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
        // Identidad verde premium Regi Kaha (teal). Las clases siguen siendo forest-*
        forest: {
          50: "#f0fdf9",
          100: "#d7f5ec",
          200: "#ade9d8",
          300: "#76d6bf",
          400: "#38bda1",
          500: "#14a08c", // teal vivo / accent
          600: "#0f766e", // verde principal
          700: "#115e59", // hover
          800: "#064e3b", // verde oscuro premium
          900: "#003b2f", // verde header
          950: "#01281f",
        },
        lime: "#84cc16", // acento lima controlado
        mint: "#ecfdf5",
        ink: "#111827",
        canvas: "#f8faf7",
        "canvas-alt": "#eef3ee",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 2px 10px rgba(6, 78, 59, 0.06), 0 0 0 1px rgba(6, 78, 59, 0.05)",
        card: "0 8px 30px -12px rgba(6, 78, 59, 0.16), 0 0 0 1px rgba(6, 78, 59, 0.05)",
        elevated: "0 24px 60px -20px rgba(6, 78, 59, 0.20), 0 0 0 1px rgba(6, 78, 59, 0.05)",
        glow: "0 0 0 1px rgba(20, 184, 166, 0.25), 0 18px 50px -20px rgba(15, 118, 110, 0.45)",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #064e3b 0%, #0f766e 60%, #115e59 100%)",
        "gradient-hero":
          "radial-gradient(ellipse 110% 80% at 78% -8%, rgba(20,184,166,0.16), transparent 58%), radial-gradient(ellipse 80% 60% at 0% 8%, rgba(15,118,110,0.12), transparent 55%)",
        "grid-soft":
          "linear-gradient(rgba(6,78,59,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6,78,59,0.05) 1px, transparent 1px)",
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
