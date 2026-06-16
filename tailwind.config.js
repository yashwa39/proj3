/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#020617",
        brand: {
          DEFAULT: "#22C55E",
          dark: "#16A34A",
          light: "#4ADE80",
        },
        surface: {
          DEFAULT: "#0F172A",
          2: "#1E293B",
          3: "#334155",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-fira-code)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      backgroundSize: {
        200: "200% 200%",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        gradientShift: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        slideUp: {
          from: { opacity: 0, transform: "translateY(30px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        glowPulse: {
          "0%,100%": { boxShadow: "0 0 20px #22C55E33" },
          "50%": { boxShadow: "0 0 40px #22C55E66, 0 0 80px #22C55E22" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        gradient: "gradientShift 8s ease infinite",
        "slide-up": "slideUp 0.6s ease both",
        "fade-in": "fadeIn 0.8s ease both",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
