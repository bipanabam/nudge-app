/** @type {import('tailwindcss').Config} */
module.exports = {
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
        primary: "hsl(153 23% 59%)",
        primaryForeground: "#ffffff",

        secondary: "hsl(90 11% 93%)",
        secondaryForeground: "hsl(158 11% 21%)",
        popover: "hsl(43 14% 89%)",
        popoverForeground: "hsl(158 11% 21%)",

        background: "#F6F7F5",
        foreground: "#2F3A36",
        card: "#E8E6E1",
        cardForeground: "#2F3A36",
        muted: "#EAEAEA",
        mutedForeground: "#767676",
        destructive: "#D22D2D",
        destructiveForeground: "#FFFFFF",

        // Routine types
        laundry: {
          DEFAULT: "#8FB8C8",
          bg: "#EEF6FA",
          fg: "#2C5363",
        },
        plant: {
          DEFAULT: "#6FAF8F",
          bg: "#EAF7F0",
          fg: "#2F5A46",
        },
        pet: {
          DEFAULT: "#F2B45A",
          bg: "#FCEEDB",
          fg: "#6B3E0A",
        },
        trash: {
          DEFAULT: "#9B7CC2",
          bg: "#F2EDF8",
          fg: "#4B3172",
        },
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
