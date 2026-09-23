import { Eye, Film, Lock, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import ConfirmModal from "../components/ConfirmModal";
import EmptyState from "../components/EmptyState";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { useToast } from "../hooks/useToast";
import useLists from "../hooks/useLists";
import api from "../services/api";
import { Button, Eyebrow, Field, Page, PageHeader, Panel } from "../styles/ui";
import { imageUrl } from "../utils/movie";

const Grid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill,minmax(300px,1fr)); gap: 24px;
  .list { position: relative; overflow: hidden; transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease; }
  .list:hover { transform: translateY(-6px); border-color: rgba(255,255,255,.18); box-shadow: 0 30px 80px rgba(0,0,0,.38); }
  .mosaic { position: relative; display: grid; grid-template-columns: repeat(4,1fr); height: 190px; margin: calc(-1 * clamp(18px, 3vw, 30px)) calc(-1 * clamp(18px, 3vw, 30px)) 24px; background: #0d0f13; overflow: hidden; }
  .mosaic::after { content: ""; position: absolute; inset: 45% 0 0; background: linear-gradient(transparent,rgba(8,9,11,.78)); }
  .mosaic img { width: 100%; height: 100%; object-fit: cover; transition: transform .45s ease; }
  .list:hover .mosaic img { transform: scale(1.045); }
  .empty-poster { display: grid; place-items: center; color: #545965; border-right: 1px solid rgba(255,255,255,.05); background: radial-gradient(circle at center,rgba(255,54,94,.08),transparent 70%); }
  h2 { margin-bottom: 9px; font-size: 1.35rem; }
  p { color: ${({ theme }) => theme.colors.muted}; min-height: 46px; line-height: 1.55; }
  .meta { display: flex; align-items: center; justify-content: space-between; color: ${({ theme }) => theme.colors.muted}; font-size: .84rem; }
  .meta span { display: flex; align-items: center; gap: 5px; }
  .delete { position: absolute; z-index: 3; right: 13px; top: 13px; width: 40px; height: 40px; display: grid; place-items: center; border: 1px solid rgba(255,255,255,.1); border-radius: 50%; background: rgba(7,8,10,.74); color: #ff899c; cursor: pointer; backdrop-filter: blur(12px); opacity: 0; transform: translateY(-5px); transition: .2s; }
  .list:hover .delete, .delete:focus { opacity: 1; transform: none; }
  @media (hover: none) { .delete { opacity: 1; transform: none; } }
`;
const Create = styled(Panel)`
  margin-bottom: 30px; border-color: rgba(255,54,94,.16); background: radial-gradient(circle at 0 0,rgba(255,54,94,.09),transparent 22rem),linear-gradient(145deg,rgba(20,23,29,.96),rgba(11,13,17,.96));
  h2 { margin-bottom: 20px; }
  .row { display: grid; grid-template-columns: 1fr 2fr auto auto; gap: 12px; align-items: end; }
  .toggle { display: flex; align-items: center; gap: 8px; height: 48px; color: ${({ theme }) => theme.colors.muted}; white-space: nowrap; }
  @media (max-width: 800px) { .row { grid-template-columns: 1fr; } }
`;

export default function ListsPage() {
  const { lists, loading, refresh } = useLists();
  const toast = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", isPublic: false });
  const [pendingDelete, setPendingDelete] = useState(null);
  const create = async (event) => {
    event.preventDefault();
    try { await api.post("/lists", form); setForm({ name: "", description: "", isPublic: false }); setShowCreate(false); await refresh(); toast.success("List created"); } catch (error) { toast.error(error.message); }
  };
  const remove = async () => {
    try { await api.delete(`/lists/${pendingDelete.id}`); await refresh(); toast.success("List deleted"); } catch (error) { toast.error(error.message); } finally { setPendingDelete(null); }
  };
  return <Page><PageHeader><div><Eyebrow>Organize your cinema</Eyebrow><h1>My lists</h1><p>Create private or public collections and arrange the perfect order for every occasion.</p></div><Button onClick={() => setShowCreate((value) => !value)}><Plus size={18} /> New list</Button></PageHeader>{showCreate && <Create as="form" onSubmit={create}><h2>Create a list</h2><div className="row"><Field>Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} maxLength={80} required /></Field><Field>Description<input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} maxLength={500} /></Field><label className="toggle"><input type="checkbox" checked={form.isPublic} onChange={(event) => setForm({ ...form, isPublic: event.target.checked })} /> Public</label><Button>Create</Button></div></Create>}{loading ? <LoadingSkeleton count={6} /> : lists.length ? <Grid>{lists.map((list) => <Panel className="list" key={list.id}><button className="delete" onClick={() => setPendingDelete(list)} aria-label={`Delete list ${list.name}`}><Trash2 size={17} /></button><Link to={`/listas/${list.id}`}><div className="mosaic">{Array.from({ length: 4 }, (_, index) => { const item = list.items[index]; const source = item && imageUrl(item.posterPath, "w342"); return source ? <img key={index} src={source} alt="" /> : <div className="empty-poster" key={index}><Film size={20} /></div>; })}</div><h2>{list.name}</h2><p>{list.description || "A collection ready for new stories."}</p><div className="meta"><span>{list.isPublic ? <><Eye size={15} /> Public</> : <><Lock size={15} /> Private</>}</span><span>{list._count.items} movies</span></div></Link></Panel>)}</Grid> : <EmptyState title="Create your first list" message="Group movies by mood, genre, company, or any idea worth a movie night." action={() => setShowCreate(true)} actionLabel="Create list" />}{pendingDelete && <ConfirmModal title={`Delete “${pendingDelete.name}”?`} message="The list and its ordering will be removed. Its movies will remain available in the catalog." confirmLabel="Delete list" onConfirm={remove} onClose={() => setPendingDelete(null)} />}</Page>;
}
