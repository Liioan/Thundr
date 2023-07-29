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
        medium: "1.25rem",
        big: "1.5rem",
      },
      backgroundImage: {
        "gradient-dark": "linear-gradient(314deg, #9747FF 0%, #44CBCA 100%)",
        "gradient-light": "linear-gradient(314deg, #5A4A78 0%, #166775 100%)",
      },
    },
    colors: {
      background: {
        dark: "#16161E",
        "dark-opacity": "rgb(22, 22, 30, .8)",
        light: "#CBCCD1",
        "light-opacity": "rgb(203, 204, 205, .8)",
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
      transparent: "rgba(0, 0, 0, 0)",
    },
  },
  plugins: [require("@tailwindcss/typography")],
  darkMode: "class",
} satisfies Config;
