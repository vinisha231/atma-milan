/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#FFE566',
          DEFAULT: '#FFD700',
          dark: '#B8860B',
        },
        saffron: {
          DEFAULT: '#FF6B2B',
          light: '#FF8C55',
        },
        lotus: {
          DEFAULT: '#FF69B4',
          dark: '#C71585',
        },
        deep: {
          950: '#0A0014',
          900: '#0D0221',
          800: '#1A0533',
          700: '#2D1B69',
        },
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        crimson: ['Crimson Text', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 25s linear infinite',
        'spin-slow-ccw': 'spin-ccw 30s linear infinite',
        'float': 'float 7s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.6s ease-out forwards',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        'spin-ccw': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(-360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,215,0,0.25), 0 0 40px rgba(255,107,43,0.15)' },
          '50%': { boxShadow: '0 0 35px rgba(255,215,0,0.5), 0 0 70px rgba(255,107,43,0.3)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
