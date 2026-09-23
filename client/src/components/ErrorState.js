import { CircleAlert, RotateCcw } from "lucide-react";
import styled from "styled-components";
import { Button } from "../styles/ui";

const Wrap = styled.div`
  min-height: 240px;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 32px;
  border-radius: 20px;
  background: rgba(255,77,103,.055);
  border: 1px solid rgba(255,77,103,.18);
  color: ${({ theme }) => theme.colors.muted};
  svg { color: ${({ theme }) => theme.colors.danger}; }
  h2 { color: ${({ theme }) => theme.colors.text}; margin: 14px 0 8px; }
`;

export default function ErrorState({ message = "Could not load this content.", retry }) {
  return <Wrap role="alert"><div><CircleAlert size={32} /><h2>Something went off script</h2><p>{message}</p>{retry && <Button onClick={retry}><RotateCcw size={17} /> Try again</Button>}</div></Wrap>;
}
