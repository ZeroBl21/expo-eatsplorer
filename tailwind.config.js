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
          dark: '#F2AE1C',
        },
        offwhite: {
          DEFAULT: '#F5F5F5',
        },
        offblack: {
          DEFAULT: '#1C1C1C',
        },
      },
      fontFamily: {
        'inter-regular': ['Inter_400Regular', 'sans-serif'],
        'inter-medium': ['Inter_500Medium', 'sans-serif'],
        'inter-semibold': ['Inter_600SemiBold', 'sans-serif'],
        'inter-bold': ['Inter_700Bold', 'sans-serif'],
        'inter-extrabold': ['Inter_800ExtraBold', 'sans-serif'],
        'inter-black': ['Inter_900Black', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
