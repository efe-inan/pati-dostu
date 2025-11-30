/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // Sınıf tabanlı karanlık mod
  theme: {
    extend: {
      colors: {
        "primary": "#f49d25",
  "background-light": "#EFEDE9", // <--- Yeni Kirli Beyaz Tonumuz
  "background-dark": "#1a1a1a",
  "brand-orange": "#FF7A00",
      },
      fontFamily: {
        "display": ["Plus Jakarta Sans", "sans-serif"],
        "sans": ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}