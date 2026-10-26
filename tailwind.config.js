/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#0a0b14',
          900: '#0e1020',
          800: '#151830',
          700: '#1f2342',
          600: '#2b3056',
          500: '#3a4070',
          400: '#5a6090',
          300: '#8b91b8',
          200: '#c2c7e0',
          100: '#e6e8f5',
        },
        brand: {
          50: '#eefcff',
          100: '#d4f7ff',
          200: '#a8eefe',
          300: '#6bd9fb',
          400: '#22bcf0',
          500: '#06a3d6',
          600: '#0a82ac',
          700: '#106a8a',
          800: '#155672',
          900: '#164760',
        },
        accent: {
          400: '#ffb347',
          500: '#ff9a1f',
          600: '#e07c00',
        },
        success: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        warning: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        error: {
          400: '#f87171',
          500: '#ef4444',
        },
      },
      boxShadow: {
        glow: '0 0 24px rgba(34, 188, 240, 0.35)',
        'glow-accent': '0 0 24px rgba(255, 154, 31, 0.4)',
        card: '0 8px 32px rgba(5, 6, 20, 0.45)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(34, 188, 240, 0.25)' },
          '50%': { boxShadow: '0 0 24px rgba(34, 188, 240, 0.55)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out both',
        slideUp: 'slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};
