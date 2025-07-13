import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}",
  ],
  darkMode: "class",
  theme: {
    extend: {},
    fontFamily: {
      header: "'Press Start 2P', system-ui",
    },
  },
  plugins: [],
};

export default config;
