import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        muted: "var(--muted)",
        line: "var(--line)",
        brand: {
          DEFAULT: "var(--brand)",
          ink: "var(--brand-ink)",
          wash: "var(--brand-wash)",
        },
        energy: "var(--energy)",
        panel: "var(--panel-dark)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,17,32,0.04), 0 8px 24px -12px rgba(11,17,32,0.12)",
        lift: "0 20px 50px -24px rgba(11,17,32,0.35)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "route-progress": {
          "0%": { transform: "scaleX(0)" },
          "80%": { transform: "scaleX(0.9)" },
          "100%": { transform: "scaleX(0.9)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "route-progress": "route-progress 2.5s cubic-bezier(0.1,0.7,0.4,1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
