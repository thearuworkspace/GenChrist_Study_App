export default function Footer() {
  return (
    <footer className="border-t border-liturgy-stone-dark/80 bg-liturgy-charcoal py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-xs text-liturgy-stone-gray/80 space-y-2">
        <p className="font-serif italic tracking-widest text-liturgy-gold text-sm">
          AD MAIOREM DEI GLORIAM
        </p>
        <p>
          © {new Date().getFullYear()} GenChrist Study App. Fully Serverless & Offline Optimized.
        </p>
        <p className="text-[10px] text-liturgy-stone-gray/40">
          Scriptures adapted from the World English Bible: Catholic Edition (WEB:CE).
        </p>
      </div>
    </footer>
  );
}
