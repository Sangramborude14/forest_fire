/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        fire: {
          low: '#10b981',      // Green
          moderate: '#f59e0b', // Amber/Yellow
          high: '#f97316',     // Orange
          extreme: '#ef4444',  // Red
        }
      }
    },
  },
  plugins: [],
}
