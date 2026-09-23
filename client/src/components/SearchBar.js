import { Clock3, LoaderCircle, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import useDebounce from "../hooks/useDebounce";
import { movieService } from "../services/movieService";
import { imageUrl, movieYear } from "../utils/movie";

const Wrap = styled.div`
  position: relative;
  width: min(640px, 100%);
  min-width: 180px;
  flex: 1 1 640px;
  form { position: relative; display: flex; align-items: center; }
  .icon { position: absolute; left: 16px; color: #747b88; pointer-events: none; }
  input { width: 100%; height: 44px; padding: 0 106px 0 46px; border-radius: 13px; border: 1px solid transparent; background: rgba(255,255,255,.055); color: white; outline: none; transition: .2s ease; }
  input::placeholder { color: #747a87; }
  input:focus { border-color: rgba(255,54,94,.48); background: rgba(255,255,255,.075); box-shadow: 0 0 0 3px rgba(255,54,94,.08); }
  .shortcut { position: absolute; right: 48px; min-width: 36px; padding: 3px 6px; border: 1px solid rgba(255,255,255,.09); border-radius: 7px; color: #777d88; background: rgba(0,0,0,.22); font-size: .68rem; text-align: center; pointer-events: none; }
  .clear { position: absolute; right: 48px; border: 0; background: transparent; color: ${({ theme }) => theme.colors.muted}; cursor: pointer; }
  .submit { position: absolute; right: 4px; width: 36px; height: 36px; display: grid; place-items: center; border: 0; border-radius: 11px; background: linear-gradient(135deg, ${({ theme }) => theme.colors.coral}, ${({ theme }) => theme.colors.primary}); box-shadow: 0 6px 18px rgba(255,54,94,.22); cursor: pointer; transition: transform .2s ease; }
  .submit:hover { transform: scale(1.05); }
  .dropdown { position: absolute; z-index: 80; left: 0; right: 0; top: calc(100% + 12px); padding: 10px; border: 1px solid rgba(255,255,255,.1); border-radius: 18px; background: rgba(12,13,17,.97); box-shadow: 0 28px 80px rgba(0,0,0,.6); backdrop-filter: blur(24px); }
  .hint { padding: 8px 10px; color: ${({ theme }) => theme.colors.muted}; font-size: .78rem; text-transform: uppercase; letter-spacing: .08em; font-weight: 700; }
  .suggestion { width: 100%; display: grid; grid-template-columns: 42px 1fr auto; align-items: center; gap: 12px; padding: 8px; border: 0; border-radius: 11px; background: transparent; text-align: left; cursor: pointer; }
  .suggestion:hover, .suggestion:focus { background: rgba(255,255,255,.06); }
  .suggestion img { width: 42px; height: 57px; object-fit: cover; border-radius: 8px; }
  .suggestion span { color: ${({ theme }) => theme.colors.muted}; font-size: .82rem; }
  .history { grid-template-columns: auto 1fr; }
  .spinner { animation: spin .8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (max-width: 600px) { input { height: 44px; padding-right: 50px; } .shortcut { display: none; } }
`;

const HISTORY_KEY = "moviehub.searchHistory";

export default function SearchBar({ compact = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const root = useRef(null);
  const input = useRef(null);
  const queryFromUrl = new URLSearchParams(location.search).get("query") || "";
  const [value, setValue] = useState(location.pathname === "/pesquisa" ? queryFromUrl : "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(value, 500);
  const history = (() => { try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; } })();

  useEffect(() => {
    const close = (event) => { if (!root.current?.contains(event.target)) setOpen(false); };
    const shortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); input.current?.focus(); setOpen(true);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", shortcut);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", shortcut); };
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
        <label htmlFor={compact ? "global-search-mobile" : "global-search"} style={{ position: "absolute", left: -9999 }}>Search movies</label>
        <input ref={input} id={compact ? "global-search-mobile" : "global-search"} value={value} onChange={(event) => { setValue(event.target.value); setOpen(true); }} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); submit(event.currentTarget.value); } }} onFocus={() => setOpen(true)} placeholder="Search movies, franchises, and stories..." autoComplete="off" />
        {value && <button className="clear" type="button" onClick={() => { setValue(""); setSuggestions([]); }} aria-label="Clear search"><X size={17} /></button>}
        {!value && <span className="shortcut">⌘ K</span>}
        <button className="submit" aria-label="Search">{loading ? <LoaderCircle className="spinner" size={17} /> : <Search size={17} />}</button>
      </form>
      {open && (value.trim().length >= 2 || history.length > 0) && (
        <div className="dropdown" role="listbox" aria-label="Search suggestions">
          {loading && <div className="hint">Procurando...</div>}
          {!value.trim() && history.length > 0 && <><div className="hint">Pesquisas recentes</div>{history.map((item) => <button key={item} className="suggestion history" onClick={() => { setValue(item); submit(item); }}><Clock3 size={17} /><strong>{item}</strong></button>)}</>}
          {value.trim() && suggestions.map((movie) => <button key={movie.id} className="suggestion" onClick={() => { setOpen(false); navigate(`/filme/${movie.id}`); }}>{imageUrl(movie.poster_path, "w92") ? <img src={imageUrl(movie.poster_path, "w92")} alt="" /> : <span /> }<strong>{movie.title}</strong><span>{movieYear(movie.release_date)}</span></button>)}
          {!loading && value.trim().length >= 2 && !suggestions.length && <div className="hint">No suggestions found</div>}
        </div>
      )}
    </Wrap>
  );
}
