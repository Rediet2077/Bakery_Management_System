/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          50:  '#fdf8f0',
          100: '#f9edd8',
          200: '#f0d4a8',
          300: '#e5b670',
          400: '#d8933a',
          500: '#c47b22',
          600: '#a8621a',
          700: '#8b4e18',
          800: '#6b3a12',
          900: '#4a280c',
        }
      }
    },
  },
  plugins: [],
}
