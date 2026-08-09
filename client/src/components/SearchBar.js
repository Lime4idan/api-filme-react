import { Clock3, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import useDebounce from "../hooks/useDebounce";
import { movieService } from "../services/movieService";
import { imageUrl, movieYear } from "../utils/movie";

const Wrap = styled.div`
  position: relative;
  width: min(600px, 100%);
  form { position: relative; display: flex; align-items: center; }
  .icon { position: absolute; left: 16px; color: ${({ theme }) => theme.colors.muted}; pointer-events: none; }
  input { width: 100%; height: 46px; padding: 0 94px 0 46px; border-radius: 14px; border: 1px solid ${({ theme }) => theme.colors.border}; background: rgba(18,22,35,.92); color: white; outline: none; }
  input:focus { border-color: rgba(139,92,246,.75); box-shadow: 0 0 0 3px rgba(139,92,246,.12); }
  .clear { position: absolute; right: 48px; border: 0; background: transparent; color: ${({ theme }) => theme.colors.muted}; cursor: pointer; }
  .submit { position: absolute; right: 5px; width: 37px; height: 36px; display: grid; place-items: center; border: 0; border-radius: 10px; background: ${({ theme }) => theme.colors.primary}; cursor: pointer; }
  .dropdown { position: absolute; z-index: 80; left: 0; right: 0; top: calc(100% + 9px); padding: 9px; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 16px; background: rgba(14,17,29,.98); box-shadow: ${({ theme }) => theme.shadow}; }
  .hint { padding: 8px 10px; color: ${({ theme }) => theme.colors.muted}; font-size: .78rem; text-transform: uppercase; letter-spacing: .08em; font-weight: 700; }
  .suggestion { width: 100%; display: grid; grid-template-columns: 36px 1fr auto; align-items: center; gap: 11px; padding: 8px; border: 0; border-radius: 10px; background: transparent; text-align: left; cursor: pointer; }
  .suggestion:hover, .suggestion:focus { background: rgba(139,92,246,.14); }
  .suggestion img { width: 36px; height: 50px; object-fit: cover; border-radius: 6px; }
  .suggestion span { color: ${({ theme }) => theme.colors.muted}; font-size: .82rem; }
  .history { grid-template-columns: auto 1fr; }
  @media (max-width: 600px) { input { height: 44px; } }
`;

const HISTORY_KEY = "moviehub.searchHistory";

export default function SearchBar({ compact = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const root = useRef(null);
  const queryFromUrl = new URLSearchParams(location.search).get("query") || "";
  const [value, setValue] = useState(location.pathname === "/pesquisa" ? queryFromUrl : "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(value, 500);
  const history = (() => { try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; } })();

  useEffect(() => {
    const close = (event) => { if (!root.current?.contains(event.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    if (debounced.trim().length < 2) { setSuggestions([]); return; }
    let active = true;
    setLoading(true);
    movieService.search({ query: debounced.trim(), page: 1 })
      .then((data) => { if (active) setSuggestions(data.results.slice(0, 5)); })
      .catch(() => { if (active) setSuggestions([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [debounced]);

  const submit = (query = value) => {
    const clean = query.trim();
    if (!clean) return;
    const nextHistory = [clean, ...history.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
    setOpen(false);
    navigate(`/pesquisa?query=${encodeURIComponent(clean)}&page=1`);
  };

  return (
    <Wrap ref={root} $compact={compact}>
      <form role="search" onSubmit={(event) => { event.preventDefault(); submit(); }}>
        <Search className="icon" size={19} />
        <label htmlFor={compact ? "global-search-mobile" : "global-search"} style={{ position: "absolute", left: -9999 }}>Pesquisar filmes</label>
        <input id={compact ? "global-search-mobile" : "global-search"} value={value} onChange={(event) => { setValue(event.target.value); setOpen(true); }} onFocus={() => setOpen(true)} placeholder="Busque um filme, diretor ou universo..." autoComplete="off" />
        {value && <button className="clear" type="button" onClick={() => { setValue(""); setSuggestions([]); }} aria-label="Limpar busca"><X size={17} /></button>}
        <button className="submit" aria-label="Pesquisar"><Search size={17} /></button>
      </form>
      {open && (value.trim().length >= 2 || history.length > 0) && (
        <div className="dropdown" role="listbox" aria-label="Sugestões de pesquisa">
          {loading && <div className="hint">Procurando...</div>}
          {!value.trim() && history.length > 0 && <><div className="hint">Pesquisas recentes</div>{history.map((item) => <button key={item} className="suggestion history" onClick={() => { setValue(item); submit(item); }}><Clock3 size={17} /><strong>{item}</strong></button>)}</>}
          {value.trim() && suggestions.map((movie) => <button key={movie.id} className="suggestion" onClick={() => { setOpen(false); navigate(`/filme/${movie.id}`); }}>{imageUrl(movie.poster_path, "w92") ? <img src={imageUrl(movie.poster_path, "w92")} alt="" /> : <span /> }<strong>{movie.title}</strong><span>{movieYear(movie.release_date)}</span></button>)}
          {!loading && value.trim().length >= 2 && !suggestions.length && <div className="hint">Nenhuma sugestão encontrada</div>}
        </div>
      )}
    </Wrap>
  );
}
