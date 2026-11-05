/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        diamond: {
          bg: "#05070d",
          panel: "#0a0f1c",
          border: "#111a2e",
          blue: "#2f81f7",
          cyan: "#22d3ee",
          text: "#e6edf7",
          muted: "#8b98b0",
        },
      },
      fontFamily: {
        sans: ["Inter", "Vazirmatn", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(47,129,247,0.35)",
        "glow-sm": "0 0 20px rgba(34,211,238,0.25)",
      },
      backgroundImage: {
        "radial-glow":
          "radial-gradient(circle at 50% 0%, rgba(47,129,247,0.18), transparent 60%)",
      },
    },
  },
  plugins: [],
};