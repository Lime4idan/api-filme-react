import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { movieService } from "../services/movieService";

const Menu = styled.div`
  display: grid; gap: 3px;
  .label { color: #697187; font-size: .7rem; text-transform: uppercase; letter-spacing: .14em; font-weight: 800; padding: 16px 14px 7px; }
  a { color: #8e97aa; padding: 8px 14px; border-radius: 10px; font-size: .88rem; transition: .18s; }
  a:hover, a.active { color: white; background: rgba(139,92,246,.14); }
`;

export default function GenreMenu({ onNavigate }) {
  const [genres, setGenres] = useState([]);
  useEffect(() => { movieService.genres().then((data) => setGenres(data.genres || [])).catch(() => {}); }, []);
  if (!genres.length) return null;
  return <Menu><span className="label">Gêneros</span>{genres.slice(0, 8).map((genre) => <NavLink key={genre.id} to={`/categoria/${genre.id}`} onClick={onNavigate}>{genre.name}</NavLink>)}</Menu>;
}
