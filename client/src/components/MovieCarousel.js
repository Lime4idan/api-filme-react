import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import MovieCard from "./MovieCard";

const Section = styled.section`
  margin-top: 64px;
  .head { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 23px; }
  .title-row { display: flex; align-items: center; gap: 13px; }
  .accent { width: 5px; height: 29px; border-radius: 99px; background: linear-gradient(${({ theme }) => theme.colors.coral}, ${({ theme }) => theme.colors.primary}); box-shadow: 0 0 20px rgba(255,54,94,.35); }
  h2 { margin: 0; font-size: clamp(1.45rem, 2.2vw, 2rem); }
  .subtitle { color: ${({ theme }) => theme.colors.muted}; margin: 7px 0 0 18px; font-size: .88rem; }
  .head-actions { display: flex; align-items: center; gap: 8px; }
  .rail-button { width: 38px; height: 38px; display: grid; place-items: center; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 50%; background: rgba(255,255,255,.04); color: #aeb2bb; cursor: pointer; transition: .2s; }
  .rail-button:hover { color: white; background: rgba(255,255,255,.1); transform: translateY(-2px); }
  .all { display: inline-flex; align-items: center; gap: 7px; min-height: 38px; padding: 0 13px; border-radius: 999px; color: ${({ theme }) => theme.colors.muted}; white-space: nowrap; font-weight: 700; font-size: .82rem; }
  .all:hover { color: white; background: rgba(255,255,255,.06); }
  .rail { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(165px, 210px); gap: 20px; overflow-x: auto; padding: 9px 4px 20px; margin-inline: -4px; scroll-snap-type: x mandatory; scrollbar-width: none; }
  .rail::-webkit-scrollbar { display: none; }
  .rail > * { scroll-snap-align: start; }
  @media (max-width: 620px) { margin-top: 50px; .rail { grid-auto-columns: 44vw; gap: 15px; } .rail-button { display: none; } .subtitle { margin-left: 0; } }
`;

export default function MovieCarousel({ title, subtitle, movies = [], to, ranked = false }) {
  const rail = useRef(null);
  if (!movies.length) return null;
  const scroll = (direction) => rail.current?.scrollBy({ left: direction * Math.min(720, rail.current.clientWidth * .78), behavior: "smooth" });
  return <Section><div className="head"><div><div className="title-row"><span className="accent" /><h2>{title}</h2></div>{subtitle && <p className="subtitle">{subtitle}</p>}</div><div className="head-actions"><button className="rail-button" onClick={() => scroll(-1)} aria-label={`Scroll back in ${title}`}><ChevronLeft size={18} /></button><button className="rail-button" onClick={() => scroll(1)} aria-label={`Scroll forward in ${title}`}><ChevronRight size={18} /></button>{to && <Link className="all" to={to}>View all <ArrowRight size={16} /></Link>}</div></div><div className="rail" ref={rail}>{movies.map((movie, index) => <MovieCard key={movie.id || movie.tmdbMovieId} movie={movie} rank={ranked ? index + 1 : undefined} />)}</div></Section>;
}
