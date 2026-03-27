/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#f5f5f5',
        surface: '#ffffff',
        border: '#e5e5e5',
        accent: '#6366f1',
        'accent-secondary': '#8b5cf6',
        'player-x': '#ef4444',
        'player-o': '#3b82f6',
      },
    },
  },
  plugins: [],
}
