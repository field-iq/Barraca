import type { Config } from "tailwindcss";
import containerQueries from "@tailwindcss/container-queries";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm, handcrafted-furniture palette (legacy / admin)
        cream: "#FAF7F2",
        sand: "#EFE7DA",
        bark: "#6B4F3A",
        walnut: "#3F2E22",
        accent: "#B5835A",
        // shadcn-style semantic tokens (see app/globals.css), used by
        // components copied from shadcn/ui-style registries.
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        // Soft UI (neumorphic) tokens for the public-facing redesign.
        // Values are `R G B` triplets (see app/globals.css), wrapped here in
        // rgb(... / <alpha-value>) so opacity modifiers like `bg-nm-surface/90`
        // or `text-nm-muted/70` work correctly.
        nm: {
          bg: "rgb(var(--nm-bg) / <alpha-value>)",
          surface: "rgb(var(--nm-surface) / <alpha-value>)",
          sunken: "rgb(var(--nm-sunken) / <alpha-value>)",
          text: "rgb(var(--nm-text) / <alpha-value>)",
          muted: "rgb(var(--nm-muted) / <alpha-value>)",
          line: "var(--nm-line)",
          accent: "rgb(var(--nm-accent) / <alpha-value>)",
          "accent-fg": "rgb(var(--nm-accent-fg) / <alpha-value>)",
          "accent-soft": "rgb(var(--nm-accent-soft) / <alpha-value>)",
          success: "rgb(var(--nm-success) / <alpha-value>)",
          warning: "rgb(var(--nm-warning) / <alpha-value>)",
          danger: "rgb(var(--nm-danger) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        serif: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        heading: ["var(--font-heading)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        soft: "20px",
        "soft-lg": "28px",
        "soft-sm": "14px",
        pill: "999px",
      },
      boxShadow: {
        soft: "8px 8px 16px var(--nm-shadow-dark), -8px -8px 16px var(--nm-shadow-light)",
        "soft-sm": "4px 4px 8px var(--nm-shadow-dark), -4px -4px 8px var(--nm-shadow-light)",
        "soft-lg": "14px 14px 28px var(--nm-shadow-dark), -14px -14px 28px var(--nm-shadow-light)",
        "soft-xs": "2px 2px 4px var(--nm-shadow-dark), -2px -2px 4px var(--nm-shadow-light)",
        "soft-inset": "inset 5px 5px 10px var(--nm-shadow-dark), inset -5px -5px 10px var(--nm-shadow-light)",
        "soft-inset-sm": "inset 2px 2px 5px var(--nm-shadow-dark), inset -2px -2px 5px var(--nm-shadow-light)",
        "soft-inset-lg": "inset 8px 8px 16px var(--nm-shadow-dark), inset -8px -8px 16px var(--nm-shadow-light)",
        "soft-flat": "0 0 0 1px var(--nm-line)",
      },
      transitionTimingFunction: { soft: "cubic-bezier(.2,.8,.2,1)" },
      keyframes: {
        "nm-in": { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "none" } },
        "nm-shimmer": { "0%": { backgroundPosition: "200% 0" }, "100%": { backgroundPosition: "-200% 0" } },
      },
      animation: { "nm-in": "nm-in .3s cubic-bezier(.2,.8,.2,1) both", "nm-shimmer": "nm-shimmer 1.6s linear infinite" },
    },
  },
  plugins: [containerQueries],
};

export default config;
