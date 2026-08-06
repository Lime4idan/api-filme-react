import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { movieSnapshot } from "../utils/movie";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const Context = createContext(null);

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    try { setItems((await api.get("/favorites", { params: { limit: 50 } })).data.items); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { refresh().catch(() => setItems([])); }, [refresh]);

  const isFavorite = useCallback((id) => items.some((item) => item.tmdbMovieId === Number(id)), [items]);

  const toggle = useCallback(async (movie) => {
    if (!user) throw new Error("Entre na sua conta para salvar filmes.");
    const snapshot = movieSnapshot(movie);
    const exists = isFavorite(snapshot.tmdbMovieId);
    const previous = items;
    setItems((current) => exists ? current.filter((item) => item.tmdbMovieId !== snapshot.tmdbMovieId) : [{ ...snapshot, id: `temp-${snapshot.tmdbMovieId}`, createdAt: new Date().toISOString() }, ...current]);
    try {
      if (exists) {
        await api.delete(`/favorites/${snapshot.tmdbMovieId}`);
        toast.success("Removido dos favoritos");
      } else {
        const { data } = await api.post("/favorites", snapshot);
        setItems((current) => current.map((item) => item.tmdbMovieId === snapshot.tmdbMovieId ? data.favorite : item));
        toast.success("Filme salvo nos favoritos");
      }
    } catch (error) {
      setItems(previous);
      throw error;
    }
  }, [user, isFavorite, items, toast]);

  const value = useMemo(() => ({ items, loading, isFavorite, toggle, refresh }), [items, loading, isFavorite, toggle, refresh]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useFavorites = () => useContext(Context);
