import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import MovieCard from "./MovieCard";

const Section = styled.section`
  margin-top: 46px;
  .head { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 19px; }
  h2 { margin: 0; font-size: clamp(1.35rem, 2vw, 1.8rem); }
  .subtitle { color: ${({ theme }) => theme.colors.muted}; margin: 5px 0 0; font-size: .9rem; }
  .all { display: inline-flex; align-items: center; color: ${({ theme }) => theme.colors.muted}; white-space: nowrap; font-weight: 600; }
  .all:hover { color: white; }
  .rail { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(160px, 205px); gap: 18px; overflow-x: auto; padding: 3px 2px 16px; scroll-snap-type: x proximity; }
  .rail > * { scroll-snap-align: start; }
`;

export default function MovieCarousel({ title, subtitle, movies = [], to }) {
  if (!movies.length) return null;
  return <Section><div className="head"><div><h2>{title}</h2>{subtitle && <p className="subtitle">{subtitle}</p>}</div>{to && <Link className="all" to={to}>Ver todos <ChevronRight size={18} /></Link>}</div><div className="rail">{movies.map((movie) => <MovieCard key={movie.id || movie.tmdbMovieId} movie={movie} />)}</div></Section>;
}
