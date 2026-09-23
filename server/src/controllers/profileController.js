const bcrypt = require("bcrypt");
const prisma = require("../utils/prisma");
const AppError = require("../utils/AppError");
const publicUser = require("../utils/publicUser");

const countSelect = {
  favorites: true,
  lists: true,
  comments: true,
  ratings: true,
};

const getProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { _count: { select: countSelect } },
  });
  res.json({ user: publicUser(user, { includeStats: true }) });
};

const updateProfile = async (req, res) => {
  const user = await prisma.user.update({ where: { id: req.user.id }, data: req.body });
  res.json({ user: publicUser(user) });
};

const changePassword = async (req, res) => {
  const valid = await bcrypt.compare(req.body.currentPassword, req.user.passwordHash);
  if (!valid) throw new AppError(400, "INVALID_CURRENT_PASSWORD", "The current password is incorrect");
  const passwordHash = await bcrypt.hash(req.body.newPassword, 12);
  await prisma.user.update({ where: { id: req.user.id }, data: { passwordHash } });
  res.status(204).send();
};

const getPublicProfile = async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findFirst({
    where: { id, isActive: true },
    include: {
      _count: {
        select: { lists: { where: { isPublic: true } }, comments: true, ratings: true },
      },
      lists: {
        where: { isPublic: true },
        select: { id: true, name: true, description: true, shareCode: true, updatedAt: true, _count: { select: { items: true } } },
        orderBy: { updatedAt: "desc" },
      },
    },
  });
  if (!user) throw new AppError(404, "USER_NOT_FOUND", "User not found");
  res.json({
    user: {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      createdAt: user.createdAt,
      stats: user._count,
    },
    lists: user.lists,
  });
};

module.exports = { getProfile, updateProfile, changePassword, getPublicProfile };
