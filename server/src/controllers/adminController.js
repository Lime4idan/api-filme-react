const prisma = require("../utils/prisma");
const AppError = require("../utils/AppError");

const dashboard = async (_req, res) => {
  const [users, comments, lists, favorites, ratings, recentComments, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.comment.count(),
    prisma.movieList.count(),
    prisma.favorite.count(),
    prisma.rating.count(),
    prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      include: { user: { select: { id: true, name: true, avatarUrl: true } }, _count: { select: { likes: true } } },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true, _count: { select: { comments: true, lists: true } } },
    }),
  ]);
  res.json({ totals: { users, comments, lists, favorites, ratings }, recentComments, recentUsers });
};

const deleteComment = async (req, res) => {
  const result = await prisma.comment.deleteMany({ where: { id: Number(req.params.id) } });
  if (!result.count) throw new AppError(404, "COMMENT_NOT_FOUND", "Comentário não encontrado");
  res.status(204).send();
};

const updateUserStatus = async (req, res) => {
  const userId = Number(req.params.id);
  if (userId === req.user.id && req.body.isActive === false) {
    throw new AppError(400, "CANNOT_DISABLE_SELF", "Você não pode desativar a própria conta");
  }
  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) throw new AppError(404, "USER_NOT_FOUND", "Usuário não encontrado");
  const user = await prisma.user.update({
    where: { id: userId },
    data: { isActive: req.body.isActive },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });
  res.json({ user });
};

module.exports = { dashboard, deleteComment, updateUserStatus };
