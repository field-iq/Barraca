import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nm: {
          bg: 'var(--nm-bg)',
          surface: 'var(--nm-surface)',
          sunken: 'var(--nm-sunken)',
          text: 'var(--nm-text)',
          muted: 'var(--nm-muted)',
          line: 'var(--nm-line)',
          accent: 'var(--nm-accent)',
          'accent-fg': 'var(--nm-accent-fg)',
          'accent-soft': 'var(--nm-accent-soft)',
          success: 'var(--nm-success)',
          warning: 'var(--nm-warning)',
          danger: 'var(--nm-danger)',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        soft: '20px',
        'soft-lg': '28px',
        'soft-sm': '14px',
        pill: '999px',
      },
      boxShadow: {
        soft: '8px 8px 16px var(--nm-shadow-dark), -8px -8px 16px var(--nm-shadow-light)',
        'soft-sm': '4px 4px 8px var(--nm-shadow-dark), -4px -4px 8px var(--nm-shadow-light)',
        'soft-lg': '14px 14px 28px var(--nm-shadow-dark), -14px -14px 28px var(--nm-shadow-light)',
        'soft-xs': '2px 2px 4px var(--nm-shadow-dark), -2px -2px 4px var(--nm-shadow-light)',
        'soft-inset': 'inset 5px 5px 10px var(--nm-shadow-dark), inset -5px -5px 10px var(--nm-shadow-light)',
        'soft-inset-sm': 'inset 2px 2px 5px var(--nm-shadow-dark), inset -2px -2px 5px var(--nm-shadow-light)',
        'soft-inset-lg': 'inset 8px 8px 16px var(--nm-shadow-dark), inset -8px -8px 16px var(--nm-shadow-light)',
        'soft-flat': '0 0 0 1px var(--nm-line)',
      },
      transitionTimingFunction: { soft: 'cubic-bezier(.2,.8,.2,1)' },
      keyframes: {
        'nm-in': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'none' } },
        'nm-shimmer': { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
      },
      animation: { 'nm-in': 'nm-in .3s cubic-bezier(.2,.8,.2,1) both', 'nm-shimmer': 'nm-shimmer 1.6s linear infinite' },
    },
  },
  plugins: [],
};
export default config;
