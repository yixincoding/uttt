/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f0f0f',
        surface: '#1a1a1a',
        'surface-elevated': '#262626',
        primary: '#ff6b6b',
        secondary: '#4ecdc4',
        accent: '#ffe66d',
        'text-primary': '#f5f5f5',
        'text-muted': '#888888',
        win: '#ffd700',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'pulse-border': 'pulse-border 1.5s ease-in-out infinite',
        'cell-pop': 'cell-pop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'win-glow': 'win-glow 1s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-border': {
          '0%, 100%': { borderColor: 'rgba(255, 230, 109, 0.3)' },
          '50%': { borderColor: 'rgba(255, 230, 109, 0.8)' },
        },
        'cell-pop': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'win-glow': {
          '0%': { boxShadow: '0 0 5px #ffd700, 0 0 10px #ffd700' },
          '100%': { boxShadow: '0 0 15px #ffd700, 0 0 25px #ffd700' },
        },
      },
    },
  },
  plugins: [],
}
