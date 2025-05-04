/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'meme-blue': '#0000FF',
          'meme-blue-light': '#3333FF',
          'meme-blue-dark': '#0000CC',
        },
        boxShadow: {
          'meme': '0 4px 6px -1px rgba(0, 0, 255, 0.1), 0 2px 4px -1px rgba(0, 0, 255, 0.06)',
        },
      },
    },
    plugins: [],
  }
  