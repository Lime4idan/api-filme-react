import { Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

const Wrap = styled.section`
  padding: 22px; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 18px; background: rgba(255,255,255,.035);
  .top { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
  h3 { margin: 0 0 5px; }
  p { margin: 0; color: ${({ theme }) => theme.colors.muted}; }
  .scores { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 18px; }
  .remove { border: 0; background: transparent; color: ${({ theme }) => theme.colors.danger}; cursor: pointer; }
`;

const ScoreButton = styled.button`
  width: 38px; height: 38px; border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $active, theme }) => $active ? theme.colors.primary : "rgba(255,255,255,.04)"};
  color: ${({ $active, theme }) => $active ? "white" : theme.colors.muted};
  cursor: pointer;
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
