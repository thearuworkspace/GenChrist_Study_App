"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, X, Bookmark, Compass } from "lucide-react";

interface TriggerDetail {
  term: string;
  explanation: string;
  historicalContext: string;
}

interface Episode {
  id: string;
  title: string;
  description: string;
  content: string[];
  triggers: Record<string, TriggerDetail>;
}

export default function EpisodeReader({ episode }: { episode: Episode }) {
  const [activeTriggerKey, setActiveTriggerKey] = useState<string | null>(null);

  const handleTriggerClick = (key: string) => {
    setActiveTriggerKey(key);
  };

  const activeTrigger = activeTriggerKey ? episode.triggers[activeTriggerKey] : null;

  // Parses narrative strings to extract and format [Why?|key] triggers dynamically
  const parseLineWithTriggers = (line: string, lineIndex: number) => {
    const regex = /\[Why\?\|([^\]]+)\]/g;
    const parts = line.split(regex);
    
    return parts.map((part, index) => {
      // Even indexes are plain text, odd indexes are trigger keys
      if (index % 2 === 0) {
        return <span key={`text-${lineIndex}-${index}`}>{part}</span>;
      } else {
        const triggerKey = part;
        const trigger = episode.triggers[triggerKey];
        const term = trigger ? trigger.term : "Theology";
        
        return (
          <button
            key={`trigger-${lineIndex}-${triggerKey}`}
            onClick={() => handleTriggerClick(triggerKey)}
            className="mx-1 inline-flex items-center rounded-md bg-amber-500/10 dark:bg-liturgy-gold/10 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:text-liturgy-gold border border-amber-800/20 dark:border-liturgy-gold/30 hover:bg-amber-500/20 dark:hover:bg-liturgy-gold/25 hover:scale-105 active:scale-95 shadow-sm transition-all duration-200"
            title={`Theological Context: ${term}`}
          >
            [Why?]
          </button>
        );
      }
    });
  };

  return (
    <div className="relative flex-grow flex flex-col justify-center py-10 sm:py-16 md:py-20 px-4 sm:px-6 transition-colors duration-300">
      {/* Background radial overlays */}
      <div className="absolute top-0 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-radial from-purple-500/5 to-transparent blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-10 -z-10 h-[400px] w-[400px] rounded-full bg-gradient-radial from-liturgy-cyan/5 to-transparent blur-3xl animate-pulse" />

      <div className="mx-auto max-w-3xl w-full">
        {/* Navigation Breadcrumb */}
        <Link
          href="/study"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors uppercase tracking-wider mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Tracks</span>
        </Link>

        {/* Narrative Box (Neumorphic Card) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-[#1c1c1a]/30 shadow-[4px_4px_15px_rgba(163,163,163,0.15),_-4px_-4px_15px_rgba(255,255,255,0.7)] dark:shadow-[10px_10px_30px_rgba(0,0,0,0.5),_-6px_-6px_30px_rgba(255,255,255,0.015)] p-6 sm:p-10 space-y-8 transition-colors duration-300"
        >
          {/* Episode Heading */}
          <div className="border-b border-black/5 dark:border-white/10 pb-6 space-y-2">
            <span className="text-xs font-semibold text-amber-800 dark:text-liturgy-gold tracking-widest uppercase">
              Immersive Reading Track
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-liturgy-stone-dark dark:text-liturgy-stone-light">
              {episode.title}
            </h1>
            <p className="text-xs sm:text-sm text-liturgy-stone-dark/70 dark:text-liturgy-stone-gray italic">
              {episode.description}
            </p>
          </div>

          {/* Prose Content */}
          <div className="space-y-6 pt-2">
            {episode.content.map((line, idx) => (
              <p
                key={idx}
                className="font-serif text-base sm:text-lg leading-relaxed text-liturgy-stone-dark/90 dark:text-liturgy-stone-light/95 text-justify transition-colors"
              >
                {parseLineWithTriggers(line, idx)}
              </p>
            ))}
          </div>
        </motion.div>
      </div>

      {/* THEOLOGICAL EXPLANATION DIALOG MODAL (Glassmorphism layout) */}
      <AnimatePresence>
        {activeTriggerKey && activeTrigger && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTriggerKey(null)}
              className="fixed inset-0 z-40 bg-black"
            />

            {/* Modal Body */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-lg rounded-2xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#1c1c1a] p-6 shadow-2xl pointer-events-auto space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar transition-colors duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-black/5 dark:border-white/10 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-amber-800 dark:text-liturgy-gold tracking-widest uppercase block">
                      Theological Insight
                    </span>
                    <h3 className="font-serif text-xl font-bold text-liturgy-stone-dark dark:text-liturgy-stone-light">
                      {activeTrigger.term}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTriggerKey(null)}
                    className="p-1 rounded-md text-liturgy-stone-gray hover:text-liturgy-stone-dark dark:hover:text-liturgy-stone-light hover:bg-black/5 dark:hover:bg-liturgy-charcoal transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="space-y-6">
                  {/* Theological Meaning */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-liturgy-cyan uppercase tracking-wider">
                      <Bookmark className="h-4 w-4" />
                      <span>Doctrine & Explanation</span>
                    </div>
                    <p className="text-sm leading-relaxed text-liturgy-stone-dark/70 dark:text-liturgy-stone-gray">
                      {activeTrigger.explanation}
                    </p>
                  </div>

                  {/* Historical context */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-amber-800 dark:text-liturgy-gold uppercase tracking-wider">
                      <Compass className="h-4 w-4" />
                      <span>Historical Context</span>
                    </div>
                    <p className="text-sm leading-relaxed text-liturgy-stone-dark/70 dark:text-liturgy-stone-gray">
                      {activeTrigger.historicalContext}
                    </p>
                  </div>
                </div>

                {/* Footer action (Skeuomorphic border button) */}
                <div className="pt-4 border-t border-black/5 dark:border-white/10 text-right">
                  <button
                    onClick={() => setActiveTriggerKey(null)}
                    className="rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 px-4 py-1.5 text-xs font-semibold text-liturgy-stone-dark dark:text-liturgy-stone-light hover:border-liturgy-cyan transition-all duration-200 active:scale-95 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.05)] shadow-sm cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
