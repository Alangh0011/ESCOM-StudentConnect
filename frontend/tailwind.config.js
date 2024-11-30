/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx,vue}", // Asegúrate de que este path cubre todos tus archivos de componente
  ],  
  theme: {
    extend: {
      colors: {
        primary: '#60a5fa',
        secundary: '#3D67BC',
        tertiary: '#6C1D45',
        cuarto: '#002d71',
        quinto: '#7aafe0'
        
      }
    },
  },
  plugins: [],
}