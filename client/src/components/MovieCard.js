import { ArrowUpRight, Film, Star } from "lucide-react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { imageUrl, movieYear } from "../utils/movie";
import FavoriteButton from "./FavoriteButton";

const Card = styled.article`
  position: relative;
  min-width: 0;
  animation: fadeUp .5s ease both;
  .poster { position: relative; display: block; aspect-ratio: 2/3; border-radius: 19px; overflow: hidden; background: #14171d; border: 1px solid rgba(255,255,255,.085); box-shadow: 0 18px 44px rgba(0,0,0,.24); transition: transform .35s cubic-bezier(.2,.75,.2,1), box-shadow .35s ease, border-color .35s ease; }
  .poster::after { content: ""; position: absolute; inset: 36% 0 0; background: linear-gradient(0deg,rgba(4,5,7,.94),rgba(4,5,7,.38),transparent); opacity: 0; transition: opacity .3s ease; }
  img { width: 100%; height: 100%; object-fit: cover; transition: transform .65s cubic-bezier(.2,.7,.2,1), filter .3s ease; }
  &:hover .poster { transform: translateY(-8px); border-color: rgba(255,255,255,.2); box-shadow: 0 28px 65px rgba(0,0,0,.46); }
  &:hover img { transform: scale(1.07); filter: saturate(1.08); }
  &:hover .poster::after { opacity: 1; }
  .favorite { position: absolute; z-index: 3; top: 10px; right: 10px; opacity: 0; transform: translateY(5px); transition: .2s; }
  &:hover .favorite, &:focus-within .favorite { opacity: 1; transform: none; }
  .score { position: absolute; z-index: 2; top: 11px; left: 11px; display: inline-flex; align-items: center; gap: 4px; padding: 6px 8px; border: 1px solid rgba(255,255,255,.13); border-radius: 999px; background: rgba(5,6,8,.72); color: #ffd07a; font-size: .74rem; font-weight: 800; backdrop-filter: blur(12px); }
  .quick { position: absolute; z-index: 2; left: 14px; right: 14px; bottom: 14px; display: flex; align-items: center; justify-content: space-between; color: white; font-size: .78rem; font-weight: 700; opacity: 0; transform: translateY(8px); transition: .28s ease; }
  &:hover .quick, &:focus-within .quick { opacity: 1; transform: none; }
  h3 { margin: 14px 0 7px; font-size: .97rem; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color .2s ease; }
  &:hover h3 { color: ${({ theme }) => theme.colors.coral}; }
  .meta { display: flex; align-items: center; justify-content: space-between; color: ${({ theme }) => theme.colors.muted}; font-size: .84rem; }
  .quality { padding: 2px 7px; border: 1px solid rgba(255,255,255,.12); border-radius: 5px; color: #a8adb8; font-size: .66rem; font-weight: 800; }
  .rank { position: absolute; z-index: -1; left: -23px; bottom: 25px; font: 800 clamp(4rem,6vw,6.5rem)/.8 "Manrope"; letter-spacing: -.1em; color: #08090b; -webkit-text-stroke: 1px rgba(255,255,255,.22); }
  &.ranked { margin-left: 24px; }
  @media (hover: none) { .favorite { opacity: 1; transform: none; } }
`;

const Placeholder = styled.div`
  height: 100%; display: grid; place-items: center; color: #646d82;
  background: radial-gradient(circle at 50% 30%, rgba(139,92,246,.25), transparent 45%), #151a29;
  &[hidden] { display: none; }
`;

export default function MovieCard({ movie, showFavorite = true, rank }) {
  const poster = imageUrl(movie.poster_path ?? movie.posterPath, "w500");
  const id = movie.id || movie.tmdbMovieId;
  return (
    <Card data-testid="movie-card" className={rank ? "ranked" : undefined}>
      {rank && <span className="rank" aria-hidden="true">{rank}</span>}
      <Link className="poster" to={`/filme/${id}`} aria-label={`Ver detalhes de ${movie.title}`}>
        {poster ? <img src={poster} alt={`Pôster de ${movie.title}`} loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.nextElementSibling.hidden = false; }} /> : null}
        <Placeholder hidden={Boolean(poster)} aria-label="Pôster indisponível"><Film size={36} /></Placeholder>
        <span className="score"><Star size={12} fill="currentColor" />{Number((movie.vote_average ?? movie.voteAverage) || 0).toFixed(1)}</span>
        <span className="quick">Ver detalhes <ArrowUpRight size={17} /></span>
      </Link>
      {showFavorite && <FavoriteButton className="favorite" movie={{ ...movie, id }} compact />}
      <Link to={`/filme/${id}`}><h3 title={movie.title}>{movie.title}</h3></Link>
      <div className="meta"><span>{movieYear(movie.release_date ?? movie.releaseDate)}</span><span className="quality">TMDB</span></div>
    </Card>
  );
}
