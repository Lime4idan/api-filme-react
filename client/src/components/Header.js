import { ChevronDown, Menu, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../styles/ui";
import Brand from "./Brand";
import SearchBar from "./SearchBar";

const Bar = styled.header`
  position: fixed;
  z-index: 90;
  top: 0;
  right: 0;
  left: 232px;
  height: 88px;
  display: flex;
  align-items: center;
  padding: 12px clamp(22px, 3.3vw, 56px);
  pointer-events: none;

  .inner {
    width: 100%;
    height: 64px;
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 0 10px 0 18px;
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 19px;
    background: rgba(9,10,13,.76);
    box-shadow: 0 18px 55px rgba(0,0,0,.28);
    backdrop-filter: blur(24px) saturate(145%);
    pointer-events: auto;
  }

  .menu { display: none; border: 0; background: transparent; color: white; cursor: pointer; }
  .mobile-brand { display: none; }
  .actions { margin-left: auto; display: flex; flex: 0 0 auto; align-items: center; gap: 10px; }
  .profile { display: flex; align-items: center; gap: 10px; padding: 5px 8px 5px 5px; border-radius: 999px; font-weight: 700; transition: background .2s ease; }
  .profile:hover { background: rgba(255,255,255,.07); }
  .profile-name { max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .avatar { width: 38px; height: 38px; display: grid; place-items: center; border: 1px solid rgba(255,255,255,.16); border-radius: 50%; background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.coral}); overflow: hidden; }
  .avatar img { width: 100%; height: 100%; object-fit: cover; }
  .chevron { color: ${({ theme }) => theme.colors.muted}; }

  @media (max-width: 920px) {
    left: 0;
    padding: 10px 14px;
    .inner { padding-left: 12px; gap: 12px; }
    .menu, .mobile-brand { display: grid; place-items: center; }
    .mobile-brand { margin-right: 2px; }
    .profile-name, .chevron { display: none; }
  }
  @media (min-width: 921px) and (max-width: 1180px) { .actions .join { display: none; } }
  @media (max-width: 640px) {
    .mobile-brand { display: none; }
    .actions .join { display: none; }
  }
`;

export default function Header({ onMenu }) {
  const { user } = useAuth();
  return <Bar><div className="inner"><button className="menu" onClick={onMenu} aria-label="Open menu"><Menu /></button><Brand className="mobile-brand" compact /><SearchBar compact /><div className="actions">{user ? <Link className="profile" to="/perfil"><span className="avatar">{user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : <UserRound size={18} />}</span><span className="profile-name">{user.name.split(" ")[0]}</span><ChevronDown className="chevron" size={15} /></Link> : <><Button as={Link} $variant="ghost" to="/login">Sign in</Button><Button as={Link} className="join" to="/cadastro">Get started</Button></>}</div></div></Bar>;
}
