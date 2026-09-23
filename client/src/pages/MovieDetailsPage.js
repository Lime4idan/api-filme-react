import { ArrowLeft, Building2, Calendar, Film, Globe2, Languages, ListPlus, Play, Star, Timer, TrendingUp, UsersRound } from "lucide-react";
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
  position: relative; min-height: 680px; margin: 0 clamp(-68px, -4vw, -22px); overflow: hidden; display: flex; align-items: flex-end;
  background: ${({ $image }) => $image ? `url(${$image}) center 22%/cover` : "radial-gradient(circle at 70% 20%,#421d32,#090b0e 62%)"};
  &::before { content: ""; position: absolute; inset: 0; backdrop-filter: saturate(115%); background: radial-gradient(circle at 72% 28%,transparent,rgba(4,5,7,.22) 52%,rgba(4,5,7,.82)); }
  &::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg,rgba(5,6,8,.98),rgba(5,6,8,.72) 52%,rgba(5,6,8,.16)),linear-gradient(0deg,#060709 0%,transparent 55%); }
  .back { position: absolute; z-index: 3; top: 30px; left: clamp(24px,5vw,72px); display: inline-flex; align-items: center; gap: 8px; padding: 9px 13px; border: 1px solid rgba(255,255,255,.11); border-radius: 999px; background: rgba(5,6,8,.46); color: #c7cad1; cursor: pointer; backdrop-filter: blur(15px); }
  .hero { position: relative; z-index: 1; width: min(1320px, 100%); display: grid; grid-template-columns: 230px minmax(0,1fr); gap: clamp(30px,4vw,60px); align-items: end; padding: 100px clamp(24px,5vw,72px) 66px; }
  .hero-poster { position: relative; aspect-ratio: 2/3; overflow: hidden; border: 1px solid rgba(255,255,255,.15); border-radius: 21px; background: #14171d; box-shadow: 0 30px 80px rgba(0,0,0,.55); }
  .hero-poster img { width: 100%; height: 100%; object-fit: cover; }
  .poster-placeholder { height: 100%; display: grid; place-items: center; color: #676d78; }
  .genres { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
  h1 { font-size: clamp(3rem,6.6vw,6.5rem); line-height: .92; margin-bottom: 14px; max-width: 950px; text-wrap: balance; }
  .tagline { font-size: 1rem; color: #b9bdc6; font-style: italic; }
  .meta { display: flex; flex-wrap: wrap; gap: 11px; color: #c4cad6; margin: 21px 0; font-size: .84rem; font-weight: 700; }
  .meta span { display: inline-flex; align-items: center; gap: 6px; }
  .meta .tmdb { padding: 7px 10px; border-radius: 999px; background: rgba(255,183,92,.13); color: #ffd17c; }
  .overview { max-width: 800px; color: #c9ccd3; line-height: 1.75; font-size: 1rem; }
  .actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 25px; }
  @media (max-width: 780px) { min-height: 720px; background-position: 64% center; &::after { background: linear-gradient(0deg,#060709 0%,rgba(6,7,9,.85) 55%,rgba(6,7,9,.24)); } .hero { grid-template-columns: 110px 1fr; padding-bottom: 42px; } h1 { font-size: clamp(2.7rem,11vw,4.7rem); } .overview { grid-column: 1/-1; } }
  @media (max-width: 520px) { .hero { grid-template-columns: 1fr; } .hero-poster { display: none; } .back { top: 100px; left: 20px; } }
`;
const Content = styled.div`
  display: grid; grid-template-columns: minmax(0,1fr) 360px; gap: clamp(30px,4vw,58px); max-width: 1280px; margin: 0 auto; padding-top: 58px;
  h2 { font-size: 1.65rem; margin-bottom: 20px; }
  .facts { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
  .fact { padding: 18px; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 16px; background: linear-gradient(145deg,rgba(255,255,255,.045),rgba(255,255,255,.018)); }
  .fact span { display: flex; align-items: center; gap: 7px; color: ${({ theme }) => theme.colors.muted}; font-size: .8rem; margin-bottom: 7px; }
  .fact strong { font-size: .94rem; }
  .credits { margin-top: 40px; }
  .people { display: grid; grid-template-columns: repeat(auto-fill,minmax(115px,1fr)); gap: 15px; }
  .person { min-width: 0; }
  .face { aspect-ratio: 1/1.22; border-radius: 15px; overflow: hidden; background: #14171d; display: grid; place-items: center; color: #616773; border: 1px solid rgba(255,255,255,.07); }
  .face img { width: 100%; height: 100%; object-fit: cover; }
  .person strong, .person small { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .person strong { font-size: .83rem; margin-top: 8px; }
  .person small { color: ${({ theme }) => theme.colors.muted}; font-size: .76rem; }
  .community { align-self: start; position: sticky; top: 106px; }
  .community-note { margin-top: 14px; padding: 18px; border: 1px solid rgba(255,255,255,.07); border-radius: 17px; background: rgba(255,255,255,.025); color: ${({ theme }) => theme.colors.muted}; font-size: .84rem; line-height: 1.6; }
  .community-note strong { display: flex; align-items: center; gap: 7px; color: white; margin-bottom: 6px; }
  @media (max-width: 980px) { grid-template-columns: 1fr; .community { position: static; } .facts { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 480px) { .facts { grid-template-columns: 1fr; } }
`;
const Trailer = styled.section`
  max-width: 1180px; margin: 68px auto 0;
  h2 { font-size: 1.8rem; }
  .frame { position: relative; aspect-ratio: 16/9; overflow: hidden; border-radius: 24px; border: 1px solid ${({ theme }) => theme.colors.border}; background: #0d0f13; box-shadow: 0 30px 80px rgba(0,0,0,.35); }
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
  return <Wrap><Backdrop $image={imageUrl(movie.backdrop_path, "original")}><button className="back" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back</button><div className="hero"><div className="hero-poster"><SafeImage src={imageUrl(movie.poster_path)} alt={`Poster for ${movie.title}`} fallback={<span className="poster-placeholder"><Film size={48} /></span>} /></div><div><div className="genres">{movie.genres?.map((genre) => <Chip key={genre.id}>{genre.name}</Chip>)}</div><h1>{movie.title}</h1>{movie.original_title !== movie.title && <p className="tagline">Original title: {movie.original_title}</p>}<div className="meta"><span className="tmdb"><Star size={15} fill="currentColor" /> {Number(movie.vote_average || 0).toFixed(1)} · {movie.vote_count?.toLocaleString("en-US")} votes</span><span><Calendar size={16} /> {formatDate(movie.release_date)}</span><span><Timer size={16} /> {formatRuntime(movie.runtime)}</span></div><p className="overview">{movie.overview || "Synopsis unavailable in English."}</p><div className="actions"><Button as="a" href={trailer ? "#trailer" : undefined} disabled={!trailer}><Play size={17} fill="currentColor" /> Watch trailer</Button><FavoriteButton movie={movie} /><Button $variant="ghost" onClick={() => user ? setListModal(true) : navigate("/login", { state: { from: `/filme/${id}` } })}><ListPlus size={18} /> Add to list</Button></div></div></div></Backdrop><Content><div><h2>Behind the story</h2><div className="facts"><div className="fact"><span><Film size={15} /> Status</span><strong>{movie.status || "Not provided"}</strong></div><div className="fact"><span><Languages size={15} /> Original language</span><strong>{movie.original_language?.toUpperCase() || "—"}</strong></div><div className="fact"><span><Globe2 size={15} /> Countries</span><strong>{movie.production_countries?.map((item) => item.name).join(", ") || "Not provided"}</strong></div><div className="fact"><span><UsersRound size={15} /> Director</span><strong>{director?.name || "Not provided"}</strong></div><div className="fact"><span><Building2 size={15} /> Production</span><strong>{movie.production_companies?.slice(0, 2).map((item) => item.name).join(", ") || "Not provided"}</strong></div><div className="fact"><span><TrendingUp size={15} /> Popularity</span><strong>{Math.round(movie.popularity || 0).toLocaleString("en-US")}</strong></div></div><div className="credits"><h2>Main cast</h2><div className="people">{cast.map((person) => <div className="person" key={person.credit_id}><div className="face"><SafeImage src={imageUrl(person.profile_path, "w185")} alt={person.name} fallback={<UsersRound />} loading="lazy" /></div><strong>{person.name}</strong><small>{person.character || "Cast"}</small></div>)}</div></div></div><aside className="community"><RatingSelector movieId={id} /><div className="community-note"><strong><Star size={16} /> Your opinion matters</strong>Community ratings help others find their next great story.</div></aside></Content>{trailer && <Trailer id="trailer"><h2>Watch the trailer</h2><div className="frame"><iframe src={`https://www.youtube-nocookie.com/embed/${trailer.key}`} title={`Trailer for ${movie.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div></Trailer>}<MovieCarousel title="You may also like" subtitle="Recommendations based on this movie" movies={data.recommendations.results} /><MovieCarousel title="In the same universe" subtitle="Stories with a similar atmosphere" movies={data.similar.results.filter((item) => !data.recommendations.results.some((other) => other.id === item.id))} /><CommentSection movieId={id} />{listModal && <AddToListModal movie={movie} onClose={() => setListModal(false)} />}</Wrap>;
}
