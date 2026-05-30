import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#06070a',
          900: '#0a0c10',
          850: '#0f1216',
          800: '#14181d',
          750: '#1b2026',
          700: '#23292f',
        },
        ignition: {
          DEFAULT: '#ff5722',
          400: '#ff7a45',
          300: '#ff9466',
          glow: '#ff5a1f',
        },
        amber: {
          hot: '#f59e0b',
        },
        spec: {
          DEFAULT: '#2dd4bf',
          400: '#34e0cb',
        },
        line: 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        sans: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      letterSpacing: {
        ultra: '0.35em',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,87,34,0.4), 0 0 40px -8px rgba(255,87,34,0.55)',
        panel: '0 30px 60px -20px rgba(0,0,0,0.8)',
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to bottom, transparent, rgba(6,7,10,0.9))',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scan: {
          '0%,100%': { transform: 'translateY(-100%)' },
          '50%': { transform: 'translateY(100%)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.2s linear infinite',
        scan: 'scan 4s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
