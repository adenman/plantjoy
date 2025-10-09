/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-pink': '#E7758B',
        'brand-green': '#85B867',
        'brand-blue': '#67A9B8', // New color for frozen items
        'brand-gray': '#4A4A4A',
      },
      fontFamily: {
        'sans': ['Montserrat', 'sans-serif'],
        'serif': ['Lora', 'serif'],
      }
    },
  },
  plugins: [],
}