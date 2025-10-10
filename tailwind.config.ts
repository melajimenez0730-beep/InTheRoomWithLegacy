import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#052d3f',
          foreground: '#f7f6dc',
        },
        secondary: {
          DEFAULT: '#9a4a0b',
          foreground: '#f7f6dc',
        },
        cream: {
          DEFAULT: '#f7f6dc',
          foreground: '#052d3f',
        },
        taupe: {
          DEFAULT: '#d8d0c0',
          foreground: '#052d3f',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: '#d8d0c0',
          foreground: '#052d3f',
        },
        accent: {
          DEFAULT: '#9a4a0b',
          foreground: '#f7f6dc',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: '#f7f6dc',
          foreground: '#052d3f',
        },
        section: {
          light: '#f7f6dc',  // Light Cream
          dark: '#d8d0c0',   // Soft Gray/Taupe
          footer: '#052d3f', // Primary Deep Blue
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
      },
    },
  },
} satisfies Config;