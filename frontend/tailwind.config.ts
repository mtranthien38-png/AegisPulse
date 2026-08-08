import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b1020",
        panel: "#11182c",
        line: "#22304f",
        accent: "#4dd4ff",
        accent2: "#8b5cf6",
      },
    },
  },
  plugins: [],
};

export default config;

