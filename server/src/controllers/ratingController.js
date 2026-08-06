const prisma = require("../utils/prisma");

const stats = async (req, res) => {
  const tmdbMovieId = Number(req.params.tmdbMovieId);
  const aggregate = await prisma.rating.aggregate({
    where: { tmdbMovieId },
    _avg: { score: true },
    _count: { score: true },
  });
  res.json({ average: aggregate._avg.score || 0, count: aggregate._count.score });
};

const mine = async (req, res) => {
  const rating = await prisma.rating.findUnique({
    where: { userId_tmdbMovieId: { userId: req.user.id, tmdbMovieId: Number(req.params.tmdbMovieId) } },
  });
  res.json({ rating });
};

const upsert = async (req, res) => {
  const key = { userId: req.user.id, tmdbMovieId: Number(req.params.tmdbMovieId) };
  const rating = await prisma.rating.upsert({
    where: { userId_tmdbMovieId: key },
    update: { score: req.body.score },
    create: { ...key, score: req.body.score },
  });
  const aggregate = await prisma.rating.aggregate({ where: { tmdbMovieId: key.tmdbMovieId }, _avg: { score: true }, _count: { score: true } });
  res.json({ rating, average: aggregate._avg.score || 0, count: aggregate._count.score });
};

const remove = async (req, res) => {
  await prisma.rating.deleteMany({
    where: { userId: req.user.id, tmdbMovieId: Number(req.params.tmdbMovieId) },
  });
  res.status(204).send();
};

module.exports = { stats, mine, upsert, remove };
