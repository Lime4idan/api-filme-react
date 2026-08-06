import { createGlobalStyle } from "styled-components";

export const theme = {
  colors: {
    bg: "#090b14",
    panel: "#101421",
    elevated: "#171c2c",
    primary: "#8b5cf6",
    primaryStrong: "#6d3df0",
    coral: "#ff4d67",
    text: "#f7f7fb",
    muted: "#9ba3b5",
    border: "rgba(255,255,255,.09)",
    success: "#41d6a3",
    warning: "#f9bf58",
    danger: "#ff657a",
  },
  shadow: "0 24px 70px rgba(0,0,0,.32)",
};

const GlobalStyles = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap");

  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    background:
      radial-gradient(circle at 80% -10%, rgba(139,92,246,.16), transparent 34rem),
      #090b14;
    color: ${({ theme }) => theme.colors.text};
    font-family: "DM Sans", system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    min-width: 320px;
  }
  body.modal-open { overflow: hidden; }
  h1, h2, h3, h4, p { margin-top: 0; }
  h1, h2, h3, h4 { font-family: "Manrope", sans-serif; letter-spacing: -.025em; }
  a { color: inherit; text-decoration: none; }
  button, input, textarea, select { font: inherit; }
  button { color: inherit; }
  img { display: block; max-width: 100%; }
  ul { list-style: none; padding: 0; margin: 0; }
  ::selection { background: rgba(139,92,246,.55); color: white; }
  :focus-visible { outline: 3px solid rgba(164,128,255,.9); outline-offset: 3px; }
  ::-webkit-scrollbar { width: 10px; height: 8px; }
  ::-webkit-scrollbar-track { background: #090b14; }
  ::-webkit-scrollbar-thumb { background: #34304f; border-radius: 999px; }
`;

export default GlobalStyles;
