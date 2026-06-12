import json
import os
import re
import argparse
import urllib.request
import urllib.error
from typing import Dict, Any, List

# Target Schema definition
TARGET_SCHEMA = {
    "type": "object",
    "properties": {
        "verseNumber": {"type": "integer"},
        "dominicalIntent": {"type": "string"},
        "cccReferences": {"type": "string"},
        "historicalContext": {"type": "string"},
        "translationNuances": {"type": "string"},
        "crossReferences": {"type": "string"},
        "historicalTrivia": {"type": "string"}
    },
    "required": [
        "verseNumber", "dominicalIntent", "cccReferences",
        "historicalContext", "translationNuances", "crossReferences", "historicalTrivia"
    ]
}

SYSTEM_PROMPT = """You are a profound Catholic theological and historical scholar.
Your task is to analyze the provided raw texts (bible verse, historical commentary, and catechism references)
and synthesize the information into exactly 6 analytical dimensions.

Strictly return ONLY a valid JSON object matching this schema:
{
  "verseNumber": <integer>,
  "dominicalIntent": "Deep theological analysis of why God/Jesus inspired or stated this exact phrase, or its Old Testament christological typology.",
  "cccReferences": "Precise paragraph citations with an original, brief summary of the dogmatic link. Do NOT copy verbatim text from modern translations. (e.g., 'See CCC ¶ 290 on Trinitarian creation').",
  "historicalContext": "The precise ancient Near Eastern, Roman, or Jewish historical reality, custom, or archaeological facts surrounding the text.",
  "translationNuances": "Specific Hebrew, Greek, or Latin root word shifts and textual translation insights from Jerome's Vulgate or original codices.",
  "crossReferences": "Explicit Book Chapter:Verse links to related concepts across the 73-book Catholic Canon.",
  "historicalTrivia": "A high-interest scientific, geographical, astronomical connection, or literary anomaly found in the history of this text."
}

Do not include markdown blocks like ```json or any conversational filler. Just the JSON object.
"""

def get_ai_response(api_key: str, api_endpoint: str, model_name: str, system_prompt: str, user_prompt: str) -> Dict[str, Any]:
    """Calls an OpenAI-compatible API to get the JSON extraction."""
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    data = {
        "model": model_name,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.2,
        "response_format": {"type": "json_object"}
    }

    req = urllib.request.Request(
        url=api_endpoint,
        data=json.dumps(data).encode("utf-8"),
        headers=headers,
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            content = result["choices"][0]["message"]["content"]
            return json.loads(content)
    except Exception as e:
        print(f"Error calling API: {e}")
        # Fallback to mock data on error so script doesn't completely crash for testing
        return get_mock_response(user_prompt)

def get_mock_response(user_prompt: str) -> Dict[str, Any]:
    """Returns a mock JSON response for testing without an API key."""
    # Try to extract verse number
    match = re.search(r"Verse Number: (\d+)", user_prompt)
    verse_num = int(match.group(1)) if match else 1

    return {
        "verseNumber": verse_num,
        "dominicalIntent": "MOCK: The Word (Logos) acts as the agent of creation, revealing absolute divine power.",
        "cccReferences": "MOCK: See CCC ¶ 290-292 on Trinitarian creation and the eternal nature of God.",
        "historicalContext": "MOCK: Written in the context of ancient Near Eastern creation myths, distinguishing Israel's monotheism.",
        "translationNuances": "MOCK: The Hebrew 'Bereshit' (in beginning) and plural 'Elohim' hinting at the Trinity.",
        "crossReferences": "MOCK: John 1:1-3; Colossians 1:16.",
        "historicalTrivia": "MOCK: The concept of creatio ex nihilo was highly distinct from contemporary Babylonian myths like the Enuma Elish."
    }

def extract_commentary(book: str, chapter: int, verse: int, commentary_text: str) -> str:
    """A simplistic extraction function. In production with massive files,
    this would use more robust regex or indexing."""
    # Look for patterns like [Genesis 1:1] or Ver. 1.
    pattern = rf"\[{book} {chapter}:{verse}\](.*?)(?:\[{book} {chapter}:\d+\]|\Z)"
    match = re.search(pattern, commentary_text, re.DOTALL | re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return "No direct commentary found."

def extract_catechism(commentary_snippet: str, catechism_text: str) -> str:
    """Finds referenced CCC paragraphs in the commentary snippet and pulls them from the catechism text."""
    ccc_references = re.findall(r"Catechism (\d+)", commentary_snippet, re.IGNORECASE)
    ccc_references.extend(re.findall(r"CCC (\d+)", commentary_snippet, re.IGNORECASE))

    results = []
    for ref in ccc_references:
        pattern = rf"\[CCC {ref}\](.*?)(?:\[CCC \d+\]|\Z)"
        match = re.search(pattern, catechism_text, re.DOTALL | re.IGNORECASE)
        if match:
            results.append(f"CCC {ref}: {match.group(1).strip()}")

    return "\n".join(results) if results else "No direct CCC text found."

def process_book(book_data: Dict, commentary_full_text: str, catechism_full_text: str, args: argparse.Namespace):
    book_name = book_data["book"]
    print(f"Processing Book: {book_name}")

    output_data = []

    for chapter_data in book_data.get("chapters", []):
        chapter_num = chapter_data["chapter"]

        for verse_data in chapter_data.get("verses", []):
            verse_num = verse_data["verse"]
            verse_text = verse_data["text"]

            print(f"  Processing {book_name} {chapter_num}:{verse_num}...")

            # 1. Extract context
            commentary_snippet = extract_commentary(book_name, chapter_num, verse_num, commentary_full_text)
            ccc_snippet = extract_catechism(commentary_snippet, catechism_full_text)

            # 2. Build Prompt
            user_prompt = f"""
            Book: {book_name}
            Chapter: {chapter_num}
            Verse Number: {verse_num}
            Verse Text: "{verse_text}"

            Commentary/Historical Context:
            {commentary_snippet}

            Catechism References Context:
            {ccc_snippet}
            """

            # 3. Call AI or Mock
            if args.mock:
                result_json = get_mock_response(user_prompt)
            else:
                result_json = get_ai_response(
                    api_key=args.api_key,
                    api_endpoint=args.api_endpoint,
                    model_name=args.model_name,
                    system_prompt=SYSTEM_PROMPT,
                    user_prompt=user_prompt
                )

            output_data.append(result_json)

            # Stop early if we are just testing
            if args.test_limit and len(output_data) >= args.test_limit:
                break

        if args.test_limit and len(output_data) >= args.test_limit:
            break

    # 4. Save Output
    output_filename = os.path.join(args.output_dir, f"{book_name.lower()}.json")
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print(f"Saved results to {output_filename}")

def main():
    parser = argparse.ArgumentParser(description="Process Catholic Bible data with Commentary and AI.")
    parser.add_argument("--canon-file", default="data/bible-canon.json", help="Path to bible-canon.json")
    parser.add_argument("--commentary-file", default="data/sources/haydock-commentary.txt", help="Path to full commentary text")
    parser.add_argument("--catechism-file", default="data/sources/catechism.txt", help="Path to catechism index text")
    parser.add_argument("--output-dir", default="data/commentary", help="Directory to save JSON outputs")

    parser.add_argument("--mock", action="store_true", help="Use mock AI responses instead of calling API")
    parser.add_argument("--api-key", default=os.environ.get("API_KEY", ""), help="API Key for AI model")
    # Defaulting to an OpenAI compatible endpoint, user can override (e.g., https://api.groq.com/openai/v1/chat/completions)
    parser.add_argument("--api-endpoint", default="https://api.openai.com/v1/chat/completions", help="API Endpoint URL")
    parser.add_argument("--model-name", default="gpt-4o", help="Model name to use")

    parser.add_argument("--target-book", default=None, help="Process only a specific book (e.g., 'Genesis')")
    parser.add_argument("--test-limit", type=int, default=None, help="Stop after N verses (useful for testing)")

    args = parser.parse_args()

    # Create output dir if not exists
    os.makedirs(args.output_dir, exist_ok=True)

    # Load Source texts
    print("Loading source texts into memory (this may take a moment for large files)...")
    try:
        with open(args.canon_file, 'r', encoding='utf-8') as f:
            canon_data = json.load(f)

        # For massive files, we might need a different approach (like mmap or line-by-line streaming)
        # but 35MB can fit in standard RAM for Python.
        try:
            with open(args.commentary_file, 'r', encoding='utf-8') as f:
                commentary_full_text = f.read()
        except FileNotFoundError:
            print(f"Warning: {args.commentary_file} not found. Proceeding with empty commentary.")
            commentary_full_text = ""

        try:
            with open(args.catechism_file, 'r', encoding='utf-8') as f:
                catechism_full_text = f.read()
        except FileNotFoundError:
            print(f"Warning: {args.catechism_file} not found. Proceeding with empty catechism.")
            catechism_full_text = ""

    except Exception as e:
        print(f"Error loading source files: {e}")
        return

    # Process Books
    for book_data in canon_data:
        book_name = book_data["book"]

        if args.target_book and book_name.lower() != args.target_book.lower():
            continue

        process_book(book_data, commentary_full_text, catechism_full_text, args)

if __name__ == "__main__":
    main()
