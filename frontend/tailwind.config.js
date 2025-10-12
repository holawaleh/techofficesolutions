/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          dark: "#0f172a", // deep navy
          surface: "#1e293b", // for cards or panels
        },
        text: {
          primary: "#f8fafc", // bright white
          secondary: "#cbd5e1", // softer gray-blue
          muted: "#94a3b8", // placeholder/subtle
        },
        primary: {
          DEFAULT: "#10b981", // emerald
          dark: "#059669",
        },
      },
    },
  },
  plugins: [],
};
