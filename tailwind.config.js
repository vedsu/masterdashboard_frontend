/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: {
            100: "#f5f5f7",
            500: "#ececec",
            900: "#e4e4e4",
          },
          bg: {
            appContent: "#fdfeff",
            section: "#feffff",
            base: "#25476a",
            "base-dark": "#2d445b",
            blue: "#03a9f4",
            purple: "#ab47bc",
            green: "#9fcc2e",
            orange: "#fa9f1b",
            checkbox: "#4f7ba7",
          },
          error: {
            crimson: "#dc143c",
          },
          pText: "#212427",
          pTextLight: "#faf9f6",
          pLabel: "#333333",
        },
        secondary: {
          sText: "#919191",
          sLabel: "#f0f0f0",
          bg: {
            lightGray: "#d3d3d3",
            silver: "#bfbfbf",
            btnExtraLight: "#598ec0",
            btnLight: "#3e5d7c",
          },
        },
        tertiary: {
          bg: {
            btn: "#191919",
          },
        },
        disabled: "#F5F5F7",
      },
    },
  },
  plugins: [],
};
