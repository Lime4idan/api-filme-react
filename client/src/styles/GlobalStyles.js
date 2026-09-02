import { createGlobalStyle } from "styled-components";

export const theme = {
  colors: {
    bg: "#060709",
    panel: "#0d0f13",
    elevated: "#14171d",
    primary: "#ff365e",
    primaryStrong: "#d91849",
    coral: "#ff6a47",
    accent: "#ffb35c",
    violet: "#9182ff",
    text: "#f7f5f2",
    muted: "#9298a6",
    border: "rgba(255,255,255,.095)",
    success: "#48d6a0",
    warning: "#ffbd5b",
    danger: "#ff5670",
  },
  shadow: "0 28px 90px rgba(0,0,0,.48)",
};

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; color-scheme: dark; }
  body {
    margin: 0;
    background:
      radial-gradient(circle at 88% -12%, rgba(255,54,94,.11), transparent 32rem),
      radial-gradient(circle at 12% 30%, rgba(145,130,255,.055), transparent 30rem),
      #060709;
    color: ${({ theme }) => theme.colors.text};
    font-family: "DM Sans", system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    min-width: 320px;
    overflow-x: hidden;
  }
  body::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    opacity: .035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.8'/%3E%3C/svg%3E");
  }
  body.modal-open { overflow: hidden; }
  h1, h2, h3, h4, p { margin-top: 0; }
  h1, h2, h3, h4 { font-family: "Manrope", sans-serif; letter-spacing: -.04em; }
  a { color: inherit; text-decoration: none !important; }
  button, input, textarea, select { font: inherit; }
  button { color: inherit; }
  img { display: block; max-width: 100%; }
  ul { list-style: none; padding: 0; margin: 0; }
  ::selection { background: rgba(255,54,94,.65); color: white; }
  :focus-visible { outline: 3px solid rgba(255,106,71,.9); outline-offset: 3px; }
  ::-webkit-scrollbar { width: 10px; height: 8px; }
  ::-webkit-scrollbar-track { background: #060709; }
  ::-webkit-scrollbar-thumb { background: #2d3038; border-radius: 999px; border: 2px solid #060709; }
  ::-webkit-scrollbar-thumb:hover { background: #454a55; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    to { background-position-x: -200%; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  }
`;

export default GlobalStyles;
