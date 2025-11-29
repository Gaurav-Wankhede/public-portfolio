declare module 'tailwindcss/lib/util/flattenColorPalette' {
  const flattenColorPalette: (theme: any) => any;
  export default flattenColorPalette;
}

declare module 'tailwindcss' {
  interface Theme {
    extend: {
      colors: {
        foreground: string;
        background: string;
        primary: {
          DEFAULT: string;
          foreground: string;
        };
        secondary: {
          DEFAULT: string;
          foreground: string;
        };
        muted: {
          DEFAULT: string;
          foreground: string;
        };
      };
    };
  }
} 