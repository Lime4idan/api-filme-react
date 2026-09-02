import { RotateCcw, SlidersHorizontal } from "lucide-react";
import styled from "styled-components";

const Bar = styled.div`
  display: grid; grid-template-columns: repeat(5, minmax(120px, 1fr)); gap: 12px; padding: 18px; margin-bottom: 34px; border-radius: 21px; border: 1px solid rgba(255,255,255,.085); background: linear-gradient(110deg,rgba(20,22,27,.92),rgba(10,12,15,.94)); box-shadow: 0 20px 60px rgba(0,0,0,.2);
  .bar-head { display: flex; align-items: center; justify-content: space-between; gap: 20px; grid-column: 1/-1; margin-bottom: 3px; }
  .title { display: flex; align-items: center; gap: 9px; font-weight: 700; }
  .title span { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 9px; background: rgba(255,54,94,.12); color: ${({ theme }) => theme.colors.primary}; }
  .reset { display: inline-flex; align-items: center; gap: 6px; padding: 6px 9px; border: 0; border-radius: 8px; background: transparent; color: ${({ theme }) => theme.colors.muted}; font-size: .75rem; cursor: pointer; }
  .reset:hover { color: white; background: rgba(255,255,255,.05); }
  label { display: grid; gap: 7px; color: ${({ theme }) => theme.colors.muted}; font-size: .72rem; font-weight: 700; letter-spacing: .02em; }
  select, input { height: 44px; width: 100%; padding: 0 12px; border: 1px solid rgba(255,255,255,.08); border-radius: 12px; background: #090b0e; color: white; outline: none; }
  select:focus, input:focus { border-color: rgba(255,54,94,.5); box-shadow: 0 0 0 3px rgba(255,54,94,.08); }
  @media (max-width: 1050px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 600px) { grid-template-columns: 1fr 1fr; padding: 14px; .sort { grid-column: 1/-1; } }
`;

export default function FilterBar({ filters, genres = [], onChange, showGenre = true }) {
  const set = (key) => (event) => onChange({ ...filters, [key]: event.target.value, page: 1 });
  const reset = () => onChange({ ...(filters.query ? { query: filters.query } : {}), page: 1, genre: "", year: "", voteMin: "", language: "", sort: "popularity" });
  return <Bar><div className="bar-head"><div className="title"><span><SlidersHorizontal size={16} /></span> Refinar catálogo</div><button className="reset" type="button" onClick={reset}><RotateCcw size={14} /> Limpar filtros</button></div>{showGenre && <label>Gênero<select value={filters.genre || ""} onChange={set("genre")}><option value="">Todos</option>{genres.map((genre) => <option key={genre.id} value={genre.id}>{genre.name}</option>)}</select></label>}<label>Ano<input type="number" min="1900" max={new Date().getFullYear() + 5} placeholder="Ex.: 2024" value={filters.year || ""} onChange={set("year")} /></label><label>Nota mínima<select value={filters.voteMin || ""} onChange={set("voteMin")}><option value="">Qualquer nota</option>{[5,6,7,8,9].map((value) => <option key={value} value={value}>{value}+</option>)}</select></label><label>Idioma<select value={filters.language || ""} onChange={set("language")}><option value="">Todos</option><option value="pt">Português</option><option value="en">Inglês</option><option value="es">Espanhol</option><option value="fr">Francês</option><option value="ja">Japonês</option><option value="ko">Coreano</option></select></label><label className="sort">Ordenar por<select value={filters.sort || "popularity"} onChange={set("sort")}><option value="popularity">Popularidade</option><option value="rating">Nota</option><option value="release">Lançamento</option></select></label></Bar>;
}
