import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        mobile: "338px",
      },
      borderRadius: {
        15: "15px",
        5: "5px",
      },
      fontSize: {
        small: "0.938",
        big: "1.25rem",
      },
    },
    colors: {
      background: {
        dark: "#16161E",
        light: "#CBCCD1",
      },
      foreground: {
        dark: "#1E2130",
        light: "#D5D6DB",
      },
      text: {
        dark: "#F5F5F5",
        light: "#0F0F14",
      },
      primary: {
        dark: "#44CBCA",
        light: "#148DA1",
      },
      secondary: {
        dark: "#7AA2F7",
        light: "#375FA0",
      },
      accent: {
        dark: "#A67AFF",
        light: "#6B588D",
      },
      danger: {
        dark: "#F7768E",
        light: "#A62941",
      },
      accept: {
        dark: "#9ECE6A",
        light: "#5B921F",
      },
    },
  },
  plugins: [],
  darkMode: "class",
} satisfies Config;
