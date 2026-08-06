const prisma = require("../utils/prisma");
const AppError = require("../utils/AppError");
const { getPagination, pageMeta } = require("../utils/pagination");

const list = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, 24, 50);
  const where = { userId: req.user.id };
  const [items, total] = await Promise.all([
    prisma.favorite.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.favorite.count({ where }),
  ]);
  res.json({ items, pagination: pageMeta(page, limit, total) });
};

const create = async (req, res) => {
  const existing = await prisma.favorite.findUnique({
    where: { userId_tmdbMovieId: { userId: req.user.id, tmdbMovieId: req.body.tmdbMovieId } },
  });
  if (existing) throw new AppError(409, "FAVORITE_EXISTS", "Este filme já está nos favoritos");
  const favorite = await prisma.favorite.create({ data: { ...req.body, userId: req.user.id } });
  res.status(201).json({ favorite });
};

const remove = async (req, res) => {
  const result = await prisma.favorite.deleteMany({
    where: { userId: req.user.id, tmdbMovieId: Number(req.params.tmdbMovieId) },
  });
  if (!result.count) throw new AppError(404, "FAVORITE_NOT_FOUND", "Favorito não encontrado");
  res.status(204).send();
};

const check = async (req, res) => {
  const favorite = await prisma.favorite.findUnique({
    where: { userId_tmdbMovieId: { userId: req.user.id, tmdbMovieId: Number(req.params.tmdbMovieId) } },
    select: { id: true },
  });
  res.json({ isFavorite: Boolean(favorite) });
};

module.exports = { list, create, remove, check };
