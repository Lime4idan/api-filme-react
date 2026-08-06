const tmdb = require("../services/tmdbService");

const page = (req) => Math.max(Number.parseInt(req.query.page, 10) || 1, 1);

const collection = (name) => async (req, res) => {
  res.json(await tmdb.getCollection(name, page(req)));
};

const popular = collection("popular");
const topRated = collection("top_rated");
const upcoming = collection("upcoming");
const nowPlaying = collection("now_playing");
const genres = async (_req, res) => res.json(await tmdb.getGenres());
const search = async (req, res) => res.json(await tmdb.search({ ...req.query, page: page(req) }));
const discover = async (req, res) => res.json(await tmdb.discover({ ...req.query, page: page(req) }));
const details = async (req, res) => res.json(await tmdb.getDetails(req.params.id));
const credits = async (req, res) => res.json(await tmdb.getCredits(req.params.id));
const videos = async (req, res) => res.json(await tmdb.getVideos(req.params.id));
const recommendations = async (req, res) => res.json(await tmdb.getRelated(req.params.id, "recommendations", page(req)));
const similar = async (req, res) => res.json(await tmdb.getRelated(req.params.id, "similar", page(req)));

module.exports = { popular, topRated, upcoming, nowPlaying, genres, search, discover, details, credits, videos, recommendations, similar };
