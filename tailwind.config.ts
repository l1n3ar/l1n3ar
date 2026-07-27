import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        g: '#0b3d2e',
        cream: '#f6f1e4',
        ink: '#1b2420',
        codeBg: '#0b1a13',
        codeInk: '#e8e3d8',
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'serif'],
        body: ['Lora', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      fontSize: {
        '0_6': '0.6rem',
        '0_7': '0.7rem',
        '0_8': '0.8rem',
        '0_9': '0.9rem',
        '1_1': '1.1rem',
        '1_2': '1.2rem',
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
