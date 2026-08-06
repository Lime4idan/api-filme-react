import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import FilterBar from "../components/FilterBar";
import LoadingSkeleton from "../components/LoadingSkeleton";
import MovieGrid from "../components/MovieGrid";
import Pagination from "../components/Pagination";
import { movieService } from "../services/movieService";
import { Eyebrow, Page, PageHeader } from "../styles/ui";

const parse = (params) => ({ query: params.get("query") || "", page: Number(params.get("page")) || 1, genre: params.get("genre") || "", year: params.get("year") || "", voteMin: params.get("voteMin") || "", language: params.get("language") || "", sort: params.get("sort") || "popularity" });

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const filters = parse(params);
  const [genres, setGenres] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { movieService.genres().then((result) => setGenres(result.genres || [])).catch(() => {}); }, []);
  useEffect(() => {
    if (!filters.query) { setData(null); return; }
    let active = true; setLoading(true); setError("");
    movieService.search(filters).then((result) => { if (active) setData(result); }).catch((err) => { if (active) setError(err.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [params.toString()]); // eslint-disable-line react-hooks/exhaustive-deps
  const update = (next) => { const updated = new URLSearchParams(); Object.entries(next).forEach(([key, value]) => { if (value && !(key === "sort" && value === "popularity")) updated.set(key, value); }); setParams(updated); };
  return <Page><PageHeader><div><Eyebrow>Pesquisa avançada</Eyebrow><h1>{filters.query ? `Resultados para “${filters.query}”` : "Encontre sua próxima história"}</h1><p>A pesquisa consulta o catálogo do TMDB e aplica filtros sobre múltiplas páginas de resultados.</p></div></PageHeader>{filters.query ? <FilterBar filters={filters} genres={genres} onChange={update} /> : null}{loading ? <LoadingSkeleton /> : error ? <ErrorState message={error} retry={() => update(filters)} /> : data?.results?.length ? <><MovieGrid movies={data.results} /><Pagination page={data.page} totalPages={data.totalPages} onChange={(page) => update({ ...filters, page })} /></> : <EmptyState title={filters.query ? "Nenhum resultado" : "Comece pela barra de pesquisa"} message={filters.query ? "Revise o título ou experimente filtros menos restritivos." : "Pesquise por um título para ver sugestões e resultados completos."} />}</Page>;
}
