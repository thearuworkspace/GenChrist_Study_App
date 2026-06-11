export default function Footer() {
  return (
    <footer className="border-t border-black/5 dark:border-white/10 bg-white dark:bg-liturgy-charcoal py-8 mt-auto transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-xs text-liturgy-stone-dark/60 dark:text-liturgy-stone-gray/80 space-y-2">
        <p className="font-serif italic tracking-widest text-amber-800 dark:text-liturgy-gold text-sm transition-colors">
          AD MAIOREM DEI GLORIAM
        </p>
        <p>
          © {new Date().getFullYear()} GenChrist Study App. Fully Serverless & Offline Optimized.
        </p>
        <p className="text-[10px] text-liturgy-stone-dark/30 dark:text-liturgy-stone-gray/40">
          Scriptures adapted from the World English Bible: Catholic Edition (WEB:CE).
        </p>
      </div>
    </footer>
  );
}

