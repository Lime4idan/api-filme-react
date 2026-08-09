import { Info, Play, Star } from "lucide-react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Button, Eyebrow } from "../styles/ui";
import { imageUrl, movieYear } from "../utils/movie";
import FavoriteButton from "./FavoriteButton";

const Hero = styled.section`
  position: relative; min-height: min(590px, 66vh); display: flex; align-items: flex-end; overflow: hidden; border-radius: 0 0 28px 28px; margin: -28px clamp(-56px, -3.4vw, -20px) 0;
  background: ${({ $image }) => $image ? `url(${$image}) center 24%/cover` : "linear-gradient(135deg,#241c3f,#111522)"};
  &::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(7,9,16,.98) 0%, rgba(7,9,16,.73) 42%, rgba(7,9,16,.15) 75%), linear-gradient(0deg, #090b14 0%, transparent 62%); }
  .content { position: relative; z-index: 1; width: min(720px, 92%); padding: clamp(45px, 7vw, 88px) clamp(24px, 5vw, 72px); }
  h1 { font-size: clamp(2.6rem, 6vw, 5.6rem); line-height: .98; margin-bottom: 18px; text-wrap: balance; }
  .meta { display: flex; align-items: center; flex-wrap: wrap; gap: 16px; color: #c8ceda; font-weight: 600; }
  .score { display: inline-flex; align-items: center; gap: 6px; color: #f8c65c; }
  p { max-width: 650px; color: #c9ced9; line-height: 1.7; margin: 20px 0 26px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .actions { display: flex; flex-wrap: wrap; gap: 11px; }
  @media (max-width: 650px) { min-height: 600px; background-position: 64% center; &::after { background: linear-gradient(0deg,#090b14 4%,rgba(9,11,20,.72) 64%,rgba(9,11,20,.25)); } .content { padding-bottom: 44px; } }
`;

export default function HeroBanner({ movie, trailerKey }) {
  if (!movie) return null;
  return <Hero $image={imageUrl(movie.backdrop_path, "original")}><div className="content"><Eyebrow>Em destaque agora</Eyebrow><h1>{movie.title}</h1><div className="meta"><span className="score"><Star size={17} fill="currentColor" />{Number(movie.vote_average || 0).toFixed(1)}</span><span>{movieYear(movie.release_date)}</span><span>{movie.original_language?.toUpperCase()}</span></div><p>{movie.overview || "Descubra a história, o elenco e todos os detalhes deste destaque."}</p><div className="actions"><Button as={Link} to={`/filme/${movie.id}`}><Info size={18} /> Saiba mais</Button><FavoriteButton movie={movie} />{trailerKey && <Button as="a" href={`https://www.youtube.com/watch?v=${trailerKey}`} target="_blank" rel="noreferrer" $variant="ghost"><Play size={18} /> Assistir trailer</Button>}</div></div></Hero>;
}
