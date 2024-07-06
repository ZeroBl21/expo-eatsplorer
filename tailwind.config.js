/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#4C7031',
        },
        primary: {
          DEFAULT: '#f8dcac',
        },
        secondary: {
          light: '#F8CF84',
          DEFAULT: '#ECC165',
          dark: '#FADDAF',
        },
        offwhite: {
          DEFAULT: '#F5F5F5',
        },
        offblack: {
          DEFAULT: '#1C1C1C',
        },
      },
    },
  },
  plugins: [],
}
