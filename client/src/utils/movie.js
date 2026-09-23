export const TMDB_IMAGE = "https://image.tmdb.org/t/p";

export const imageUrl = (path, size = "w500") => (
  path ? (/^https?:\/\//i.test(path) ? path : `${TMDB_IMAGE}/${size}${path}`) : null
);

export const movieYear = (date) => {
  if (!date) return "—";
  const year = String(date).slice(0, 4);
  return /^\d{4}$/.test(year) ? year : "—";
};

export const formatDate = (date) => {
  if (!date) return "Not provided";
  const value = new Date(`${String(date).slice(0, 10)}T12:00:00`);
  return Number.isNaN(value.getTime()) ? "Not provided" : value.toLocaleDateString("en-US");
};

export const formatRuntime = (minutes) => {
  if (!minutes) return "Runtime not provided";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours ? `${hours}h ` : ""}${rest}min`;
};

export const movieSnapshot = (movie) => ({
  tmdbMovieId: Number(movie.id || movie.tmdbMovieId),
  title: movie.title,
  posterPath: movie.poster_path ?? movie.posterPath ?? null,
  releaseDate: movie.release_date ?? movie.releaseDate ?? null,
  voteAverage: movie.vote_average ?? movie.voteAverage ?? null,
});

export const asMovie = (item) => ({
  ...item,
  id: item.id || item.tmdbMovieId,
  poster_path: item.poster_path ?? item.posterPath,
  release_date: item.release_date ?? item.releaseDate,
  vote_average: item.vote_average ?? item.voteAverage,
});
