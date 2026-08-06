import { Clapperboard } from "lucide-react";
import styled from "styled-components";
import { Button } from "../styles/ui";

const Wrap = styled.div`
  min-height: 260px;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 40px 20px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  background: rgba(255,255,255,.02);
  color: ${({ theme }) => theme.colors.muted};
  svg { color: ${({ theme }) => theme.colors.primary}; margin: 0 auto 16px; }
  h2 { color: ${({ theme }) => theme.colors.text}; margin-bottom: 8px; }
  p { max-width: 480px; }
`;

export default function EmptyState({ title = "Nada por aqui", message, action, actionLabel }) {
  return <Wrap><div><Clapperboard size={34} /><h2>{title}</h2><p>{message}</p>{action && <Button onClick={action}>{actionLabel || "Continuar"}</Button>}</div></Wrap>;
}
