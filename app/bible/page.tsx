"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Book, 
  HelpCircle, 
  BookOpenText, 
  X, 
  Bookmark, 
  Flame, 
  Share2 
} from "lucide-react";
import bibleData from "@/data/bible.json";

interface Verse {
  verse: number;
  text: string;
}

interface Chapter {
  chapter: number;
  verses: Verse[];
}

interface BookData {
  id: string;
  name: string;
  chapters: Chapter[];
}

// Custom mock commentaries mapping
function getVerseCommentary(bookId: string, chapter: number, verse: number, text: string) {
  const commentaries: Record<string, { reflection: string; history: string; catechism: string }> = {
    "genesis-1-1": {
      reflection: "God creates 'ex nihilo' (out of nothing) by His pure love. This first verse teaches us that time, space, and matter are not eternal, but are created and ordered by a personal, supreme intelligence.",
      history: "Written in the context of the Babylonian Exile. Unlike the Mesopotamian creation myths (like Enuma Elish) which depict creation as a violent battle between chaotic gods, Genesis presents a calm, orderly, and single sovereign God who speaks the world into existence.",
      catechism: "CCC 290: 'In the beginning God created the heavens and the earth.' These words express three truths: a beginning, a creator, and the goodness of all things made."
    },
    "genesis-1-2": {
      reflection: "The 'Spirit hovering' (ruah) over the dark, chaotic waters represents the divine presence preparing to bring order and life. This foreshadows the Sacrament of Baptism, where the Holy Spirit moves over the waters of rebirth.",
      history: "The Hebrew phrase 'tohu wa-bohu' means 'waste and void'. Ancient Near Eastern cultures viewed the sea and darkness as symbols of chaos and danger.",
      catechism: "CCC 1218: Since the beginning of the world, water, so humble and wonderful a creature, has been the source of life and fruitfulness. Sacred Scripture sees the Spirit of God 'hovering' over the waters."
    },
    "genesis-1-3": {
      reflection: "God creates through His Word: 'Let there be light.' This creative Word is the pre-existent Jesus Christ (the Logos). God's first creation is light, which dispels darkness and brings clarity.",
      history: "Light in scripture represents truth and goodness. In ancient cultures, the sun was worshiped as a god; Genesis debunks this by creating light before the sun, showing that God is the source of light.",
      catechism: "CCC 298: Since God could create everything out of nothing, he can also through the Holy Spirit give spiritual life to sinners by creating a pure heart in them."
    },
    "tobit-1-3": {
      reflection: "Tobit's life shows that righteousness is not abstract; it is lived out through concrete acts of charity. In exile, when his fellow Israelites are suffering, Tobit risks his safety to feed the hungry and bury the dead.",
      history: "The deportations of the Northern Kingdom of Israel occurred around 722 BC under the Assyrian Empire. Israelites in Nineveh were subjected to severe pressure to assimilate and abandon their faith.",
      catechism: "CCC 2447: The works of mercy are charitable actions by which we come to the aid of our neighbor in his bodily and spiritual necessities. Burying the dead is a corporal work of mercy."
    }
  };

  const key = `${bookId}-${chapter}-${verse}`;
  return commentaries[key] || {
    reflection: `This verse from ${bookId.toUpperCase()} chapter ${chapter} highlights the faithful walk of God's people. Reflect on: "${text}" and how God's truth applies to your life today.`,
    history: `This text belongs to the historical period of ${bookId === "tobit" ? "Assyrian Exile (c. 8th Century BC)" : "Patriarchal and Mosaic narrative histories"}. It emphasizes Israel's preservation of the covenant.`,
    catechism: `CCC 101-104: In Sacred Scripture, the Church constantly finds her nourishment and her strength, for she welcomes it not as a human word, but as what it really is, the Word of God.`
  };
}

export default function BiblePage() {
  const [selectedBookIndex, setSelectedBookIndex] = useState(0);
  const [selectedChapterNumber, setSelectedChapterNumber] = useState(1);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [commentaryType, setCommentaryType] = useState<"explanation" | "doubt" | null>(null);

  const books = bibleData as BookData[];
  const currentBook = books[selectedBookIndex];
  
  // Find chapter object safely
  const currentChapter = currentBook.chapters.find(c => c.chapter === selectedChapterNumber) || currentBook.chapters[0];

  const handleSelectBook = (index: number) => {
    setSelectedBookIndex(index);
    setSelectedChapterNumber(1);
    setSelectedVerse(null);
    setCommentaryType(null);
  };

  const handleSelectChapter = (chapNum: number) => {
    setSelectedChapterNumber(chapNum);
    setSelectedVerse(null);
    setCommentaryType(null);
  };

  const handleVerseClick = (verse: Verse, type: "explanation" | "doubt") => {
    setSelectedVerse(verse);
    setCommentaryType(type);
  };

  const selectedCommentary = selectedVerse 
    ? getVerseCommentary(currentBook.id, currentChapter.chapter, selectedVerse.verse, selectedVerse.text)
    : null;

  return (
    <div className="relative flex-grow flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden transition-colors duration-300">
      {/* BACKGROUND GRAPHIC GLOW */}
      <div className="absolute top-1/2 left-1/4 -z-10 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-liturgy-gold/5 blur-3xl" />
      <div className="absolute bottom-0 right-10 -z-10 h-[400px] w-[400px] rounded-full bg-liturgy-cyan/5 blur-3xl" />

      {/* LEFT COLUMN: CONTROL PANEL & BIBLE SCRIPTURE PANELS */}
      <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-black/5 dark:border-white/10">
        
        {/* Navigation Selector Bar */}
        <div className="border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#1c1c1a]/60 backdrop-blur-md p-4 flex flex-wrap gap-4 items-center justify-between transition-colors duration-300">
          <div className="flex items-center space-x-2 text-liturgy-stone-dark dark:text-liturgy-stone-light">
            <Book className="h-5 w-5 text-liturgy-gold" />
            <h2 className="font-serif text-lg font-bold">Scripture</h2>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Book Selector (Skeuomorphic depth borders) */}
            <select
              value={selectedBookIndex}
              onChange={(e) => handleSelectBook(Number(e.target.value))}
              className="bg-white dark:bg-liturgy-stone-dark border border-black/10 dark:border-white/10 rounded-md px-3 py-1.5 text-sm text-liturgy-stone-dark dark:text-liturgy-stone-light focus:outline-none focus:border-liturgy-cyan transition-colors"
            >
              {books.map((b, i) => (
                <option key={b.id} value={i}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* Chapter Selector (Skeuomorphic depth borders) */}
            <select
              value={selectedChapterNumber}
              onChange={(e) => handleSelectChapter(Number(e.target.value))}
              className="bg-white dark:bg-liturgy-stone-dark border border-black/10 dark:border-white/10 rounded-md px-3 py-1.5 text-sm text-liturgy-stone-dark dark:text-liturgy-stone-light focus:outline-none focus:border-liturgy-cyan transition-colors"
            >
              {currentBook.chapters.map((c) => (
                <option key={c.chapter} value={c.chapter}>
                  Chapter {c.chapter}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Scripture Reading Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Chapter Heading */}
            <div className="text-center space-y-2">
              <span className="text-xs font-semibold text-amber-800 dark:text-liturgy-gold tracking-widest uppercase">
                World English Bible: Catholic Edition
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-liturgy-stone-dark dark:text-liturgy-stone-light transition-colors">
                {currentBook.name} {currentChapter.chapter}
              </h1>
              <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-liturgy-gold to-transparent mx-auto" />
            </div>

            {/* Verses Column */}
            <div className="space-y-6 pt-4 text-justify">
              {currentChapter.verses.map((v) => {
                const isSelected = selectedVerse?.verse === v.verse;
                return (
                  <motion.div
                    key={v.verse}
                    whileHover={{
                      scale: 1.015,
                      backdropFilter: "blur(12px)",
                      borderColor: "rgba(212, 175, 55, 0.3)",
                      boxShadow: "0 4px 12px rgba(212, 175, 55, 0.08)",
                    }}
                    transition={{ duration: 0.2 }}
                    className={`group relative py-2.5 px-3 rounded-lg transition-all duration-300 border ${
                      isSelected
                        ? "bg-black/5 dark:bg-[#1c1c1a]/80 border-l-4 border-liturgy-cyan border-black/5 dark:border-white/10 shadow-[4px_4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                        : "bg-transparent border-transparent hover:bg-black/[0.02] dark:hover:bg-[#1c1c1a]/40"
                    }`}
                  >
                    <p className="font-serif text-base md:text-lg leading-relaxed text-liturgy-stone-dark/90 dark:text-liturgy-stone-light/90 transition-colors">
                      {/* Verse number */}
                      <span className="font-sans font-bold text-xs text-amber-800 dark:text-liturgy-gold select-none mr-2.5 vertical-align-super">
                        {v.verse}
                      </span>
                      {v.text}
                    </p>

                    {/* Hover actions - subtle overlay micro-interaction chips */}
                    <div className="absolute top-2 right-2 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white dark:bg-liturgy-charcoal border border-black/10 dark:border-white/10 p-1 rounded-md shadow-md">
                      <button
                        onClick={() => handleVerseClick(v, "explanation")}
                        className="flex items-center space-x-1 rounded px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:text-liturgy-gold hover:bg-amber-800/10 dark:hover:bg-liturgy-gold/10 transition-colors"
                      >
                        <BookOpenText className="h-3 w-3" />
                        <span>📖 Explanation</span>
                      </button>
                      <span className="text-liturgy-stone-gray text-[10px]">|</span>
                      <button
                        onClick={() => handleVerseClick(v, "doubt")}
                        className="flex items-center space-x-1 rounded px-1.5 py-0.5 text-[10px] font-semibold text-liturgy-cyan hover:bg-liturgy-cyan/10 transition-colors"
                      >
                        <HelpCircle className="h-3 w-3" />
                        <span>🤔 Have a Doubt?</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: DESKTOP DUAL-PANE VIEWPORT (Glassmorphism layout) */}
      <div className="hidden lg:block w-[400px] xl:w-[460px] h-full overflow-y-auto bg-white/60 dark:bg-[#1c1c1a]/60 backdrop-blur-md border-l border-black/5 dark:border-white/10 custom-scrollbar relative transition-colors duration-300">
        <AnimatePresence mode="wait">
          {selectedVerse ? (
            <motion.div
              key={`${currentBook.id}-${selectedChapterNumber}-${selectedVerse.verse}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="p-6 space-y-6"
            >
              {/* Heading */}
              <div className="flex items-start justify-between border-b border-black/5 dark:border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-semibold text-amber-800 dark:text-liturgy-gold tracking-wider uppercase">
                    {commentaryType === "doubt" ? "🤔 Verse Inquiry" : "📖 Exegesis"}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-liturgy-stone-dark dark:text-liturgy-stone-light">
                    {currentBook.name} {currentChapter.chapter}:{selectedVerse.verse}
                  </h3>
                </div>
                <button
                  onClick={() => { setSelectedVerse(null); setCommentaryType(null); }}
                  className="p-1 rounded-md text-liturgy-stone-gray hover:text-liturgy-stone-dark dark:hover:text-liturgy-stone-light hover:bg-black/5 dark:hover:bg-liturgy-stone-dark transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Displayed verse quote (Neumorphic indentation) */}
              <div className="p-4 rounded-lg bg-black/[0.02] dark:bg-liturgy-charcoal/50 border border-black/5 dark:border-white/5 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] text-xs italic text-liturgy-stone-dark/80 dark:text-liturgy-stone-light/80 leading-relaxed font-serif">
                &ldquo;{selectedVerse.text}&rdquo;
              </div>

              {/* Commentary modules */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-liturgy-cyan uppercase tracking-wider">
                    <Bookmark className="h-3.5 w-3.5" />
                    <span>Theological Reflection</span>
                  </div>
                  <p className="text-sm leading-relaxed text-liturgy-stone-dark/70 dark:text-liturgy-stone-gray">
                    {selectedCommentary?.reflection}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-amber-800 dark:text-liturgy-gold uppercase tracking-wider">
                    <Flame className="h-3.5 w-3.5" />
                    <span>Historical Context</span>
                  </div>
                  <p className="text-sm leading-relaxed text-liturgy-stone-dark/70 dark:text-liturgy-stone-gray">
                    {selectedCommentary?.history}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Catechism Connection</span>
                  </div>
                  <p className="text-sm leading-relaxed text-liturgy-stone-dark/70 dark:text-liturgy-stone-gray">
                    {selectedCommentary?.catechism}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-liturgy-stone-dark/40 dark:text-liturgy-stone-gray space-y-4">
              <BookOpenText className="h-10 w-10 text-black/10 dark:text-liturgy-stone-dark" />
              <div className="space-y-1">
                <p className="text-sm font-serif font-bold text-liturgy-stone-dark/80 dark:text-liturgy-stone-light">Select a Verse</p>
                <p className="text-xs">Hover a line of text and click the 📖 Explanation or 🤔 Doubt options to view deep theological reflection and context here.</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* MOBILE DRAWER: Viewport sliding touch drawer (Glassmorphism layout) */}
      <AnimatePresence>
        {selectedVerse && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSelectedVerse(null); setCommentaryType(null); }}
              className="lg:hidden fixed inset-0 z-40 bg-black"
            />
            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="lg:hidden fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-black/5 dark:border-white/10 bg-white/95 dark:bg-[#1c1c1a]/90 backdrop-blur-xl p-6 max-h-[75vh] overflow-y-auto custom-scrollbar space-y-6 transition-colors duration-300"
            >
              {/* Pull Bar Indicator */}
              <div className="w-12 h-1 bg-liturgy-stone-gray/40 rounded-full mx-auto mb-2" />

              <div className="flex items-start justify-between pb-2">
                <div>
                  <span className="text-[10px] font-semibold text-amber-800 dark:text-liturgy-gold tracking-wider uppercase">
                    {commentaryType === "doubt" ? "🤔 Mobile Inquiry" : "📖 Verse Explanation"}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-liturgy-stone-dark dark:text-liturgy-stone-light">
                    {currentBook.name} {currentChapter.chapter}:{selectedVerse.verse}
                  </h3>
                </div>
                <button
                  onClick={() => { setSelectedVerse(null); setCommentaryType(null); }}
                  className="p-1 rounded-md text-liturgy-stone-gray hover:text-liturgy-stone-dark dark:hover:text-liturgy-stone-light"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Displayed verse quote */}
              <div className="p-3.5 rounded-lg bg-black/[0.02] dark:bg-liturgy-charcoal/50 border border-black/5 dark:border-white/5 text-xs italic text-liturgy-stone-dark/80 dark:text-liturgy-stone-light/80 leading-relaxed font-serif">
                &ldquo;{selectedVerse.text}&rdquo;
              </div>

              {/* Commentary modules */}
              <div className="space-y-5">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-liturgy-cyan uppercase tracking-wider">
                    <span>Theological Reflection</span>
                  </div>
                  <p className="text-xs leading-relaxed text-liturgy-stone-dark/70 dark:text-liturgy-stone-gray">
                    {selectedCommentary?.reflection}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-amber-800 dark:text-liturgy-gold uppercase tracking-wider">
                    <span>Historical Context</span>
                  </div>
                  <p className="text-xs leading-relaxed text-liturgy-stone-dark/70 dark:text-liturgy-stone-gray">
                    {selectedCommentary?.history}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                    <span>Catechism Connection</span>
                  </div>
                  <p className="text-xs leading-relaxed text-liturgy-stone-dark/70 dark:text-liturgy-stone-gray">
                    {selectedCommentary?.catechism}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
