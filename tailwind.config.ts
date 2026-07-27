import type { Config } from 'tailwindcss';

// Design tokens from the approved "Gazette" design — royal green on cream,
// Cormorant Garamond / Lora / IBM Plex Mono. Extend this theme rather than
// reaching for arbitrary values in components.
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        g: '#0b3d2e',    // the one accent — text/border/rule, never a large fill
        cream: '#f6f1e4', // page ground
        ink: '#1b2420',   // body text
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'serif'],
        body: ['Lora', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        lg: '0 12px 32px rgba(11, 26, 19, 0.22)', // the design system's one "whisper" elevation
      },
    },
  },
  plugins: [],
} satisfies Config;
