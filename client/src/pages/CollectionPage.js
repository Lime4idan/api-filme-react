import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import FilterBar from "../components/FilterBar";
import LoadingSkeleton from "../components/LoadingSkeleton";
import MovieGrid from "../components/MovieGrid";
import Pagination from "../components/Pagination";
import { movieService } from "../services/movieService";
import { Eyebrow, Page, PageHeader } from "../styles/ui";

const definitions = {
  topRated: { title: "Melhores avaliados", eyebrow: "Seleção da comunidade", description: "Filmes que atravessam gêneros e gerações com notas excepcionais.", loader: movieService.topRated },
  upcoming: { title: "Lançamentos", eyebrow: "Na sua agenda", description: "As próximas estreias para acompanhar de perto.", loader: movieService.upcoming },
  nowPlaying: { title: "Em cartaz", eyebrow: "Nas telonas", description: "O que está em exibição nos cinemas neste momento.", loader: movieService.nowPlaying },
};

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
  const description = genreId ? `Explore filmes de ${genre?.name || "deste gênero"}, com filtros que consultam o catálogo completo.` : definition.description;
  return <Page><PageHeader><div><Eyebrow>{genreId ? "Explore por gênero" : definition.eyebrow}</Eyebrow><h1>{title}</h1><p>{description}</p></div></PageHeader><FilterBar filters={filters} genres={genres} showGenre={!genreId} onChange={update} />{loading ? <LoadingSkeleton /> : error ? <ErrorState message={error} retry={() => update({ ...filters })} /> : data?.results?.length ? <><MovieGrid movies={data.results} /><Pagination page={data.page} totalPages={data.totalPages} onChange={(page) => update({ ...filters, page })} /></> : <EmptyState title="Nenhum filme encontrado" message="Tente remover um filtro ou escolher outro período." />}</Page>;
}
