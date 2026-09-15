/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#011659",
        secondary: "#FF5F15",
        blueLight: "#95A7CA",
        background: "#F3F3F5",
      },

      fontSize: {
        hero: ["56px", {
          lineHeight: "72px",
          fontWeight: "800",
        }],

        h1: ["36px", {
          lineHeight: "44px",
          fontWeight: "700",
        }],

        h2: ["24px", {
          lineHeight: "32px",
          fontWeight: "600",
        }],

        h3: ["18px", {
          lineHeight: "28px",
          fontWeight: "600",
        }],

        body: ["16px", {
          lineHeight: "24px",
          fontWeight: "400",
        }],

        button: ["16px", {
          lineHeight: "24px",
          fontWeight: "600",
        }],

        label: ["14px", {
          lineHeight: "20px",
          fontWeight: "500",
        }],

        caption: ["12px", {
          lineHeight: "16px",
          fontWeight: "500",
        }],
      },
    },
  },

  plugins: [],
};