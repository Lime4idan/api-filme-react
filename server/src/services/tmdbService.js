const axios = require("axios");
const AppError = require("../utils/AppError");
const cache = require("../utils/cache");

const TTL = {
  genres: 24 * 60 * 60 * 1000,
  details: 30 * 60 * 1000,
  collection: 10 * 60 * 1000,
  search: 5 * 60 * 1000,
};

const client = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 8000,
});

const normalizePage = (data) => ({
  page: data.page || 1,
  results: Array.isArray(data.results) ? data.results : [],
  totalPages: Math.min(data.total_pages || 1, 500),
  totalResults: data.total_results || 0,
});

const request = async (path, params = {}) => {
  if (!process.env.TMDB_API_KEY) {
    throw new AppError(503, "TMDB_NOT_CONFIGURED", "A integração com o TMDB ainda não foi configurada");
  }
  try {
    const { data } = await client.get(path, {
      params: { api_key: process.env.TMDB_API_KEY, language: "pt-BR", ...params },
    });
    return data;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      throw new AppError(504, "TMDB_TIMEOUT", "O TMDB demorou demais para responder");
    }
    const status = error.response?.status === 404 ? 404 : 502;
    throw new AppError(status, status === 404 ? "MOVIE_NOT_FOUND" : "TMDB_ERROR", status === 404 ? "Filme não encontrado" : "Não foi possível consultar o TMDB");
  }
};

const cachedRequest = (key, ttl, path, params) => cache.remember(key, ttl, () => request(path, params));

const getCollection = async (collection, page = 1) => {
  const allowed = new Set(["popular", "top_rated", "upcoming", "now_playing"]);
  if (!allowed.has(collection)) throw new AppError(404, "COLLECTION_NOT_FOUND", "Coleção não encontrada");
  const data = await cachedRequest(`collection:${collection}:${page}`, TTL.collection, `/movie/${collection}`, { page });
  return normalizePage(data);
};

const getGenres = async () => cachedRequest("genres", TTL.genres, "/genre/movie/list");

const getDetails = async (id) => cachedRequest(`movie:${id}`, TTL.details, `/movie/${id}`);

const getCredits = async (id) => cachedRequest(`credits:${id}`, TTL.details, `/movie/${id}/credits`);

const getVideos = async (id) => {
  const data = await cachedRequest(`videos:${id}`, TTL.details, `/movie/${id}/videos`);
  return {
    results: (data.results || [])
      .filter((video) => video.site === "YouTube")
      .sort((a, b) => Number(b.official) - Number(a.official) || (a.type === "Trailer" ? -1 : 1)),
  };
};

const getRelated = async (id, type, page = 1) => {
  if (!["recommendations", "similar"].includes(type)) throw new AppError(400, "INVALID_RELATED_TYPE", "Tipo inválido");
  return normalizePage(await cachedRequest(`${type}:${id}:${page}`, TTL.collection, `/movie/${id}/${type}`, { page }));
};

const sortResults = (movies, sort) => {
  const result = [...movies];
  const compare = {
    popularity: (a, b) => (b.popularity || 0) - (a.popularity || 0),
    rating: (a, b) => (b.vote_average || 0) - (a.vote_average || 0),
    release: (a, b) => String(b.release_date || "").localeCompare(String(a.release_date || "")),
  }[sort];
  return compare ? result.sort(compare) : result;
};

const search = async ({ query, page = 1, genre, year, voteMin, language, sort }) => {
  if (!query?.trim()) throw new AppError(400, "VALIDATION_ERROR", "Informe um título para pesquisar");
  const key = `search:${JSON.stringify({ query, page, genre, year, voteMin, language, sort })}`;
  return cache.remember(key, TTL.search, async () => {
    const advanced = genre || voteMin || language || sort;
    if (!advanced) {
      return normalizePage(await request("/search/movie", { query: query.trim(), page, include_adult: false, year }));
    }

    const first = await request("/search/movie", { query: query.trim(), page: 1, include_adult: false, year });
    const pagesToFetch = Math.min(first.total_pages || 1, 5);
    const remaining = await Promise.all(
      Array.from({ length: pagesToFetch - 1 }, (_, index) => request("/search/movie", {
        query: query.trim(), page: index + 2, include_adult: false, year,
      })),
    );
    const all = [first, ...remaining].flatMap((item) => item.results || []);
    const filtered = sortResults(all.filter((movie) => {
      if (genre && !(movie.genre_ids || []).includes(Number(genre))) return false;
      if (voteMin && (movie.vote_average || 0) < Number(voteMin)) return false;
      if (language && movie.original_language !== language) return false;
      return true;
    }), sort);
    const start = (Number(page) - 1) * 20;
    return {
      page: Number(page),
      results: filtered.slice(start, start + 20),
      totalPages: Math.max(Math.ceil(filtered.length / 20), 1),
      totalResults: filtered.length,
    };
  });
};

const discover = async ({ page = 1, genre, year, voteMin, language, sort = "popularity" }) => {
  const sortMap = { popularity: "popularity.desc", rating: "vote_average.desc", release: "primary_release_date.desc" };
  const params = {
    page,
    include_adult: false,
    include_video: false,
    sort_by: sortMap[sort] || sortMap.popularity,
    "vote_count.gte": sort === "rating" ? 100 : undefined,
    with_genres: genre || undefined,
    primary_release_year: year || undefined,
    "vote_average.gte": voteMin || undefined,
    with_original_language: language || undefined,
  };
  const key = `discover:${JSON.stringify(params)}`;
  return normalizePage(await cachedRequest(key, TTL.collection, "/discover/movie", params));
};

module.exports = {
  request,
  getCollection,
  getGenres,
  getDetails,
  getCredits,
  getVideos,
  getRelated,
  search,
  discover,
  TTL,
};
