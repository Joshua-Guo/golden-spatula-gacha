/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mythic: '#ef4444',
        legendary: '#eab308',
        special: '#f97316',
        epic: '#a855f7',
        rare: '#3b82f6',
        uncommon: '#22c55e',
        common: '#9ca3af',
      },
      animation: {
        'flip': 'flip 0.6s ease-in-out',
        'shine': 'shine 2s ease-in-out infinite',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        shine: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
