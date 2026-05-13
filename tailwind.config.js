/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0B',
        surface: '#141518',
        'surface-2': '#1B1C20',
        border: '#2A2B30',
        'border-strong': '#3A3B42',
        'text-primary': '#F5F5F7',
        'text-secondary': '#9B9CA3',
        'text-muted': '#6B6C73',
        accent: '#FF6B2C',
        'accent-hover': '#FF8347',
        success: '#22C55E',
        warning: '#EAB308',
        failure: '#EF4444',
        info: '#3B82F6',
        live: '#22D3EE',
      },
      fontFamily: {
        sans: ['"Geist Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono Variable"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'pulse-live': 'pulse-live 1.6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-live': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.55', transform: 'scale(0.92)' },
        },
      },
    },
  },
  plugins: [],
}
