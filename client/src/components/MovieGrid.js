import styled from "styled-components";
import MovieCard from "./MovieCard";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(180px, 42vw), 1fr));
  gap: clamp(30px, 3vw, 42px) clamp(15px, 2.1vw, 26px);
`;

export default function MovieGrid({ movies = [], showFavorite = true }) {
  return <Grid>{movies.map((movie) => <MovieCard key={movie.id || movie.tmdbMovieId} movie={movie} showFavorite={showFavorite} />)}</Grid>;
}
