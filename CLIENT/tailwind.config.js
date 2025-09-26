import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        linkedin: {
          primary: "#0A66C2", // LinkedIn Blue
          "primary-content": "#FFFFFF",

          secondary: "#FFFFFF", // White
          "secondary-content": "#000000", // Black text on white

          accent: "#7FC15E", // LinkedIn Green
          "accent-content": "#FFFFFF",

          neutral: "#000000",
          "neutral-content": "#FFFFFF",

          "base-100": "#F3F2EF",
          "base-content": "#000000",

          info: "#5E5E5E",
          success: "#057642",
          warning: "#F5C75D",
          error: "#CC1016",
        },
      },
    ],
  },
};
