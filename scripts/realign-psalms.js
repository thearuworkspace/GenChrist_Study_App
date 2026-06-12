const fs = require('fs');
const path = require('path');

const CANON_FILE_PATH = path.join(__dirname, '..', 'data', 'bible-canon.json');

function realignPsalms() {
  console.log(`Loading database file: ${CANON_FILE_PATH}...`);
  if (!fs.existsSync(CANON_FILE_PATH)) {
    console.error(`Error: File does not exist at ${CANON_FILE_PATH}`);
    process.exit(1);
  }
  
  const content = fs.readFileSync(CANON_FILE_PATH, 'utf-8');
  let data;
  try {
    data = JSON.parse(content);
  } catch (error) {
    console.error('Error: Failed to parse JSON database:', error.message);
    process.exit(1);
  }
  
  // Find Psalms
  const psalmsIndex = data.findIndex(b => b.book === 'Psalms');
  if (psalmsIndex === -1) {
    console.error('Error: Book of Psalms not found in database.');
    process.exit(1);
  }
  
  const psalmsBook = data[psalmsIndex];
  const origChapters = psalmsBook.chapters;
  console.log(`Original Psalms chapters count: ${origChapters.length}`);
  
  // Helper to find original chapter by number
  function getOrigChapter(num) {
    const chap = origChapters.find(c => c.chapter === num);
    if (!chap) {
      console.error(`Error: Original Psalm chapter ${num} not found.`);
      process.exit(1);
    }
    return chap;
  }
  
  const newChapters = [];
  
  // Realign to Modern Standard (150 chapters)
  for (let c = 1; c <= 150; c++) {
    if (c >= 1 && c <= 8) {
      // 1. Psalms 1 to 8: Identical
      const orig = getOrigChapter(c);
      newChapters.push({
        chapter: c,
        verses: orig.verses.map(v => ({ verse: v.verse, text: v.text }))
      });
    } 
    else if (c === 9) {
      // 2. Psalm 9 (Modern): Verses 1 to 21 of Vulgate Psalm 9
      const orig9 = getOrigChapter(9);
      const verses = orig9.verses
        .filter(v => v.verse >= 1 && v.verse <= 21)
        .map(v => ({ verse: v.verse, text: v.text }));
      newChapters.push({
        chapter: c,
        verses
      });
    } 
    else if (c === 10) {
      // 3. Psalm 10 (Modern): Verses 22 to 39 of Vulgate Psalm 9 (reindexed 1 to 18)
      const orig9 = getOrigChapter(9);
      const verses = orig9.verses
        .filter(v => v.verse >= 22 && v.verse <= 39)
        .map(v => ({ verse: v.verse - 21, text: v.text }));
      newChapters.push({
        chapter: c,
        verses
      });
    } 
    else if (c >= 11 && c <= 113) {
      // 4. Psalms 11 to 113 (Modern): Shifted by +1 from Vulgate Psalms 10 to 112
      const orig = getOrigChapter(c - 1);
      newChapters.push({
        chapter: c,
        verses: orig.verses.map(v => ({ verse: v.verse, text: v.text }))
      });
    } 
    else if (c === 114) {
      // 5. Psalm 114 (Modern): Verses 1 to 8 of Vulgate Psalm 113
      const orig113 = getOrigChapter(113);
      const verses = orig113.verses
        .filter(v => v.verse >= 1 && v.verse <= 8)
        .map(v => ({ verse: v.verse, text: v.text }));
      newChapters.push({
        chapter: c,
        verses
      });
    } 
    else if (c === 115) {
      // 6. Psalm 115 (Modern): Verses 9 to 26 of Vulgate Psalm 113 (reindexed 1 to 18)
      const orig113 = getOrigChapter(113);
      const verses = orig113.verses
        .filter(v => v.verse >= 9 && v.verse <= 26)
        .map(v => ({ verse: v.verse - 8, text: v.text }));
      newChapters.push({
        chapter: c,
        verses
      });
    } 
    else if (c === 116) {
      // 7. Psalm 116 (Modern): Vulgate Psalm 114 (9 verses) and Vulgate Psalm 115 (10 verses) combined
      const orig114 = getOrigChapter(114);
      const orig115 = getOrigChapter(115);
      
      const v1 = orig114.verses.map(v => ({ verse: v.verse, text: v.text }));
      const v2 = orig115.verses.map(v => ({ verse: v.verse + 9, text: v.text }));
      
      newChapters.push({
        chapter: c,
        verses: [...v1, ...v2]
      });
    } 
    else if (c >= 117 && c <= 146) {
      // 8. Psalms 117 to 146 (Modern): Shifted by +1 from Vulgate Psalms 116 to 145
      const orig = getOrigChapter(c - 1);
      newChapters.push({
        chapter: c,
        verses: orig.verses.map(v => ({ verse: v.verse, text: v.text }))
      });
    } 
    else if (c === 147) {
      // 9. Psalm 147 (Modern): Vulgate Psalm 146 (11 verses) and Vulgate Psalm 147 (9 verses) combined
      const orig146 = getOrigChapter(146);
      const orig147 = getOrigChapter(147);
      
      const v1 = orig146.verses.map(v => ({ verse: v.verse, text: v.text }));
      const v2 = orig147.verses.map(v => ({ verse: v.verse + 11, text: v.text }));
      
      newChapters.push({
        chapter: c,
        verses: [...v1, ...v2]
      });
    } 
    else if (c >= 148 && c <= 150) {
      // 10. Psalms 148 to 150 (Modern): Identical
      const orig = getOrigChapter(c);
      newChapters.push({
        chapter: c,
        verses: orig.verses.map(v => ({ verse: v.verse, text: v.text }))
      });
    }
  }
  
  // Sort new chapters just to be absolutely clean
  newChapters.sort((a, b) => a.chapter - b.chapter);
  
  // Update Book of Psalms
  psalmsBook.chapters = newChapters;
  
  console.log(`Realigned Book of Psalms chapters count: ${newChapters.length}`);
  console.log(`Psalm 9 verses: ${newChapters.find(c => c.chapter === 9).verses.length}`);
  console.log(`Psalm 10 verses: ${newChapters.find(c => c.chapter === 10).verses.length}`);
  console.log(`Psalm 116 verses: ${newChapters.find(c => c.chapter === 116).verses.length}`);
  console.log(`Psalm 147 verses: ${newChapters.find(c => c.chapter === 147).verses.length}`);
  
  // Write back database file
  fs.writeFileSync(CANON_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Successfully updated and saved realigned database file.`);
}

realignPsalms();
