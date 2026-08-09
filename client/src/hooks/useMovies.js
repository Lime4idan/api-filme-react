import { useCallback, useEffect, useState } from "react";

export default function useMovies(loader, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try { setData(await loader()); } catch (err) { setError(err.message); } finally { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => { load(); }, [load]);
  return { data, loading, error, retry: load, setData };
}
