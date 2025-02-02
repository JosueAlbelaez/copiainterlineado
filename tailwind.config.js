/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#00BF63',
        secondary: '#FF3131',
        background: {
          DEFAULT: 'hsl(0 0% 100%)',
          dark: 'hsl(240 10% 3.9%)'
        },
        foreground: {
          DEFAULT: 'hsl(240 10% 3.9%)',
          dark: 'hsl(0 0% 98%)'
        },
        card: {
          DEFAULT: 'hsl(0 0% 100%)',
          dark: 'hsl(240 10% 3.9%)'
        },
        'card-foreground': {
          DEFAULT: 'hsl(240 10% 3.9%)',
          dark: 'hsl(0 0% 98%)'
        },
        border: {
          DEFAULT: 'hsl(240 5.9% 90%)',
          dark: 'hsl(240 3.7% 15.9%)'
        },
        muted: {
          DEFAULT: 'hsl(240 4.8% 95.9%)',
          dark: 'hsl(240 3.7% 15.9%)'
        },
        accent: {
          DEFAULT: 'hsl(240 4.8% 95.9%)',
          dark: 'hsl(240 3.7% 15.9%)'
        }
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
    },
  },
  plugins: [],
}