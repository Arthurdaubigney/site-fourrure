/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/index.html', './src/app.js'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#070504', 900: '#0b0907', 800: '#120f0b', 700: '#1a1610', 600: '#262017' },
        gold: { 200: '#f3e3b8', 300: '#e6cd8f', 400: '#d4b06a', 500: '#bf974a', 600: '#9c7635', 700: '#6f5323' },
        bone: '#f2ece0',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Geist', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { widest2: '0.32em' },
    },
  },
  plugins: [],
};
