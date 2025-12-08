/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#1e293b", // Slate-800 'Midnight'
        accent: "#d97706", // Amber-600 'Gold'
        "accent-light": "#fffbeb", // Amber-50
        sidebar: "#0f172a", // Slate-900 'Deep Midnight'
        "sidebar-active": "#1e293b", // Slate-800
        "sidebar-text": "#cbd5e1", // Slate-300
        background: "#fafaf9", // Stone-50 'Warm White'
        surface: "#ffffff", // White
        text: "#1c1917", // Stone-900 'Charcoal'
        "text-secondary": "#78716c", // Stone-500 'Warm Grey'
        border: "#e7e5e4", // Stone-200
      },
    },
  },
  plugins: [],
};
