import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#252525',
        white: '#FFFFFF',

        gray1: '#F2F2F2',
        gray2: '#DADADC',
        gray3: '#6E6E6E',
        gray4: '#767676',
        gray5: '#8B8C92',
        gray6: '#545961',
        gray7: '#F3F5F8',

        primary: {
          DEFAULT: '#006DFF',
          5: '#EBF3FF',
          gray: '#00439C',
        },

        label: {
          red: {
            100: '#804640',
            10: '#FCEEED',
          },
          yellow: {
            100: '#AA8339',
            10: '#F4ECDD',
          },
        },

        warning: {
          100: '#C70000',
          10: '#F3DADA',
          DEFAULT: '#C70000',
        },

        fontSize: {
          title: ['22px', { lineHeight: '30px' }],
          large: ['17px', { lineHeight: '24px' }],
          normal: ['15px', { lineHeight: '22px' }],
          small: ['12px', { lineHeight: '18px' }],
        },

        fontWeight: {
          regular: '400',
          semibold: '600',
          bold: '700',
        },
      },
    },
  },
  plugins: [],
};

export default config;