/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#090b1a",
        surface: "#101329",
        accent: "#4f46e5",
        accentMuted: "#6366f1",
        positive: "#22c55e",
        negative: "#ef4444"
      },
      boxShadow: {
        card: "0 10px 40px rgba(15, 23, 42, 0.35)"
      }
    }
  },
  plugins: []
};
