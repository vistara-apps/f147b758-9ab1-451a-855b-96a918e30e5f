import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors from design system
        primary: 'hsl(260, 85%, 58%)',
        accent: 'hsl(340, 95%, 58%)',
        bg: 'hsl(240, 12%, 8%)',
        surface: 'hsl(240, 10%, 12%)',
        surfaceHover: 'hsl(240, 10%, 16%)',
        text: 'hsl(0, 0%, 98%)',
        textMuted: 'hsl(240, 5%, 65%)',
        success: 'hsl(142, 76%, 45%)',
        warning: 'hsl(38, 92%, 50%)',
      },
      fontSize: {
        display: ['3xl', { lineHeight: 'tight', fontWeight: 'bold' }],
        h1: ['2xl', { fontWeight: 'semibold' }],
        h2: ['xl', { fontWeight: 'semibold' }],
        body: ['base', { lineHeight: '7' }],
        caption: ['sm', { lineHeight: '5' }],
        label: ['xs', { fontWeight: 'medium', letterSpacing: 'wide', textTransform: 'uppercase' }],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 8px 32px hsla(240, 20%, 4%, 0.5)',
        button: '0 4px 12px hsla(260, 85%, 58%, 0.3)',
        glow: '0 0 24px hsla(340, 95%, 58%, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '400ms',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
  },
  plugins: [],
};

export default config;
