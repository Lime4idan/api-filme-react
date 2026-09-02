import { useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "./Header";
import MobileMenu from "./MobileMenu";
import MobileDock from "./MobileDock";
import Sidebar from "./Sidebar";

const Content = styled.div`
  position: relative;
  margin-left: 232px;
  padding-top: 88px;
  min-height: 100vh;
  &::before { content: ""; position: fixed; inset: 0 0 0 232px; pointer-events: none; background: radial-gradient(circle at 82% 12%, rgba(255,54,94,.07), transparent 25rem); }
  @media (max-width: 920px) { margin-left: 0; padding-top: 0; &::before { inset: 0; } }
`;

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <><Sidebar /><Header onMenu={() => setMenuOpen(true)} />{menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}<Content><Outlet /></Content><MobileDock /></>;
}
