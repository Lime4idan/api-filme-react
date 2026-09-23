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

const moods = [[28, "Action"], [878, "Sci-fi"], [27, "Horror"], [16, "Animation"], [35, "Comedy"], [10749, "Romance"]];

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
  return <Home><HeroBanner movie={featured} trailerKey={trailer} /><Discovery><div className="lead"><span className="lead-icon"><Compass size={20} /></span><span><strong>Explore by mood</strong><small>What kind of story fits today?</small></span></div><div className="moods">{moods.map(([id, name]) => <Link key={id} to={`/categoria/${id}`}>{name}<ArrowUpRight size={13} /></Link>)}</div></Discovery><MovieCarousel title={user ? "Made for your taste" : "Start here"} subtitle={user && data.personalized.personalized ? "A living selection shaped by your curation" : "Stories audiences love"} movies={sections.personalized} /><MovieCarousel title="Trending now" subtitle="The movies driving the conversation" movies={sections.popular} ranked /><Manifesto><Flame className="symbol" size={28} /><p>More than watching: discover, organize, and share the stories that become part of you.</p><Link to="/cadastro">Create my space <ArrowUpRight size={17} /></Link></Manifesto><MovieCarousel title="Excellence on screen" subtitle="Great ratings, performances, and unforgettable stories" movies={sections.top} to="/melhores-avaliados" /><MovieCarousel title="Coming next" subtitle="Releases to keep on your radar" movies={sections.upcoming} to="/lancamentos" /><MovieCarousel title="On the big screen" subtitle="What is playing in theaters right now" movies={sections.now} to="/em-cartaz" />{favorites.length > 0 && <MovieCarousel title="Your session continues" subtitle="Return to your personal curation" movies={favorites.map(asMovie)} to="/minha-lista" />}<Manifesto><Sparkles className="symbol" size={27} /><p>Your next favorite movie may be just one click away.</p><Link to="/melhores-avaliados">View acclaimed movies <ArrowUpRight size={17} /></Link></Manifesto></Home>;
}
