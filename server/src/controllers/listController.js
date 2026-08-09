const crypto = require("crypto");
const prisma = require("../utils/prisma");
const AppError = require("../utils/AppError");

const ensureOwnedList = async (listId, userId, includeItems = false) => {
  const list = await prisma.movieList.findFirst({
    where: { id: Number(listId), userId },
    include: includeItems ? { items: { orderBy: { position: "asc" } } } : undefined,
  });
  if (!list) throw new AppError(404, "LIST_NOT_FOUND", "Lista não encontrada");
  return list;
};

const createShareCode = () => crypto.randomBytes(9).toString("base64url");

const listAll = async (req, res) => {
  const lists = await prisma.movieList.findMany({
    where: { userId: req.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { items: true } },
      items: { orderBy: { position: "asc" }, take: 4 },
    },
  });
  res.json({ lists });
};

const create = async (req, res) => {
  const list = await prisma.movieList.create({
    data: { ...req.body, userId: req.user.id, shareCode: createShareCode() },
    include: { items: true },
  });
  res.status(201).json({ list });
};

const get = async (req, res) => {
  const list = await ensureOwnedList(req.params.id, req.user.id, true);
  res.json({ list });
};

const update = async (req, res) => {
  await ensureOwnedList(req.params.id, req.user.id);
  const list = await prisma.movieList.update({ where: { id: Number(req.params.id) }, data: req.body });
  res.json({ list });
};

const remove = async (req, res) => {
  await ensureOwnedList(req.params.id, req.user.id);
  await prisma.movieList.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
};

const addItem = async (req, res) => {
  const list = await ensureOwnedList(req.params.id, req.user.id);
  const existing = await prisma.movieListItem.findUnique({
    where: { listId_tmdbMovieId: { listId: list.id, tmdbMovieId: req.body.tmdbMovieId } },
  });
  if (existing) throw new AppError(409, "LIST_ITEM_EXISTS", "Este filme já está na lista");
  const aggregate = await prisma.movieListItem.aggregate({ where: { listId: list.id }, _max: { position: true } });
  const item = await prisma.movieListItem.create({
    data: { ...req.body, listId: list.id, position: (aggregate._max.position ?? -1) + 1 },
  });
  res.status(201).json({ item });
};

const removeItem = async (req, res) => {
  const list = await ensureOwnedList(req.params.id, req.user.id);
  const result = await prisma.movieListItem.deleteMany({
    where: { listId: list.id, tmdbMovieId: Number(req.params.tmdbMovieId) },
  });
  if (!result.count) throw new AppError(404, "LIST_ITEM_NOT_FOUND", "Filme não encontrado na lista");
  res.status(204).send();
};

const reorder = async (req, res) => {
  const list = await ensureOwnedList(req.params.id, req.user.id, true);
  const currentIds = list.items.map((item) => item.tmdbMovieId).sort((a, b) => a - b);
  const receivedIds = [...req.body.movieIds].sort((a, b) => a - b);
  if (currentIds.length !== receivedIds.length || currentIds.some((id, index) => id !== receivedIds[index])) {
    throw new AppError(400, "INVALID_REORDER", "A nova ordem deve conter todos os filmes da lista");
  }
  await prisma.$transaction(req.body.movieIds.map((tmdbMovieId, position) => prisma.movieListItem.update({
    where: { listId_tmdbMovieId: { listId: list.id, tmdbMovieId } },
    data: { position },
  })));
  const updated = await ensureOwnedList(list.id, req.user.id, true);
  res.json({ items: updated.items });
};

module.exports = { listAll, create, get, update, remove, addItem, removeItem, reorder };
