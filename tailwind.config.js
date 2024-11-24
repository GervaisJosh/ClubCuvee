/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        burgundy: '#800020',
        dark: {
          DEFAULT: '#000000',
          secondary: '#1a1a1a',
          accent: '#2d2d2d',
        },
        light: {
          DEFAULT: '#ffffff',
          secondary: '#f5f5f5',
          accent: '#e5e5e5',
        },
      },
      fontFamily: {
        TayBasal: ['TayBasal', 'sans-serif'],
        HVFlorentino: ['HV Florentino', 'serif'],
        helvetica: ['Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
