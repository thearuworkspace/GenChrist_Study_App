const fs = require('fs');
const path = require('path');

const CPDV_URL = 'https://raw.githubusercontent.com/scrollmapper/bible_databases/master/formats/json/CPDV.json';
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'bible-canon.json');

// Map of CPDV book names to official Catholic naming conventions
const BOOK_NAME_MAP = {
  // Old Testament (46 books)
  "Genesis": "Genesis",
  "Exodus": "Exodus",
  "Leviticus": "Leviticus",
  "Numbers": "Numbers",
  "Deuteronomy": "Deuteronomy",
  "Joshua": "Joshua",
  "Judges": "Judges",
  "Ruth": "Ruth",
  "I Samuel": "1 Samuel",
  "II Samuel": "2 Samuel",
  "I Kings": "1 Kings",
  "II Kings": "2 Kings",
  "I Chronicles": "1 Chronicles",
  "II Chronicles": "2 Chronicles",
  "Ezra": "Ezra",
  "Nehemiah": "Nehemiah",
  "Tobit": "Tobias",
  "Judith": "Judith",
  "Esther": "Esther",
  "Job": "Job",
  "Psalms": "Psalms",
  "Proverbs": "Proverbs",
  "Ecclesiastes": "Ecclesiastes",
  "Song of Solomon": "Song of Solomon",
  "Wisdom": "Wisdom",
  "Sirach": "Ecclesiasticus",
  "Isaiah": "Isaiah",
  "Jeremiah": "Jeremiah",
  "Lamentations": "Lamentations",
  "Baruch": "Baruch",
  "Ezekiel": "Ezekiel",
  "Daniel": "Daniel",
  "Hosea": "Hosea",
  "Joel": "Joel",
  "Amos": "Amos",
  "Obadiah": "Obadiah",
  "Jonah": "Jonah",
  "Micah": "Micah",
  "Nahum": "Nahum",
  "Habakkuk": "Habakkuk",
  "Zephaniah": "Zephaniah",
  "Haggai": "Haggai",
  "Zechariah": "Zechariah",
  "Malachi": "Malachi",
  "I Maccabees": "1 Machabees",
  "II Maccabees": "2 Machabees",

  // New Testament (27 books)
  "Matthew": "Matthew",
  "Mark": "Mark",
  "Luke": "Luke",
  "John": "John",
  "Acts": "Acts",
  "Romans": "Romans",
  "I Corinthians": "1 Corinthians",
  "II Corinthians": "2 Corinthians",
  "Galatians": "Galatians",
  "Ephesians": "Ephesians",
  "Philippians": "Philippians",
  "Colossians": "Colossians",
  "I Thessalonians": "1 Thessalonians",
  "II Thessalonians": "2 Thessalonians",
  "I Timothy": "1 Timothy",
  "II Timothy": "2 Timothy",
  "Titus": "Titus",
  "Philemon": "Philemon",
  "Hebrews": "Hebrews",
  "James": "James",
  "I Peter": "1 Peter",
  "II Peter": "2 Peter",
  "I John": "1 John",
  "II John": "2 John",
  "III John": "3 John",
  "Jude": "Jude",
  "Revelation of John": "Revelation"
};

async function setupCanon() {
  console.log(`Fetching CPDV Bible from: ${CPDV_URL}...`);
  try {
    const response = await fetch(CPDV_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch CPDV Bible: ${response.statusText}`);
    }
    
    const rawData = await response.json();
    console.log('Successfully fetched raw data. Cleaning and structuring into hierarchical matrix tree...');
    
    if (!rawData.books || !Array.isArray(rawData.books)) {
      throw new Error('Raw data does not contain a valid "books" array.');
    }
    
    const structuredCanon = [];
    
    for (const book of rawData.books) {
      const srcBookName = book.name ? book.name.trim() : '';
      const targetBookName = BOOK_NAME_MAP[srcBookName];
      
      // If it is in our map, it belongs in the Catholic Canon
      if (!targetBookName) {
        continue;
      }
      
      const bookObj = {
        book: targetBookName,
        chapters: []
      };
      
      if (book.chapters && Array.isArray(book.chapters)) {
        for (const chapterData of book.chapters) {
          const chapNum = Number(chapterData.chapter);
          const chapterObj = {
            chapter: chapNum,
            verses: []
          };
          
          if (chapterData.verses && Array.isArray(chapterData.verses)) {
            // Sort verses by verse number
            const sortedVerses = [...chapterData.verses].sort((a, b) => a.verse - b.verse);
            
            for (const verseData of sortedVerses) {
              const verseNum = Number(verseData.verse);
              const originalText = verseData.text || '';
              
              // Clean typography and whitespace
              const cleanText = originalText
                .replace(/\u00a0/g, ' ')  // replace non-breaking spaces
                .replace(/\s+/g, ' ')    // collapse multiple spaces
                .trim();
              
              chapterObj.verses.push({
                verse: verseNum,
                text: cleanText
              });
            }
          }
          bookObj.chapters.push(chapterObj);
        }
        
        // Sort chapters by chapter number
        bookObj.chapters.sort((a, b) => a.chapter - b.chapter);
      }
      
      structuredCanon.push(bookObj);
    }
    
    // Sort books in canonical order according to BOOK_NAME_MAP keys
    const canonicalOrder = Object.values(BOOK_NAME_MAP);
    structuredCanon.sort((a, b) => canonicalOrder.indexOf(a.book) - canonicalOrder.indexOf(b.book));
    
    console.log(`Processed ${structuredCanon.length} books.`);
    
    // Ensure the output directory exists
    const dir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write Structured Canon safely
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(structuredCanon, null, 2), 'utf-8');
    console.log(`Successfully output canonical Bible array to: ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('Error during Catholic Bible Setup:', error);
    process.exit(1);
  }
}

setupCanon();
