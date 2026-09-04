/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#171412',
        char: '#211C19',
        cream: '#FBF9F6',
        paper: '#F4F0EA',
        ember: '#E8491D',
        'ember-dark': '#C23A15',
        mustard: '#C9A227',
        leaf: '#2F6B3A',
        line: '#E7E1D8',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(23,20,18,0.06)',
        lift: '0 12px 24px -8px rgba(23,20,18,0.18)',
      },
      borderRadius: {
        sm2: '6px',
      },
    },
  },
  plugins: [],
};
