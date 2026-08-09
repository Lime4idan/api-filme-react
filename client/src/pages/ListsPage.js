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
  display: grid; grid-template-columns: repeat(auto-fill,minmax(270px,1fr)); gap: 20px;
  .list { position: relative; overflow: hidden; }
  .mosaic { display: grid; grid-template-columns: repeat(4,1fr); height: 150px; margin: -30px -30px 20px; background: #0e121e; }
  .mosaic img { width: 100%; height: 100%; object-fit: cover; }
  .empty-poster { display: grid; place-items: center; color: #5c6579; border-right: 1px solid rgba(255,255,255,.05); }
  h2 { margin-bottom: 8px; }
  p { color: ${({ theme }) => theme.colors.muted}; min-height: 44px; line-height: 1.45; }
  .meta { display: flex; align-items: center; justify-content: space-between; color: ${({ theme }) => theme.colors.muted}; font-size: .84rem; }
  .meta span { display: flex; align-items: center; gap: 5px; }
  .delete { position: absolute; right: 12px; top: 12px; width: 38px; height: 38px; display: grid; place-items: center; border: 0; border-radius: 50%; background: rgba(7,9,15,.78); color: #ff8899; cursor: pointer; }
`;
const Create = styled(Panel)`
  margin-bottom: 26px;
  .row { display: grid; grid-template-columns: 1fr 2fr auto auto; gap: 12px; align-items: end; }
  .toggle { display: flex; align-items: center; gap: 8px; height: 44px; color: ${({ theme }) => theme.colors.muted}; white-space: nowrap; }
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
    try { await api.post("/lists", form); setForm({ name: "", description: "", isPublic: false }); setShowCreate(false); await refresh(); toast.success("Lista criada"); } catch (error) { toast.error(error.message); }
  };
  const remove = async () => {
    try { await api.delete(`/lists/${pendingDelete.id}`); await refresh(); toast.success("Lista excluída"); } catch (error) { toast.error(error.message); } finally { setPendingDelete(null); }
  };
  return <Page><PageHeader><div><Eyebrow>Organize seu cinema</Eyebrow><h1>Minhas listas</h1><p>Crie coleções privadas ou públicas e monte a ordem perfeita para cada ocasião.</p></div><Button onClick={() => setShowCreate((value) => !value)}><Plus size={18} /> Nova lista</Button></PageHeader>{showCreate && <Create as="form" onSubmit={create}><h2>Criar uma lista</h2><div className="row"><Field>Nome<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} maxLength={80} required /></Field><Field>Descrição<input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} maxLength={500} /></Field><label className="toggle"><input type="checkbox" checked={form.isPublic} onChange={(event) => setForm({ ...form, isPublic: event.target.checked })} /> Pública</label><Button>Criar</Button></div></Create>}{loading ? <LoadingSkeleton count={6} /> : lists.length ? <Grid>{lists.map((list) => <Panel className="list" key={list.id}><button className="delete" onClick={() => setPendingDelete(list)} aria-label={`Excluir lista ${list.name}`}><Trash2 size={17} /></button><Link to={`/listas/${list.id}`}><div className="mosaic">{Array.from({ length: 4 }, (_, index) => { const item = list.items[index]; const source = item && imageUrl(item.posterPath, "w342"); return source ? <img key={index} src={source} alt="" /> : <div className="empty-poster" key={index}><Film size={20} /></div>; })}</div><h2>{list.name}</h2><p>{list.description || "Uma coleção pronta para ganhar novas histórias."}</p><div className="meta"><span>{list.isPublic ? <><Eye size={15} /> Pública</> : <><Lock size={15} /> Privada</>}</span><span>{list._count.items} filmes</span></div></Link></Panel>)}</Grid> : <EmptyState title="Crie sua primeira lista" message="Agrupe filmes por humor, gênero, companhia ou qualquer ideia que mereça uma sessão." action={() => setShowCreate(true)} actionLabel="Criar lista" />}{pendingDelete && <ConfirmModal title={`Excluir “${pendingDelete.name}”?`} message="A lista e sua organização serão removidas. Os filmes continuarão disponíveis no catálogo." confirmLabel="Excluir lista" onConfirm={remove} onClose={() => setPendingDelete(null)} />}</Page>;
}
