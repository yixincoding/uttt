/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0f0f0f',
        surface: '#1a1a1a',
        border: '#2a2a2a',
        accent: '#6366f1',
        'accent-secondary': '#8b5cf6',
        'player-x': '#ef4444',
        'player-o': '#3b82f6',
      },
    },
  },
  plugins: [],
}
