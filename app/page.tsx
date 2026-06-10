"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, BookMarked, Image, Flame, Sparkles } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
  };


  // Saint of the day data
  const saint = {
    name: "St. Jerome",
    title: "Priest, Doctor, & Patron of Biblical Scholars",
    feastDay: "September 30",
    quote: "Ignorance of Scripture is ignorance of Christ.",
    bio: "St. Jerome (c. 347 – 420 AD) was a priest, confessor, theologian, and historian. He translated the Bible from Hebrew and Greek into Latin (the Vulgate), making the Word of God accessible to the Western Church. His life was marked by fierce scholarly dedication and deep ascetic contemplation in Bethlehem.",
    patronage: "Biblical scholars, translators, librarians, and students.",
  };

  const modules = [
    {
      title: "Scripture Workstation",
      description: "Explore the Holy Scriptures (WEB: Catholic Edition) with integrated dynamic reflections, historical contexts, and hover-triggered annotations.",
      href: "/bible",
      icon: BookOpen,
      color: "from-liturgy-gold to-yellow-600",
      accent: "text-liturgy-gold",
      shadow: "shadow-liturgy-gold/10",
      hoverBorder: "hover:border-liturgy-gold",
    },
    {
      title: "The Study Track",
      description: "Walk through immersive, episodic narrative studies where the prose speaks directly to you. Interact with golden theology prompts to explore teachings.",
      href: "/study",
      icon: BookMarked,
      color: "from-purple-500 to-indigo-600",
      accent: "text-purple-400",
      shadow: "shadow-purple-500/10",
      hoverBorder: "hover:border-purple-500",
    },
    {
      title: "Manga Archive",
      description: "Engage with beautiful, high-resolution graphic novel panels illustrating sacred history, powered by static serverless image pipelines.",
      href: "/manga",
      icon: Image,
      color: "from-liturgy-cyan to-blue-600",
      accent: "text-liturgy-cyan",
      shadow: "shadow-liturgy-cyan/10",
      hoverBorder: "hover:border-liturgy-cyan",
    },
  ];

  return (
    <div className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-radial from-liturgy-cyan/5 to-transparent blur-3xl sm:h-[800px] sm:w-[800px]" />
      <div className="absolute top-1/4 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-gradient-radial from-liturgy-gold/5 to-transparent blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12 md:space-y-16"
        >
          {/* Hero Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 rounded-full border border-liturgy-cyan/20 bg-liturgy-cyan/5 px-4 py-1.5 text-xs font-semibold text-liturgy-cyan tracking-wider uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Sanctum Veritas et Scientia</span>
            </div>
            <h1 className="font-serif text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-liturgy-stone-light via-liturgy-cyan to-liturgy-gold bg-clip-text text-transparent">
                GenChrist Study App
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-base text-liturgy-stone-gray sm:text-lg">
              Welcome to the ultimate Catholic scripture workstation, episodic theology track, and animated visual narrative archive. Empowering your faith journey through sacred art and text.
            </p>
          </motion.div>

          {/* Saint of the Day Banner */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-2xl border border-liturgy-stone-dark bg-liturgy-stone-dark/40 backdrop-blur-sm p-6 sm:p-8 shadow-xl"
          >
            {/* Corner Accent Glow */}
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-liturgy-gold/10 blur-xl" />
            
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start relative z-10">
              <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-liturgy-gold/20 to-amber-500/10 border border-liturgy-gold/30 text-liturgy-gold shadow-lg shadow-liturgy-gold/5">
                <Flame className="h-7 w-7 animate-pulse" />
              </div>
              
              <div className="space-y-4 flex-grow">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-x-2 text-xs font-medium text-liturgy-gold tracking-widest uppercase">
                    <span>Saint of the Day</span>
                    <span className="text-liturgy-stone-gray">•</span>
                    <span>Feast: {saint.feastDay}</span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-liturgy-stone-light">
                    {saint.name}
                  </h2>
                  <p className="text-xs italic text-liturgy-stone-gray font-medium">
                    {saint.title}
                  </p>
                </div>
                
                <blockquote className="border-l-2 border-liturgy-gold pl-4 py-1">
                  <p className="font-serif text-lg italic text-liturgy-stone-light">
                    &ldquo;{saint.quote}&rdquo;
                  </p>
                </blockquote>
                
                <p className="text-sm leading-relaxed text-liturgy-stone-gray">
                  {saint.bio}
                </p>

                <div className="text-xs text-liturgy-stone-gray">
                  <strong className="text-liturgy-gold">Patronage:</strong> {saint.patronage}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sub-Routes Entry Cards Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  key={module.href}
                  href={module.href}
                  className={`group relative flex flex-col rounded-2xl border border-liturgy-stone-dark bg-liturgy-stone-dark/30 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 ${module.hoverBorder} hover:bg-liturgy-stone-dark/50 ${module.shadow}`}
                >
                  {/* Decorative glow overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-liturgy-stone-dark to-liturgy-charcoal border border-liturgy-stone-dark text-liturgy-stone-light transition-transform duration-300 group-hover:scale-105 group-hover:text-liturgy-cyan mb-5">
                    <Icon className={`h-6 w-6 transition-colors duration-300 group-hover:${module.accent}`} />
                  </div>
                  
                  <h3 className="font-serif text-xl font-bold text-liturgy-stone-light group-hover:text-liturgy-cyan transition-colors duration-300 mb-2">
                    {module.title}
                  </h3>
                  
                  <p className="text-sm leading-relaxed text-liturgy-stone-gray flex-grow">
                    {module.description}
                  </p>
                  
                  <div className="mt-4 flex items-center space-x-1.5 text-xs font-semibold text-liturgy-cyan tracking-wider uppercase group-hover:underline">
                    <span>Enter Portal</span>
                    <span>→</span>
                  </div>
                </Link>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
