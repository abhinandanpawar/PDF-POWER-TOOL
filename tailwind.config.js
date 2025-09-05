/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#000000', // Black
        'primary-hover': '#1a1a1a', // Very dark gray
        'secondary': '#ffffff', // White
        'background': '#000000', // Black
        'card': '#1a1a1a', // Dark gray for cards
        'text-primary': '#ffffff', // White for main text
        'text-secondary': '#a0a0a0', // Light gray for secondary text
        'border': '#404040', // Medium gray for borders
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        fadeInRight: {
          'from': { opacity: '0', transform: 'translateX(100%)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-right': 'fadeInRight 0.5s ease-out forwards',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
