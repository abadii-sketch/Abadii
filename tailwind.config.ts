import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        night: '#14192B',
        nightSoft: '#1E2540',
        sand: '#F6EFE2',
        sandDim: '#EDE3CF',
        sun: '#F2A93B',
        sunSoft: '#F7C878',
        ember: '#E1622F',
        emberDeep: '#C24A20',
        acacia: '#5C7A5E',
        ink: '#201C1A',
        clay: '#C97C4B'
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'sans-serif']
      },
      backgroundImage: {
        'sun-arc': 'radial-gradient(circle at 50% 120%, #F2A93B 0%, #E1622F 45%, transparent 70%)'
      }
    }
  },
  plugins: []
};

export default config;
