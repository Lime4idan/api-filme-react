import { useEffect, useState } from "react";
import {
  Container,
  Movie,
  MovieList,
  SectionTitle,
  Sidebar,
  Logo,
  Menu,
  MainContent,
  SearchBar,
  Hero,
  HeroContent,
  HeroOverlay,
  HeroButtons,
  Layout,
} from "./style";

import { Link } from "react-router-dom";

function Home() {
  const imagePath = "https://image.tmdb.org/t/p/original";
  const posterPath = "https://image.tmdb.org/t/p/w500";

  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");

  const KEY = process.env.REACT_APP_KEY;

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${KEY}&language=pt-BR`
    )
      .then((res) => res.json())
      .then((data) => setMovies(data.results));
  }, [KEY]);

  const featured = movies[0];

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <Sidebar>
        <Logo>
          Movie<span>Hub</span>
        </Logo>

        <Menu>
          <a href="/" className="active">
            Home
          </a>

          <a href="/">Filmes</a>

          <a href="/">Populares</a>

          <a href="/">Favoritos</a>
        </Menu>
      </Sidebar>

      <MainContent>
        <SearchBar>
          <input
            type="text"
            placeholder="Pesquisar filmes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchBar>

        {featured && (
          <Hero
            style={{
              backgroundImage: `url(${imagePath}${featured.backdrop_path})`,
            }}
          >
            <HeroOverlay />

            <HeroContent>
              <h1>{featured.title}</h1>

              <div className="meta">
                <span>⭐ {featured.vote_average?.toFixed(1)}</span>

                <span>
                  {new Date(featured.release_date).getFullYear()}
                </span>
              </div>

              <p>
                {featured.overview?.slice(0, 250)}
              </p>

              <HeroButtons>
                <Link to={`/${featured.id}`}>
                  <button>Ver Detalhes</button>
                </Link>
              </HeroButtons>
            </HeroContent>
          </Hero>
        )}

        <Container>
          <SectionTitle>Filmes Populares</SectionTitle>

          <MovieList>
            {filteredMovies.map((movie) => (
              <Movie key={movie.id}>
                <Link to={`/${movie.id}`}>
                  <img
                    src={`${posterPath}${movie.poster_path}`}
                    alt={movie.title}
                  />
                </Link>

                <div className="info">
                  <h3>{movie.title}</h3>

                  <div className="meta">
                    <span>⭐ {movie.vote_average?.toFixed(1)}</span>

                    <span>
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                  </div>
                </div>
              </Movie>
            ))}
          </MovieList>
        </Container>
      </MainContent>
    </Layout>
  );
}

export default Home;