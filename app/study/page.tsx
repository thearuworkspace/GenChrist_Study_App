"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookMarked, ArrowRight, Flame, Sparkles } from "lucide-react";
import episodesData from "@/data/episodes.json";

export default function StudyIndexPage() {
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
    <div className="relative overflow-hidden py-12 sm:py-16 md:py-20">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-radial from-purple-500/5 to-transparent blur-3xl" />
      <div className="absolute bottom-10 left-10 -z-10 h-[400px] w-[400px] rounded-full bg-gradient-radial from-liturgy-gold/5 to-transparent blur-3xl" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-10"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-3">
            <div className="inline-flex items-center space-x-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-1 text-xs font-semibold text-purple-400 tracking-wider uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Episodic Theology Track</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-liturgy-stone-light">
              Conversational Study Episodes
            </h1>
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-liturgy-stone-gray">
              Engage with immersive, structured narrative prose that speaks directly to you. Unlock the deep theology, catechism teachings, and historical contexts under golden triggers.
            </p>
          </motion.div>

          {/* Episodes List Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {episodesData.map((episode, index) => (
              <Link
                key={episode.id}
                href={`/study/${episode.id}`}
                className="group relative flex flex-col justify-between rounded-xl border border-liturgy-stone-dark bg-liturgy-stone-dark/30 p-6 shadow-md hover:bg-liturgy-stone-dark/50 hover:border-purple-500/40 transition-all duration-300"
              >
                {/* Number Badge */}
                <div className="absolute top-6 right-6 font-serif text-3xl font-extrabold text-liturgy-stone-dark/60 group-hover:text-purple-500/20 transition-colors">
                  0{index + 1}
                </div>

                <div className="space-y-4 max-w-[85%]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <BookMarked className="h-5 w-5" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-serif text-xl font-bold text-liturgy-stone-light group-hover:text-purple-400 transition-colors">
                      {episode.title}
                    </h3>
                    <p className="text-xs text-liturgy-stone-gray flex items-center space-x-1">
                      <Flame className="h-3.5 w-3.5 text-liturgy-gold inline" />
                      <span>{Object.keys(episode.triggers).length} Theological Triggers</span>
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-liturgy-stone-gray leading-relaxed">
                    {episode.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-liturgy-stone-dark/60 flex items-center justify-between text-xs font-semibold text-purple-400 group-hover:text-purple-300 transition-colors uppercase tracking-wider">
                  <span>Start Reading</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
