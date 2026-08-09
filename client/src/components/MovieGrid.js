import styled from "styled-components";
import MovieCard from "./MovieCard";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(170px, 42vw), 1fr));
  gap: clamp(20px, 2.5vw, 30px) clamp(14px, 2vw, 24px);
`;

export default function MovieGrid({ movies = [], showFavorite = true }) {
  return <Grid>{movies.map((movie) => <MovieCard key={movie.id || movie.tmdbMovieId} movie={movie} showFavorite={showFavorite} />)}</Grid>;
}
