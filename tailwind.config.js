/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#030014',
        secondary:'#151312',

        background: '#F6F7F5',
        foreground: '#2F3A36',

        card: '#E8E6E1',
        cardForeground: 'hsl(158 11% 21%)',

        popover: "hsl(43 14% 89%)",
        popoverForeground: "hsl(158 11% 21%)",

        /* Brand */
        primary: "hsl(153 23% 59%)",
        primaryForeground: "#ffffff",

        secondary: "hsl(90 11% 93%)",
        secondaryForeground: "hsl(158 11% 21%)",

        muted: "hsl(43 14% 92%)",
        mutedForeground: "hsl(158 8% 45%)",

        accent: "hsl(150 26% 56%)",
        accentForeground: "hsl(150 30% 20%)",

        destructive: "hsl(0 65% 50%)",

        /* Routine-specific */
        laundry: {
          DEFAULT: "hsl(197 31% 67%)",
          bg: "hsl(197 31% 94%)",
          fg: "hsl(197 35% 25%)",
        },

        plant: {
          DEFAULT: "hsl(150 26% 50%)",
          bg: "hsl(150 26% 92%)",
          fg: "hsl(150 30% 20%)",
        },

        pet: {
          DEFAULT: "hsl(35 55% 55%)",
          bg: "hsl(35 55% 92%)",
          fg: "hsl(35 50% 25%)",
        },

        trash: {
          DEFAULT: "hsl(280 25% 55%)",
          bg: "hsl(280 25% 93%)",
          fg: "hsl(280 25% 25%)",
        },
      },
      borderRadius: {
        lg: 16,
        xl: 20,
      },
    },
  },
  plugins: [],
}