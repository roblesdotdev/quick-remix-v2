import { type Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        canvas: 'hsl(var(--canvas))',
        fg: 'hsl(var(--fg))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          fg: 'hsl(var(--primary-fg))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          fg: 'hsl(var(--destructive-fg))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          fg: 'hsl(var(--muted-fg))',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
