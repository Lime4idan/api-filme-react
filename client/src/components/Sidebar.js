import { CalendarDays, Clapperboard, Heart, Home, ListVideo, Shield, Sparkles, Star } from "lucide-react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import GenreMenu from "./GenreMenu";

const Aside = styled.aside`
  position: fixed; z-index: 100; inset: 0 auto 0 0; width: 250px; padding: 28px 18px; overflow-y: auto;
  background: rgba(12,15,25,.96); border-right: 1px solid ${({ theme }) => theme.colors.border}; backdrop-filter: blur(24px);
  .brand { display: flex; align-items: center; gap: 10px; padding: 0 10px 24px; font: 800 1.38rem "Manrope"; }
  .brand-mark { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 12px; background: linear-gradient(135deg, ${({ theme }) => theme.colors.coral}, ${({ theme }) => theme.colors.primary}); box-shadow: 0 10px 24px rgba(139,92,246,.3); }
  .brand span:last-child { color: ${({ theme }) => theme.colors.primary}; }
  nav { display: grid; gap: 5px; }
  nav > a { display: flex; align-items: center; gap: 12px; min-height: 43px; padding: 0 13px; color: #929bad; border-radius: 11px; font-weight: 600; font-size: .9rem; }
  nav > a:hover, nav > a.active { color: white; background: rgba(139,92,246,.14); }
  nav > a.active { box-shadow: inset 3px 0 ${({ theme }) => theme.colors.primary}; }
  @media (max-width: 920px) { display: none; }
`;

export const mainLinks = [
  ["/", "Início", Home, true], ["/melhores-avaliados", "Melhores avaliados", Star],
  ["/lancamentos", "Lançamentos", Sparkles], ["/em-cartaz", "Em cartaz", CalendarDays],
  ["/minha-lista", "Favoritos", Heart], ["/listas", "Minhas listas", ListVideo],
];

export default function Sidebar() {
  const { user } = useAuth();
  return <Aside><NavLink className="brand" to="/"><span className="brand-mark"><Clapperboard size={20} /></span><span>Movie<span>Hub</span></span></NavLink><nav aria-label="Navegação principal">{mainLinks.map(([to, label, Icon, end]) => <NavLink key={to} to={to} end={end}><Icon size={18} />{label}</NavLink>)}{user?.role === "ADMIN" && <NavLink to="/admin"><Shield size={18} />Administração</NavLink>}<GenreMenu /></nav></Aside>;
}
