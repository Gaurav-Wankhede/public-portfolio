/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // 8px Grid Spacing System
      spacing: {
        0: "0",
        0.5: "4px",
        1: "8px",
        1.5: "12px",
        2: "16px",
        2.5: "20px",
        3: "24px",
        3.5: "28px",
        4: "32px",
        5: "40px",
        6: "48px",
        7: "56px",
        8: "64px",
        9: "72px",
        10: "80px",
        11: "88px",
        12: "96px",
        14: "112px",
        16: "128px",
        20: "160px",
        24: "192px",
        28: "224px",
        32: "256px",
        36: "288px",
        40: "320px",
        44: "352px",
        48: "384px",
        52: "416px",
        56: "448px",
        60: "480px",
        64: "512px",
        72: "576px",
        80: "640px",
        96: "768px",
      },

      // Fluid Typography
      fontSize: {
        // Display sizes
        "display-xl": "clamp(3rem, 5vw + 1rem, 6rem)",
        "display-lg": "clamp(2.5rem, 4vw + 1rem, 5rem)",
        "display-md": "clamp(2rem, 3.5vw + 1rem, 4rem)",
        "display-sm": "clamp(1.75rem, 3vw + 1rem, 3.5rem)",

        // Heading sizes
        h1: "clamp(2rem, 2.5vw + 1rem, 3rem)",
        h2: "clamp(1.75rem, 2vw + 1rem, 2.5rem)",
        h3: "clamp(1.5rem, 1.5vw + 1rem, 2rem)",
        h4: "clamp(1.25rem, 1vw + 1rem, 1.75rem)",
        h5: "clamp(1.125rem, 0.5vw + 1rem, 1.5rem)",
        h6: "clamp(1rem, 0.25vw + 1rem, 1.25rem)",

        // Body sizes
        "body-xl": "clamp(1.125rem, 0.5vw + 1rem, 1.25rem)",
        "body-lg": "clamp(1rem, 0.25vw + 0.9rem, 1.125rem)",
      },

      // Border Radius (8px grid)
      borderRadius: {
        none: "0",
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
        "3xl": "48px",
        full: "9999px",
      },

      // Line Heights
      lineHeight: {
        none: "1",
        tight: "1.25",
        snug: "1.375",
        normal: "1.5",
        relaxed: "1.625",
        loose: "2",
      },

      // Letter Spacing
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0em",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
      },

      // Colors (from existing shadcn config)
      colors: {
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
        chart: Object.fromEntries(
          Array.from({ length: 5 }, (_, i) => [
            i + 1,
            `hsl(var(--chart-${i + 1}))`,
          ]),
        ),
        // Additional color palette
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
        blue: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        green: {
          400: "#4ade80",
          600: "#16a34a",
        },
        red: {
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
        },
        yellow: {
          400: "#facc15",
          600: "#ca8a04",
        },
        purple: {
          400: "#c084fc",
          600: "#9333ea",
        },
      },

      // Animation
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in": "slideIn 0.4s ease-out",
        spin: "spin 1s linear infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },

      // Box Shadow
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        none: "none",
      },
    },
  },
  plugins: [],
};
