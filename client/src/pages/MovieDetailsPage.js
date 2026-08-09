import { Building2, Calendar, Film, Globe2, Languages, ListPlus, Play, Star, Timer, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import AddToListModal from "../components/AddToListModal";
import CommentSection from "../components/CommentSection";
import ErrorState from "../components/ErrorState";
import FavoriteButton from "../components/FavoriteButton";
import LoadingSkeleton from "../components/LoadingSkeleton";
import MovieCarousel from "../components/MovieCarousel";
import RatingSelector from "../components/RatingSelector";
import SafeImage from "../components/SafeImage";
import { useAuth } from "../hooks/useAuth";
import { movieService } from "../services/movieService";
import { Button, Chip, Page } from "../styles/ui";
import { formatDate, formatRuntime, imageUrl } from "../utils/movie";

const Wrap = styled(Page)`padding-top: 0;`;
const Backdrop = styled.section`
  position: relative; min-height: 560px; margin: 0 clamp(-56px, -3.4vw, -20px); overflow: hidden; display: flex; align-items: flex-end;
  background: ${({ $image }) => $image ? `url(${$image}) center 24%/cover` : "radial-gradient(circle at 70% 20%,#38255d,#0b0e18 62%)"};
  &::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg,rgba(7,9,16,.98),rgba(7,9,16,.54) 58%,rgba(7,9,16,.18)),linear-gradient(0deg,#090b14,transparent 65%); }
  .hero { position: relative; z-index: 1; width: min(850px, 92%); padding: 80px clamp(24px,5vw,72px) 60px; }
  .genres { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
  h1 { font-size: clamp(2.6rem,6vw,5.3rem); line-height: 1; margin-bottom: 12px; }
  .tagline { font-size: 1.08rem; color: #c8cedb; font-style: italic; }
  .meta { display: flex; flex-wrap: wrap; gap: 16px; color: #c4cad6; margin: 18px 0; }
  .meta span { display: inline-flex; align-items: center; gap: 6px; }
  .overview { max-width: 760px; color: #d4d8e1; line-height: 1.75; }
  .actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 25px; }
`;
const Content = styled.div`
  display: grid; grid-template-columns: 260px minmax(0,1fr); gap: clamp(28px,4vw,56px); max-width: 1200px; margin: 0 auto; padding-top: 48px;
  .poster { aspect-ratio: 2/3; overflow: hidden; border-radius: 20px; background: #171c2c; box-shadow: ${({ theme }) => theme.shadow}; }
  .poster img { width: 100%; height: 100%; object-fit: cover; }
  .poster-placeholder { height: 100%; display: grid; place-items: center; color: #697187; }
  .facts { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
  .fact { padding: 16px; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 14px; background: rgba(255,255,255,.03); }
  .fact span { display: flex; align-items: center; gap: 7px; color: ${({ theme }) => theme.colors.muted}; font-size: .8rem; margin-bottom: 7px; }
  .fact strong { font-size: .94rem; }
  .credits { margin-top: 28px; }
  .people { display: grid; grid-template-columns: repeat(auto-fill,minmax(110px,1fr)); gap: 14px; }
  .person { min-width: 0; }
  .face { aspect-ratio: 1/1.25; border-radius: 13px; overflow: hidden; background: #171c2c; display: grid; place-items: center; color: #616a7e; }
  .face img { width: 100%; height: 100%; object-fit: cover; }
  .person strong, .person small { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .person strong { font-size: .83rem; margin-top: 8px; }
  .person small { color: ${({ theme }) => theme.colors.muted}; font-size: .76rem; }
  @media (max-width: 800px) { grid-template-columns: 1fr; .poster { width: min(260px,70vw); margin: 0 auto; } .facts { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 480px) { .facts { grid-template-columns: 1fr; } }
`;
const Trailer = styled.section`
  max-width: 1100px; margin: 54px auto 0;
  .frame { position: relative; aspect-ratio: 16/9; overflow: hidden; border-radius: 20px; border: 1px solid ${({ theme }) => theme.colors.border}; background: #101421; }
  iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
`;

export default function MovieDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [listModal, setListModal] = useState(false);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true; setData(null); setError(""); window.scrollTo(0, 0);
    Promise.all([movieService.details(id), movieService.credits(id), movieService.videos(id), movieService.recommendations(id), movieService.similar(id)])
      .then(([movie, credits, videos, recommendations, similar]) => { if (active) setData({ movie, credits, videos, recommendations, similar }); })
      .catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [id, version]);
  const trailer = data?.videos.results?.find((item) => item.type === "Trailer") || data?.videos.results?.[0];
  const director = data?.credits.crew?.find((person) => person.job === "Director");
  const cast = useMemo(() => data?.credits.cast?.slice(0, 10) || [], [data]);
  if (error) return <Wrap><ErrorState message={error} retry={() => setVersion((value) => value + 1)} /></Wrap>;
  if (!data) return <Wrap style={{ paddingTop: 40 }}><LoadingSkeleton count={10} /></Wrap>;
  const { movie } = data;
  return <Wrap><Backdrop $image={imageUrl(movie.backdrop_path, "original")}><div className="hero"><div className="genres">{movie.genres?.map((genre) => <Chip key={genre.id}>{genre.name}</Chip>)}</div><h1>{movie.title}</h1>{movie.original_title !== movie.title && <p className="tagline">{movie.original_title}</p>}<div className="meta"><span><Star size={17} fill="#f8c65c" color="#f8c65c" /> {Number(movie.vote_average || 0).toFixed(1)} ({movie.vote_count?.toLocaleString("pt-BR")} votos)</span><span><Calendar size={17} /> {formatDate(movie.release_date)}</span><span><Timer size={17} /> {formatRuntime(movie.runtime)}</span></div><p className="overview">{movie.overview || "Sinopse não disponível em português."}</p><div className="actions"><FavoriteButton movie={movie} /><Button $variant="ghost" onClick={() => user ? setListModal(true) : navigate("/login", { state: { from: `/filme/${id}` } })}><ListPlus size={18} /> Adicionar à lista</Button>{trailer && <Button as="a" href="#trailer"><Play size={18} /> Ver trailer</Button>}</div></div></Backdrop><Content><aside><div className="poster"><SafeImage src={imageUrl(movie.poster_path)} alt={`Pôster de ${movie.title}`} fallback={<Film size={48} />} /></div></aside><div><h2>Ficha do filme</h2><div className="facts"><div className="fact"><span><Film size={15} /> Status</span><strong>{movie.status || "Não informado"}</strong></div><div className="fact"><span><Languages size={15} /> Idioma original</span><strong>{movie.original_language?.toUpperCase() || "—"}</strong></div><div className="fact"><span><Globe2 size={15} /> Países</span><strong>{movie.production_countries?.map((item) => item.name).join(", ") || "Não informados"}</strong></div><div className="fact"><span><UsersRound size={15} /> Direção</span><strong>{director?.name || "Não informada"}</strong></div><div className="fact"><span><Building2 size={15} /> Produção</span><strong>{movie.production_companies?.slice(0, 2).map((item) => item.name).join(", ") || "Não informada"}</strong></div><div className="fact"><span><Star size={15} /> Popularidade</span><strong>{Math.round(movie.popularity || 0).toLocaleString("pt-BR")}</strong></div></div><div className="credits"><h2>Elenco principal</h2><div className="people">{cast.map((person) => <div className="person" key={person.credit_id}><div className="face"><SafeImage src={imageUrl(person.profile_path, "w185")} alt={person.name} fallback={<UsersRound />} loading="lazy" /></div><strong>{person.name}</strong><small>{person.character || "Elenco"}</small></div>)}</div></div><div style={{ marginTop: 30 }}><RatingSelector movieId={id} /></div></div></Content>{trailer && <Trailer id="trailer"><h2>Trailer</h2><div className="frame"><iframe src={`https://www.youtube-nocookie.com/embed/${trailer.key}`} title={`Trailer de ${movie.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div></Trailer>}<MovieCarousel title="Recomendados para quem gostou" movies={data.recommendations.results} /><MovieCarousel title="Filmes semelhantes" movies={data.similar.results.filter((item) => !data.recommendations.results.some((other) => other.id === item.id))} /><CommentSection movieId={id} />{listModal && <AddToListModal movie={movie} onClose={() => setListModal(false)} />}</Wrap>;
}
