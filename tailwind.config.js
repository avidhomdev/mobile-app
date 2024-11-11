/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f9f7eb",
          100: "#ede9c9",
          200: "#e1dfa5",
          300: "#d2d57f",
          400: "#bfca5a",
          500: "#9eb041",
          600: "#768934",
          700: "#506125",
          800: "#2e3b16",
          900: "#0f1406",
          foreground: "#FFFFFF",
          DEFAULT: "#9eb041",
        },
        secondary: {
          50: "#f7f1e4",
          100: "#e3dbca",
          200: "#d0c3ac",
          300: "#bcae8f",
          400: "#a99970",
          500: "#8f8156",
          600: "#6f6242",
          700: "#50432e",
          800: "#312619",
          900: "#150800",
          foreground: "#FFFFFF",
          DEFAULT: "#8f8156",
        },
      },
    },
  },
  plugins: [],
};
