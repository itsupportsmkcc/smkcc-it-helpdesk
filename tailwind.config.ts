import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Starbucks Design System Colors
        "starbucks-green": "#006241",
        "green-accent": "#00754A",
        "house-green": "#1E3932",
        "green-uplift": "#2b5148",
        "green-light": "#d4e9e2",
        "neutral-warm": "#f2f0eb",
        "ceramic": "#edebe9",
        "gold": "#cba258",
        "gold-light": "#dfc49d",
        "gold-lightest": "#faf6ee",
        "text-black": "rgba(0, 0, 0, 0.87)",
        "text-black-soft": "rgba(0, 0, 0, 0.58)",
        "input-border": "#d6dbde",

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "#00754A",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#1E3932",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "#00754A",
      },
      borderRadius: {
        pill: "50px",
        card: "12px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "sb-card": "0 0 0.5px rgba(0,0,0,0.14), 0 1px 2px rgba(0,0,0,0.12)",
        "sb-nav": "0 1px 3px rgba(0,0,0,0.1), 0 2px 2px rgba(0,0,0,0.06), 0 0 2px rgba(0,0,0,0.07)",
        "sb-frap": "0 0 6px rgba(0,0,0,0.24), 0 8px 12px rgba(0,0,0,0.14)",
      },
      letterSpacing: {
        tightest: "-0.16px",
      },
      fontFamily: {
        sukhumvit: ["'Sukhumvit Set'", "'Prompt'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        sarabun: ["'Sarabun'", "'TH Sarabun New'", "'THSarabunNew'", "Garuda", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
