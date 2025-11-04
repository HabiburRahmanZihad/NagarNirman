/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2A7D2F",      // Deep Green
        secondary: "#69AF0B",    // Lime Green
        lighter: "#f2a921",       // Amber Gold
        bg1: "#FFFFFF",          // White
        bg2: "#F3F4F6",          // Gray-White
        heading: "#002E2E",      // Deep Green
        body: "#273043",         // Dark Gray for normal text
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        urbanist: ["Urbanist", "sans-serif"],
        jost: ["Jost", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;