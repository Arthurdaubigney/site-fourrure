/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/*.html', './src/partials/*.html', './src/app.js', './scripts/build.mjs'],
  theme: {
    extend: {
      colors: {
        ink: { 950: 'rgb(var(--ink-950) / <alpha-value>)', 900: 'rgb(var(--ink-900) / <alpha-value>)', 800: 'rgb(var(--ink-800) / <alpha-value>)', 700: 'rgb(var(--ink-700) / <alpha-value>)', 600: 'rgb(var(--ink-600) / <alpha-value>)' },
        gold: { 200: 'rgb(var(--gold-200) / <alpha-value>)', 300: 'rgb(var(--gold-300) / <alpha-value>)', 400: 'rgb(var(--gold-400) / <alpha-value>)', 500: 'rgb(var(--gold-500) / <alpha-value>)', 600: 'rgb(var(--gold-600) / <alpha-value>)', 700: 'rgb(var(--gold-700) / <alpha-value>)' },
        bone: 'rgb(var(--bone) / <alpha-value>)',
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
