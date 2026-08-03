import type { Config } from "tailwindcss";

// PRD §7.1 — 실제 CGV 앱 '더보기' 스크린샷 실측 토큰. 임의 색상 추가 금지.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "cgv-red": "#FF2949",
        "cgv-red-deep": "#FF164F",
        "cgv-grad-start": "#FF7553",
        "cgv-grad-end": "#FF406C",
        "cgv-black": "#121212",
        "cgv-bar-dark": "#454545",
        "cgv-gray-600": "#707070",
        "cgv-gray-400": "#B3B3B3",
        "cgv-gray-100": "#F4F4F4",
        "cgv-white": "#FFFFFF",
        "cgv-gold": "#F5C518",
      },
      fontFamily: {
        sans: ["Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
      },
      fontSize: {
        // PRD §7.2 타이포그래피
        h1: ["20px", { lineHeight: "28px", fontWeight: "700" }],
        h2: ["17px", { lineHeight: "24px", fontWeight: "700" }],
        body: ["15px", { lineHeight: "22px" }],
        sub: ["13px", { lineHeight: "18px" }],
        caption: ["11px", { lineHeight: "14px" }],
        "number-big": ["40px", { lineHeight: "48px", fontWeight: "800" }],
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
        sheet: "20px",
      },
      maxWidth: {
        mobile: "480px",
      },
      backgroundImage: {
        "cgv-grad": "linear-gradient(90deg, #FF7553 0%, #FF406C 100%)",
        "cgv-fab": "linear-gradient(180deg, #FF2949 0%, #FF164F 100%)",
      },
      keyframes: {
        "scan-line": {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(100%)" },
        },
        ripple: {
          "0%": { transform: "scale(0.6)", opacity: "0.7" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
      },
      animation: {
        "scan-line": "scan-line 1s ease-in-out infinite alternate",
        ripple: "ripple 1.8s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
