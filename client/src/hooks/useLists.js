import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./useAuth";

export default function useLists(autoLoad = true) {
  const { user } = useAuth();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const refresh = useCallback(async () => {
    if (!user) { setLists([]); return []; }
    setLoading(true);
    try {
      const result = (await api.get("/lists")).data.lists;
      setLists(result);
      return result;
    } finally { setLoading(false); }
  }, [user]);
  useEffect(() => { if (autoLoad) refresh().catch(() => setLists([])); }, [autoLoad, refresh]);
  return { lists, loading, refresh, setLists };
}
