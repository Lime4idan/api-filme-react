import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./styles.css";

const Movie = () => {
  const { id } = useParams();

  const imagePath = "https://image.tmdb.org/t/p/original";

  const [movie, setMovie] = useState(null);

  const KEY = process.env.REACT_APP_KEY;

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${KEY}&language=pt-BR`
    )
      .then((res) => res.json())
      .then((data) => setMovie(data));
  }, [id, KEY]);

  if (!movie) {
    return (
      <div className="loading">
        <h1>Carregando...</h1>
      </div>
    );
  }

  return (
    <div className="movie-page">
      <div
        className="hero-movie"
        style={{
          backgroundImage: `url(${imagePath}${movie.backdrop_path})`,
        }}
      >
        <div className="overlay" />

        <div className="hero-content">
          <h1>{movie.title}</h1>

          <div className="movie-meta">
            <span>⭐ {movie.vote_average?.toFixed(1)}</span>
            <span>{movie.release_date}</span>
            <span>{movie.runtime} min</span>
          </div>

          <p>{movie.overview}</p>

          <Link to="/">
            <button>← Voltar</button>
          </Link>
        </div>
      </div>

      <div className="details-container">
        <div className="poster-area">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
        </div>

        <div className="info-area">
          <h2>Informações</h2>

          <div className="info-card">
            <h3>Título Original</h3>
            <p>{movie.original_title}</p>
          </div>

          <div className="info-card">
            <h3>Popularidade</h3>
            <p>{Math.round(movie.popularity)}</p>
          </div>

          <div className="info-card">
            <h3>Nota Média</h3>
            <p>{movie.vote_average?.toFixed(1)}/10</p>
          </div>

          <div className="info-card">
            <h3>Votos</h3>
            <p>{movie.vote_count}</p>
          </div>

          <div className="info-card">
            <h3>Status</h3>
            <p>{movie.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movie;