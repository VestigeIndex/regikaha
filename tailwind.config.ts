import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "SF Pro Display", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        // Identidad verde Regi Kaha
        forest: {
          50: "#eafaf2",
          100: "#DDF4EA",
          200: "#bce9d4",
          300: "#8fd9b6",
          400: "#54c794",
          500: "#2AB673", // verde vivo / accent
          600: "#198C68", // verde principal
          700: "#157355",
          800: "#0F5C4A", // verde profundo
          900: "#0c4a3c",
          950: "#062b22",
        },
        mint: "#DDF4EA",
        ink: "#122019",
        canvas: "#F7FAF8",
        "canvas-alt": "#E9F2ED",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 2px 10px rgba(15, 92, 74, 0.06), 0 0 0 1px rgba(15, 92, 74, 0.05)",
        card: "0 8px 30px -12px rgba(15, 92, 74, 0.18), 0 0 0 1px rgba(15, 92, 74, 0.06)",
        elevated: "0 24px 60px -20px rgba(15, 92, 74, 0.22), 0 0 0 1px rgba(15, 92, 74, 0.05)",
        glow: "0 0 0 1px rgba(42, 182, 115, 0.25), 0 18px 50px -20px rgba(25, 140, 104, 0.45)",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #0F5C4A 0%, #198C68 52%, #2AB673 100%)",
        "gradient-hero":
          "radial-gradient(ellipse 110% 80% at 78% -8%, rgba(42,182,115,0.18), transparent 58%), radial-gradient(ellipse 80% 60% at 0% 8%, rgba(25,140,104,0.12), transparent 55%)",
        "grid-soft":
          "linear-gradient(rgba(15,92,74,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,92,74,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "56px 56px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
