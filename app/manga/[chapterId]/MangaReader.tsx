"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Server, Compass, Maximize2 } from "lucide-react";

interface Page {
  pageNumber: number;
  imageUrl: string;
  r2Key: string;
  caption: string;
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  r2BucketPrefix: string;
  pages: Page[];
}

export default function MangaReader({ chapter }: { chapter: Chapter }) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const currentPage = chapter.pages[currentPageIndex];

  const handleNext = () => {
    if (currentPageIndex < chapter.pages.length - 1) {
      setDirection(1);
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setDirection(-1);
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" as const },
    }),
  };

  const cdnUrl = `${chapter.r2BucketPrefix}/${currentPage.r2Key}`;

  return (
    <div className="relative flex-grow flex flex-col items-center py-10 sm:py-16 px-4 transition-colors duration-300">
      {/* Background Graphic Glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-liturgy-cyan/5 blur-3xl animate-pulse" />

      <div className="max-w-4xl w-full flex flex-col space-y-6">
        
        {/* Navigation Breadcrumb & Page Info */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/manga"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-liturgy-cyan hover:text-liturgy-cyan-hover transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Archive</span>
          </Link>
          
          <div className="text-xs text-liturgy-stone-dark/70 dark:text-liturgy-stone-gray font-serif transition-colors">
            {chapter.title} &bull; Page {currentPage.pageNumber} of {chapter.pages.length}
          </div>
        </div>

        {/* Dynamic Reader Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Main Visual Panels Box (Takes 3 cols on lg, Neumorphic card style) */}
          <div className="lg:col-span-3 flex flex-col justify-center rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-[#1c1c1a]/30 p-4 sm:p-6 shadow-[4px_4px_15px_rgba(163,163,163,0.15),_-4px_-4px_15px_rgba(255,255,255,0.7)] dark:shadow-[10px_10px_25px_rgba(0,0,0,0.5),_-6px_-6px_25px_rgba(255,255,255,0.015)] relative min-h-[400px] sm:min-h-[500px] transition-colors duration-300">
            <div className="relative flex-grow flex items-center justify-center overflow-hidden rounded-xl bg-liturgy-charcoal border border-black/10 dark:border-white/10 shadow-inner">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentPageIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full h-full flex flex-col items-center justify-center p-2 relative"
                >
                  {/* Image Container with hover zoom state */}
                  <motion.div 
                    whileHover={{ scale: 1.015 }}
                    className="relative max-w-full max-h-[450px] overflow-hidden rounded-lg border border-liturgy-stone-dark/30 shadow-xl cursor-zoom-in group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentPage.imageUrl}
                      alt={`Page ${currentPage.pageNumber}`}
                      className="object-contain max-h-[450px] w-auto transition-all duration-300 group-hover:brightness-105"
                    />
                    
                    {/* Zoom icon tooltip */}
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="h-4 w-4 text-liturgy-cyan" />
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation buttons (Tactile skeuomorphic) */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handlePrev}
                disabled={currentPageIndex === 0}
                className={`flex items-center space-x-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-2 text-xs font-semibold text-liturgy-stone-dark dark:text-liturgy-stone-light hover:border-liturgy-cyan dark:hover:border-liturgy-cyan transition-all duration-200 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.05)] shadow-sm ${
                  currentPageIndex === 0 ? "opacity-30 cursor-not-allowed border-transparent shadow-none" : "active:scale-95 active:shadow-[inset_1px_2px_4px_rgba(0,0,0,0.1)] dark:active:shadow-[inset_1px_2px_4px_rgba(0,0,0,0.4)]"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev Page</span>
              </button>

              {/* Dot Indicators */}
              <div className="hidden sm:flex space-x-1.5">
                {chapter.pages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > currentPageIndex ? 1 : -1);
                      setCurrentPageIndex(idx);
                    }}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      idx === currentPageIndex ? "bg-liturgy-cyan w-4" : "bg-liturgy-stone-gray/30 hover:bg-liturgy-stone-gray/60"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={currentPageIndex === chapter.pages.length - 1}
                className={`flex items-center space-x-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-2 text-xs font-semibold text-liturgy-stone-dark dark:text-liturgy-stone-light hover:border-liturgy-cyan dark:hover:border-liturgy-cyan transition-all duration-200 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.05)] shadow-sm ${
                  currentPageIndex === chapter.pages.length - 1 ? "opacity-30 cursor-not-allowed border-transparent shadow-none" : "active:scale-95 active:shadow-[inset_1px_2px_4px_rgba(0,0,0,0.1)] dark:active:shadow-[inset_1px_2px_4px_rgba(0,0,0,0.4)]"
                }`}
              >
                <span>Next Page</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Pane Details (Takes 1 col on lg, Neumorphic styling) */}
          <div className="lg:col-span-1 flex flex-col justify-between rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-[#1c1c1a]/40 p-5 sm:p-6 shadow-md transition-colors duration-300 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-xs font-semibold text-liturgy-cyan uppercase tracking-wider">
                <Compass className="h-4 w-4" />
                <span>Visual Narrative</span>
              </div>
              <h4 className="font-serif text-sm font-bold text-liturgy-stone-dark dark:text-liturgy-stone-light">
                Scene Narrative
              </h4>
              <p className="text-xs leading-relaxed text-liturgy-stone-dark/80 dark:text-liturgy-stone-gray/90 text-justify">
                {currentPage.caption}
              </p>
            </div>

            {/* Cloudflare R2 Pipeline Info (Tactile box) */}
            <div className="rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-liturgy-charcoal/50 p-4 space-y-3 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)]">
              <div className="flex items-center space-x-2 text-[10px] font-bold text-amber-800 dark:text-liturgy-gold uppercase tracking-wider">
                <Server className="h-3.5 w-3.5" />
                <span>Cloudflare R2 Node</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase text-liturgy-stone-dark/40 dark:text-liturgy-stone-gray block">Asset CDN URL:</span>
                <code className="text-[10px] text-amber-800 dark:text-liturgy-cyan break-all block leading-tight font-mono select-all bg-white dark:bg-liturgy-charcoal p-1.5 rounded border border-black/5 dark:border-white/5 shadow-sm">
                  {cdnUrl}
                </code>
              </div>
              <span className="text-[9px] text-liturgy-stone-dark/50 dark:text-liturgy-stone-gray/50 block leading-normal">
                Rendered statically via Next.js image loading pipeline mapping keys directly to object storage targets.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
