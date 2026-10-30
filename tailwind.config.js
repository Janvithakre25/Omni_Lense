/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          dark: '#004C37',
          DEFAULT: '#006241',
          fresh: '#00754A',
          hover: '#005236'
        },
        cream: {
          DEFAULT: '#F7F0E5',
          dark: '#EFE6D8'
        },
        warmWhite: '#FFFCF7',
        sage: {
          DEFAULT: '#D4E4D3',
          light: '#E2EEE1'
        },
        mint: {
          DEFAULT: '#E8F3EC',
          light: '#F2F8F4'
        },
        coffee: {
          DEFAULT: '#6F4E37',
          light: '#8B654A'
        },
        charcoal: {
          DEFAULT: '#1E2923',
          light: '#2E3D35'
        },
        mutedGrey: '#66736B',
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(30, 41, 35, 0.06), 0 2px 6px -1px rgba(30, 41, 35, 0.04)',
        'soft-lg': '0 12px 32px -4px rgba(0, 76, 55, 0.08), 0 4px 12px -2px rgba(30, 41, 35, 0.05)',
        'lift': '0 16px 40px -6px rgba(0, 98, 65, 0.12), 0 6px 16px -2px rgba(30, 41, 35, 0.06)',
      }
    },
  },
  plugins: [],
}
