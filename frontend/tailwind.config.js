/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Apple-inspired color palette
        gray: {
          50: '#fafafa',
          100: '#f5f5f7',
          200: '#f2f2f7',
          300: '#d1d1d6',
          400: '#c7c7cc',
          500: '#aeaeb2',
          600: '#8e8e93',
          700: '#6d6d70',
          800: '#48484a',
          900: '#1d1d1f',
        },
        blue: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#007aff',
          600: '#0056d6',
          700: '#0043a8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        'system': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'headline': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'title': ['1.375rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'caption': ['0.875rem', { lineHeight: '1.4' }],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'apple-sm': '0 1px 3px rgba(0, 0, 0, 0.04)',
        'apple': '0 4px 12px rgba(0, 0, 0, 0.06)',
        'apple-lg': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'apple-xl': '0 12px 32px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-subtle': 'bounceSubtle 1s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
      },
      backdropBlur: {
        'apple': '20px',
      },
    },
  },
  plugins: [],
}
