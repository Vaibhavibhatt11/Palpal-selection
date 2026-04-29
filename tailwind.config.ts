import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff1f7",
          100: "#ffe2f0",
          200: "#ffc6e1",
          300: "#ff9fcb",
          400: "#ff73b2",
          500: "#ff4d9c",
          600: "#f02f7f",
          700: "#c91d64",
          800: "#a11650",
          900: "#7f123f"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(111, 18, 63, 0.12)",
        glow: "0 24px 80px rgba(240, 47, 127, 0.22)"
      }
    }
  },
  plugins: []
};

export default config;
