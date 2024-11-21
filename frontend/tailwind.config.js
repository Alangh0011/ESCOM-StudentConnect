/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#60a5fa',
        secundary: '#002d71',
        tertiary: '#6C1D45'
        
      }
    },
  },
  plugins: [],
}