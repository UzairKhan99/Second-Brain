// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"], // your source files here
  theme: {
    extend: {
      fontFamily: {
        'rubik': ['Rubik', 'sans-serif'],
      },
      colors: {
        // Primary color shades based on #748D92
        primary: {
          100: "#d9e1e3",
          200: "#b3c3c7",
          300: "#8ca5aa",
          400: "#66868e",
          500: "#406871",  // slightly darker than #748D92 for contrast
          600: "#34555a",
          700: "#284342",
          800: "#1c312b",
          900: "#101a15"
        },
        // Secondary color shades based on #D3D9D4
        secondary: {
          100: "#ebeee9",
          200: "#d7ddd4",
          300: "#c3ccc0",
          400: "#afbba9",
          500: "#9ba993",  // base-ish shade
          600: "#7a856f",
          700: "#5a6350",
          800: "#393631",
          900: "#1c1a1a"
        },
        // Secondary text color single shade (no shades needed)
        secondaryText: "#124E66"
      }
    }
  },
  plugins: [],
};
