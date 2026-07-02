import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: '#E8891A',
          light: '#F5A94A',
          dark: '#C4720F',
        },
        green: {
          DEFAULT: '#5C6B2E',
          light: '#7A8A3A',
          dark: '#3E4A1E',
        },
        cream: {
          DEFAULT: '#FAF6EE',
          dark: '#EDE6D4',
          darker: '#DDD3BB',
        },
        brand: {
          dark: '#2C2B1E',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'wiggle': 'wiggle 0.6s ease-in-out infinite',
        'float-paw': 'floatPaw 6s ease-in-out infinite',
        'pop-in': 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        floatPaw: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(8deg)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
