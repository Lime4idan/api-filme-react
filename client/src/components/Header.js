import { Menu, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../styles/ui";
import SearchBar from "./SearchBar";

const Bar = styled.header`
  position: fixed; z-index: 90; top: 0; right: 0; left: 250px; height: 76px; display: flex; align-items: center; gap: 20px; padding: 0 clamp(20px, 3.4vw, 56px);
  background: linear-gradient(to bottom, rgba(9,11,20,.98), rgba(9,11,20,.72)); backdrop-filter: blur(18px);
  .menu { display: none; border: 0; background: transparent; color: white; cursor: pointer; }
  .actions { margin-left: auto; display: flex; align-items: center; gap: 12px; }
  .profile { display: flex; align-items: center; gap: 10px; font-weight: 700; }
  .avatar { width: 37px; height: 37px; display: grid; place-items: center; border-radius: 50%; background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.coral}); overflow: hidden; }
  .avatar img { width: 100%; height: 100%; object-fit: cover; }
  @media (max-width: 920px) { left: 0; .menu { display: block; } .profile span { display: none; } }
  @media (max-width: 600px) { gap: 10px; padding: 0 14px; .actions .join { display: none; } }
`;

export default function Header({ onMenu }) {
  const { user } = useAuth();
  return <Bar><button className="menu" onClick={onMenu} aria-label="Abrir menu"><Menu /></button><SearchBar compact /><div className="actions">{user ? <Link className="profile" to="/perfil"><span>{user.name.split(" ")[0]}</span><span className="avatar">{user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : <UserRound size={18} />}</span></Link> : <><Button as={Link} $variant="ghost" to="/login">Entrar</Button><Button as={Link} className="join" to="/cadastro">Criar conta</Button></>}</div></Bar>;
}
