/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto_400Regular', 'sans-serif'],
        bold: ['Roboto_700Bold', 'sans-serif'],
        mono: ['SpaceMono_400Regular', 'monospace'],
      },
      colors: {
        background: '#121212', 
        surface: '#1E1E1E',    
        primary: '#FFFFFF',    
        secondary: '#A0A0A0',  
        operativo: '#00E676',  
        advertencia: '#FFC107',
        critico: '#FF4C4C',    
        action: '#3B82F6',     
      }
    },
  },
  plugins: [],
}