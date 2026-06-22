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
        // Identidad azul celeste metálico Regi Kaha (las clases siguen llamándose forest-*)
        forest: {
          50: "#eff5ff",
          100: "#d9edff",
          200: "#bfdcfe",
          300: "#93c2fd",
          400: "#3fb0f5", // celeste metálico
          500: "#2e9bf0", // azul celeste vivo / accent
          600: "#1f6fe0", // azul principal
          700: "#1857c4",
          800: "#11357e", // azul profundo
          900: "#0e2a63",
          950: "#081a40",
        },
        mint: "#d9edff",
        ink: "#0e1a2b",
        canvas: "#f5f9ff",
        "canvas-alt": "#e6f0fb",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 2px 10px rgba(17, 53, 126, 0.07), 0 0 0 1px rgba(17, 53, 126, 0.05)",
        card: "0 8px 30px -12px rgba(17, 53, 126, 0.20), 0 0 0 1px rgba(17, 53, 126, 0.06)",
        elevated: "0 24px 60px -20px rgba(17, 53, 126, 0.26), 0 0 0 1px rgba(17, 53, 126, 0.05)",
        glow: "0 0 0 1px rgba(63, 176, 245, 0.30), 0 18px 50px -20px rgba(31, 111, 224, 0.50)",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #0e2f6e 0%, #1f6fe0 45%, #3fb0f5 82%, #bfe6ff 100%)",
        "gradient-hero":
          "radial-gradient(ellipse 110% 80% at 78% -8%, rgba(63,176,245,0.22), transparent 58%), radial-gradient(ellipse 80% 60% at 0% 8%, rgba(31,111,224,0.14), transparent 55%)",
        "grid-soft":
          "linear-gradient(rgba(17,53,126,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(17,53,126,0.05) 1px, transparent 1px)",
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
