const prisma = require("../utils/prisma");
const tmdb = require("../services/tmdbService");

const personalized = async (req, res) => {
  const [favorites, ratings, listItems] = await Promise.all([
    prisma.favorite.findMany({ where: { userId: req.user.id }, select: { tmdbMovieId: true }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.rating.findMany({ where: { userId: req.user.id, score: { gte: 8 } }, select: { tmdbMovieId: true }, orderBy: { score: "desc" }, take: 10 }),
    prisma.movieListItem.findMany({ where: { list: { userId: req.user.id } }, select: { tmdbMovieId: true }, take: 20 }),
  ]);

  const sourceIds = [...new Set([
    ...favorites.map((item) => item.tmdbMovieId),
    ...ratings.map((item) => item.tmdbMovieId),
    ...listItems.map((item) => item.tmdbMovieId),
  ])];

  if (!sourceIds.length) {
    return res.json({ ...(await tmdb.getCollection("popular", 1)), personalized: false });
  }

  const sourceMovies = (await Promise.all(sourceIds.slice(0, 8).map((id) => tmdb.getDetails(id).catch(() => null)))).filter(Boolean);
  const genreFrequency = new Map();
  sourceMovies.forEach((movie) => (movie.genres || []).forEach((genre) => {
    genreFrequency.set(genre.id, (genreFrequency.get(genre.id) || 0) + 1);
  }));
  const topGenres = [...genreFrequency.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id]) => id);

  const batches = topGenres.length
    ? await Promise.all(topGenres.map((genre) => tmdb.discover({ genre, sort: "rating", page: 1 })))
    : [await tmdb.getCollection("popular", 1)];
  const excluded = new Set(sourceIds);
  const seen = new Set();
  const results = batches.flatMap((batch) => batch.results).filter((movie) => {
    if (excluded.has(movie.id) || seen.has(movie.id)) return false;
    seen.add(movie.id);
    return true;
  }).sort((a, b) => ((b.vote_average || 0) * 0.65 + (b.popularity || 0) * 0.01) - ((a.vote_average || 0) * 0.65 + (a.popularity || 0) * 0.01)).slice(0, 20);

  res.json({ page: 1, results, totalPages: 1, totalResults: results.length, personalized: true });
};

module.exports = { personalized };
