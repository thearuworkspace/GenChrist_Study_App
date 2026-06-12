import { useState, useMemo, useCallback } from "react";
import rawBibleData from "@/data/bible-canon.json";

// Type definitions
export interface Verse {
  verse: number;
  text: string;
}

export interface Chapter {
  chapter: number;
  verses: Verse[];
}

export interface BookData {
  book: string;
  chapters: Chapter[];
}

export interface VerseRef {
  book: string;
  chapter: string;
  verse: number;
  text: string;
}

export interface CrossReference extends VerseRef {
  type: "theological" | "keyword";
}

const bibleData = rawBibleData as BookData[];

// List of all 73 books in canonical order
export const BOOK_NAMES: string[] = bibleData.map(b => b.book);

// Static theological cross-references for major passages, updated to use standard names
const THEOLOGICAL_CROSS_REFS: Record<string, Array<{ book: string; chapter: string; verse: number }>> = {
  "Genesis-1-1": [
    { book: "John", chapter: "1", verse: 1 },
    { book: "John", chapter: "1", verse: 2 },
    { book: "John", chapter: "1", verse: 3 },
    { book: "Colossians", chapter: "1", verse: 16 },
    { book: "Hebrews", chapter: "1", verse: 2 },
    { book: "Psalms", chapter: "102", verse: 25 },
    { book: "Revelation", chapter: "4", verse: 11 }
  ],
  "Genesis-1-2": [
    { book: "Psalms", chapter: "104", verse: 30 },
    { book: "Jeremiah", chapter: "4", verse: 23 }
  ],
  "Genesis-1-3": [
    { book: "2 Corinthians", chapter: "4", verse: 6 },
    { book: "John", chapter: "1", verse: 9 },
    { book: "John", chapter: "8", verse: 12 }
  ],
  "Tobias-1-3": [
    { book: "Tobias", chapter: "4", verse: 7 },
    { book: "Tobias", chapter: "4", verse: 8 },
    { book: "Tobias", chapter: "12", verse: 8 },
    { book: "Proverbs", chapter: "19", verse: 17 }
  ],
  "John-1-1": [
    { book: "Genesis", chapter: "1", verse: 1 },
    { book: "1 John", chapter: "1", verse: 1 },
    { book: "Revelation", chapter: "19", verse: 13 }
  ]
};

// Stop words list for filtering irrelevant words during keyword cross-referencing
const STOP_WORDS = new Set([
  'the', 'and', 'of', 'in', 'to', 'a', 'is', 'that', 'was', 'for', 'on', 'are', 'as', 'with', 
  'his', 'they', 'it', 'he', 'be', 'by', 'from', 'at', 'an', 'this', 'have', 'but', 'not', 
  'or', 'which', 'you', 'your', 'me', 'my', 'shall', 'will', 'unto', 'them', 'their', 'him', 
  'were', 'had', 'has', 'said', 'there', 'upon', 'then', 'so', 'who', 'when', 'out', 'up', 
  'into', 'no', 'our', 'us', 'we', 'am', 'been', 'what', 'did', 'do', 'if', 'about', 'than', 
  'only', 'some', 'these', 'would', 'should', 'she', 'her', 'their', 'theirs', 'myself', 
  'himself', 'itself', 'ourselves', 'yourselves', 'themselves', 'here', 'there', 'where', 
  'when', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 
  'such', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now'
]);

export function useBibleEngine(initialBook: string = "Genesis", initialChapter: number = 1) {
  const [selectedBookName, setSelectedBookName] = useState<string>(initialBook);
  const [selectedChapter, setSelectedChapter] = useState<number>(initialChapter);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);

  // Safely get book object
  const activeBookObj = useMemo((): BookData => {
    return bibleData.find(b => b.book === selectedBookName) || bibleData[0];
  }, [selectedBookName]);

  // List of chapter numbers in the active book
  const chapters = useMemo((): number[] => {
    return activeBookObj.chapters.map(c => c.chapter);
  }, [activeBookObj]);

  // Safely get active chapter object
  const activeChapterObj = useMemo((): Chapter => {
    return activeBookObj.chapters.find(c => c.chapter === selectedChapter) || activeBookObj.chapters[0];
  }, [activeBookObj, selectedChapter]);

  // Handle book selection, resetting chapter to 1 and verse to null
  const selectBook = useCallback((bookName: string) => {
    const bookExists = bibleData.some(b => b.book === bookName);
    if (bookExists) {
      setSelectedBookName(bookName);
      setSelectedChapter(1);
      setSelectedVerse(null);
    }
  }, []);

  // Handle chapter selection, resetting verse to null
  const selectChapter = useCallback((chapterNum: number) => {
    setSelectedChapter(chapterNum);
    setSelectedVerse(null);
  }, []);

  // Get verses for the current book and chapter
  const verses = useMemo((): Verse[] => {
    return activeChapterObj ? activeChapterObj.verses : [];
  }, [activeChapterObj]);

  // Get total chapter count for a book
  const getChapterCount = useCallback((bookName: string): number => {
    const bookObj = bibleData.find(b => b.book === bookName);
    return bookObj ? bookObj.chapters.length : 0;
  }, []);

  // Full-text search engine (lightning-fast client-side scan)
  const searchBible = useCallback((query: string): VerseRef[] => {
    if (!query || query.trim().length < 2) return [];
    const lowerQuery = query.toLowerCase();
    const results: VerseRef[] = [];
    
    for (const b of bibleData) {
      for (const c of b.chapters) {
        for (const v of c.verses) {
          if (v.text.toLowerCase().includes(lowerQuery)) {
            results.push({
              book: b.book,
              chapter: String(c.chapter),
              verse: v.verse,
              text: v.text
            });
            if (results.length >= 100) {
              return results;
            }
          }
        }
      }
    }
    return results;
  }, []);

  // Get cross-references dynamically
  const getCrossReferences = useCallback((book: string, chapter: string, verseNum: number): CrossReference[] => {
    const key = `${book}-${chapter}-${verseNum}`;
    const results: CrossReference[] = [];
    
    const targetBookObj = bibleData.find(b => b.book === book);
    if (!targetBookObj) return [];
    
    const targetChapterObj = targetBookObj.chapters.find(c => String(c.chapter) === chapter);
    if (!targetChapterObj) return [];
    
    const targetVerseObj = targetChapterObj.verses.find(v => v.verse === verseNum);
    if (!targetVerseObj) return [];
    
    const targetText = targetVerseObj.text;

    // 1. Fetch static theological cross-references if defined
    if (THEOLOGICAL_CROSS_REFS[key]) {
      for (const ref of THEOLOGICAL_CROSS_REFS[key]) {
        const refBookObj = bibleData.find(b => b.book === ref.book);
        if (refBookObj) {
          const refChapterObj = refBookObj.chapters.find(c => String(c.chapter) === ref.chapter);
          if (refChapterObj) {
            const refVerseObj = refChapterObj.verses.find(v => v.verse === ref.verse);
            if (refVerseObj) {
              results.push({
                book: ref.book,
                chapter: ref.chapter,
                verse: ref.verse,
                text: refVerseObj.text,
                type: "theological"
              });
            }
          }
        }
      }
    }

    // 2. Compute dynamic keyword-based cross-references
    const keywords = targetText
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"“’”]/g, "")
      .split(/\s+/)
      .filter(w => w.length >= 4 && !STOP_WORDS.has(w));

    if (keywords.length > 0) {
      const candidates: Array<{ ref: VerseRef; score: number }> = [];

      for (const b of bibleData) {
        for (const c of b.chapters) {
          // Avoid matching the current chapter of the same book
          if (b.book === book && String(c.chapter) === chapter) continue;
          
          for (const v of c.verses) {
            const lowerText = v.text.toLowerCase();
            let score = 0;
            for (const word of keywords) {
              if (lowerText.includes(word)) {
                score++;
              }
            }

            if (score > 0) {
              if (b.book !== book) {
                score += 0.5; // cross-book bonus
              }
              candidates.push({
                ref: { book: b.book, chapter: String(c.chapter), verse: v.verse, text: v.text },
                score
              });
            }
          }
        }
      }

      // Sort by score descending and take the top matches
      candidates.sort((a, b) => b.score - a.score);
      
      const existingRefs = new Set(results.map(r => `${r.book}-${r.chapter}-${r.verse}`));
      let addedCount = 0;
      
      for (const candidate of candidates) {
        const candKey = `${candidate.ref.book}-${candidate.ref.chapter}-${candidate.ref.verse}`;
        if (!existingRefs.has(candKey)) {
          results.push({
            ...candidate.ref,
            type: "keyword"
          });
          addedCount++;
          if (results.length >= 6 || addedCount >= 4) break;
        }
      }
    }

    return results;
  }, []);

  return {
    books: BOOK_NAMES,
    chapters,
    verses,
    selectedBookName,
    selectedChapter,
    selectedVerse,
    setSelectedBookName: selectBook,
    setSelectedChapter: selectChapter,
    setSelectedVerse,
    getChapterCount,
    searchBible,
    getCrossReferences
  };
}
