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
        bg: 'var(--color-bg)',
        fg: 'var(--color-fg)',
        accent: 'var(--color-accent)',
        surface: 'var(--color-surface)',
        surfaceHover: 'var(--color-surface-hover)',
        textMuted: 'var(--color-text-muted)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px',
      },
      boxShadow: {
        card: '0 8px 32px hsla(240, 20%, 4%, 0.5)',
        button: '0 4px 12px hsla(260, 85%, 58%, 0.3)',
        glow: '0 0 24px hsla(340, 95%, 58%, 0.4)',
      },
    },
  },
  plugins: [],
};

export default config;
