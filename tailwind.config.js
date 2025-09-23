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
        background: 'rgb(248 249 250)', // #F8F9FA
        foreground: 'rgb(44 62 80)',     // #2C3E50
        primary: {
          DEFAULT: 'rgb(52 152 219)',   // #3498DB
          foreground: 'rgb(255 255 255)', // #FFFFFF
        },
        secondary: {
          DEFAULT: 'rgb(52 73 94)',      // #34495E
          foreground: 'rgb(255 255 255)', // #FFFFFF
        },
        destructive: {
          DEFAULT: 'rgb(231 76 60)',     // #E74C3C
          foreground: 'rgb(255 255 255)', // #FFFFFF
        },
        success: {
          DEFAULT: 'rgb(39 174 96)',     // #27AE60
          foreground: 'rgb(255 255 255)', // #FFFFFF
        },
        muted: {
          DEFAULT: 'rgb(236 240 241)',   // #ECF0F1
          foreground: 'rgb(52 73 94)',    // #34495E
        },
        accent: {
          DEFAULT: 'rgb(22 160 133)',    // #16A085
          foreground: 'rgb(255 255 255)', // #FFFFFF
        },
        card: {
          DEFAULT: 'rgb(255 255 255)',   // #FFFFFF
          foreground: 'rgb(44 62 80)',     // #2C3E50
        },
        popover: {
          DEFAULT: 'rgb(255 255 255)',   // #FFFFFF
          foreground: 'rgb(44 62 80)',     // #2C3E50
        },
        border: 'rgb(189 195 199)',     // #BDC3C7
        input: 'rgb(189 195 199)',        // #BDC3C7
        ring: 'rgb(41 128 185)',      // #2980B9
      },
      borderRadius: {
        lg: `1rem`,
        md: `calc(1rem - 2px)`,
        sm: `calc(1rem - 4px)`,
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'md': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '2xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'outline': '0 0 0 3px rgba(66, 153, 225, 0.5)',
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
