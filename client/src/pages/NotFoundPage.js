import { Clapperboard, Home } from "lucide-react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Button, Page } from "../styles/ui";

const Wrap = styled(Page)`min-height: calc(100vh - 76px); display: grid; place-items: center; text-align: center; .code { font: 800 clamp(6rem,20vw,13rem) "Manrope"; line-height: .8; color: transparent; -webkit-text-stroke: 2px rgba(139,92,246,.75); } h1 { font-size: clamp(2rem,4vw,3.5rem); margin: 24px 0 10px; } p { color: ${({ theme }) => theme.colors.muted}; max-width: 520px; margin: 0 auto 24px; }`;

export default function NotFoundPage() {
  return <Wrap><div><Clapperboard size={34} /><div className="code">404</div><h1>Esta cena não existe</h1><p>O endereço pode ter mudado ou o filme saiu de cartaz por aqui.</p><Button as={Link} to="/"><Home size={17} /> Voltar ao início</Button></div></Wrap>;
}
