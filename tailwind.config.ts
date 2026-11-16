import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // VFR-Markenfarben aus vfr-gmbh.de
        vfr: {
          50:  "#eef7fb",
          100: "#d4eaf2",
          200: "#a5d3e1",
          300: "#6fb6cb",
          400: "#3e94ae",
          500: "#15779b",
          600: "#11607d",
          700: "#0d4d65",
          800: "#0a3c50",
          900: "#082e3e",
        },
        gold: {
          50:  "#fdf8e7",
          100: "#faefc4",
          200: "#f4dc83",
          DEFAULT: "#E4C769",
          500: "#E4C769",
          600: "#c2a447",
          700: "#9c8334",
        },
        accent: {
          DEFAULT: "#c8102e",
          dark: "#9a0c23",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Open Sans", "Helvetica Neue", "Arial", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
