import { CalendarDays, Heart, Home, ListVideo, Shield, Sparkles, Star } from "lucide-react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import Brand from "./Brand";
import GenreMenu from "./GenreMenu";

const Aside = styled.aside`
  position: fixed; z-index: 100; inset: 0 auto 0 0; width: 232px; padding: 25px 15px 18px; overflow-y: auto;
  background: linear-gradient(180deg, rgba(12,13,17,.98), rgba(7,8,10,.98)); border-right: 1px solid rgba(255,255,255,.07); backdrop-filter: blur(24px);
  .brand { margin: 0 9px 31px; }
  .section-label { color: #5f6571; font-size: .66rem; text-transform: uppercase; letter-spacing: .18em; font-weight: 800; padding: 0 13px 9px; }
  nav { display: grid; gap: 4px; }
  nav > a { position: relative; display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 0 13px; color: #858b98; border-radius: 12px; font-weight: 600; font-size: .88rem; transition: color .2s ease, background .2s ease, transform .2s ease; }
  nav > a:hover { color: white; background: rgba(255,255,255,.055); transform: translateX(2px); }
  nav > a.active { color: white; background: linear-gradient(90deg, rgba(255,54,94,.18), rgba(255,54,94,.035)); }
  nav > a.active::before { content: ""; position: absolute; left: 0; width: 3px; height: 20px; border-radius: 99px; background: ${({ theme }) => theme.colors.primary}; box-shadow: 0 0 18px rgba(255,54,94,.7); }
  nav > a.active svg { color: ${({ theme }) => theme.colors.primary}; }
  .footer { margin-top: 24px; padding: 17px 14px; border: 1px solid rgba(255,255,255,.07); border-radius: 17px; background: linear-gradient(145deg,rgba(255,54,94,.1),rgba(145,130,255,.05)); }
  .footer strong { display: block; font-size: .82rem; margin-bottom: 5px; }
  .footer span { color: ${({ theme }) => theme.colors.muted}; font-size: .72rem; line-height: 1.5; }
  @media (max-width: 920px) { display: none; }
`;

export const mainLinks = [
  ["/", "Home", Home, true], ["/melhores-avaliados", "Top rated", Star],
  ["/lancamentos", "Upcoming", Sparkles], ["/em-cartaz", "Now playing", CalendarDays],
  ["/minha-lista", "Favorites", Heart], ["/listas", "My lists", ListVideo],
];

export default function Sidebar() {
  const { user } = useAuth();
  return <Aside><Brand className="brand" /><nav aria-label="Main navigation"><span className="section-label">Discover</span>{mainLinks.slice(0, 4).map(([to, label, Icon, end]) => <NavLink key={to} to={to} end={end}><Icon size={18} />{label}</NavLink>)}<span className="section-label" style={{ marginTop: 17 }}>Library</span>{mainLinks.slice(4).map(([to, label, Icon, end]) => <NavLink key={to} to={to} end={end}><Icon size={18} />{label}</NavLink>)}{user?.role === "ADMIN" && <NavLink to="/admin"><Shield size={18} />Administration</NavLink>}<GenreMenu /></nav><div className="footer"><strong>Your world of cinema</strong><span>Save, rate, and share stories worth remembering.</span></div></Aside>;
}
