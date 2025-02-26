/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'beat': 'beat 1s ease-in-out infinite',
      },
      keyframes: {
        beat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        }
      },
      colors: {
        primary: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          900: '#111827',
        },
      },
      height: {
        'hero': '80vh',
      }
    },
  },
  plugins: [],
}