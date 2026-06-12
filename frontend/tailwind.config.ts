import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#005BFF",
          dark: "#0049CC",
          light: "#E5F0FF",
        },
        accent: {
          DEFAULT: "#F1117E",
          dark: "#C10E65",
          light: "#FDE7F1",
        },
      },
    },
  },
  plugins: [],
};
export default config;
