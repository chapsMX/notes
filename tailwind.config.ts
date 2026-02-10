import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef3c7',
          100: '#fde68a',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
        }
      }
    },
  },
  plugins: [],
}
export default config
