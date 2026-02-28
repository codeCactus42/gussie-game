/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#171717",
        foreground: "#FFFFF5",
        muted: "#212126",
        "muted-foreground": "#B2ACA9",
        brand: "#FF4A3D",
        "linear-back": "#0A090C",
        "linear-front": "#3a3446",
        "linear-text": "#A1A1A4",
        "linkedin-back": "#21262E",
        "linkedin-front": "#333c47",
        "x-back": "#000000",
        "x-front": "#171717",
        "instagram-back": "#000000",
        "instagram-front": "#171717",
      },
      fontFamily: {
        "sans-normal": ["Outfit_400Regular"],
        "sans-medium": ["Outfit_500Medium"],
        "sans-semibold": ["Outfit_600SemiBold"],
        "sans-bold": ["Outfit_700Bold"],
        display: ["Bangers_400Regular"],
      },
    },
  },
  plugins: [],
};
