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
        // MUJI Design System Tokens
        muji: {
          ink: "#3c3c43",
          deep: "#1d1d1f",
          soft: "#333333",
          mid: "#666666",
          quiet: "#767676",
          mist: "#8f8f8f",
          faint: "#9d9da0",
          hairline: "#c4c4c6",
          "hairline-soft": "#e0e0e0",
          canvas: "#ffffff",
          surface: "#ebebec",
          red: "#7f0019",
          green: "#009262",
          mint: "#32c997",
          warning: "#e48900",
          lemon: "#ffa826",
          danger: "#dd0c14",
        },

        // Legacy / Theme Aliases mapped to MUJI tokens
        "starbucks-green": "#009262",
        "green-accent": "#009262",
        "house-green": "#1d1d1f",
        "green-uplift": "#3c3c43",
        "green-light": "#ebebec",
        "neutral-warm": "#ffffff",
        "ceramic": "#ebebec",
        "gold": "#7f0019",
        "gold-light": "#c4c4c6",
        "gold-lightest": "#fafafa",
        "text-black": "#1d1d1f",
        "text-black-soft": "#666666",
        "input-border": "#c4c4c6",

        background: "#ffffff",
        foreground: "#3c3c43",
        card: {
          DEFAULT: "#ffffff",
          foreground: "#3c3c43",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#3c3c43",
        },
        primary: {
          DEFAULT: "#1d1d1f",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#ebebec",
          foreground: "#1d1d1f",
        },
        muted: {
          DEFAULT: "#ebebec",
          foreground: "#767676",
        },
        accent: {
          DEFAULT: "#7f0019",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#dd0c14",
          foreground: "#ffffff",
        },
        border: "#e0e0e0",
        input: "#c4c4c6",
        ring: "#1d1d1f",
      },
      borderRadius: {
        none: "0px",
        card: "2px",
        pill: "9999px",
        full: "9999px",
        lg: "2px",
        md: "2px",
        sm: "2px",
      },
      boxShadow: {
        none: "none",
        "sb-card": "none",
        "sb-nav": "none",
        "sb-frap": "none",
        hairline: "0 1px 0 0 #e0e0e0",
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
