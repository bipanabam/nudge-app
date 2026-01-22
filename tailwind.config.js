/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./routine/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        /* Brand */
        background: {
          DEFAULT: "#F6F7F5",
          dark: "hsl(158 15% 10%)",
        },
        foreground: {
          DEFAULT: "#2F3A36",
          dark: "hsl(90 11% 95%)",
        },
        card: {
          DEFAULT: "#E8E6E1",
          dark: "hsl(158 12% 14%)",
        },
        muted: {
          DEFAULT: "#EAEAEA",
          dark: "hsl(158 10% 16%)",
        },
        mutedForeground: {
          DEFAULT: "#767676",
          dark: "hsl(158 8% 55%)",
        },
        primary: {
          DEFAULT: "hsl(153 23% 59%)",
          dark: "hsl(153 23% 55%)",
        },
        primaryForeground: "#ffffff",

        secondary: "hsl(90 11% 93%)",
        secondaryForeground: "hsl(158 11% 21%)",
        popover: "hsl(43 14% 89%)",
        popoverForeground: "hsl(158 11% 21%)",

        cardForeground: "#2F3A36",
        destructive: {
          DEFAULT: "#D22D2D",
          dark: "hsl(0 55% 45%)",
        },
        destructiveForeground: {
          DEFAULT: "#FFFFFF",
          dark: "hsl(0 0% 100%)",
        },

        // Routine colors
        laundry: { DEFAULT: "#8FB8C8", dark: "hsl(197 31% 60%)" },
        "laundry-bg": { DEFAULT: "#EEF6FA", dark: "hsl(197 25% 10%)" },
        "laundry-fg": { DEFAULT: "#2C5363", dark: "hsl(197 31% 85%)" },
        plant: { DEFAULT: "#6FAF8F", dark: "hsl(150 26% 45%)" },
        "plant-bg": { DEFAULT: "#EAF7F0", dark: "hsl(150 20% 12%)" },
        "plant-fg": { DEFAULT: "#2F5A46", dark: "hsl(150 26% 85%)" },
        pet: { DEFAULT: "#F2B45A", dark: "hsl(35 55% 50%)" },
        "pet-bg": { DEFAULT: "#FCEEDB", dark: "hsl(35 40% 12%)" },
        "pet-fg": { DEFAULT: "#6B3E0A", dark: "hsl(35 55% 85%)" },
        trash: { DEFAULT: "#9B7CC2", dark: "hsl(280 25% 50%)" },
        "trash-bg": { DEFAULT: "#F2EDF8", dark: "hsl(280 20% 12%)" },
        "trash-fg": { DEFAULT: "#4B3172", dark: "hsl(280 25% 85%)" },

        status: {
          overdue: "#FEE2E2",
          done: "#D1FAE5",
          active: "#DBEAFE",
        },
      },
      borderRadius: {
        xl: 20,
        lg: 16,
      },
      boxShadow: {
        card: "0 8px 30px -8px rgba(47,58,54,0.08)",
      },
    },
  },
  plugins: [],
};
