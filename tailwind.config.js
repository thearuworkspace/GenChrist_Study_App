/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // High-end luxury cyber colors
        'cyber-black': '#050505',
        'cyber-gold': '#D4AF37',
        
        // Retaining your original nested custom palette so sub-pages don't crash
        liturgy: {
          charcoal: '#121212',
          cyan: '#A8E6CF', // Backwards compatibility helper
          stone: {
            light: '#F5F5F0',
            dark: '#1C1C1A',
            gray: '#8E8E8A',
          },
          gold: {
            DEFAULT: '#D4AF37',
            hover: '#AA820A',
          }
        }
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Helvetica", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        // High-end subtle neon gold aura instead of muddy plastic shadows
        'gold-glow': '0 0 25px rgba(214, 175, 55, 0.08)',
        'gold-glow-hover': '0 0 40px rgba(214, 175, 55, 0.18)',
      }
    },
  },
  plugins: [],
}
