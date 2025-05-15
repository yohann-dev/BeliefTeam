/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          'meme-blue': '#0066FF',
          'meme-blue-light': '#4D94FF',
          'meme-blue-dark': '#0047B3',
          'meme-blue-accent': '#00B3FF',
          'meme-blue-muted': '#E6F0FF',
          // Dark mode colors
          dark: {
            primary: '#0f172a', // Slate 900
            secondary: '#1e293b', // Slate 800
            accent: '#334155', // Slate 700
            text: '#f8fafc', // Slate 50
            'text-muted': '#94a3b8', // Slate 400
          }
        },
        boxShadow: {
          'meme': '0 4px 6px -1px rgba(0, 102, 255, 0.1), 0 2px 4px -1px rgba(0, 102, 255, 0.06)',
          'meme-glow': '0 0 15px rgba(0, 102, 255, 0.3)',
        },
        animation: {
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'bounce-slow': 'bounce 3s infinite',
          'spin-slow': 'spin 2s linear infinite',
        },
      },
    },
    plugins: [],
  }
  