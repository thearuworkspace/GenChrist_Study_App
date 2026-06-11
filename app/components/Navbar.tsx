"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BookOpen, BookMarked, Image, Home, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const pathname = usePathname();

  useEffect(() => {
    // Read local storage or document class on mount
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "light" || (!savedTheme && document.documentElement.classList.contains("light"))) {
        setTheme("light");
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      } else {
        setTheme("dark");
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      }
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Bible Workstation", href: "/bible", icon: BookOpen },
    { name: "Study Tracks", href: "/study", icon: BookMarked },
    { name: "Manga Archive", href: "/manga", icon: Image },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#1c1c1a]/60 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Title */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center space-x-2">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-liturgy-cyan to-liturgy-gold p-[2px] transition-transform duration-300 group-hover:scale-105">
                <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-white dark:bg-liturgy-charcoal transition-colors">
                  <span className="font-serif text-sm font-bold text-liturgy-cyan">Gen</span>
                </div>
              </div>
              <span className="font-serif text-lg font-bold tracking-wider text-liturgy-stone-dark dark:text-liturgy-stone-light transition-colors duration-300 group-hover:text-liturgy-cyan">
                GenChrist <span className="text-liturgy-gold">Study</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Items + Theme Toggle & Mobile controls */}
          <div className="flex items-center space-x-3">
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    <span
                      className={`relative z-10 flex items-center space-x-2 transition-colors duration-200 ${
                        isActive 
                          ? "text-liturgy-cyan font-semibold" 
                          : "text-liturgy-stone-gray hover:text-liturgy-stone-dark dark:hover:text-liturgy-stone-light"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="activeNav"
                        className="absolute inset-0 rounded-md bg-black/5 dark:bg-liturgy-stone-dark/50 border-b-2 border-liturgy-cyan"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Theme Toggle Button (Skeuomorphic border and depth details) */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-liturgy-stone-dark dark:text-liturgy-stone-light hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.05)] shadow-md active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)] dark:active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)]"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Sun className="h-4.5 w-4.5 text-liturgy-gold" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Moon className="h-4.5 w-4.5 text-liturgy-cyan" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center rounded-md p-2 text-liturgy-stone-gray hover:bg-black/5 dark:hover:bg-liturgy-stone-dark hover:text-liturgy-stone-dark dark:hover:text-liturgy-stone-light focus:outline-none"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-black/5 dark:border-white/10 bg-white/95 dark:bg-liturgy-charcoal md:hidden"
          >
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 rounded-md px-3 py-2 text-base font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-black/5 dark:bg-liturgy-stone-dark text-liturgy-cyan border-l-4 border-liturgy-cyan"
                        : "text-liturgy-stone-gray hover:bg-black/5 dark:hover:bg-liturgy-stone-dark/50 hover:text-liturgy-stone-dark dark:hover:text-liturgy-stone-light"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
