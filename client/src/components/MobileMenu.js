import { LogOut, UserRound, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import GenreMenu from "./GenreMenu";
import { mainLinks } from "./Sidebar";

const Overlay = styled.div`
  display: none;
  @media (max-width: 920px) {
    display: block; position: fixed; z-index: 200; inset: 0; background: rgba(2,4,10,.7); backdrop-filter: blur(8px);
    .drawer { width: min(340px, 88vw); height: 100%; overflow-y: auto; padding: 22px; background: #0f1320; box-shadow: 30px 0 80px rgba(0,0,0,.5); }
    .top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    h2 { margin: 0; }
    button { border: 0; background: transparent; color: white; cursor: pointer; }
    nav { display: grid; gap: 5px; }
    nav > a { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 11px; color: ${({ theme }) => theme.colors.muted}; }
    nav > a.active { color: white; background: rgba(139,92,246,.17); }
  }
`;

export default function MobileMenu({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return <Overlay onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="drawer" role="dialog" aria-modal="true" aria-label="Menu"><div className="top"><h2>MovieHub</h2><button onClick={onClose} aria-label="Fechar menu"><X /></button></div><nav>{mainLinks.map(([to, label, Icon, end]) => <NavLink key={to} to={to} end={end} onClick={onClose}><Icon size={18} />{label}</NavLink>)}{user && <NavLink to="/perfil" onClick={onClose}><UserRound size={18} />Perfil</NavLink>}<GenreMenu onNavigate={onClose} />{user && <button onClick={async () => { await logout(); onClose(); navigate("/"); }}><LogOut size={18} /> Sair</button>}</nav></div></Overlay>;
}
