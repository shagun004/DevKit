/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        bg: {
          base:    '#07070F',
          surface: '#0E0E1A',
          card:    '#13131F',
          border:  '#1C1C2E',
        },
        text: {
          primary:   '#F0F0FF',
          secondary: '#6B6B9A',
          muted:     '#2E2E4A',
        }
      },
      animation: {
        'fade-in-up':  'fadeInUp 0.35s ease forwards',
        'slide-left':  'slideInLeft 0.3s ease forwards',
        'pulse-dot':   'pulseDot 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}