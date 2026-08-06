import { Heart, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import styled from "styled-components";
import { Button } from "../styles/ui";

const Card = styled.article`
  display: grid; grid-template-columns: auto 1fr; gap: 14px; padding: 20px 0; border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  .avatar { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 50%; overflow: hidden; background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.coral}); font-weight: 800; }
  .avatar img { width: 100%; height: 100%; object-fit: cover; }
  .head { display: flex; justify-content: space-between; gap: 12px; }
  .head small { color: ${({ theme }) => theme.colors.muted}; }
  p { color: #d4d8e3; white-space: pre-wrap; line-height: 1.65; margin: 10px 0; }
  .actions { display: flex; align-items: center; gap: 14px; }
  .link { display: inline-flex; align-items: center; gap: 6px; border: 0; background: transparent; color: ${({ theme }) => theme.colors.muted}; cursor: pointer; padding: 4px 0; }
  .link.active { color: ${({ theme }) => theme.colors.coral}; }
  textarea { width: 100%; min-height: 100px; padding: 12px; border-radius: 12px; border: 1px solid ${({ theme }) => theme.colors.border}; background: #0d111d; color: white; resize: vertical; }
  .edit-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
`;

export default function CommentCard({ comment, canModerate, onLike, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const date = new Date(comment.createdAt).toLocaleString("pt-BR", { dateStyle: "medium", timeStyle: "short" });
  return <Card><div className="avatar">{comment.author.avatarUrl ? <img src={comment.author.avatarUrl} alt="" /> : comment.author.name.charAt(0).toUpperCase()}</div><div><div className="head"><div><strong>{comment.author.name}</strong><br /><small>{date}{comment.updatedAt !== comment.createdAt ? " · editado" : ""}</small></div></div>{editing ? <><textarea value={content} maxLength={1000} aria-label="Editar comentário" onChange={(event) => setContent(event.target.value)} /><div className="edit-actions"><Button $variant="ghost" onClick={() => { setEditing(false); setContent(comment.content); }}>Cancelar</Button><Button onClick={() => { onEdit(comment.id, content); setEditing(false); }} disabled={!content.trim()}>Salvar</Button></div></> : <p>{comment.content}</p>}<div className="actions"><button className={`link ${comment.likedByMe ? "active" : ""}`} onClick={() => onLike(comment)} aria-pressed={comment.likedByMe}><Heart size={16} fill={comment.likedByMe ? "currentColor" : "none"} /> {comment.likeCount}</button>{comment.canEdit && !editing && <button className="link" onClick={() => setEditing(true)}><Pencil size={15} /> Editar</button>}{(comment.canEdit || canModerate) && <button className="link" onClick={() => onDelete(comment)}><Trash2 size={15} /> Excluir</button>}</div></div></Card>;
}
