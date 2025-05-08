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
          'meme-blue-dark': '#0047B3',
          'meme-blue-muted': '#E6F0FF',
          'meme-yellow': '#FFD700',
          'meme-blue-accent': '#00B3FF',
        },
        boxShadow: {
          'meme': '0 4px 6px -1px rgba(0, 102, 255, 0.1), 0 2px 4px -1px rgba(0, 102, 255, 0.06)',
          'meme-glow': '0 0 15px rgba(0, 102, 255, 0.3)',
        },
        keyframes: {
          marquee: {
            '0%': { transform: 'translateX(100%)' },
            '100%': { transform: 'translateX(-100%)' },
          },
        },
        animation: {
          'marquee': 'marquee 15s linear infinite',
          'spin-slow': 'spin 3s linear infinite',
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
      },
    },
    plugins: [
      require('tailwind-scrollbar-hide'),
      function({ addUtilities }) {
        const newUtilities = {
          '.scrollbar-thin': {
            '&::-webkit-scrollbar': {
              height: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '2px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'rgba(255, 255, 255, 0.3)',
            },
          },
        }
        addUtilities(newUtilities, ['responsive', 'hover'])
      }
    ],
  }
  