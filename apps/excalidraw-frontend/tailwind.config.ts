import type { Config } from "tailwindcss";
import uiPreset from "@repo/ui/tailwind";
const config: Config = {
  presets: [uiPreset],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    borderRadius: {
      lg: "0.5rem",
      md: "calc(0.5rem - 2px)",
      sm: "calc(0.5rem - 4px)",
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};

export default config;

