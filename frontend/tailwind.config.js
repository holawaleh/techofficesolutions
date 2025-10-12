/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#059669", // emerald-600
          light: "#10B981",   // emerald-500
          dark: "#047857",    // emerald-700
        },
        text: {
          light: "#F8FAFC",
          DEFAULT: "#1E293B",
          subtle: "#475569",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px rgba(16, 185, 129, 0.4)", // emerald glow
      },
    },
  },
  plugins: [],
};
