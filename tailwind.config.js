/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");

export default withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      sm: { min: "375px" },
      md: { min: "768px" },
      lg: { min: "1024px" },
    },
  },
  plugins: ["@tailwindcss/forms"],
});
