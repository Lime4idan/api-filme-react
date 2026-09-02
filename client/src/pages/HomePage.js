import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Compass, Flame, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
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

const Home = styled(Page)`
  padding-top: 24px;
  @media (max-width: 920px) { padding-top: 104px; }
`;

const Discovery = styled.section`
  display: grid;
  grid-template-columns: minmax(220px,.8fr) minmax(0,2fr);
  gap: 22px;
  align-items: center;
  margin-top: 27px;
  padding: 18px 20px;
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 20px;
  background: linear-gradient(105deg,rgba(255,54,94,.075),rgba(255,255,255,.025) 45%,rgba(145,130,255,.055));

  .lead { display: flex; align-items: center; gap: 12px; }
  .lead-icon { width: 42px; height: 42px; display: grid; place-items: center; flex: 0 0 auto; border-radius: 13px; background: rgba(255,54,94,.14); color: ${({ theme }) => theme.colors.coral}; }
  strong { display: block; }
  small { color: ${({ theme }) => theme.colors.muted}; }
  .moods { display: flex; gap: 8px; overflow-x: auto; justify-content: flex-end; scrollbar-width: none; }
  .moods::-webkit-scrollbar { display: none; }
  .moods a { display: inline-flex; align-items: center; gap: 6px; min-height: 38px; padding: 0 13px; border: 1px solid rgba(255,255,255,.08); border-radius: 999px; background: rgba(5,6,8,.35); color: #aaafba; white-space: nowrap; font-size: .8rem; font-weight: 700; transition: .2s; }
  .moods a:hover { color: white; border-color: rgba(255,106,71,.4); background: rgba(255,106,71,.08); }
  @media (max-width: 760px) { grid-template-columns: 1fr; .moods { justify-content: flex-start; } }
`;

const Manifesto = styled.section`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 18px;
  margin-top: 66px;
  padding: 26px 0;
  border-block: 1px solid rgba(255,255,255,.07);
  .symbol { color: ${({ theme }) => theme.colors.primary}; }
  p { margin: 0; color: #bbbfc8; font: 600 clamp(1.05rem,1.8vw,1.45rem)/1.45 "Manrope"; letter-spacing: -.025em; }
  a { display: inline-flex; align-items: center; gap: 7px; color: ${({ theme }) => theme.colors.accent}; font-weight: 700; white-space: nowrap; }
  @media (max-width: 620px) { grid-template-columns: auto 1fr; a { grid-column: 2; } }
`;

const moods = [[28, "Ação"], [878, "Sci-fi"], [27, "Terror"], [16, "Animação"], [35, "Comédia"], [10749, "Romance"]];

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
    const withoutFeatured = () => new Set(featured ? [featured.id] : []);
    const popularOffset = [...(data.popular.results || []).slice(8), ...(data.popular.results || []).slice(0, 8)];
    return {
      personalized: uniqueSection(data.personalized.results, withoutFeatured()),
      popular: uniqueSection(popularOffset, withoutFeatured()),
      top: uniqueSection(data.top.results, withoutFeatured()),
      upcoming: uniqueSection(data.upcoming.results, withoutFeatured()),
      now: uniqueSection(data.now.results, withoutFeatured()),
    };
  }, [data, featured]);
  if (error) return <Home><ErrorState message={error} retry={() => setVersion((value) => value + 1)} /></Home>;
  if (!data || !sections) return <Home><LoadingSkeleton count={12} /></Home>;
  return <Home><HeroBanner movie={featured} trailerKey={trailer} /><Discovery><div className="lead"><span className="lead-icon"><Compass size={20} /></span><span><strong>Explore por atmosfera</strong><small>Que história combina com hoje?</small></span></div><div className="moods">{moods.map(([id, name]) => <Link key={id} to={`/categoria/${id}`}>{name}<ArrowUpRight size={13} /></Link>)}</div></Discovery><MovieCarousel title={user ? "Feito para o seu gosto" : "Comece por aqui"} subtitle={user && data.personalized.personalized ? "Uma seleção viva a partir da sua curadoria" : "Histórias que conquistaram o público"} movies={sections.personalized} /><MovieCarousel title="Em alta agora" subtitle="Os filmes que estão dominando a conversa" movies={sections.popular} ranked /><Manifesto><Flame className="symbol" size={28} /><p>Mais do que assistir: descubra, organize e compartilhe as histórias que fazem parte de você.</p><Link to="/cadastro">Criar meu espaço <ArrowUpRight size={17} /></Link></Manifesto><MovieCarousel title="Excelência em cena" subtitle="Grandes notas, atuações e histórias inesquecíveis" movies={sections.top} to="/melhores-avaliados" /><MovieCarousel title="Próximos capítulos" subtitle="Estreias para colocar no radar" movies={sections.upcoming} to="/lancamentos" /><MovieCarousel title="Na tela grande" subtitle="O que está em cartaz neste momento" movies={sections.now} to="/em-cartaz" />{favorites.length > 0 && <MovieCarousel title="Sua sessão continua" subtitle="Retome sua curadoria pessoal" movies={favorites.map(asMovie)} to="/minha-lista" />}<Manifesto><Sparkles className="symbol" size={27} /><p>Seu próximo filme favorito pode estar a um clique de distância.</p><Link to="/melhores-avaliados">Ver aclamados <ArrowUpRight size={17} /></Link></Manifesto></Home>;
}
