/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a8ba',
          400: '#ed7495',
          500: '#e24271',
          600: '#ce2756',
          700: '#ad1b44',
          800: '#800020',
          900: '#7a0c37',
          950: '#44041b',
        },
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