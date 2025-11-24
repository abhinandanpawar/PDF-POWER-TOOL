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
          DEFAULT: '#00f2ff', // Neon Cyan
          foreground: '#050505',
          glow: '#00f2ffaa',
        },
        secondary: {
          DEFAULT: '#7000ff', // Neon Purple
          foreground: '#ffffff',
          glow: '#7000ffaa',
        },
        accent: {
          DEFAULT: '#ff003c', // Cyberpunk Red
          foreground: '#ffffff',
        },
        background: '#050505', // Almost Black
        surface: '#0a0a0a', // Dark Gray
        'surface-highlight': '#121212',
        border: '#333333',
        'border-highlight': '#555555',
        foreground: '#e0e0e0', // Light Gray Text
        'muted-foreground': '#a0a0a0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Orbitron', 'sans-serif'], // Futuristic font
      },
      boxShadow: {
        'neon-blue': '0 0 5px theme("colors.primary.DEFAULT"), 0 0 20px theme("colors.primary.glow")',
        'neon-purple': '0 0 5px theme("colors.secondary.DEFAULT"), 0 0 20px theme("colors.secondary.glow")',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'cyber-grid': "radial-gradient(circle, #333 1px, transparent 1px)",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #00f2ff 0deg, #7000ff 180deg, #00f2ff 360deg)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
