import { ArrowDown, ArrowUp, Eye, EyeOff, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import ConfirmModal from "../components/ConfirmModal";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import Pagination from "../components/Pagination";
import ShareButton from "../components/ShareButton";
import SafeImage from "../components/SafeImage";
import { useToast } from "../hooks/useToast";
import api from "../services/api";
import { Button, Eyebrow, Field, Page, PageHeader, Panel } from "../styles/ui";
import { imageUrl, movieYear } from "../utils/movie";

const List = styled.div`
  display: grid; gap: 11px;
  .item { display: grid; grid-template-columns: 42px 64px minmax(0,1fr) auto; align-items: center; gap: 15px; padding: 10px 14px; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 15px; background: rgba(255,255,255,.03); }
  .position { color: ${({ theme }) => theme.colors.muted}; text-align: center; font-weight: 800; }
  .poster { width: 64px; aspect-ratio: 2/3; object-fit: cover; border-radius: 8px; background: #171c2c; }
  .info { min-width: 0; }
  .info h3 { margin: 0 0 5px; }
  .info span { color: ${({ theme }) => theme.colors.muted}; font-size: .84rem; }
  .actions { display: flex; gap: 5px; }
  .actions button { width: 36px; height: 36px; display: grid; place-items: center; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 9px; background: transparent; color: ${({ theme }) => theme.colors.muted}; cursor: pointer; }
  @media (max-width: 600px) { .item { grid-template-columns: 34px 50px minmax(0,1fr); } .poster { width: 50px; } .actions { grid-column: 2/4; justify-content: flex-end; } }
`;
const Editor = styled(Panel)`
  margin-bottom: 28px;
  .fields { display: grid; grid-template-columns: 1fr 2fr auto; gap: 12px; align-items: end; }
  .public { display: flex; align-items: center; gap: 7px; height: 44px; color: ${({ theme }) => theme.colors.muted}; }
  .save { display: flex; justify-content: flex-end; margin-top: 14px; }
  @media (max-width: 800px) { .fields { grid-template-columns: 1fr; } }
`;

export default function ListDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [list, setList] = useState(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState(null);
  const load = () => api.get(`/lists/${id}`).then(({ data }) => setList(data.list)).catch((err) => setError(err.message));
  useEffect(load, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  if (error) return <Page><ErrorState message={error} /></Page>;
  if (!list) return <Page><p>Loading list...</p></Page>;
  const save = async (event) => {
    event.preventDefault();
    try { const { data } = await api.put(`/lists/${id}`, { name: list.name, description: list.description || null, isPublic: list.isPublic }); setList((current) => ({ ...current, ...data.list })); toast.success("List updated"); } catch (err) { toast.error(err.message); }
  };
  const move = async (index, direction) => {
    const nextIndex = index + direction; if (nextIndex < 0 || nextIndex >= list.items.length) return;
    const items = [...list.items]; [items[index], items[nextIndex]] = [items[nextIndex], items[index]]; setList({ ...list, items });
    try { const { data } = await api.put(`/lists/${id}/reorder`, { movieIds: items.map((item) => item.tmdbMovieId) }); setList((current) => ({ ...current, items: data.items })); } catch (err) { toast.error(err.message); load(); }
  };
  const remove = async () => {
    try { await api.delete(`/lists/${id}/items/${pending.tmdbMovieId}`); setList((current) => ({ ...current, items: current.items.filter((item) => item.tmdbMovieId !== pending.tmdbMovieId) })); toast.success("Movie removed from list"); } catch (err) { toast.error(err.message); } finally { setPending(null); }
  };
  const pageSize = 20;
  const totalPages = Math.max(Math.ceil(list.items.length / pageSize), 1);
  const visibleItems = list.items.slice((page - 1) * pageSize, page * pageSize);
  return <Page><PageHeader><div><Eyebrow>{list.isPublic ? "Shareable list" : "Private collection"}</Eyebrow><h1>{list.name}</h1><p>{list.items.length} {list.items.length === 1 ? "movie" : "movies"} in your own order.</p></div>{list.isPublic && <ShareButton title={list.name} text={list.description} url={`${window.location.origin}/lista/${list.shareCode}`} />}</PageHeader><Editor as="form" onSubmit={save}><h2>List details</h2><div className="fields"><Field>Name<input value={list.name} maxLength={80} onChange={(event) => setList({ ...list, name: event.target.value })} required /></Field><Field>Description<input value={list.description || ""} maxLength={500} onChange={(event) => setList({ ...list, description: event.target.value })} /></Field><label className="public"><input type="checkbox" checked={list.isPublic} onChange={(event) => setList({ ...list, isPublic: event.target.checked })} /> {list.isPublic ? <Eye size={17} /> : <EyeOff size={17} />} Public</label></div><div className="save"><Button><Save size={17} /> Save changes</Button></div></Editor>{list.items.length ? <><List>{visibleItems.map((item, localIndex) => { const index = (page - 1) * pageSize + localIndex; return <div className="item" key={item.id}><span className="position">{index + 1}</span><SafeImage className="poster" src={imageUrl(item.posterPath, "w154")} alt={`Poster for ${item.title}`} /><div className="info"><h3><button style={{ all: "unset", cursor: "pointer" }} onClick={() => navigate(`/filme/${item.tmdbMovieId}`)}>{item.title}</button></h3><span>{movieYear(item.releaseDate)} · ★ {Number(item.voteAverage || 0).toFixed(1)}</span></div><div className="actions"><button onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move ${item.title} up`}><ArrowUp size={16} /></button><button onClick={() => move(index, 1)} disabled={index === list.items.length - 1} aria-label={`Move ${item.title} down`}><ArrowDown size={16} /></button><button onClick={() => setPending(item)} aria-label={`Remove ${item.title}`}><Trash2 size={16} /></button></div></div>; })}</List><Pagination page={page} totalPages={totalPages} onChange={setPage} /></> : <EmptyState title="Empty list" message="Open a movie and select “Add to list” to begin this collection." />}{pending && <ConfirmModal title="Remove movie?" message={`“${pending.title}” will be removed from this list.`} confirmLabel="Remove" onConfirm={remove} onClose={() => setPending(null)} />}</Page>;
}
