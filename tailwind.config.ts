import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nuit: { DEFAULT: '#1B2A4A', 50: '#EEF1F7', 100: '#D5DCEA', 700: '#22345C', 900: '#111C33' },
        or: { DEFAULT: '#C9A227', light: '#E6C65C', dark: '#9C7C14' },
        creme: '#FAF7F0',
      },
      fontFamily: { serif: ['Georgia', 'serif'] },
      boxShadow: { carte: '0 10px 30px -10px rgba(27,42,74,0.35)' },
    },
  },
  plugins: [],
};

export default config;
