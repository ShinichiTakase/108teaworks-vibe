import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tea: {
          deep: "#1e3c1a",
          DEFAULT: "#2d5016",
          light: "#4a7c23",
        },
        washi: "#f5f2eb",
        cream: "#faf8f5",
        ink: {
          DEFAULT: "#1a1a1a",
          muted: "#4a4a4a",
        },
        accent: "#6b5344",
        border: "#e5e0d8",
        footer: {
          top: "#FBF3E5",
          middle: "#F0E6DC",
        },
      },
      fontFamily: {
        // システムフォントのみ使用（外部フォント読み込みなし）
        heading: ["Yu Mincho", "YuMincho", "Hiragino Mincho ProN", "Hiragino Serif", "Noto Serif JP", "serif"],
        body: ["Yu Mincho", "YuMincho", "Hiragino Mincho ProN", "Hiragino Serif", "Noto Serif JP", "serif"],
      },
      maxWidth: {
        content: "720px",
        wide: "1200px",
      },
      animation: {
        marquee: "marquee 28s linear infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
