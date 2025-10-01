// @ts-nocheck

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "Poppins", "sans-serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
      },
      colors: {
        "purple-1": "var(--purple-1)",
        white: "var(--white)",
        aqua: "var(--aqua)",
        "purple-2": "var(--purple-2)",
        "purple-3": "var(--purple-3)",
        "green-button": "var(--green-button)",
      },
    },
  },
  plugins: [],
};

export default config;
