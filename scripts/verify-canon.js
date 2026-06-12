const fs = require('fs');
const path = require('path');

const CANON_FILE_PATH = path.join(__dirname, '..', 'data', 'bible-canon.json');

function verifyCanon() {
  console.log(`Starting validation of Catholic Canon data file: ${CANON_FILE_PATH}...`);
  
  if (!fs.existsSync(CANON_FILE_PATH)) {
    console.error(`Error: Bible canon file does not exist at ${CANON_FILE_PATH}`);
    process.exit(1);
  }
  
  const content = fs.readFileSync(CANON_FILE_PATH, 'utf-8');
  let data;
  
  try {
    data = JSON.parse(content);
  } catch (error) {
    console.error('Error: Failed to parse JSON content from bible-canon.json:', error.message);
    process.exit(1);
  }
  
  // 1. Check if root is an array
  if (!Array.isArray(data)) {
    console.error('Error: Root of bible-canon.json is not an array.');
    process.exit(1);
  }
  
  // 2. Check for exactly 73 books
  const expectedBookCount = 73;
  if (data.length !== expectedBookCount) {
    console.error(`Error: Expected exactly ${expectedBookCount} books, but found ${data.length} books.`);
    process.exit(1);
  }
  
  console.log(`- SUCCESS: Exactly ${expectedBookCount} books found.`);
  
  // Extract all book names
  const bookNames = new Set(data.map(b => b.book));
  
  // 3. Specifically check for required Catholic books
  const requiredBooks = [
    "Tobias",
    "Judith",
    "Wisdom",
    "Ecclesiasticus",
    "Baruch",
    "1 Machabees",
    "2 Machabees"
  ];
  
  let missingBooks = [];
  for (const book of requiredBooks) {
    if (!bookNames.has(book)) {
      missingBooks.push(book);
    }
  }
  
  if (missingBooks.length > 0) {
    console.error('Error: The following required Catholic books are missing from the canon:', missingBooks.join(', '));
    process.exit(1);
  }
  
  console.log(`- SUCCESS: Checked for the presence of Tobias, Judith, Wisdom, Ecclesiasticus, Baruch, and 1 & 2 Machabees.`);
  
  // 4. Validate schema structure (book -> chapters -> verses)
  for (let i = 0; i < data.length; i++) {
    const bookEntry = data[i];
    if (typeof bookEntry.book !== 'string' || !bookEntry.book) {
      console.error(`Error: Book at index ${i} has an invalid "book" name property.`);
      process.exit(1);
    }
    if (!Array.isArray(bookEntry.chapters)) {
      console.error(`Error: Book "${bookEntry.book}" chapters property is not an array.`);
      process.exit(1);
    }
    
    for (let j = 0; j < bookEntry.chapters.length; j++) {
      const chapterEntry = bookEntry.chapters[j];
      if (typeof chapterEntry.chapter !== 'number' || chapterEntry.chapter <= 0) {
        console.error(`Error: Book "${bookEntry.book}" has an invalid chapter number:`, chapterEntry.chapter);
        process.exit(1);
      }
      if (!Array.isArray(chapterEntry.verses)) {
        console.error(`Error: Book "${bookEntry.book}" Chapter ${chapterEntry.chapter} verses property is not an array.`);
        process.exit(1);
      }
      
      for (let k = 0; k < chapterEntry.verses.length; k++) {
        const verseEntry = chapterEntry.verses[k];
        if (typeof verseEntry.verse !== 'number' || verseEntry.verse <= 0) {
          console.error(`Error: Book "${bookEntry.book}" Chapter ${chapterEntry.chapter} has an invalid verse number:`, verseEntry.verse);
          process.exit(1);
        }
        if (typeof verseEntry.text !== 'string') {
          console.error(`Error: Book "${bookEntry.book}" Chapter ${chapterEntry.chapter} Verse ${verseEntry.verse} has an invalid text property.`);
          process.exit(1);
        }
      }
    }
  }
  
  console.log(`- SUCCESS: Hierarchical schema structure (Book -> Chapter -> Verse Array) verified for all books.`);
  
  console.log('\n========================================================================');
  console.log(' SYSTEM CONFIRMATION LOG: CATHOLIC CANON VERIFICATION SUCCESSFUL');
  console.log(' - Database file "data/bible-canon.json" matches the 73-book Catholic Canon.');
  console.log(' - Structure conforms to strict hierarchical matrix array specification.');
  console.log('========================================================================\n');
  
  process.exit(0);
}

verifyCanon();
