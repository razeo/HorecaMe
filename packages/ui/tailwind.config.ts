import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#2D4654',
          50: '#E8EEF1',
          100: '#C5D6DE',
          200: '#9EBDC8',
          300: '#77A3B2',
          400: '#558FA2',
          500: '#2D4654',
          600: '#263D4A',
          700: '#1E3340',
          800: '#172A36',
          900: '#0F1A21',
        },
        sky: {
          DEFAULT: '#87BCDE',
          50: '#F0F7FB',
          100: '#D8ECF5',
          200: '#B8DDEC',
          300: '#A8D1EC',
          400: '#87BCDE',
          500: '#6AADD4',
          600: '#4D9DCA',
          700: '#3A8AB8',
          800: '#2E7299',
          900: '#245A7A',
        },
        navy: {
          DEFAULT: '#243B4A',
          50: '#E5EBEF',
          100: '#BFCFDA',
          200: '#95B1C3',
          300: '#6B93AC',
          400: '#4C7D9A',
          500: '#243B4A',
          600: '#1F3340',
          700: '#192B37',
          800: '#13232D',
          900: '#0D1A23',
        },
        surface: {
          DEFAULT: '#0F1A21',
          raised: '#1A2A33',
          overlay: '#243B4A',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
