import { useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "./Header";
import MobileMenu from "./MobileMenu";
import Sidebar from "./Sidebar";

const Content = styled.div`
  margin-left: 250px;
  padding-top: 76px;
  min-height: 100vh;
  @media (max-width: 920px) { margin-left: 0; padding-top: 0; }
`;

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <><Sidebar /><Header onMenu={() => setMenuOpen(true)} />{menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}<Content><Outlet /></Content></>;
}
