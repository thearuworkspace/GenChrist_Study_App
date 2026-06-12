"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Book, 
  HelpCircle, 
  BookOpenText, 
  X, 
  Bookmark, 
  Flame, 
  Share2,
  ChevronDown,
  Compass,
  Languages,
  Link as LinkIcon,
  Sparkles
} from "lucide-react";
import { useBibleEngine } from "@/hooks/useBibleEngine";

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

interface VerseCommentary {
  chapter: number;
  verse: number;
  why_jesus_said_it: string;
  ccc_validation: string;
  historical_reality: string;
  translation_shift: string;
  cross_references: string[];
  fascinating_fact: string;
}

export default function BiblePage() {
  const {
    books,
    chapters,
    verses,
    selectedBookName,
    selectedChapter,
    selectedVerse,
    setSelectedBookName,
    setSelectedChapter,
    setSelectedVerse,
    getCrossReferences
  } = useBibleEngine();

  const [commentaryType, setCommentaryType] = useState<"explanation" | "doubt" | null>(null);
  
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [navTab, setNavTab] = useState<"book" | "chapter" | "verse">("book");
  const [highlightedVerse, setHighlightedVerse] = useState<number | null>(null);

  // Group books by Old/New Testament
  const OLD_TESTAMENT_SET = useMemo(() => new Set([
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
    "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
    "Nehemiah", "Tobias", "Judith", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes",
    "Song of Solomon", "Wisdom", "Ecclesiasticus", "Isaiah", "Jeremiah", "Lamentations",
    "Baruch", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah",
    "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "1 Machabees", "2 Machabees"
  ]), []);

  const otBooks = useMemo(() => books.filter(b => OLD_TESTAMENT_SET.has(b)), [books, OLD_TESTAMENT_SET]);
  const ntBooks = useMemo(() => books.filter(b => !OLD_TESTAMENT_SET.has(b)), [books, OLD_TESTAMENT_SET]);

  const scrollVerseIntoView = (verseNum: number) => {
    setTimeout(() => {
      const element = document.getElementById(`verse-${verseNum}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);
  };

  const handleSelectVerseFromMenu = (verseNum: number) => {
    setSelectedVerse(verseNum);
    setIsNavOpen(false);
    setHighlightedVerse(verseNum);
    scrollVerseIntoView(verseNum);
    setTimeout(() => {
      setHighlightedVerse(null);
    }, 2500);
  };

  const handleSelectChapterOnly = (chapNum: number) => {
    setSelectedChapter(chapNum);
    setSelectedVerse(null);
    setIsNavOpen(false);
    setTimeout(() => {
      const container = document.getElementById("reading-container");
      if (container) {
        container.scrollTop = 0;
      }
    }, 150);
  };

  const handleSelectBook = (bookName: string) => {
    setSelectedBookName(bookName);
    setCommentaryType(null);
  };

  const handleSelectChapter = (chapNum: number) => {
    setSelectedChapter(chapNum);
    setCommentaryType(null);
  };

  const handleVerseClick = (verseNum: number, type: "explanation" | "doubt") => {
    setSelectedVerse(verseNum);
    setCommentaryType(type);
  };

  const selectedVerseText = selectedVerse !== null ? verses[selectedVerse - 1]?.text || "" : "";

  const [commentaryData, setCommentaryData] = useState<VerseCommentary | null>(null);
  const [commentaryLoading, setCommentaryLoading] = useState(false);
  const [commentaryError, setCommentaryError] = useState(false);

  useEffect(() => {
    if (selectedVerse === null) {
      setCommentaryData(null);
      setCommentaryLoading(false);
      setCommentaryError(false);
      return;
    }

    let isMounted = true;
    setCommentaryLoading(true);
    setCommentaryError(false);
    setCommentaryData(null);

    const bookKey = selectedBookName.toLowerCase();
    
    import(`@/data/commentary/${bookKey}.json`)
      .then((module) => {
        if (!isMounted) return;
        const list = module.default as VerseCommentary[];
        const match = list.find(
          (item) => item.chapter === selectedChapter && item.verse === selectedVerse
        );
        if (match) {
          setCommentaryData(match);
        } else {
          setCommentaryError(true);
        }
        setCommentaryLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn(`No commentary file found for ${bookKey}`, err);
        setCommentaryError(true);
        setCommentaryLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedBookName, selectedChapter, selectedVerse]);

  const crossReferences = useMemo(() => {
    if (selectedVerse === null) return [];
    return getCrossReferences(selectedBookName, String(selectedChapter), selectedVerse);
  }, [selectedVerse, selectedBookName, selectedChapter, getCrossReferences]);

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
            {/* Custom 3-Step Navigation Button */}
            <button
              onClick={() => {
                setNavTab("book");
                setIsNavOpen(true);
              }}
              className="flex items-center space-x-2.5 px-4 py-2 rounded-lg bg-black/[0.03] dark:bg-white/[0.04] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] border border-black/10 dark:border-white/10 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.05)] text-sm text-liturgy-stone-dark dark:text-liturgy-stone-light transition-all duration-200"
            >
              <span className="font-serif font-bold tracking-wide">
                {selectedBookName === "Psalms" 
                  ? `Psalm ${selectedChapter}${selectedVerse ? `:${selectedVerse}` : ""}` 
                  : `${selectedBookName} ${selectedChapter}${selectedVerse ? `:${selectedVerse}` : ""}`}
              </span>
              <ChevronDown className="h-4 w-4 text-liturgy-gold transition-transform duration-200 group-hover:translate-y-0.5" />
            </button>
          </div>
        </div>

        {/* Scripture Reading Content */}
        <div id="reading-container" className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Chapter Heading */}
            <div className="text-center space-y-2">
              <span className="text-xs font-semibold text-amber-800 dark:text-liturgy-gold tracking-widest uppercase">
                Catholic Public Domain Version (CPDV)
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-liturgy-stone-dark dark:text-liturgy-stone-light transition-colors">
                {selectedBookName === "Psalms" ? `Psalm ${selectedChapter}` : `${selectedBookName} ${selectedChapter}`}
              </h1>
              <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-liturgy-gold to-transparent mx-auto" />
            </div>

             {/* Verses Column */}
             <div className="space-y-6 pt-4 text-justify">
               {verses.map((v) => {
                 const isSelected = selectedVerse === v.verse;
                 const isHighlighted = highlightedVerse === v.verse;
                 return (
                   <motion.div
                     key={v.verse}
                     id={`verse-${v.verse}`}
                     whileHover={{
                       scale: 1.015,
                       backdropFilter: "blur(12px)",
                       borderColor: "rgba(212, 175, 55, 0.3)",
                       boxShadow: "0 4px 12px rgba(212, 175, 55, 0.08)",
                     }}
                     transition={{ duration: 0.2 }}
                     className={`group relative py-2.5 px-3 rounded-lg transition-all duration-1000 border ${
                       isHighlighted
                         ? "bg-amber-500/10 dark:bg-liturgy-gold/15 border-l-4 border-liturgy-gold border-black/10 dark:border-white/10 shadow-[0_0_15px_rgba(214,175,55,0.2)] animate-pulse"
                         : isSelected
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
                        onClick={() => handleVerseClick(v.verse, "explanation")}
                        className="flex items-center space-x-1 rounded px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:text-liturgy-gold hover:bg-amber-800/10 dark:hover:bg-liturgy-gold/10 transition-colors"
                      >
                        <BookOpenText className="h-3 w-3" />
                        <span>📖 Explanation</span>
                      </button>
                      <span className="text-liturgy-stone-gray text-[10px]">|</span>
                      <button
                        onClick={() => handleVerseClick(v.verse, "doubt")}
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
          {selectedVerse !== null ? (
            <motion.div
              key={`${selectedBookName}-${selectedChapter}-${selectedVerse}`}
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
                    {selectedBookName === "Psalms" ? `Psalm ${selectedChapter}:${selectedVerse}` : `${selectedBookName} ${selectedChapter}:${selectedVerse}`}
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
                &ldquo;{selectedVerseText}&rdquo;
              </div>

              {/* Commentary modules */}
              {commentaryLoading ? (
                <div className="h-64 flex flex-col items-center justify-center space-y-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-liturgy-gold border-t-transparent"></div>
                  <p className="text-xs text-liturgy-stone-dark/60 dark:text-liturgy-stone-gray font-sans">
                    Loading commentary matrix...
                  </p>
                </div>
              ) : commentaryError || !commentaryData ? (
                <div className="p-6 rounded-xl bg-white/20 dark:bg-white/5 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-lg text-center space-y-4">
                  <div className="inline-flex p-3 rounded-full bg-liturgy-gold/10 text-liturgy-gold">
                    <Bookmark className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-serif font-semibold text-liturgy-stone-dark dark:text-liturgy-stone-light">
                    Offline Archive Status
                  </p>
                  <p className="text-xs text-liturgy-stone-dark/60 dark:text-liturgy-stone-gray leading-relaxed font-sans">
                    Deep-dive data maps for this verse are currently compiling in the offline archive.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 1. Why Jesus Said It */}
                  <div className="space-y-2 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 backdrop-blur-sm shadow-[0_0_15px_rgba(245,158,11,0.02)]">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                      <Flame className="h-4 w-4 text-amber-500" />
                      <span>Why?</span>
                    </div>
                    <p className="text-sm leading-relaxed text-liturgy-stone-dark/80 dark:text-liturgy-stone-light/85">
                      {commentaryData.why_jesus_said_it}
                    </p>
                  </div>

                  {/* 2. Catechism Connection */}
                  <div className="space-y-2 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.02)]">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      <BookOpenText className="h-4 w-4 text-emerald-500" />
                      <span>Catechism Connection</span>
                    </div>
                    <p className="text-sm leading-relaxed text-liturgy-stone-dark/80 dark:text-liturgy-stone-light/85">
                      {commentaryData.ccc_validation}
                    </p>
                  </div>

                  {/* 3. Historical Reality */}
                  <div className="space-y-2 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.02)]">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                      <Compass className="h-4 w-4 text-blue-500" />
                      <span>Historical Reality</span>
                    </div>
                    <p className="text-sm leading-relaxed text-liturgy-stone-dark/80 dark:text-liturgy-stone-light/85">
                      {commentaryData.historical_reality}
                    </p>
                  </div>

                  {/* 4. Linguistic / Translation Shift */}
                  <div className="space-y-2 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 backdrop-blur-sm shadow-[0_0_15px_rgba(139,92,246,0.02)]">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                      <Languages className="h-4 w-4 text-purple-500" />
                      <span>Linguistic / Translation Shift</span>
                    </div>
                    <p className="text-sm leading-relaxed text-liturgy-stone-dark/80 dark:text-liturgy-stone-light/85">
                      {commentaryData.translation_shift}
                    </p>
                  </div>

                  {/* 5. Cross References */}
                  <div className="space-y-2 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 backdrop-blur-sm shadow-[0_0_15px_rgba(99,102,241,0.02)]">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                      <LinkIcon className="h-4 w-4 text-indigo-500" />
                      <span>Commentary Cross References</span>
                    </div>
                    {commentaryData.cross_references && commentaryData.cross_references.length > 0 ? (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {commentaryData.cross_references.map((ref, idx) => (
                          <span 
                            key={idx}
                            className="px-2.5 py-1 rounded bg-indigo-500/10 dark:bg-indigo-400/10 text-xs font-medium text-indigo-700 dark:text-indigo-300 border border-indigo-500/20"
                          >
                            {ref}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs italic text-liturgy-stone-dark/40 dark:text-liturgy-stone-gray">
                        No specific commentary cross references for this verse.
                      </p>
                    )}
                  </div>

                  {/* 6. Fascinating Fact */}
                  <div className="space-y-2 p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 backdrop-blur-sm shadow-[0_0_15px_rgba(244,63,94,0.02)]">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                      <Sparkles className="h-4 w-4 text-rose-500" />
                      <span>Fascinating Fact</span>
                    </div>
                    <p className="text-sm leading-relaxed text-liturgy-stone-dark/80 dark:text-liturgy-stone-light/85">
                      {commentaryData.fascinating_fact}
                    </p>
                  </div>
                </div>
              )}

                {/* Scripture Cross-References */}
                {crossReferences.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-black/5 dark:border-white/10">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-amber-800 dark:text-liturgy-gold uppercase tracking-wider">
                      <BookOpenText className="h-3.5 w-3.5" />
                      <span>Scripture Cross-References</span>
                    </div>
                    <div className="space-y-3">
                      {crossReferences.map((ref, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => {
                            setSelectedBookName(ref.book);
                            setSelectedChapter(Number(ref.chapter));
                            setSelectedVerse(ref.verse);
                          }}
                          className="p-2.5 rounded border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.05] dark:hover:bg-white/[0.06] hover:border-liturgy-gold/30 dark:hover:border-liturgy-gold/30 cursor-pointer transition-all duration-200"
                        >
                          <div className="flex justify-between text-[11px] font-bold text-amber-800 dark:text-liturgy-gold mb-1">
                            <span>{ref.book === "Psalms" ? `Psalm ${ref.chapter}:${ref.verse}` : `${ref.book} ${ref.chapter}:${ref.verse}`}</span>
                            <span className="text-[9px] uppercase px-1 rounded bg-black/5 dark:bg-white/10 text-liturgy-stone-dark/60 dark:text-liturgy-stone-light/60">
                              {ref.type}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed text-liturgy-stone-dark/70 dark:text-liturgy-stone-gray italic">
                            &ldquo;{ref.text}&rdquo;
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
        {selectedVerse !== null && (
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
                    {selectedBookName === "Psalms" ? `Psalm ${selectedChapter}:${selectedVerse}` : `${selectedBookName} ${selectedChapter}:${selectedVerse}`}
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
                &ldquo;{selectedVerseText}&rdquo;
              </div>

              {/* Commentary modules */}
              {commentaryLoading ? (
                <div className="h-48 flex flex-col items-center justify-center space-y-3">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-liturgy-gold border-t-transparent"></div>
                  <p className="text-[11px] text-liturgy-stone-dark/60 dark:text-liturgy-stone-gray font-sans">
                    Loading commentary matrix...
                  </p>
                </div>
              ) : commentaryError || !commentaryData ? (
                <div className="p-5 rounded-xl bg-white/20 dark:bg-white/5 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-lg text-center space-y-3 animate-fade-in">
                  <div className="inline-flex p-2 rounded-full bg-liturgy-gold/10 text-liturgy-gold">
                    <Bookmark className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-serif font-semibold text-liturgy-stone-dark dark:text-liturgy-stone-light">
                    Offline Archive Status
                  </p>
                  <p className="text-[11px] text-liturgy-stone-dark/60 dark:text-liturgy-stone-gray leading-relaxed font-sans">
                    Deep-dive data maps for this verse are currently compiling in the offline archive.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 1. Why Jesus Said It */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 backdrop-blur-sm">
                    <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                      <Flame className="h-3.5 w-3.5 text-amber-500" />
                      <span>Why?</span>
                    </div>
                    <p className="text-xs leading-relaxed text-liturgy-stone-dark/80 dark:text-liturgy-stone-light/85">
                      {commentaryData.why_jesus_said_it}
                    </p>
                  </div>

                  {/* 2. Catechism Connection */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-sm">
                    <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      <BookOpenText className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Catechism Connection</span>
                    </div>
                    <p className="text-xs leading-relaxed text-liturgy-stone-dark/80 dark:text-liturgy-stone-light/85">
                      {commentaryData.ccc_validation}
                    </p>
                  </div>

                  {/* 3. Historical Reality */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 backdrop-blur-sm">
                    <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                      <Compass className="h-3.5 w-3.5 text-blue-500" />
                      <span>Historical Reality</span>
                    </div>
                    <p className="text-xs leading-relaxed text-liturgy-stone-dark/80 dark:text-liturgy-stone-light/85">
                      {commentaryData.historical_reality}
                    </p>
                  </div>

                  {/* 4. Linguistic / Translation Shift */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 backdrop-blur-sm">
                    <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-purple-700 dark:text-purple-400 tracking-wider uppercase">
                      <Languages className="h-3.5 w-3.5 text-purple-500" />
                      <span>Linguistic / Translation Shift</span>
                    </div>
                    <p className="text-xs leading-relaxed text-liturgy-stone-dark/80 dark:text-liturgy-stone-light/85">
                      {commentaryData.translation_shift}
                    </p>
                  </div>

                  {/* 5. Cross References */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 backdrop-blur-sm">
                    <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-indigo-700 dark:text-indigo-400 tracking-wider uppercase">
                      <LinkIcon className="h-3.5 w-3.5 text-indigo-500" />
                      <span>Commentary Cross References</span>
                    </div>
                    {commentaryData.cross_references && commentaryData.cross_references.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {commentaryData.cross_references.map((ref, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-400/10 text-[10px] font-medium text-indigo-700 dark:text-indigo-300 border border-indigo-500/20"
                          >
                            {ref}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] italic text-liturgy-stone-dark/40 dark:text-liturgy-stone-gray">
                        No specific commentary cross references for this verse.
                      </p>
                    )}
                  </div>

                  {/* 6. Fascinating Fact */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 backdrop-blur-sm">
                    <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-rose-700 dark:text-rose-400 tracking-wider uppercase">
                      <Sparkles className="h-3.5 w-3.5 text-rose-500" />
                      <span>Fascinating Fact</span>
                    </div>
                    <p className="text-xs leading-relaxed text-liturgy-stone-dark/80 dark:text-liturgy-stone-light/85">
                      {commentaryData.fascinating_fact}
                    </p>
                  </div>
                </div>
              )}

                {/* Mobile Cross-References */}
                {crossReferences.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-black/5 dark:border-white/10">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-amber-800 dark:text-liturgy-gold uppercase tracking-wider">
                      <span>Scripture Cross-References</span>
                    </div>
                    <div className="space-y-3">
                      {crossReferences.map((ref, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => {
                            setSelectedBookName(ref.book);
                            setSelectedChapter(Number(ref.chapter));
                            setSelectedVerse(ref.verse);
                          }}
                          className="p-2.5 rounded border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.05] dark:hover:bg-white/[0.06] cursor-pointer transition-all duration-200"
                        >
                          <div className="flex justify-between text-[11px] font-bold text-amber-800 dark:text-liturgy-gold mb-1">
                            <span>{ref.book === "Psalms" ? `Psalm ${ref.chapter}:${ref.verse}` : `${ref.book} ${ref.chapter}:${ref.verse}`}</span>
                            <span className="text-[9px] uppercase px-1 rounded bg-black/5 dark:bg-white/10 text-liturgy-stone-dark/60 dark:text-liturgy-stone-light/60">
                              {ref.type}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed text-liturgy-stone-dark/70 dark:text-liturgy-stone-gray italic">
                            &ldquo;{ref.text}&rdquo;
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3-STEP NAVIGATION MENU OVERLAY */}
      <AnimatePresence>
        {isNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsNavOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#1c1c1a] border border-black/10 dark:border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between bg-black/[0.01] dark:bg-white/[0.01]">
                <div className="flex flex-col space-y-1">
                  <span className="text-[10px] font-semibold text-amber-800 dark:text-liturgy-gold tracking-wider uppercase">
                    Scripture Navigator
                  </span>
                  
                  {/* Clickable Breadcrumbs */}
                  <div className="flex items-center space-x-1.5 text-xs text-liturgy-stone-dark/60 dark:text-liturgy-stone-gray font-serif">
                    <button
                      onClick={() => setNavTab("book")}
                      className={`hover:text-liturgy-gold transition-colors font-bold ${
                        navTab === "book" ? "text-liturgy-gold underline" : ""
                      }`}
                    >
                      {selectedBookName}
                    </button>
                    <span className="opacity-50">/</span>
                    <button
                      onClick={() => {
                        if (navTab === "verse" || navTab === "chapter") {
                          setNavTab("chapter");
                        }
                      }}
                      className={`hover:text-liturgy-gold transition-colors font-bold ${
                        navTab === "chapter" ? "text-liturgy-gold underline" : ""
                      } ${navTab === "book" ? "opacity-40 cursor-default pointer-events-none" : ""}`}
                    >
                      Chapter {selectedChapter}
                    </button>
                    <span className="opacity-50">/</span>
                    <button
                      onClick={() => {
                        if (navTab === "verse") {
                          setNavTab("verse");
                        }
                      }}
                      className={`hover:text-liturgy-gold transition-colors font-bold ${
                        navTab === "verse" ? "text-liturgy-gold underline" : ""
                      } ${navTab !== "verse" ? "opacity-40 cursor-default pointer-events-none" : ""}`}
                    >
                      {selectedVerse ? `Verse ${selectedVerse}` : "Select Verse"}
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsNavOpen(false)}
                  className="p-1.5 rounded-lg text-liturgy-stone-gray hover:text-liturgy-stone-dark dark:hover:text-liturgy-stone-light hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Grid content panels */}
              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                
                {/* 1. BOOK SELECTION PANEL */}
                {navTab === "book" && (
                  <div className="space-y-6">
                    {/* Old Testament */}
                    <div>
                      <h4 className="text-[11px] font-bold tracking-widest text-amber-800 dark:text-liturgy-gold uppercase mb-3 border-b border-black/5 dark:border-white/5 pb-1">
                        Old Testament
                      </h4>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {otBooks.map((bName) => (
                          <button
                            key={bName}
                            onClick={() => {
                              setSelectedBookName(bName);
                              setSelectedChapter(1);
                              setSelectedVerse(null);
                              setNavTab("chapter");
                            }}
                            className={`p-2 text-xs text-left rounded-lg border font-serif transition-all duration-200 ${
                              selectedBookName === bName
                                ? "bg-amber-500/10 border-liturgy-gold text-amber-800 dark:text-liturgy-gold font-bold"
                                : "bg-black/[0.01] dark:bg-white/[0.01] border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 text-liturgy-stone-dark/90 dark:text-liturgy-stone-light/95"
                            }`}
                          >
                            {bName}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* New Testament */}
                    <div>
                      <h4 className="text-[11px] font-bold tracking-widest text-amber-800 dark:text-liturgy-gold uppercase mb-3 border-b border-black/5 dark:border-white/5 pb-1">
                        New Testament
                      </h4>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {ntBooks.map((bName) => (
                          <button
                            key={bName}
                            onClick={() => {
                              setSelectedBookName(bName);
                              setSelectedChapter(1);
                              setSelectedVerse(null);
                              setNavTab("chapter");
                            }}
                            className={`p-2 text-xs text-left rounded-lg border font-serif transition-all duration-200 ${
                              selectedBookName === bName
                                ? "bg-amber-500/10 border-liturgy-gold text-amber-800 dark:text-liturgy-gold font-bold"
                                : "bg-black/[0.01] dark:bg-white/[0.01] border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 text-liturgy-stone-dark/90 dark:text-liturgy-stone-light/95"
                            }`}
                          >
                            {bName}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. CHAPTER SELECTION PANEL */}
                {navTab === "chapter" && (
                  <div>
                    <h4 className="text-[11px] font-bold tracking-widest text-amber-800 dark:text-liturgy-gold uppercase mb-4 border-b border-black/5 dark:border-white/5 pb-1">
                      Chapters of {selectedBookName}
                    </h4>
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                      {chapters.map((chapNum) => (
                        <button
                          key={chapNum}
                          onClick={() => {
                            setSelectedChapter(chapNum);
                            setSelectedVerse(null);
                            setNavTab("verse");
                          }}
                          className={`p-2.5 text-xs text-center rounded-lg border font-mono transition-all duration-200 ${
                            selectedChapter === chapNum
                              ? "bg-amber-500/10 border-liturgy-gold text-amber-800 dark:text-liturgy-gold font-bold"
                              : "bg-black/[0.01] dark:bg-white/[0.01] border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 text-liturgy-stone-dark/90 dark:text-liturgy-stone-light/95"
                          }`}
                        >
                          {chapNum}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. VERSE SELECTION PANEL */}
                {navTab === "verse" && (
                  <div>
                    <div className="flex flex-wrap items-center justify-between mb-4 border-b border-black/5 dark:border-white/5 pb-2">
                      <h4 className="text-[11px] font-bold tracking-widest text-amber-800 dark:text-liturgy-gold uppercase">
                        Verses of {selectedBookName} {selectedChapter}
                      </h4>
                      <button
                        onClick={() => handleSelectChapterOnly(selectedChapter)}
                        className="text-[10px] font-bold text-liturgy-cyan hover:underline hover:text-liturgy-cyan/85 transition-colors"
                      >
                        Read Entire Chapter
                      </button>
                    </div>
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                      {verses.map((v) => (
                        <button
                          key={v.verse}
                          onClick={() => handleSelectVerseFromMenu(v.verse)}
                          className={`p-2.5 text-xs text-center rounded-lg border font-mono transition-all duration-200 ${
                            selectedVerse === v.verse
                              ? "bg-amber-500/10 border-liturgy-gold text-amber-800 dark:text-liturgy-gold font-bold"
                              : "bg-black/[0.01] dark:bg-white/[0.01] border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 text-liturgy-stone-dark/90 dark:text-liturgy-stone-light/95"
                          }`}
                        >
                          {v.verse}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
