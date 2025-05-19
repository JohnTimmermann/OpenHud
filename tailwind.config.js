/** @type {import('tailwindcss').Config} */
import forms from "@tailwindcss/forms";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "2.5rem",
          sm: "2.5rem",
        },
      },
      colors: {
        "background-primary": "oklch(var(--background-primary))",
        "background-contrast": "oklch(var(--background-contrast))",
        "background-secondary": "oklch(var(--background-secondary))",
        "background-hover": "oklch(var(--background-hover))",
        "background-light": "oklch(var(--background-light))",
        text: "oklch(var(--text))",
        "text-secondary": "oklch(var(--text-secondary))",
        "text-disabled": "oklch(var(--text-disabled))",
        primary: "oklch(var(--primary))",
        "primary-light": "oklch(var(--primary-light))",
        "primary-dark": "oklch(var(--primary-dark))",
        secondary: "oklch(var(--secondary))",
        "secondary-light": "oklch(var(--secondary-light))",
        "secondary-dark": "oklch(var(--secondary-dark))",
        border: "oklch(var(--border-color))",
        button: "oklch(var(--button-color))",
        "button-text": "oklch(var(--button-text))",
      },
      animation: {
        "fade-in": "fadeIn 0.1s ease",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      boxShadow: {
        custom: "1px 3px 5px 0px rgba(0,0,0,0.50)",
      },
    },
  },
  plugins: [forms],
};
