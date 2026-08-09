const prisma = require("../utils/prisma");
const AppError = require("../utils/AppError");

const getPublicList = async (req, res) => {
  const list = await prisma.movieList.findFirst({
    where: { shareCode: req.params.shareCode, isPublic: true, user: { isActive: true } },
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
      items: { orderBy: { position: "asc" } },
      _count: { select: { items: true } },
    },
  });
  if (!list) throw new AppError(404, "PUBLIC_LIST_NOT_FOUND", "Lista pública não encontrada");
  res.json({ list });
};

module.exports = { getPublicList };
