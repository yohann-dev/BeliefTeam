/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'meme-blue': '#0066FF',
          'meme-blue-light': '#4D94FF',
          'meme-blue-dark': '#0047B3',
          'meme-blue-accent': '#00B3FF',
          'meme-blue-muted': '#E6F0FF',
        },
        boxShadow: {
          'meme': '0 4px 6px -1px rgba(0, 102, 255, 0.1), 0 2px 4px -1px rgba(0, 102, 255, 0.06)',
          'meme-glow': '0 0 15px rgba(0, 102, 255, 0.3)',
        },
        animation: {
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'bounce-slow': 'bounce 3s infinite',
        },
      },
    },
    plugins: [],
  }
  