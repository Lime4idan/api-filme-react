import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import FilterBar from "../components/FilterBar";
import LoadingSkeleton from "../components/LoadingSkeleton";
import MovieGrid from "../components/MovieGrid";
import Pagination from "../components/Pagination";
import { movieService } from "../services/movieService";
import { Eyebrow, Page, PageHeader } from "../styles/ui";

const definitions = {
  topRated: { title: "Top rated", eyebrow: "Community favorites", description: "Exceptional movies that transcend genres and generations.", loader: movieService.topRated },
  upcoming: { title: "Upcoming", eyebrow: "On your calendar", description: "The next releases worth keeping on your radar.", loader: movieService.upcoming },
  nowPlaying: { title: "Now playing", eyebrow: "On the big screen", description: "Movies currently playing in theaters.", loader: movieService.nowPlaying },
};

const CatalogueHeader = styled(PageHeader)`
  position: relative;
  overflow: hidden;
  align-items: center;
  min-height: 260px;
  padding: clamp(28px,4vw,48px);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 26px;
  background: radial-gradient(circle at 84% 30%,rgba(255,54,94,.16),transparent 20rem),linear-gradient(125deg,#171016,#0b0d11 58%);
  box-shadow: 0 25px 75px rgba(0,0,0,.26);
  &::after { content: "CINEMA"; position: absolute; right: -20px; bottom: -32px; color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,.08); font: 800 clamp(4.8rem,11vw,10rem)/1 "Manrope"; letter-spacing: -.08em; }
  > div { position: relative; z-index: 1; }
  .catalog-meta { position: relative; z-index: 1; display: grid; justify-items: end; gap: 8px; }
  .catalog-meta strong { font: 800 clamp(2.6rem,5vw,4.5rem)/1 "Manrope"; }
  .catalog-meta span { color: ${({ theme }) => theme.colors.muted}; font-size: .72rem; letter-spacing: .14em; text-transform: uppercase; }
  @media (max-width: 650px) { min-height: 230px; .catalog-meta { display: none; } }
`;

const fromParams = (params) => ({ page: Number(params.get("page")) || 1, genre: params.get("genre") || "", year: params.get("year") || "", voteMin: params.get("voteMin") || "", language: params.get("language") || "", sort: params.get("sort") || "popularity" });

export default function CollectionPage({ type }) {
  const { genreId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = fromParams(searchParams);
  const [genres, setGenres] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const definition = genreId ? null : definitions[type];
  const genre = genres.find((item) => item.id === Number(genreId));
  useEffect(() => { movieService.genres().then((result) => setGenres(result.genres || [])).catch(() => {}); }, []);
  useEffect(() => {
    let active = true; setLoading(true); setError("");
    const hasFilters = genreId || filters.genre || filters.year || filters.voteMin || filters.language || filters.sort !== "popularity";
    const request = hasFilters ? movieService.discover({ ...filters, genre: genreId || filters.genre }) : definition.loader(filters.page);
    request.then((result) => { if (active) setData(result); }).catch((err) => { if (active) setError(err.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [genreId, type, searchParams.toString()]); // eslint-disable-line react-hooks/exhaustive-deps
  const update = (next) => { const params = new URLSearchParams(); Object.entries(next).forEach(([key, value]) => { if (value && !(key === "sort" && value === "popularity")) params.set(key, value); }); setSearchParams(params); };
  const title = genreId ? (genre?.name || "Categoria") : definition.title;
  const description = genreId ? `Explore ${genre?.name || "this genre"} movies with filters across the full catalog.` : definition.description;
  return <Page><CatalogueHeader><div><Eyebrow>{genreId ? "Explore by genre" : definition.eyebrow}</Eyebrow><h1>{title}</h1><p>{description}</p></div><div className="catalog-meta"><strong>{data?.totalResults?.toLocaleString("en-US") || "∞"}</strong><span>stories to discover</span></div></CatalogueHeader><FilterBar filters={filters} genres={genres} showGenre={!genreId} onChange={update} />{loading ? <LoadingSkeleton /> : error ? <ErrorState message={error} retry={() => update({ ...filters })} /> : data?.results?.length ? <><MovieGrid movies={data.results} /><Pagination page={data.page} totalPages={data.totalPages} onChange={(page) => update({ ...filters, page })} /></> : <EmptyState title="No movies found" message="Try removing a filter or choosing a different period." />}</Page>;
}
