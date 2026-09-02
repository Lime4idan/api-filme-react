import { Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

const Wrap = styled.section`
  padding: 24px; border: 1px solid rgba(255,183,92,.14); border-radius: 21px; background: radial-gradient(circle at 100% 0,rgba(255,183,92,.1),transparent 15rem),linear-gradient(145deg,rgba(20,22,27,.94),rgba(10,12,15,.96)); box-shadow: 0 22px 65px rgba(0,0,0,.24);
  .top { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
  h3 { margin: 0 0 5px; }
  p { margin: 0; color: ${({ theme }) => theme.colors.muted}; }
  .scores { display: grid; grid-template-columns: repeat(5,1fr); gap: 7px; margin-top: 20px; }
  .remove { border: 0; background: transparent; color: ${({ theme }) => theme.colors.danger}; cursor: pointer; }
`;

const ScoreButton = styled.button`
  min-width: 0; height: 39px; border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $active, theme }) => $active ? `linear-gradient(135deg,${theme.colors.coral},${theme.colors.primary})` : "rgba(255,255,255,.04)"};
  color: ${({ $active, theme }) => $active ? "white" : theme.colors.muted};
  cursor: pointer; transition: transform .18s ease, background .18s ease;
  &:hover { transform: translateY(-2px); background: ${({ $active, theme }) => $active ? theme.colors.primary : "rgba(255,255,255,.09)"}; }
`;

export default function RatingSelector({ movieId }) {
  const { user } = useAuth();
  const toast = useToast();
  const [mine, setMine] = useState(null);
  const [stats, setStats] = useState({ average: 0, count: 0 });
  useEffect(() => {
    api.get(`/movies/${movieId}/ratings`).then(({ data }) => setStats(data)).catch(() => {});
    if (user) api.get(`/movies/${movieId}/my-rating`).then(({ data }) => setMine(data.rating?.score || null)).catch(() => {});
    else setMine(null);
  }, [movieId, user]);
  const rate = async (score) => {
    try { const { data } = await api.post(`/movies/${movieId}/rating`, { score }); setMine(score); setStats({ average: data.average, count: data.count }); toast.success(`Sua nota ${score} foi salva`); } catch (error) { toast.error(error.message); }
  };
  const remove = async () => {
    try { await api.delete(`/movies/${movieId}/rating`); setMine(null); const { data } = await api.get(`/movies/${movieId}/ratings`); setStats(data); toast.success("Avaliação removida"); } catch (error) { toast.error(error.message); }
  };
  return <Wrap><div className="top"><div><h3><Star size={18} fill="#f8c65c" color="#f8c65c" /> Comunidade MovieHub</h3><p>{stats.count ? `${Number(stats.average).toFixed(1)}/10 · ${stats.count} ${stats.count === 1 ? "avaliação" : "avaliações"}` : "Seja a primeira pessoa a avaliar"}</p></div>{mine && <button className="remove" onClick={remove} aria-label="Remover minha avaliação"><Trash2 size={18} /></button>}</div>{user ? <div className="scores" aria-label="Escolha sua nota">{Array.from({ length: 10 }, (_, index) => index + 1).map((score) => <ScoreButton key={score} $active={mine === score} onClick={() => rate(score)} aria-pressed={mine === score} aria-label={`Dar nota ${score}`}>{score}</ScoreButton>)}</div> : <p style={{ marginTop: 16 }}>Entre na sua conta para dar uma nota.</p>}</Wrap>;
}
