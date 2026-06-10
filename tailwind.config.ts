import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        liturgy: {
          charcoal: "#121212",
          stone: {
            light: "#F5F5F0",
            dark: "#1C1C1A",
            gray: "#8E8E8A",
          },
          gold: {
            DEFAULT: "#D4AF37",
            hover: "#AA820A",
          },
          cyan: {
            DEFAULT: "#06B6D4",
            hover: "#0891B2",
          },
        },
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Helvetica", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;

