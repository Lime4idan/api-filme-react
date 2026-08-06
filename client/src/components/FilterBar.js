import { SlidersHorizontal } from "lucide-react";
import styled from "styled-components";

const Bar = styled.div`
  display: grid; grid-template-columns: repeat(5, minmax(120px, 1fr)); gap: 12px; padding: 16px; margin-bottom: 28px; border-radius: 18px; border: 1px solid ${({ theme }) => theme.colors.border}; background: rgba(17,21,34,.82);
  .title { display: flex; align-items: center; gap: 8px; grid-column: 1/-1; font-weight: 700; }
  label { display: grid; gap: 6px; color: ${({ theme }) => theme.colors.muted}; font-size: .78rem; font-weight: 600; }
  select, input { height: 42px; width: 100%; padding: 0 11px; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 10px; background: #0d111d; color: white; }
  @media (max-width: 1000px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 600px) { grid-template-columns: 1fr 1fr; .sort { grid-column: 1/-1; } }
`;

export default function FilterBar({ filters, genres = [], onChange, showGenre = true }) {
  const set = (key) => (event) => onChange({ ...filters, [key]: event.target.value, page: 1 });
  return <Bar><div className="title"><SlidersHorizontal size={17} /> Refinar resultados</div>{showGenre && <label>Gênero<select value={filters.genre || ""} onChange={set("genre")}><option value="">Todos</option>{genres.map((genre) => <option key={genre.id} value={genre.id}>{genre.name}</option>)}</select></label>}<label>Ano<input type="number" min="1900" max={new Date().getFullYear() + 5} placeholder="Ex.: 2024" value={filters.year || ""} onChange={set("year")} /></label><label>Nota mínima<select value={filters.voteMin || ""} onChange={set("voteMin")}><option value="">Qualquer nota</option>{[5,6,7,8,9].map((value) => <option key={value} value={value}>{value}+</option>)}</select></label><label>Idioma<select value={filters.language || ""} onChange={set("language")}><option value="">Todos</option><option value="pt">Português</option><option value="en">Inglês</option><option value="es">Espanhol</option><option value="fr">Francês</option><option value="ja">Japonês</option><option value="ko">Coreano</option></select></label><label className="sort">Ordenar por<select value={filters.sort || "popularity"} onChange={set("sort")}><option value="popularity">Popularidade</option><option value="rating">Nota</option><option value="release">Lançamento</option></select></label></Bar>;
}
