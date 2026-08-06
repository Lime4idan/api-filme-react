import { X } from "lucide-react";
import { useEffect } from "react";
import styled from "styled-components";
import { Button } from "../styles/ui";

const Overlay = styled.div`
  position: fixed; z-index: 1000; inset: 0; display: grid; place-items: center; padding: 20px; background: rgba(3,5,10,.78); backdrop-filter: blur(8px);
  .modal { width: min(440px, 100%); padding: 26px; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 20px; background: #151a29; box-shadow: ${({ theme }) => theme.shadow}; }
  .head { display: flex; justify-content: space-between; gap: 20px; }
  .close { border: 0; background: transparent; color: ${({ theme }) => theme.colors.muted}; cursor: pointer; }
  p { color: ${({ theme }) => theme.colors.muted}; line-height: 1.6; }
  .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
`;

export default function ConfirmModal({ title = "Confirmar ação", message, confirmLabel = "Confirmar", onConfirm, onClose, danger = true }) {
  useEffect(() => { document.body.classList.add("modal-open"); return () => document.body.classList.remove("modal-open"); }, []);
  return <Overlay onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}><div className="modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title"><div className="head"><h2 id="confirm-title">{title}</h2><button className="close" onClick={onClose} aria-label="Fechar"><X /></button></div><p>{message}</p><div className="actions"><Button $variant="ghost" onClick={onClose}>Cancelar</Button><Button $variant={danger ? "danger" : undefined} onClick={onConfirm}>{confirmLabel}</Button></div></div></Overlay>;
}
