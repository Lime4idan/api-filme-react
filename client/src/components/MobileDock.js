import { Heart, Home, ListVideo, Search, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const Dock = styled.nav`
  display: none;
  @media (max-width: 700px) {
    position: fixed;
    z-index: 150;
    right: 12px;
    bottom: 11px;
    left: 12px;
    display: grid;
    grid-template-columns: repeat(5,1fr);
    min-height: 66px;
    padding: 7px;
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 21px;
    background: rgba(11,12,15,.9);
    box-shadow: 0 18px 55px rgba(0,0,0,.5);
    backdrop-filter: blur(24px) saturate(140%);

    a { position: relative; display: grid; place-items: center; align-content: center; gap: 4px; min-width: 0; border-radius: 15px; color: #727985; font-size: .61rem; font-weight: 700; }
    a.active { color: white; background: rgba(255,255,255,.06); }
    a.active svg { color: ${({ theme }) => theme.colors.primary}; filter: drop-shadow(0 0 9px rgba(255,54,94,.5)); }
  }
`;

const links = [
  ["/", "Início", Home, true],
  ["/pesquisa", "Buscar", Search],
  ["/minha-lista", "Favoritos", Heart],
  ["/listas", "Listas", ListVideo],
  ["/perfil", "Perfil", UserRound],
];

export default function MobileDock() {
  return <Dock aria-label="Navegação rápida">{links.map(([to, label, Icon, end]) => <NavLink key={to} to={to} end={end}><Icon size={20} /><span>{label}</span></NavLink>)}</Dock>;
}
