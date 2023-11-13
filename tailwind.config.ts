import { type Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  darkMode: 'class',
  theme: {
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
