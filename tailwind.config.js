/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      display: ["roboto", "sans-serif"],
      body: ["roboto", "sans-serif"],
    },
    extend: {
      colors: {
        "curious-blue": {
          50: "#f2f8fd",
          100: "#e3effb",
          200: "#c1dff6",
          300: "#8bc4ee",
          400: "#369be0",
          500: "#258bd2",
          600: "#176eb2",
          700: "#145890",
          800: "#144b78",
          900: "#163f64",
          950: "#0f2942",
        },
      },
    },
  },
  plugins: [import("flowbite/plugin")],
};
