import { CalendarDays, ListVideo, MessageSquareText, Star, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import ErrorState from "../components/ErrorState";
import api from "../services/api";
import { Eyebrow, Page, PageHeader, Panel } from "../styles/ui";
import { formatDate } from "../utils/movie";

const Profile = styled.div`
  display: grid; grid-template-columns: 270px 1fr; gap: 24px;
  .identity { text-align: center; }
  .avatar { width: 100px; height: 100px; margin: 0 auto 16px; display: grid; place-items: center; overflow: hidden; border-radius: 50%; background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.coral}); }
  .avatar img { width: 100%; height: 100%; object-fit: cover; }
  .muted { color: ${({ theme }) => theme.colors.muted}; }
  .stats { display: flex; justify-content: center; gap: 16px; margin-top: 18px; }
  .stats span { display: grid; gap: 4px; }
  .lists { display: grid; gap: 12px; }
  .list { display: flex; justify-content: space-between; gap: 20px; padding: 17px; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 14px; background: rgba(255,255,255,.03); }
  .list h3 { margin-bottom: 5px; }
  .list p { color: ${({ theme }) => theme.colors.muted}; margin: 0; }
  @media (max-width: 760px) { grid-template-columns: 1fr; }
`;

export default function PublicProfilePage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { api.get(`/users/${id}`).then(({ data: result }) => setData(result)).catch((err) => setError(err.message)); }, [id]);
  if (error) return <Page><ErrorState message={error} /></Page>;
  if (!data) return <Page><p>Carregando perfil...</p></Page>;
  const { user, lists } = data;
  return <Page><PageHeader><div><Eyebrow>Perfil da comunidade</Eyebrow><h1>{user.name}</h1><p>Curadoria pública e participação no MovieHub.</p></div></PageHeader><Profile><Panel className="identity"><div className="avatar">{user.avatarUrl ? <img src={user.avatarUrl} alt={`Avatar de ${user.name}`} /> : <UserRound size={38} />}</div><h2>{user.name}</h2><p className="muted">{user.bio || "Apaixonado por boas histórias."}</p><p className="muted"><CalendarDays size={14} /> Desde {formatDate(user.createdAt)}</p><div className="stats"><span><ListVideo size={17} />{user.stats?.lists || 0}</span><span><MessageSquareText size={17} />{user.stats?.comments || 0}</span><span><Star size={17} />{user.stats?.ratings || 0}</span></div></Panel><div><h2>Listas públicas</h2><div className="lists">{lists.map((list) => <Link className="list" key={list.id} to={`/lista/${list.shareCode}`}><div><h3>{list.name}</h3><p>{list.description || "Lista pública"}</p></div><strong>{list._count.items} filmes</strong></Link>)}</div></div></Profile></Page>;
}
