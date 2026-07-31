import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        g: 'rgb(var(--color-g) / <alpha-value>)',
        cream: 'rgb(var(--color-cream) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        codeBg: 'rgb(var(--color-codeBg) / <alpha-value>)',
        codeInk: 'rgb(var(--color-codeInk) / <alpha-value>)',

        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
          foreground: 'rgb(var(--popover-foreground) / <alpha-value>)',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'serif'],
        body: ['var(--font-body)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        '0_6': '0.6rem',
        '0_7': '0.7rem',
        '0_8': '0.8rem',
        '0_9': '0.9rem',
        '1_1': '1.1rem',
        '1_2': '1.2rem',
        '1_4': '1.4rem',
        '2_6': '2.6rem',
      },
      maxWidth: {
        dialog: 'min(47.5rem, 92vw)',
        'dialog-md': 'min(40rem, 92vw)',
        'dialog-sm': 'min(32.5rem, 92vw)',
      },
      gridTemplateColumns: {
        layout: '20% 1fr 20%',
      },
      boxShadow: {
        lg: '0 0.75rem 2rem rgba(11, 26, 19, 0.22)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
