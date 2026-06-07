import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'way-petroleo': '#0F5C7A',
        'way-verde': '#1FAE4B',
        'way-lima': '#6CD34A',
        'way-turquesa': '#3CC7C3',
        'way-azulAgua': '#2FA4D9',
        'way-gris': '#E6E6E6',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Montserrat', 'sans-serif'],
        body: ['var(--font-body)', 'Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
