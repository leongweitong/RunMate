/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgba(230, 56, 37, 255)',
        secondary: 'rgba(225, 225, 225, 255)',
        black: 'rgba(0, 0, 0, 255)',
        white: 'rgba(255, 255, 255, 255)',
      },
    },
  },
  plugins: [],
}

