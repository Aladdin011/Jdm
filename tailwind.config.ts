import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Enhanced Architectural Palette with Better Accessibility
        "arch-orange": "#EE690B",
        "arch-orange-light": "#FF8A3D", // Lighter variant for better contrast
        "arch-orange-dark": "#CC5500",  // Darker variant for better contrast
        "arch-rust": "#83371D",
        "arch-rust-light": "#A0472A",  // Better contrast on dark backgrounds
        "arch-brown": "#4B332E",
        "arch-brown-light": "#6B4A42", // Improved readability
        "arch-charcoal": "#0B1014",
        "arch-charcoal-light": "#1A2128", // Better layering
        "arch-blue-gray": "#2E3E4B",
        "arch-blue-gray-light": "#4A5A6B", // Enhanced contrast
        "arch-light-blue": "#BBD3EB",
        "arch-light-blue-dark": "#9BC2E0", // Better on light backgrounds

        // Enhanced Status Colors for Better Accessibility
        "success": {
          DEFAULT: "#10B981", // Emerald-500 - WCAG AA compliant
          light: "#34D399",   // Emerald-400
          dark: "#059669",    // Emerald-600
          bg: "#ECFDF5",      // Emerald-50
        },
        "warning": {
          DEFAULT: "#F59E0B", // Amber-500 - WCAG AA compliant
          light: "#FBBF24",   // Amber-400
          dark: "#D97706",    // Amber-600
          bg: "#FFFBEB",      // Amber-50
        },
        "error": {
          DEFAULT: "#EF4444", // Red-500 - WCAG AA compliant
          light: "#F87171",   // Red-400
          dark: "#DC2626",    // Red-600
          bg: "#FEF2F2",      // Red-50
        },
        "info": {
          DEFAULT: "#3B82F6", // Blue-500 - WCAG AA compliant
          light: "#60A5FA",   // Blue-400
          dark: "#2563EB",    // Blue-600
          bg: "#EFF6FF",      // Blue-50
        },

        // Glass Morphism Enhancement Colors
        "glass": {
          "white": "rgba(255, 255, 255, 0.1)",
          "white-strong": "rgba(255, 255, 255, 0.15)",
          "black": "rgba(0, 0, 0, 0.1)",
          "black-strong": "rgba(0, 0, 0, 0.2)",
          "border": "rgba(255, 255, 255, 0.2)",
          "border-strong": "rgba(255, 255, 255, 0.3)",
        },

        // Premium Navigation
        "nav-text": "var(--nav-text)",
        "nav-hover": "var(--nav-hover)",
        "nav-accent": "var(--nav-accent)",
        "header-bg": "var(--header-bg)",
        "header-blur": "var(--header-blur)",
        "dropdown-bg": "var(--dropdown-bg)",
        border: "var(--border)",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "40px",
        "3xl": "64px",
      },
      spacing: {
        "18": "4.5rem",
        "72": "18rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
