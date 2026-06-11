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
        // Your brand new skeuomorphic-neumorphic core layers
        'liturgy-dark': '#151515',
        'liturgy-stone': '#222222',
        'liturgy-gold': '#D4AF37',
        
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
      },
      boxShadow: {
        // Real tactical extrusion shadows
        'neumorphic-flat': '6px 6px 14px #0a0a0a, -6px -6px 14px #202020',
        'neumorphic-pressed': 'inset 4px 4px 8px #0a0a0a, inset -4px -4px 8px #202020',
        // Metallic edge illumination glow
        'gold-rim': '0 0 0 1px rgba(212, 175, 55, 0.15), 0 8px 24px rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
}
