import { MessageSquareText, Send } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { Button } from "../styles/ui";
import CommentCard from "./CommentCard";
import ConfirmModal from "./ConfirmModal";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import Pagination from "./Pagination";

const Section = styled.section`
  margin-top: 46px;
  .title { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
  .title h2 { margin: 0; }
  form { display: grid; gap: 10px; padding: 18px; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 16px; background: rgba(255,255,255,.03); }
  textarea { width: 100%; min-height: 100px; padding: 13px; border: 0; background: transparent; color: white; resize: vertical; outline: none; }
  .form-bottom { display: flex; align-items: center; justify-content: space-between; gap: 12px; color: ${({ theme }) => theme.colors.muted}; font-size: .82rem; }
  .signin { padding: 18px; border-radius: 14px; background: rgba(139,92,246,.09); color: ${({ theme }) => theme.colors.muted}; }
`;

export default function CommentSection({ movieId }) {
  const { user } = useAuth();
  const toast = useToast();
  const [comments, setComments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const load = useCallback(async (page = 1) => {
    try { setError(""); const { data } = await api.get(`/movies/${movieId}/comments`, { params: { page } }); setComments(data.comments); setPagination(data.pagination); }
    catch (err) { setError(err.message); }
  }, [movieId]);
  useEffect(() => { load(); }, [load, user]);
  const submit = async (event) => {
    event.preventDefault(); if (!content.trim()) return;
    try { const { data } = await api.post(`/movies/${movieId}/comments`, { content }); setComments((items) => [data.comment, ...items]); setContent(""); toast.success("Comentário publicado"); }
    catch (err) { toast.error(err.message); }
  };
  const like = async (comment) => {
    if (!user) { toast.error("Entre na sua conta para curtir comentários"); return; }
    try { const { data } = comment.likedByMe ? await api.delete(`/comments/${comment.id}/like`) : await api.post(`/comments/${comment.id}/like`); setComments((items) => items.map((item) => item.id === comment.id ? { ...item, likedByMe: data.liked, likeCount: data.likeCount } : item)); } catch (err) { toast.error(err.message); }
  };
  const edit = async (id, nextContent) => {
    try { const { data } = await api.put(`/comments/${id}`, { content: nextContent }); setComments((items) => items.map((item) => item.id === id ? data.comment : item)); toast.success("Comentário atualizado"); } catch (err) { toast.error(err.message); }
  };
  const remove = async () => {
    try { await api.delete(`/comments/${pendingDelete.id}`); setComments((items) => items.filter((item) => item.id !== pendingDelete.id)); toast.success("Comentário excluído"); } catch (err) { toast.error(err.message); } finally { setPendingDelete(null); }
  };
  return <Section><div className="title"><MessageSquareText /><h2>Conversa da comunidade</h2></div>{user ? <form onSubmit={submit}><label htmlFor="new-comment" style={{ position: "absolute", left: -9999 }}>Seu comentário</label><textarea id="new-comment" value={content} onChange={(event) => setContent(event.target.value)} placeholder="O que este filme despertou em você?" maxLength={1000} /><div className="form-bottom"><span>{content.length}/1000</span><Button disabled={!content.trim()}><Send size={16} /> Publicar</Button></div></form> : <p className="signin">Entre na sua conta para participar da conversa.</p>}{error ? <ErrorState message={error} retry={load} /> : comments.length ? comments.map((comment) => <CommentCard key={comment.id} comment={comment} canModerate={user?.role === "ADMIN"} onLike={like} onEdit={edit} onDelete={setPendingDelete} />) : <EmptyState title="Ainda sem comentários" message="Este pode ser o começo de uma boa conversa sobre cinema." />}<Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={load} />{pendingDelete && <ConfirmModal title="Excluir comentário?" message="Esta ação remove o comentário e todas as curtidas dele." confirmLabel="Excluir" onConfirm={remove} onClose={() => setPendingDelete(null)} />}</Section>;
}
