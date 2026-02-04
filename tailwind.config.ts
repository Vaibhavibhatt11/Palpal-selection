import type { Config } from "tailwindcss";

const config: Config = {
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
        soft: "0 10px 30px rgba(20, 20, 20, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
