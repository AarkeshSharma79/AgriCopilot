/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "#0B2E1F",
          900: "#0F3D28",
          800: "#134D31",
          700: "#166534",
          600: "#1E7A41",
          500: "#2C9653",
        },
        leaf: {
          50: "#F1F8F1",
          100: "#E1F1E2",
          400: "#5FB868",
          500: "#3FA34D",
          600: "#2E8B3F",
        },
        sand: "#F6F8F5",
        clay: "#E8664B",
        amber: {
          500: "#F0A93B",
        },
        sky: {
          500: "#2E90E5",
        },
      },
      fontFamily: {
        display: ["'Sora'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 40, 24, 0.04), 0 4px 16px rgba(16, 40, 24, 0.06)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
