import { X } from "lucide-react";
import { useEffect } from "react";
import styled from "styled-components";
import { Button } from "../styles/ui";

const Overlay = styled.div`
  position: fixed; z-index: 1000; inset: 0; display: grid; place-items: center; padding: 20px; background: rgba(2,3,5,.82); backdrop-filter: blur(12px);
  .modal { width: min(460px, 100%); padding: 28px; border: 1px solid rgba(255,255,255,.11); border-radius: 24px; background: radial-gradient(circle at 100% 0,rgba(255,86,112,.09),transparent 16rem),#111318; box-shadow: 0 35px 110px rgba(0,0,0,.65); animation: fadeUp .24s ease both; }
  .head { display: flex; justify-content: space-between; gap: 20px; }
  .close { border: 0; background: transparent; color: ${({ theme }) => theme.colors.muted}; cursor: pointer; }
  p { color: ${({ theme }) => theme.colors.muted}; line-height: 1.6; }
  .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 27px; }
`;

export default function ConfirmModal({ title = "Confirmar ação", message, confirmLabel = "Confirmar", onConfirm, onClose, danger = true }) {
  useEffect(() => { document.body.classList.add("modal-open"); return () => document.body.classList.remove("modal-open"); }, []);
  return <Overlay onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}><div className="modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title"><div className="head"><h2 id="confirm-title">{title}</h2><button className="close" onClick={onClose} aria-label="Fechar"><X /></button></div><p>{message}</p><div className="actions"><Button $variant="ghost" onClick={onClose}>Cancelar</Button><Button $variant={danger ? "danger" : undefined} onClick={onConfirm}>{confirmLabel}</Button></div></div></Overlay>;
}
