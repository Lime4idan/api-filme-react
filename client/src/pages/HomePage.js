import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import ErrorState from "../components/ErrorState";
import HeroBanner from "../components/HeroBanner";
import LoadingSkeleton from "../components/LoadingSkeleton";
import MovieCarousel from "../components/MovieCarousel";
import { useAuth } from "../hooks/useAuth";
import { useFavorites } from "../hooks/useFavorites";
import api from "../services/api";
import { movieService } from "../services/movieService";
import { Page } from "../styles/ui";
import { asMovie } from "../utils/movie";

const Home = styled(Page)`padding-top: 28px;`;

const uniqueSection = (movies, used) => (movies || []).filter((movie) => {
  if (used.has(movie.id)) return false;
  used.add(movie.id);
  return true;
}).slice(0, 14);

export default function HomePage() {
  const { user } = useAuth();
  const { items: favorites } = useFavorites();
  const [data, setData] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    setError("");
    Promise.all([movieService.popular(), movieService.topRated(), movieService.upcoming(), movieService.nowPlaying()])
      .then(async ([popular, top, upcoming, now]) => {
        const personalized = user ? await api.get("/recommendations/personalized").then(({ data: result }) => result).catch(() => popular) : popular;
        if (active) setData({ popular, top, upcoming, now, personalized });
      })
      .catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [user, version]);
  const featured = data?.popular.results?.find((movie) => movie.backdrop_path && movie.overview) || data?.popular.results?.[0];
  useEffect(() => {
    if (!featured) return;
    movieService.videos(featured.id).then((result) => setTrailer(result.results.find((item) => item.type === "Trailer")?.key || null)).catch(() => setTrailer(null));
  }, [featured]);
  const sections = useMemo(() => {
    if (!data) return null;
    const used = new Set(featured ? [featured.id] : []);
    return {
      popular: uniqueSection(data.popular.results, used),
      top: uniqueSection(data.top.results, used),
      upcoming: uniqueSection(data.upcoming.results, used),
      now: uniqueSection(data.now.results, used),
      personalized: uniqueSection(data.personalized.results, new Set(favorites.map((item) => item.tmdbMovieId))),
    };
  }, [data, featured, favorites]);
  if (error) return <Home><ErrorState message={error} retry={() => setVersion((value) => value + 1)} /></Home>;
  if (!data || !sections) return <Home><LoadingSkeleton count={12} /></Home>;
  return <Home><HeroBanner movie={featured} trailerKey={trailer} /><MovieCarousel title={user ? "Escolhidos para você" : "Para começar a sessão"} subtitle={user && data.personalized.personalized ? "Inspirados no que você salva e avalia" : "Favoritos do público neste momento"} movies={sections.personalized} /><MovieCarousel title="Populares" subtitle="Os títulos que estão movimentando as conversas" movies={sections.popular} /><MovieCarousel title="Aclamados" subtitle="Grandes notas, grandes histórias" movies={sections.top} to="/melhores-avaliados" /><MovieCarousel title="Próximos lançamentos" movies={sections.upcoming} to="/lancamentos" /><MovieCarousel title="Em cartaz" movies={sections.now} to="/em-cartaz" />{favorites.length > 0 && <MovieCarousel title="Salvos recentemente" subtitle="Retome sua curadoria" movies={favorites.map(asMovie)} to="/minha-lista" />}</Home>;
}
