/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "scrollbar-thumb": "#888",
        "scrollbar-track": "#f0f0f0",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
