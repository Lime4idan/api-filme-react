import { Film, Star } from "lucide-react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { imageUrl, movieYear } from "../utils/movie";
import FavoriteButton from "./FavoriteButton";

const Card = styled.article`
  position: relative;
  min-width: 0;
  .poster { position: relative; display: block; aspect-ratio: 2/3; border-radius: 17px; overflow: hidden; background: #151a29; border: 1px solid ${({ theme }) => theme.colors.border}; }
  img { width: 100%; height: 100%; object-fit: cover; transition: transform .45s ease, filter .3s ease; }
  &:hover img { transform: scale(1.045); filter: brightness(.78); }
  .favorite { position: absolute; top: 10px; right: 10px; opacity: 0; transform: translateY(5px); transition: .2s; }
  &:hover .favorite, &:focus-within .favorite { opacity: 1; transform: none; }
  h3 { margin: 13px 0 7px; font-size: .98rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .meta { display: flex; align-items: center; justify-content: space-between; color: ${({ theme }) => theme.colors.muted}; font-size: .84rem; }
  .rating { display: inline-flex; align-items: center; gap: 5px; color: #f7c75e; }
  @media (hover: none) { .favorite { opacity: 1; transform: none; } }
`;

const Placeholder = styled.div`
  height: 100%; display: grid; place-items: center; color: #646d82;
  background: radial-gradient(circle at 50% 30%, rgba(139,92,246,.25), transparent 45%), #151a29;
  &[hidden] { display: none; }
`;

export default function MovieCard({ movie, showFavorite = true }) {
  const poster = imageUrl(movie.poster_path ?? movie.posterPath, "w500");
  const id = movie.id || movie.tmdbMovieId;
  return (
    <Card data-testid="movie-card">
      <Link className="poster" to={`/filme/${id}`} aria-label={`Ver detalhes de ${movie.title}`}>
        {poster ? <img src={poster} alt={`Pôster de ${movie.title}`} loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.nextElementSibling.hidden = false; }} /> : null}
        <Placeholder hidden={Boolean(poster)} aria-label="Pôster indisponível"><Film size={36} /></Placeholder>
      </Link>
      {showFavorite && <FavoriteButton className="favorite" movie={{ ...movie, id }} compact />}
      <Link to={`/filme/${id}`}><h3 title={movie.title}>{movie.title}</h3></Link>
      <div className="meta"><span>{movieYear(movie.release_date ?? movie.releaseDate)}</span><span className="rating"><Star size={14} fill="currentColor" />{Number((movie.vote_average ?? movie.voteAverage) || 0).toFixed(1)}</span></div>
    </Card>
  );
}
