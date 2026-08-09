import { Check, ListPlus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../services/api";
import { Button, Field } from "../styles/ui";
import { movieSnapshot } from "../utils/movie";
import { useToast } from "../hooks/useToast";

const Overlay = styled.div`
  position: fixed; z-index: 1000; inset: 0; display: grid; place-items: center; padding: 20px; background: rgba(3,5,10,.8); backdrop-filter: blur(8px);
  .modal { width: min(520px, 100%); max-height: 80vh; overflow-y: auto; padding: 25px; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 20px; background: #151a29; box-shadow: ${({ theme }) => theme.shadow}; }
  .head { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
  .close { border: 0; background: transparent; color: ${({ theme }) => theme.colors.muted}; cursor: pointer; }
  .lists { display: grid; gap: 9px; margin: 20px 0; }
  .list { display: flex; justify-content: space-between; align-items: center; gap: 16px; width: 100%; padding: 14px; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 12px; background: rgba(255,255,255,.03); text-align: left; cursor: pointer; }
  .list:hover { border-color: ${({ theme }) => theme.colors.primary}; }
  .list small { color: ${({ theme }) => theme.colors.muted}; display: block; margin-top: 3px; }
  .create { display: grid; grid-template-columns: 1fr auto; gap: 9px; }
`;

export default function AddToListModal({ movie, onClose }) {
  const toast = useToast();
  const [lists, setLists] = useState([]);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(null);
  const load = () => api.get("/lists").then(({ data }) => setLists(data.lists));
  useEffect(() => { document.body.classList.add("modal-open"); load().catch((error) => toast.error(error.message)); return () => document.body.classList.remove("modal-open"); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const add = async (list) => {
    setBusy(list.id);
    try { await api.post(`/lists/${list.id}/items`, movieSnapshot(movie)); toast.success(`Adicionado a “${list.name}”`); onClose(); }
    catch (error) { toast.error(error.message); }
    finally { setBusy(null); }
  };

  const create = async () => {
    if (!name.trim()) return;
    setBusy("create");
    try {
      const { data } = await api.post("/lists", { name: name.trim(), isPublic: false });
      await api.post(`/lists/${data.list.id}/items`, movieSnapshot(movie));
      toast.success("Lista criada e filme adicionado");
      onClose();
    } catch (error) { toast.error(error.message); } finally { setBusy(null); }
  };

  return <Overlay onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="list-modal-title"><div className="head"><div><h2 id="list-modal-title">Adicionar à lista</h2><p>Organize “{movie.title}” do seu jeito.</p></div><button className="close" onClick={onClose} aria-label="Fechar"><X /></button></div><div className="lists">{lists.map((list) => <button className="list" key={list.id} onClick={() => add(list)} disabled={Boolean(busy)}><span><strong>{list.name}</strong><small>{list._count?.items || 0} filmes · {list.isPublic ? "Pública" : "Privada"}</small></span>{busy === list.id ? "…" : <ListPlus size={19} />}</button>)}</div><Field>Nova lista<div className="create"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Para assistir no fim de semana" maxLength={80} /><Button type="button" onClick={create} disabled={!name.trim() || Boolean(busy)}>{busy === "create" ? <Check size={18} /> : <Plus size={18} />} Criar</Button></div></Field></div></Overlay>;
}
