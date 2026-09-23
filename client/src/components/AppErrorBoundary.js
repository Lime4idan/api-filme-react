import { Component } from "react";
import styled from "styled-components";
import { Button } from "../styles/ui";
import Brand from "./Brand";

const Screen = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 28px;
  background:
    radial-gradient(circle at 50% 0, rgba(255,54,94,.16), transparent 34rem),
    ${({ theme }) => theme.colors.bg};
`;

const Card = styled.section`
  width: min(560px, 100%);
  padding: clamp(30px, 6vw, 54px);
  text-align: center;
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 28px;
  background: rgba(13,15,19,.92);
  box-shadow: ${({ theme }) => theme.shadow};

  > a { justify-content: center; margin-bottom: 34px; }
  .code { color: ${({ theme }) => theme.colors.primary}; font-size: .7rem; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; }
  h1 { margin: 10px 0 14px; font-size: clamp(2rem, 6vw, 3.6rem); line-height: .98; }
  p { margin: 0 auto 26px; max-width: 420px; color: ${({ theme }) => theme.colors.muted}; line-height: 1.65; }
`;

export default class AppErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    if (process.env.NODE_ENV !== "production") console.error("Falha ao renderizar o MovieHub", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return <Screen><Card role="alert"><Brand /><span className="code">Startup error</span><h1>This session went off script.</h1><p>MovieHub encountered an unexpected problem. Reload the application to begin a new session.</p><Button onClick={() => window.location.reload()}>Reload MovieHub</Button></Card></Screen>;
  }
}
