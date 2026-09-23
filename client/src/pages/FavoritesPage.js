import EmptyState from "../components/EmptyState";
import LoadingSkeleton from "../components/LoadingSkeleton";
import MovieGrid from "../components/MovieGrid";
import { useFavorites } from "../hooks/useFavorites";
import { Eyebrow, Page, PageHeader } from "../styles/ui";
import { asMovie } from "../utils/movie";

export default function FavoritesPage() {
  const { items, loading } = useFavorites();
  return <Page><PageHeader><div><Eyebrow>Your curation</Eyebrow><h1>My favorites</h1><p>Movies you want to keep close, saved privately to your account.</p></div></PageHeader>{loading ? <LoadingSkeleton /> : items.length ? <MovieGrid movies={items.map(asMovie)} /> : <EmptyState title="Your list is waiting" message="Explore the catalog and use the heart to save movies that catch your attention." />}</Page>;
}
