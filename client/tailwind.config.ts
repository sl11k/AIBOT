import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        nutricare: {
          primary: "#02BE6A",
          "primary-light": "#70EBAF",
          "green-50": "#ECFDF5",
          bg: "#FAFAFA",
          surface: "#FFFFFF",
          border: "#E4E4E7",
          "border-light": "#F4F4F5",
          "text-muted": "#71717A",
          disabled: "#D4D4D8",
        },
      },
      borderRadius: {
        nc: "12px",
        "nc-lg": "16px",
      },
      boxShadow: {
        "nc-card": "0 1px 3px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
