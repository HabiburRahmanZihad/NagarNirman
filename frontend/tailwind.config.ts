import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2a7d2f',
          light: '#81d586',
          dark: '#1a5d1f',
        },
        secondary: {
          DEFAULT: '#aef452',
          light: '#d4ff94',
          dark: '#8bc93a',
        },
        accent: {
          DEFAULT: '#f2a921',
          light: '#ffc850',
          dark: '#d89010',
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
