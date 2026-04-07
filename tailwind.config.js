/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    "bg-foreground",
    "bg-sidebarActive",
    "bg-sidebarBg",
    "text-primary",
    "text-sidebarText",
    "text-mutedText",
    "border-sidebarBorder",
    "border-cardBorder",
    "bg-background",
    "bg-cardbg",
    "bg-badgeRejected",
    "text-closebtn",
    "text-navyDeep",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5ba3f5", // active nav, approve buttons, accent
        secondary: "#2d7dd6", // mid blue, bars, dots
        background: "#f0f4fa", // main page background
        cardbg: "#ffffff", // card / full-card background
        foreground: "#0a1628", // dark navy — sidebar bg, headings
        buttonbg: "#003388", // in-progress color, button hover
        closebtn: "#c0392b", // rejected / reject button

        // Extra dashboard tokens
        sidebarBg: "#0a1628", // sidebar background
        sidebarActive: "#0d2d5a", // active nav item bg
        sidebarText: "#4a6a9a", // inactive nav text
        sidebarBorder: "#1a2d4a", // sidebar dividers
        navyDeep: "#003388", // completed badge / darkest blue
        skyBlue: "#85c0ff", // lightest accent
        mutedText: "#7a9abf", // subtitles, muted labels
        cardBorder: "#d0dcf0", // card borders
        badgePending: "#e8f4ff", // pending badge bg
        badgePendingText: "#0066bb",
        badgeProgress: "#ddeeff", // in-progress badge bg
        badgeProgressText: "#0044aa",
        badgeDone: "#d8eeff", // completed badge bg
        badgeDoneText: "#003388",
        badgeRejected: "#fdecea", // rejected badge bg
        badgeRejectedText: "#c0392b",
      },
      fontFamily: {
        sans: ["Roboto", "ui-sans-serif", "system-ui"],
      },
      width: {
        74: "18.5rem",
      },
    },
  },
  plugins: [],
};
