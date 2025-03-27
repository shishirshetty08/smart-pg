/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fff7f5',
          200: '#ffccc7',
          500: '#ff5a5f',
          600: '#e63946',
          700: '#cc1e2b',
        },
        secondary: {
          50: '#f0f9ff',
          200: '#bae6fd',
          500: '#00a3e0',
          600: '#0077b6',
          700: '#005b8f',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          700: '#4b5563',
          900: '#1f2937',
        },
      },
    },
  },
  plugins: [],
};