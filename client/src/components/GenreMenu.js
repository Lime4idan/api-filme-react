import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { movieService } from "../services/movieService";

const Menu = styled.div`
  display: grid; gap: 3px;
  .label { color: #5f6571; font-size: .66rem; text-transform: uppercase; letter-spacing: .18em; font-weight: 800; padding: 25px 13px 8px; }
  a { position: relative; color: #7f8591; padding: 7px 13px 7px 29px; border-radius: 10px; font-size: .83rem; transition: .18s; }
  a::before { content: ""; position: absolute; left: 14px; top: 50%; width: 4px; height: 4px; border-radius: 50%; background: #454a54; transform: translateY(-50%); }
  a:hover, a.active { color: white; background: rgba(255,255,255,.045); }
  a.active::before { background: ${({ theme }) => theme.colors.coral}; box-shadow: 0 0 10px currentColor; }
`;

export default function GenreMenu({ onNavigate }) {
  const [genres, setGenres] = useState([]);
  useEffect(() => { movieService.genres().then((data) => setGenres(data.genres || [])).catch(() => {}); }, []);
  if (!genres.length) return null;
  return <Menu><span className="label">Gêneros</span>{genres.slice(0, 8).map((genre) => <NavLink key={genre.id} to={`/categoria/${genre.id}`} onClick={onNavigate}>{genre.name}</NavLink>)}</Menu>;
}
