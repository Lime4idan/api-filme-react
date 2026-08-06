import EmptyState from "../components/EmptyState";
import LoadingSkeleton from "../components/LoadingSkeleton";
import MovieGrid from "../components/MovieGrid";
import { useFavorites } from "../hooks/useFavorites";
import { Eyebrow, Page, PageHeader } from "../styles/ui";
import { asMovie } from "../utils/movie";

export default function FavoritesPage() {
  const { items, loading } = useFavorites();
  return <Page><PageHeader><div><Eyebrow>Sua curadoria</Eyebrow><h1>Meus favoritos</h1><p>Os filmes que você não quer perder de vista, salvos de forma privada na sua conta.</p></div></PageHeader>{loading ? <LoadingSkeleton /> : items.length ? <MovieGrid movies={items.map(asMovie)} /> : <EmptyState title="Sua lista está esperando" message="Explore o catálogo e use o coração para guardar os filmes que chamarem sua atenção." />}</Page>;
}
