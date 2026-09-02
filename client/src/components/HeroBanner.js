import { Calendar, ChevronDown, Info, Play, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../styles/ui";
import { imageUrl, movieYear } from "../utils/movie";
import FavoriteButton from "./FavoriteButton";

const Hero = styled.section`
  position: relative;
  min-height: min(700px, calc(100vh - 112px));
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 30px;
  background: ${({ $image }) => $image ? `url(${$image}) center 22%/cover` : "linear-gradient(135deg,#2d1525,#121318)"};
  box-shadow: 0 36px 110px rgba(0,0,0,.42);

  &::before { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at 74% 35%, transparent 0 28%, rgba(5,6,8,.08) 54%, rgba(5,6,8,.56) 100%); }
  &::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(5,6,8,.98) 0%, rgba(5,6,8,.8) 36%, rgba(5,6,8,.18) 74%), linear-gradient(0deg, rgba(6,7,9,.95) 0%, transparent 62%); }
  .content { position: relative; z-index: 1; width: min(810px, 92%); padding: clamp(48px, 7vw, 94px) clamp(27px, 5.4vw, 82px); animation: fadeUp .65s .08s ease both; }
  .spotlight { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 20px; padding: 7px 11px; border: 1px solid rgba(255,255,255,.13); border-radius: 999px; background: rgba(10,11,14,.42); color: #ececf0; font-size: .7rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; backdrop-filter: blur(14px); }
  .spotlight svg { color: ${({ theme }) => theme.colors.accent}; }
  h1 { font-size: clamp(3.3rem, 7.2vw, 7rem); line-height: .88; margin-bottom: 24px; max-width: 780px; text-wrap: balance; text-shadow: 0 8px 35px rgba(0,0,0,.38); }
  .meta { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; color: #c8cbd2; font-weight: 700; font-size: .84rem; }
  .meta > span { display: inline-flex; align-items: center; gap: 6px; }
  .score { padding: 7px 10px; border-radius: 999px; background: rgba(255,188,91,.13); color: #ffd27f; }
  .language { padding: 5px 8px; border: 1px solid rgba(255,255,255,.18); border-radius: 6px; font-size: .68rem; letter-spacing: .08em; }
  p { max-width: 670px; color: #c9cbd2; line-height: 1.7; margin: 22px 0 29px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; font-size: clamp(.94rem,1.2vw,1.06rem); }
  .actions { display: flex; flex-wrap: wrap; gap: 11px; }
  .edition { position: absolute; z-index: 1; top: 42px; right: 42px; display: grid; justify-items: end; color: rgba(255,255,255,.72); font-size: .66rem; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; }
  .edition strong { margin-top: 4px; font: 800 3.5rem/.9 "Manrope"; letter-spacing: -.08em; color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,.33); }
  .scroll-cue { position: absolute; z-index: 2; right: 38px; bottom: 34px; display: flex; align-items: center; gap: 9px; color: rgba(255,255,255,.55); font-size: .7rem; letter-spacing: .12em; text-transform: uppercase; }
  .scroll-cue svg { animation: bob 1.8s ease-in-out infinite; }
  @keyframes bob { 50% { transform: translateY(4px); } }
  @media (max-width: 760px) { min-height: 660px; border-radius: 23px; background-position: 62% center; &::after { background: linear-gradient(0deg,#060709 3%,rgba(6,7,9,.68) 56%,rgba(6,7,9,.08)); } .content { width: 100%; padding-bottom: 48px; } .edition, .scroll-cue { display: none; } h1 { font-size: clamp(3rem,14vw,5.3rem); } }
`;

export default function HeroBanner({ movie, trailerKey }) {
  if (!movie) return null;
  return <Hero $image={imageUrl(movie.backdrop_path, "original")}><div className="edition">MovieHub selection<strong>01</strong></div><div className="content"><span className="spotlight"><Sparkles size={14} /> Destaque da semana</span><h1>{movie.title}</h1><div className="meta"><span className="score"><Star size={15} fill="currentColor" />{Number(movie.vote_average || 0).toFixed(1)} TMDB</span><span><Calendar size={15} />{movieYear(movie.release_date)}</span><span className="language">{movie.original_language?.toUpperCase()}</span></div><p>{movie.overview || "Descubra a história, o elenco e todos os detalhes deste destaque."}</p><div className="actions"><Button as={Link} to={`/filme/${movie.id}`}><Play size={17} fill="currentColor" /> Explorar filme</Button><FavoriteButton movie={movie} />{trailerKey && <Button as="a" href={`https://www.youtube.com/watch?v=${trailerKey}`} target="_blank" rel="noreferrer" $variant="ghost"><Info size={18} /> Assistir trailer</Button>}</div></div><span className="scroll-cue">Role para descobrir <ChevronDown size={16} /></span></Hero>;
}
