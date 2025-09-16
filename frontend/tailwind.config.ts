import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // Enable manual class-based dark mode
  content: ['./index.html', './src/**/*.{ts,tsx}'], // make sure paths are correct
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
