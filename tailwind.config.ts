import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base Colors (Dark Theme)
        bg: {
          primary: "#0A0E27",
          secondary: "#121829",
          surface: "#1A1F3A",
          elevated: "#242B47",
        },
        border: {
          subtle: "#2E3652",
          strong: "#3D4563",
        },
        text: {
          primary: "#F5F7FA",
          secondary: "#B8C1D6",
          tertiary: "#7A8599",
          inverse: "#0A0E27",
        },
        // Blockchain Colors (Primary Brand)
        blockchain: {
          blue: "#3B82F6",
          "blue-light": "#60A5FA",
          "blue-dark": "#1E40AF",
        },
        // Government Colors (Accent)
        gold: {
          DEFAULT: "#FBBF24",
          light: "#FCD34D",
          dark: "#D97706",
        },
        // Status Colors
        status: {
          success: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
          info: "#06B6D4",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "var(--font-fira-code)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px #2563eb, 0 0 10px #2563eb" },
          "100%": { boxShadow: "0 0 20px #2563eb, 0 0 30px #2563eb" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
