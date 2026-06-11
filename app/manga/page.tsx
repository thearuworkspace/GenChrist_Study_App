"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Image as ImageIcon, Sparkles, BookOpen } from "lucide-react";
import mangaData from "@/data/manga.json";

export default function MangaIndexPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
  };

  return (
    <div className="relative overflow-hidden py-12 sm:py-16 md:py-20 transition-colors duration-300">
      {/* Background Graphic Glow */}
      <div className="absolute top-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-radial from-liturgy-cyan/5 to-transparent blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 -z-10 h-[400px] w-[400px] rounded-full bg-gradient-radial from-liturgy-gold/5 to-transparent blur-3xl animate-pulse" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-10"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-3">
            <div className="inline-flex items-center space-x-1.5 rounded-full border border-liturgy-cyan/20 bg-liturgy-cyan/5 px-4 py-1 text-xs font-semibold text-liturgy-cyan tracking-wider uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Visual Narrative Archive</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-liturgy-stone-dark dark:text-liturgy-stone-light transition-colors">
              Manga Graphic Novels
            </h1>
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-liturgy-stone-dark/80 dark:text-liturgy-stone-gray">
              Explore theological and historical narratives beautifully depicted in sequential artwork. All image assets are configured for static CDN delivery.
            </p>
          </motion.div>

          {/* Manga Cards Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {mangaData.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/manga/${chapter.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-[#1c1c1a]/30 hover:border-liturgy-cyan/40 dark:hover:border-liturgy-cyan/40 shadow-[4px_4px_12px_rgba(163,163,163,0.15),_-4px_-4px_12px_rgba(255,255,255,0.7)] dark:shadow-[10px_10px_20px_rgba(0,0,0,0.4),_-6px_-6px_20px_rgba(255,255,255,0.015)] transition-all duration-300"
              >
                {/* Image container with smooth scaling on hover */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-liturgy-charcoal border-b border-black/5 dark:border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-liturgy-charcoal via-transparent to-transparent z-10 opacity-60 dark:opacity-75" />
                  
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={chapter.coverUrl}
                    alt={chapter.title}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  
                  <div className="absolute bottom-4 left-4 z-20 flex items-center space-x-1.5 rounded-md bg-liturgy-charcoal/80 border border-liturgy-stone-dark/85 px-2.5 py-1 text-[10px] font-semibold text-liturgy-cyan tracking-wider uppercase">
                    <ImageIcon className="h-3 w-3" />
                    <span>{chapter.pages.length} Pages</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-bold text-liturgy-stone-dark dark:text-liturgy-stone-light group-hover:text-liturgy-cyan transition-colors duration-300">
                      {chapter.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-liturgy-stone-dark/70 dark:text-liturgy-stone-gray leading-relaxed">
                      {chapter.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-liturgy-cyan group-hover:text-liturgy-cyan/80 transition-colors uppercase tracking-wider">
                    <span className="flex items-center space-x-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Open Book</span>
                    </span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
