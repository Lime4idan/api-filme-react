import { CalendarDays, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ErrorState from "../components/ErrorState";
import MovieGrid from "../components/MovieGrid";
import Pagination from "../components/Pagination";
import ShareButton from "../components/ShareButton";
import api from "../services/api";
import { Eyebrow, Page, PageHeader } from "../styles/ui";
import { asMovie, formatDate } from "../utils/movie";

export default function PublicListPage() {
  const { shareCode } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [list, setList] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { api.get(`/public/lists/${shareCode}`).then(({ data }) => setList(data.list)).catch((err) => setError(err.message)); }, [shareCode]);
  if (error) return <Page><ErrorState message={error} /></Page>;
  if (!list) return <Page><p>Carregando lista pública...</p></Page>;
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const pageSize = 24;
  const totalPages = Math.max(Math.ceil(list.items.length / pageSize), 1);
  const visible = list.items.slice((page - 1) * pageSize, page * pageSize);
  return <Page><PageHeader><div><Eyebrow>Curadoria compartilhada</Eyebrow><h1>{list.name}</h1><p>{list.description || "Uma seleção criada na comunidade MovieHub."}</p><p><Link to={`/usuario/${list.user.id}`}><UserRound size={15} /> {list.user.name}</Link> · {list._count.items} filmes · <CalendarDays size={15} /> Atualizada em {formatDate(list.updatedAt)}</p></div><ShareButton title={list.name} text={`Lista de ${list.user.name} no MovieHub`} /></PageHeader><MovieGrid movies={visible.map(asMovie)} /><Pagination page={page} totalPages={totalPages} onChange={(nextPage) => setSearchParams(nextPage > 1 ? { page: String(nextPage) } : {})} /></Page>;
}
