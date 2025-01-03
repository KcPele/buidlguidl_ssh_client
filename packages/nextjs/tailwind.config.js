/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']"],
  daisyui: {
    themes: [
      {
        light: {
          // Primary - Royal Blue for main actions and focus
          primary: "#4A6FDC",
          "primary-content": "#FFFFFF",

          // Secondary - Soft Blue for supporting elements
          secondary: "#8CA9F7",
          "secondary-content": "#1A1A2E",

          // Accent - Vibrant Indigo for highlights
          accent: "#6366F1",
          "accent-content": "#FFFFFF",

          // Neutral tones
          neutral: "#1E293B",
          "neutral-content": "#F8FAFC",

          // Base colors - Clean whites with subtle blue undertones
          "base-100": "#FFFFFF",
          "base-200": "#F1F5F9",
          "base-300": "#E2E8F0",
          "base-content": "#1E293B",

          // Semantic colors
          info: "#3B82F6",
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",

          // Enhanced rounded corners for modern feel
          "--rounded-btn": "0.75rem",

          // Refined tooltip styling
          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "oklch(var(--p))",
          },

          // Enhanced link interactions
          ".link": {
            textUnderlineOffset: "3px",
          },
          ".link:hover": {
            opacity: "90%",
            transition: "all 0.2s ease-in-out",
          },
        },
      },
      {
        dark: {
          // Primary - Deep Navy with high contrast
          primary: "#6366F1",
          "primary-content": "#FFFFFF",

          // Secondary - Muted Purple for depth
          secondary: "#818CF8",
          "secondary-content": "#FFFFFF",

          // Accent - Electric Indigo for emphasis
          accent: "#4F46E5",
          "accent-content": "#FFFFFF",

          // Neutral tones - Sophisticated grays
          neutral: "#F8FAFC",
          "neutral-content": "#1E293B",

          // Base colors - Rich dark mode palette
          "base-100": "#0F172A",
          "base-200": "#1E293B",
          "base-300": "#334155",
          "base-content": "#F1F5F9",

          // Semantic colors with adjusted luminosity
          info: "#60A5FA",
          success: "#34D399",
          warning: "#FBBF24",
          error: "#F87171",

          // Consistent rounded corners
          "--rounded-btn": "0.75rem",

          // Enhanced tooltip for dark mode
          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "oklch(var(--p))",
          },

          // Refined link styling
          ".link": {
            textUnderlineOffset: "3px",
          },
          ".link:hover": {
            opacity: "90%",
            transition: "all 0.2s ease-in-out",
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: {
        center: "0 0 16px -4px rgb(0 0 0 / 0.1)",
        "center-dark": "0 0 16px -4px rgb(0 0 0 / 0.25)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
};
