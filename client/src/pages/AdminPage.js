import { Heart, ListVideo, MessageSquareText, Shield, Star, Trash2, UserRound, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import ConfirmModal from "../components/ConfirmModal";
import ErrorState from "../components/ErrorState";
import { useToast } from "../hooks/useToast";
import api from "../services/api";
import { Button, Eyebrow, Page, PageHeader, Panel } from "../styles/ui";
import { formatDate } from "../utils/movie";

const Stats = styled.div`
  display: grid; grid-template-columns: repeat(5,1fr); gap: 13px; margin-bottom: 28px;
  .stat { padding: 18px; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 16px; background: rgba(255,255,255,.035); }
  .stat svg { color: ${({ theme }) => theme.colors.primary}; }
  .stat strong { display: block; font-size: 1.8rem; margin-top: 10px; }
  .stat span { color: ${({ theme }) => theme.colors.muted}; font-size: .82rem; }
  @media (max-width: 900px) { grid-template-columns: repeat(2,1fr); }
`;
const Columns = styled.div`
  display: grid; grid-template-columns: 1.1fr .9fr; gap: 22px;
  h2 { display: flex; align-items: center; gap: 8px; }
  .row { display: flex; justify-content: space-between; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid ${({ theme }) => theme.colors.border}; }
  .row:last-child { border: 0; }
  .row p { margin: 4px 0 0; color: ${({ theme }) => theme.colors.muted}; font-size: .86rem; }
  .comment { max-width: 470px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .status { border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 999px; background: transparent; color: ${({ theme }) => theme.colors.muted}; padding: 7px 10px; cursor: pointer; }
  .status.active { color: ${({ theme }) => theme.colors.success}; }
  @media (max-width: 1050px) { grid-template-columns: 1fr; }
`;

export default function AdminPage() {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(null);
  const load = () => api.get("/admin/dashboard").then(({ data: result }) => setData(result)).catch((err) => setError(err.message));
  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (error) return <Page><ErrorState message={error} retry={load} /></Page>;
  if (!data) return <Page><p>Carregando painel...</p></Page>;
  const statItems = [["users", "Usuários", UsersRound], ["comments", "Comentários", MessageSquareText], ["lists", "Listas", ListVideo], ["favorites", "Favoritos", Heart], ["ratings", "Avaliações", Star]];
  const remove = async () => { try { await api.delete(`/admin/comments/${pending.id}`); setData((current) => ({ ...current, totals: { ...current.totals, comments: current.totals.comments - 1 }, recentComments: current.recentComments.filter((item) => item.id !== pending.id) })); toast.success("Comentário removido"); } catch (err) { toast.error(err.message); } finally { setPending(null); } };
  const toggleUser = async (user) => { try { const { data: result } = await api.put(`/admin/users/${user.id}/status`, { isActive: !user.isActive }); setData((current) => ({ ...current, recentUsers: current.recentUsers.map((item) => item.id === user.id ? { ...item, isActive: result.user.isActive } : item) })); toast.success(result.user.isActive ? "Usuário reativado" : "Usuário desativado"); } catch (err) { toast.error(err.message); } };
  return <Page><PageHeader><div><Eyebrow>Operação MovieHub</Eyebrow><h1>Painel administrativo</h1><p>Indicadores essenciais e ferramentas leves para manter a comunidade saudável.</p></div><Shield size={36} /></PageHeader><Stats>{statItems.map(([key,label,Icon]) => <div className="stat" key={key}><Icon size={20} /><strong>{data.totals[key]}</strong><span>{label}</span></div>)}</Stats><Columns><Panel><h2><MessageSquareText size={20} /> Comentários recentes</h2>{data.recentComments.map((comment) => <div className="row" key={comment.id}><div><strong>{comment.user.name}</strong><p className="comment">{comment.content}</p><p>Filme #{comment.tmdbMovieId} · {formatDate(comment.createdAt)}</p></div><Button $variant="ghost" onClick={() => setPending(comment)} aria-label="Excluir comentário"><Trash2 size={16} /></Button></div>)}</Panel><Panel><h2><UserRound size={20} /> Usuários recentes</h2>{data.recentUsers.map((user) => <div className="row" key={user.id}><div><strong>{user.name}</strong><p>{user.email} · {user.role}</p></div><button className={`status ${user.isActive ? "active" : ""}`} onClick={() => toggleUser(user)}>{user.isActive ? "Ativo" : "Desativado"}</button></div>)}</Panel></Columns>{pending && <ConfirmModal title="Remover comentário?" message="A moderação excluirá permanentemente este comentário e suas curtidas." confirmLabel="Remover" onConfirm={remove} onClose={() => setPending(null)} />}</Page>;
}
