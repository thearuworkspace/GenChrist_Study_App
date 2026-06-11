"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  BookMarked, 
  Image as ImageIcon, 
  Flame, 
  Sparkles, 
  Server, 
  Compass, 
  ChevronDown, 
  Plus, 
  Minus,
  Sparkle
} from "lucide-react";

const MotionLink = motion(Link);

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Standard Framer Motion scroll entry spring animations
  const scrollSpringVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring" as const, stiffness: 100, damping: 15 } 
    }
  };

  // Tactile Spring Button & Card variants (using spring physics: stiffness 200)
  const springClickVariants = {
    initial: {
      scale: 1,
      y: 0
    },
    hover: {
      scale: 1.015,
      y: -2,
      transition: { type: "spring" as const, stiffness: 200, damping: 12 }
    },
    tap: {
      scale: 0.985,
      y: 1,
      transition: { type: "spring" as const, stiffness: 200, damping: 8 }
    }
  };

  const bentoCardVariants = {
    initial: {
      scale: 1,
      y: 0
    },
    hover: {
      scale: 0.995,
      y: 0,
      transition: { type: "spring" as const, stiffness: 200, damping: 15 }
    },
    tap: {
      scale: 0.98,
      y: 0,
      transition: { type: "spring" as const, stiffness: 200, damping: 10 }
    }
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

  const stats = [
    { value: "73", label: "Canonical Books", description: "Complete Catholic Canon, incorporating standard scriptures and the deuterocanonical texts." },
    { value: "24+", label: "Theology Commentaries", description: "Immersive narrative tracks, linguistic guides, and historical contexts mapped directly to text." },
    { value: "100%", label: "Serverless & Database-Free", description: "No database lag or API bottlenecks. All data pre-compiled into static JSON structures." },
    { value: "4K+", label: "Visual Manga Panels", description: "High-definition narrative illustrations served via Cloudflare R2 static edge storage." }
  ];

  const faqs = [
    {
      question: "Why does the GenChrist Study App use the World English Bible: Catholic Edition?",
      answer: "The Catholic scriptural canon includes 73 books, incorporating the 7 Deuterocanonical books (such as Tobit, Judith, and Wisdom) which were part of the ancient Greek Septuagint used by the Apostles. The World English Bible: Catholic Edition provides a modern, highly accurate English translation that preserves this complete scriptural canon, making it the perfect foundation for Catholic biblical study."
    },
    {
      question: "What are the golden '[Why?]' triggers in the Study Tracks?",
      answer: "These triggers are interactive theological and historical commentaries. As you read the conversational narrative, clicking a [Why?] button launches a glassmorphic popover modal detailing theological dogmas (referencing the Catechism of the Catholic Church), historical contexts, and linguistic insights (such as the Greek origin of the term 'Logos') behind that specific phrase."
    },
    {
      question: "How does this application function 100% database-free and serverless?",
      answer: "GenChrist is engineered as a serverless static application. Instead of relying on a live relational database which introduces latency and operational overhead, the entire library of scriptures, episodic commentaries, and manga assets are pre-compiled into local structured JSON layout data profiles. This ensures that the app loads instantly, runs with zero server cost, and is fully optimized for static CDN edge deployments like Vercel's hobby tier."
    },
    {
      question: "How does this app integrate Catholic Theology with Science and Archaeology?",
      answer: "Following the teachings of Pope St. John Paul II in his encyclical 'Fides et Ratio' (Faith and Reason), we believe that faith and reason are complementary paths to the truth. We cross-reference scriptures with historical archaeology (like the Assyrian deportations in Tobit) and scientific principles (viewing creation through cosmology and natural laws) to show that divine revelation and human reason are fully integrated."
    }
  ];

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] dark:bg-liturgy-dark flex items-center justify-center transition-colors duration-300">
        <div className="text-amber-800 dark:text-liturgy-gold font-serif text-xl animate-pulse flex items-center space-x-2">
          <Sparkles className="h-5 w-5 animate-spin" />
          <span>Loading GenChrist System...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] dark:bg-liturgy-dark text-liturgy-stone-dark dark:text-liturgy-stone-light transition-colors duration-300 overflow-x-hidden">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 border-b border-black/5 dark:border-white/5 bg-gradient-to-b from-[#FAF9F6] via-[#F5F5F0] to-[#FAF9F6] dark:from-liturgy-dark dark:via-[#191919] dark:to-liturgy-dark transition-colors duration-300">
        {/* Background radial glows */}
        <div className="absolute top-1/4 left-1/2 -z-10 h-[600px] w-[600px] sm:h-[800px] sm:w-[800px] -translate-x-1/2 rounded-full bg-gradient-radial from-liturgy-cyan/10 to-transparent blur-3xl opacity-75 dark:opacity-40" />
        <div className="absolute bottom-1/4 left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-gradient-radial from-liturgy-gold/10 to-transparent blur-3xl opacity-75 dark:opacity-40" />

        <div className="max-w-4xl mx-auto space-y-8 relative z-10 flex flex-col items-center">
          {/* Glowing Badge tag */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 rounded-full border border-liturgy-cyan/20 dark:border-liturgy-gold/25 bg-liturgy-cyan/5 px-4 py-1.5 text-xs font-semibold text-liturgy-cyan dark:text-liturgy-gold tracking-wider uppercase shadow-[inset_1px_1px_2px_rgba(6,182,212,0.15)] dark:shadow-gold-rim"
          >
            <Sparkles className="h-3.5 w-3.5 text-liturgy-cyan dark:text-liturgy-gold animate-pulse" />
            <span>Sensus Fidei, Revelatio, et Scientia</span>
          </motion.div>

          {/* Extruded Hero Console Panel (Skeuomorphic & Neumorphic workstation header wrapper) */}
          <div className="bg-[#FAF9F6] dark:bg-liturgy-stone border border-black/5 dark:border-liturgy-gold/20 shadow-[6px_6px_14px_rgba(0,0,0,0.06),_-6px_-6px_14px_rgba(255,255,255,0.7)] dark:shadow-neumorphic-flat rounded-3xl p-8 sm:p-12 w-full max-w-3xl space-y-6 transition-colors duration-300">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-amber-900 via-liturgy-cyan to-amber-700 dark:from-liturgy-stone-light dark:via-liturgy-cyan dark:to-liturgy-gold bg-clip-text text-transparent">
                GenChrist Study App
              </span>
            </h1>

            <p className="mx-auto max-w-xl text-sm sm:text-base text-liturgy-stone-dark/80 dark:text-liturgy-stone-gray leading-relaxed">
              Immerse yourself in complete Catholic Scripture, interactive theological tracks, and high-definition narrative manga. Harmonizing divine revelation, historical archaeology, and cosmological science.
            </p>

            {/* Skeuomorphic Spring CTA Button */}
            <div className="pt-4">
              <motion.button
                variants={springClickVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => document.getElementById("bento-showcase")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-3.5 rounded-xl border border-amber-800/40 dark:border-liturgy-gold/40 bg-gradient-to-b from-amber-600 to-amber-700 dark:from-[#2a2a2a] dark:to-[#1a1a1a] text-white dark:text-liturgy-gold font-serif font-bold tracking-wide uppercase transition-colors shadow-[0_4px_6px_rgba(0,0,0,0.15),_inset_0_1px_1px_rgba(255,255,255,0.3)] dark:shadow-neumorphic-flat hover:dark:shadow-neumorphic-pressed cursor-pointer"
              >
                Begin Exploration
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ASYMMETRICAL BENTO GRID SHOWCASE */}
      <motion.section 
        id="bento-showcase"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollSpringVariants}
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12"
      >
        <div className="text-center md:text-left space-y-2">
          <span className="text-xs font-semibold text-liturgy-cyan dark:text-liturgy-gold tracking-widest uppercase">
            Feature Architecture
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-liturgy-stone-dark dark:text-liturgy-stone-light">
            Interactive Core Portals
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tile 1: Scripture Workstation (Takes 2 cols, 2 rows) */}
          <motion.div
            variants={bentoCardVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="md:col-span-2 md:row-span-2 rounded-2xl border border-black/5 dark:border-liturgy-gold/20 bg-white dark:bg-liturgy-stone shadow-[6px_6px_14px_rgba(0,0,0,0.06),_-6px_-6px_14px_rgba(255,255,255,0.7)] dark:shadow-neumorphic-flat hover:dark:shadow-neumorphic-pressed p-6 sm:p-8 flex flex-col justify-between transition-colors duration-300"
          >
            <div className="space-y-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 dark:from-liturgy-gold/15 dark:to-transparent border border-amber-800/20 dark:border-liturgy-gold/30 text-amber-800 dark:text-liturgy-gold">
                <BookOpen className="h-6 w-6" />
              </div>
              
              <div className="space-y-3">
                <h3 className="font-serif text-2xl font-bold text-liturgy-stone-dark dark:text-liturgy-stone-light">
                  Interactive Scripture Workstation
                </h3>
                <p className="text-sm leading-relaxed text-liturgy-stone-dark/70 dark:text-liturgy-stone-gray">
                  A high-legibility interface built for deep exegesis. Hover over verse lines to reveal quick interaction chips. Dive into theological reflection, historical archaeology commentaries, and Catechism links inside a side-by-side split workstation or responsive sliding mobile drawer.
                </p>
              </div>

              {/* Book indicators visual detail */}
              <div className="flex flex-wrap gap-2 pt-2">
                {["Genesis (OT)", "Tobit (Deuterocanon)", "John (NT - Coming Soon)"].map((book) => (
                  <span 
                    key={book}
                    className="inline-flex items-center space-x-1.5 rounded-full border border-black/10 dark:border-white/5 bg-black/5 dark:bg-white/5 px-3 py-1 text-xs text-liturgy-stone-dark/70 dark:text-liturgy-stone-gray"
                  >
                    <Sparkle className="h-3 w-3 text-liturgy-gold" />
                    <span>{book}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <Link href="/bible" className="inline-block">
                <motion.button 
                  variants={springClickVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  className="px-6 py-2.5 rounded-lg text-white dark:text-liturgy-gold text-xs font-bold tracking-wider uppercase border border-amber-800/40 dark:border-liturgy-gold/40 bg-gradient-to-b from-amber-600 to-amber-700 dark:from-[#2a2a2a] dark:to-[#1a1a1a] shadow-[0_2px_4px_rgba(0,0,0,0.1),_inset_0_1px_1px_rgba(255,255,255,0.3)] dark:shadow-neumorphic-flat hover:dark:shadow-neumorphic-pressed cursor-pointer"
                >
                  Open Workstation
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Tile 2: Manga Archive (Takes 1 col, 2 rows) */}
          <motion.div
            variants={bentoCardVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="md:col-span-1 md:row-span-2 rounded-2xl border border-black/5 dark:border-liturgy-gold/20 bg-white dark:bg-liturgy-stone shadow-[6px_6px_14px_rgba(0,0,0,0.06),_-6px_-6px_14px_rgba(255,255,255,0.7)] dark:shadow-neumorphic-flat hover:dark:shadow-neumorphic-pressed p-6 flex flex-col justify-between transition-colors duration-300"
          >
            <div className="space-y-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-liturgy-cyan/15 to-transparent border border-liturgy-cyan/30 text-liturgy-cyan">
                <ImageIcon className="h-6 w-6" />
              </div>
              
              <div className="space-y-3">
                <h3 className="font-serif text-2xl font-bold text-liturgy-stone-dark dark:text-liturgy-stone-light">
                  Manga Archive
                </h3>
                <p className="text-sm leading-relaxed text-liturgy-stone-dark/70 dark:text-liturgy-stone-gray">
                  Graphic novels visually interpreting sacred accounts. Built with swipe transition frames and image-scaling layouts accepting public external asset paths hosted on Cloudflare R2 nodes.
                </p>
              </div>

              {/* R2 serverless node diagram representation */}
              <div className="rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-liturgy-charcoal/50 p-4 space-y-2 text-xs shadow-inner">
                <div className="flex items-center space-x-1.5 font-bold text-liturgy-cyan uppercase tracking-wider text-[10px]">
                  <Server className="h-3.5 w-3.5 animate-pulse" />
                  <span>R2 Storage Pipeline</span>
                </div>
                <code className="text-[10px] text-amber-800 dark:text-liturgy-gold break-all block leading-tight font-mono p-1.5 rounded bg-white dark:bg-[#1c1c1a] border border-black/5 dark:border-white/5">
                  cdn.genchrist.app/manga/ch1
                </code>
              </div>
            </div>

            <div className="pt-8">
              <Link href="/manga" className="inline-block w-full">
                <motion.button 
                  variants={springClickVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  className="w-full px-6 py-2.5 rounded-lg text-white dark:text-liturgy-cyan text-xs font-bold tracking-wider uppercase border border-liturgy-cyan/40 bg-gradient-to-b from-liturgy-cyan to-blue-600 dark:from-[#2a2a2a] dark:to-[#1a1a1a] shadow-[0_2px_4px_rgba(0,0,0,0.1),_inset_0_1px_1px_rgba(255,255,255,0.3)] dark:shadow-neumorphic-flat hover:dark:shadow-neumorphic-pressed cursor-pointer"
                >
                  Browse Manga
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Tile 3: Study Tracks (Takes 1 col, 1 row) */}
          <motion.div
            variants={bentoCardVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="md:col-span-1 md:row-span-1 rounded-2xl border border-black/5 dark:border-liturgy-gold/20 bg-white dark:bg-liturgy-stone shadow-[6px_6px_14px_rgba(0,0,0,0.06),_-6px_-6px_14px_rgba(255,255,255,0.7)] dark:shadow-neumorphic-flat hover:dark:shadow-neumorphic-pressed p-6 flex flex-col justify-between transition-colors duration-300"
          >
            <div className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <BookMarked className="h-5 w-5" />
              </div>
              
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-bold text-liturgy-stone-dark dark:text-liturgy-stone-light">
                  Conversational Tracks
                </h4>
                <p className="text-xs text-liturgy-stone-dark/70 dark:text-liturgy-stone-gray leading-normal">
                  Prose that directly addresses you. Touch golden triggers to open deep doctrine modals.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/study" className="inline-block w-full">
                <motion.button 
                  variants={springClickVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  className="w-full px-4 py-2 rounded-lg text-white dark:text-purple-400 text-[10px] font-bold tracking-wider uppercase border border-purple-500/40 bg-gradient-to-b from-purple-500 to-indigo-600 dark:from-[#2a2a2a] dark:to-[#1a1a1a] shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-neumorphic-flat hover:dark:shadow-neumorphic-pressed cursor-pointer"
                >
                  Start Study
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Tile 4: Saint of the Day (Takes 2 cols, 1 row) */}
          <motion.div
            variants={bentoCardVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="md:col-span-2 md:row-span-1 rounded-2xl border border-black/5 dark:border-liturgy-gold/20 bg-white dark:bg-liturgy-stone shadow-[6px_6px_14px_rgba(0,0,0,0.06),_-6px_-6px_14px_rgba(255,255,255,0.7)] dark:shadow-neumorphic-flat hover:dark:shadow-neumorphic-pressed p-6 relative overflow-hidden flex flex-col justify-between transition-colors duration-300"
          >
            {/* Corner Glow */}
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-liturgy-gold/5 dark:bg-liturgy-gold/10 blur-xl" />
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start relative z-10">
              <div className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-liturgy-gold/20 to-amber-500/10 border border-liturgy-gold/30 text-amber-800 dark:text-liturgy-gold shadow-md">
                <Flame className="h-5.5 w-5.5 animate-pulse" />
              </div>
              
              <div className="space-y-2 flex-grow">
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-x-2 text-[10px] font-bold text-amber-800 dark:text-liturgy-gold tracking-widest uppercase">
                    <span>Saint of the Day</span>
                    <span className="text-liturgy-stone-gray">•</span>
                    <span>Feast: {saint.feastDay}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-liturgy-stone-dark dark:text-liturgy-stone-light">
                    {saint.name}
                  </h3>
                </div>
                
                <blockquote className="border-l-2 border-amber-800 dark:border-liturgy-gold pl-3 py-0.5">
                  <p className="font-serif text-sm italic text-liturgy-stone-dark/95 dark:text-liturgy-stone-light">
                    &ldquo;{saint.quote}&rdquo;
                  </p>
                </blockquote>

                <p className="text-xs leading-relaxed text-liturgy-stone-dark/70 dark:text-liturgy-stone-gray">
                  {saint.bio}
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.section>

      {/* 3. 'LEGACY & MISSION' BREAKDOWN SECTION (Glassmorphic Breakout Row) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollSpringVariants}
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        {/* Glassmorphic layered border & rim shadows */}
        <div className="rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-liturgy-gold/20 shadow-gold-rim p-8 sm:p-12 transition-colors duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            
            {/* Column 1: Heading & Description */}
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3.5 py-1 text-xs font-semibold text-liturgy-stone-dark/80 dark:text-liturgy-stone-light tracking-wider uppercase">
                <span>Fides et Ratio</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-liturgy-stone-dark dark:text-liturgy-stone-light leading-tight">
                Synthesizing Faith, Science & Archaeology
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-liturgy-cyan to-liturgy-gold" />
              <p className="text-sm sm:text-base leading-relaxed text-liturgy-stone-dark/70 dark:text-liturgy-stone-gray">
                Following the Catholic philosophical legacy of St. Anselm (*Fides quaerens intellectum* - faith seeking understanding), the GenChrist Study App holds that divine revelation, scientific cosmological facts, and archaeological truths cannot contradict one another. They are distinct reflections of the same Logos.
              </p>
            </div>

            {/* Column 2: Specific categories list */}
            <div className="space-y-6">
              
              {/* Category 1 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-800/15 dark:border-liturgy-gold/30 text-amber-800 dark:text-liturgy-gold shadow-sm">
                  <Flame className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-base font-bold text-liturgy-stone-dark dark:text-liturgy-stone-light">
                    Sacred Theology & Tradition
                  </h4>
                  <p className="text-xs leading-relaxed text-liturgy-stone-dark/75 dark:text-liturgy-stone-gray">
                    Absolute fidelity to the deposit of faith, the Sacred Scripture, and the teachings of the Magisterium, illuminated by the Church Fathers and Doctors.
                  </p>
                </div>
              </div>

              {/* Category 2 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-liturgy-cyan/10 border border-liturgy-cyan/30 text-liturgy-cyan shadow-sm">
                  <Compass className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-base font-bold text-liturgy-stone-dark dark:text-liturgy-stone-light">
                    Historical Archaeology
                  </h4>
                  <p className="text-xs leading-relaxed text-liturgy-stone-dark/75 dark:text-liturgy-stone-gray">
                    Exploring ancient Near Eastern history—such as the Neo-Assyrian captivity of Nineveh details in Tobit—to illuminate the cultural framework of the covenants.
                  </p>
                </div>
              </div>

              {/* Category 3 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 shadow-sm">
                  <Server className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-base font-bold text-liturgy-stone-dark dark:text-liturgy-stone-light">
                    Cosmological Science
                  </h4>
                  <p className="text-xs leading-relaxed text-liturgy-stone-dark/75 dark:text-liturgy-stone-gray">
                    Affirming that scientific discoveries—from evolutionary mechanics to astrophysical space laws—reveal the sublime order and intelligence of God&apos;s creation.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </motion.section>

      {/* 4. STATISTIC MILESTONE TIER */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollSpringVariants}
        className="py-16 bg-[#F5F5F0] dark:bg-[#161614] border-y border-black/5 dark:border-white/5 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div 
                key={stat.label}
                className="rounded-2xl border border-black/5 dark:border-liturgy-gold/20 bg-[#FAF9F6] dark:bg-liturgy-stone shadow-[6px_6px_14px_rgba(0,0,0,0.06),_-6px_-6px_14px_rgba(255,255,255,0.7)] dark:shadow-neumorphic-flat p-6 space-y-3 transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="font-serif text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-amber-700 to-liturgy-cyan dark:from-liturgy-gold dark:to-liturgy-cyan bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="font-serif text-sm font-bold text-liturgy-stone-dark dark:text-liturgy-stone-light">
                  {stat.label}
                </div>
                <p className="text-xs text-liturgy-stone-dark/70 dark:text-liturgy-stone-gray leading-normal">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 5. INTERACTIVE FAQ ACCORDION PANEL SECTION */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollSpringVariants}
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12"
      >
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-amber-800 dark:text-liturgy-gold tracking-widest uppercase">
            Faith and Reason Inquiry
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-liturgy-stone-dark dark:text-liturgy-stone-light">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-xl text-xs sm:text-sm text-liturgy-stone-dark/70 dark:text-liturgy-stone-gray">
            Addressing theological inquiries, translation details, and app mechanics.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index}
                className="rounded-xl overflow-hidden transition-all duration-300"
              >
                {/* Skeuomorphic Header Bar Button (Pressing/Depressing with spring physics 200) */}
                <motion.button
                  onClick={() => toggleFaq(index)}
                  className={`w-full flex items-center justify-between p-5 text-left font-serif text-sm sm:text-base font-bold transition-all duration-200 border cursor-pointer select-none border-black/5 dark:border-liturgy-gold/20 ${
                    isOpen 
                      ? "bg-black/5 dark:bg-liturgy-stone text-liturgy-cyan shadow-[inset_1px_2px_4px_rgba(0,0,0,0.06)] dark:shadow-neumorphic-pressed rounded-t-xl" 
                      : "bg-[#FAF9F6] dark:bg-liturgy-stone text-liturgy-stone-dark dark:text-liturgy-stone-light shadow-[4px_4px_10px_rgba(163,163,163,0.15),_-4px_-4px_10px_rgba(255,255,255,0.7)] dark:shadow-neumorphic-flat rounded-xl hover:border-liturgy-cyan/30"
                  }`}
                  whileHover={{ scale: 0.995 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <span className="max-w-[90%]">{faq.question}</span>
                  <div className="flex-shrink-0 ml-4">
                    {isOpen ? (
                      <Minus className="h-4 w-4 text-liturgy-cyan" />
                    ) : (
                      <Plus className="h-4 w-4 text-liturgy-stone-gray" />
                    )}
                  </div>
                </motion.button>

                {/* Glassmorphic answer body drop with spring slide */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                      <div className="p-6 bg-white/[0.03] backdrop-blur-xl border-x border-b border-black/5 dark:border-liturgy-gold/10 rounded-b-xl text-xs sm:text-sm leading-relaxed text-liturgy-stone-dark/80 dark:text-liturgy-stone-gray text-justify shadow-gold-rim">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.section>

    </main>
  );
}
