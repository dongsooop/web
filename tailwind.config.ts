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
          foreground: '#0066EB',
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
          80: '#804640',
          10: '#F3DADA',
          DEFAULT: '#D90000',
        },

        mint: {
          DEFAULT: '#CBE8D7',
          soft: '#EEF9F2',
          strong: '#2F6B46',
        },
        sky: {
          DEFAULT: '#D9E8FF',
          soft: '#EDF5FF',
          strong: '#2D5EA8',
        },
        violet: {
          DEFAULT: '#E0DAFB',
          soft: '#F2EFFF',
          strong: '#5B4BA8',
        },
        rose: {
          DEFAULT: '#F4D9E8',
          soft: '#FFF1F7',
          strong: '#A14F71',
        },
        amber: {
          DEFAULT: '#F4E7CB',
          soft: '#FFF8EA',
          strong: '#926F2D',
        },
        teal: {
          DEFAULT: '#CBE9E6',
          soft: '#EAF8F7',
          strong: '#216B66',
        },
        indigo: {
          DEFAULT: '#D8DEFF',
          soft: '#EEF1FF',
          strong: '#4557A8',
        },
        peach: {
          DEFAULT: '#F7DDCF',
          soft: '#FFF3EE',
          strong: '#A35C3F',
        },
        lime: {
          DEFAULT: '#DDE9B9',
          soft: '#F5FAE8',
          strong: '#5E7A22',
        },
        coral: {
          DEFAULT: '#F6D2C9',
          soft: '#FFF0EC',
          strong: '#A6534A',
        },

        schedule: {
          muted: '#B7BDCC',
          gridLine: '#C7CFDB',
          redBg: '#FCEEED',
          redLine: '#F28B82',
          redText: '#804640',
          yellowBg: '#FFF7CC',
          yellowLine: '#F4D03F',
          yellowText: '#8A6D00',
          greenBg: '#E7F5EF',
          greenLine: '#79C89D',
          greenText: '#166534',
          blueBg: '#EBF3FF',
          blueLine: '#8BB8FF',
          blueText: '#00439C',
          purpleBg: '#EEE7FF',
          purpleLine: '#B9A2F3',
          purpleText: '#5B21B6',
          orangeBg: '#FFF3E8',
          orangeLine: '#F2BE7A',
          orangeText: '#B45309',
          slateBg: '#F2F5F9',
          slateLine: '#D8E0EA',
          slateText: '#506072',
        },
      },

      maxWidth: {
        layout: '150rem',
        timetable: '65rem',
        'timetable-content': '58rem',
        'timetable-grid': '52rem',
      },

      spacing: {
        18: '4.5rem',
        23: '5.75rem',
        28: '7rem',
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
        28: '7rem',
        35: '8.75rem',
      },

      gridTemplateColumns: {
        schedule: 'minmax(0, 1fr) 20rem',
        'timetable-xs': '2.75rem minmax(0, 1fr)',
        timetable: '4.5rem minmax(0, 1fr)',
        'timetable-sm': '3.5rem minmax(0, 1fr)',
      },

      gridTemplateRows: {
        timetable: 'repeat(14, minmax(0, 3.5rem))',
        'timetable-shell': '2.25rem minmax(0, 1fr)',
      },

      borderRadius: {
        timetable: '1.75rem',
      },

      fontSize: {
        title: ['22px', { lineHeight: '30px' }],
        heading: ['18px', { lineHeight: '26px' }],
        body: ['16px', { lineHeight: '24px' }],
        bodySm: ['14px', { lineHeight: '20px' }],
        caption: ['12px', { lineHeight: '18px' }],
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
        'schedule-link': '0 14px 34px rgba(37, 37, 37, 0.04)',
      },

      backgroundImage: {
        'timetable-glow': 'radial-gradient(circle at top, rgba(0, 109, 255, 0.16), transparent 58%)',
      },
    },
  },
  plugins: [],
};

export default config;
