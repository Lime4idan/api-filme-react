import { ChevronLeft, ChevronRight } from "lucide-react";
import styled from "styled-components";

const Nav = styled.nav`
  display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 42px;
  button { min-width: 42px; height: 42px; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 11px; background: rgba(255,255,255,.04); color: ${({ theme }) => theme.colors.muted}; cursor: pointer; }
  button[aria-current="page"] { background: ${({ theme }) => theme.colors.primary}; color: white; border-color: transparent; }
  button:disabled { opacity: .35; cursor: not-allowed; }
`;

export default function Pagination({ page = 1, totalPages = 1, onChange }) {
  if (totalPages <= 1) return null;
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i).filter((value) => value <= totalPages);
  return <Nav aria-label="Paginação"><button onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Página anterior"><ChevronLeft size={18} /></button>{pages.map((value) => <button key={value} onClick={() => onChange(value)} aria-current={value === page ? "page" : undefined}>{value}</button>)}<button onClick={() => onChange(page + 1)} disabled={page >= totalPages} aria-label="Próxima página"><ChevronRight size={18} /></button></Nav>;
}
