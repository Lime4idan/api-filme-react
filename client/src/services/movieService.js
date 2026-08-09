import api from "./api";

const get = async (path, params) => (await api.get(path, { params })).data;

export const movieService = {
  popular: (page = 1) => get("/movies/popular", { page }),
  topRated: (page = 1) => get("/movies/top-rated", { page }),
  upcoming: (page = 1) => get("/movies/upcoming", { page }),
  nowPlaying: (page = 1) => get("/movies/now-playing", { page }),
  genres: () => get("/movies/genres"),
  search: (params) => get("/movies/search", params),
  discover: (params) => get("/movies/discover", params),
  details: (id) => get(`/movies/${id}`),
  credits: (id) => get(`/movies/${id}/credits`),
  videos: (id) => get(`/movies/${id}/videos`),
  recommendations: (id, page = 1) => get(`/movies/${id}/recommendations`, { page }),
  similar: (id, page = 1) => get(`/movies/${id}/similar`, { page }),
};
