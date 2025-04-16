module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust paths to match your project structure
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
