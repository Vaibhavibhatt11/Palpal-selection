import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf5f7",
          100: "#f9e8ed",
          200: "#f0cdd8",
          300: "#e2a3b8",
          400: "#cf6d8f",
          500: "#b8436a",
          600: "#9e2d55",
          700: "#7a1f3d",
          800: "#651a33",
          900: "#55182d"
        },
        gold: {
          400: "#c9a227",
          500: "#b8922a",
          600: "#9a7a22"
        },
        cream: {
          50: "#fdfcfa",
          100: "#faf8f5",
          200: "#f3efe8",
          300: "#e8e0d4"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 4px 24px rgba(122, 31, 61, 0.08)",
        card: "0 2px 12px rgba(0, 0, 0, 0.06)",
        lift: "0 8px 30px rgba(122, 31, 61, 0.12)"
      },
      animation: {
        marquee: "marquee 28s linear infinite"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
