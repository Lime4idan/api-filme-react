import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";
import styled from "styled-components";

const Context = createContext(null);

const Stack = styled.div`
  position: fixed;
  right: 20px;
  bottom: 24px;
  z-index: 1200;
  display: grid;
  gap: 10px;
  width: min(390px, calc(100vw - 40px));
`;

const ToastItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: start;
  gap: 12px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 3px solid ${({ $type, theme }) => $type === "error" ? theme.colors.danger : $type === "success" ? theme.colors.success : theme.colors.primary};
  border-radius: 17px;
  background: rgba(15,17,21,.96);
  box-shadow: ${({ theme }) => theme.shadow};
  backdrop-filter: blur(20px);
  animation: fadeUp .25s ease both;
  p { margin: 0; line-height: 1.4; }
  button { border: 0; background: transparent; color: ${({ theme }) => theme.colors.muted}; cursor: pointer; }
`;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const remove = useCallback((id) => setToasts((items) => items.filter((item) => item.id !== id)), []);
  const show = useCallback((message, type = "info") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((items) => [...items, { id, message, type }]);
    window.setTimeout(() => remove(id), 4200);
  }, [remove]);
  const value = useMemo(() => ({ show, success: (message) => show(message, "success"), error: (message) => show(message, "error") }), [show]);
  return (
    <Context.Provider value={value}>
      {children}
      <Stack aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} $type={toast.type} role={toast.type === "error" ? "alert" : "status"}>
            {toast.type === "error" ? <CircleAlert size={20} /> : toast.type === "success" ? <CheckCircle2 size={20} /> : <Info size={20} />}
            <p>{toast.message}</p>
            <button onClick={() => remove(toast.id)} aria-label="Fechar notificação"><X size={18} /></button>
          </ToastItem>
        ))}
      </Stack>
    </Context.Provider>
  );
}

export const useToast = () => useContext(Context);
