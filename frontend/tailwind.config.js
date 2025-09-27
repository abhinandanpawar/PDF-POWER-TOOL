/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(210, 100%, 50%)',
          foreground: 'hsl(210, 100%, 98%)',
          50: 'hsl(210, 100%, 95%)',
          100: 'hsl(210, 100%, 90%)',
          200: 'hsl(210, 100%, 80%)',
          300: 'hsl(210, 100%, 70%)',
          400: 'hsl(210, 100%, 60%)',
          500: 'hsl(210, 100%, 50%)',
          600: 'hsl(210, 100%, 40%)',
          700: 'hsl(210, 100%, 30%)',
          800: 'hsl(210, 100%, 20%)',
          900: 'hsl(210, 100%, 10%)',
        },
        secondary: {
          DEFAULT: 'hsl(240, 6%, 10%)',
          foreground: 'hsl(240, 5%, 96%)',
        },
        destructive: {
          DEFAULT: 'hsl(0, 84%, 60%)',
          foreground: 'hsl(0, 0%, 98%)',
        },
        muted: {
          DEFAULT: 'hsl(240, 4%, 46%)',
          foreground: 'hsl(240, 4%, 65%)',
        },
        accent: {
          DEFAULT: 'hsl(240, 6%, 10%)',
          foreground: 'hsl(240, 5%, 96%)',
        },
        popover: {
          DEFAULT: 'hsl(240, 10%, 4%)',
          foreground: 'hsl(240, 5%, 96%)',
        },
        card: {
          DEFAULT: 'hsl(240, 10%, 4%)',
          foreground: 'hsl(240, 5%, 96%)',
        },
        background: 'hsl(240, 10%, 4%)',
        foreground: 'hsl(0, 0%, 98%)',
        border: 'hsl(240, 4%, 16%)',
        input: 'hsl(240, 4%, 16%)',
        ring: 'hsl(210, 100%, 50%)',
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
