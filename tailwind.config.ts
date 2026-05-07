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
          DEFAULT: '#D90000',
        },

        schedule: {
          sunday: '#C62828',
          muted: '#B7BDCC',
          official: {
            purpleBg: '#EEE7FF',
            purpleText: '#5B21B6',
            greenBg: '#E7F5EF',
            greenText: '#166534',
            blueBg: '#EAF2FF',
            blueText: '#1D4ED8',
            orangeBg: '#FFF3E8',
            orangeText: '#B45309',
          },
          member: {
            blueBg: '#EBF3FF',
            blueText: '#00439C',
            greenBg: '#E7F5EF',
            greenText: '#166534',
            yellowBg: '#FFF6DB',
            yellowText: '#8A5A00',
          },
        },
      },

      maxWidth: {
        layout: '90rem',
      },

      spacing: {
        18: '4.5rem',
        23: '5.75rem',
        30: '7.5rem',
        33: '8.25rem',
        35: '8.75rem',
        45: '11.25rem',
        65: '16.25rem',
        90: '22.5rem',
        130: '32.5rem',
      },

      gridAutoRows: {
        18: '4.5rem',
        35: '8.75rem',
      },

      gridTemplateColumns: {
        schedule: 'minmax(0, 1fr) 20rem',
      },

      borderRadius: {
        calendar: '1.125rem',
        card: '1.5rem',
        panel: '1.75rem',
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

      boxShadow: {
        'schedule-panel': '0 18px 60px rgba(37, 37, 37, 0.05)',
        'schedule-card': '0 10px 30px rgba(37, 37, 37, 0.04)',
        'schedule-icon': '0 12px 28px rgba(37, 37, 37, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
