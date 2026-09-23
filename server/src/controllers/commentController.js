const prisma = require("../utils/prisma");
const AppError = require("../utils/AppError");
const { getPagination, pageMeta } = require("../utils/pagination");

const serialize = (comment, userId) => ({
  id: comment.id,
  tmdbMovieId: comment.tmdbMovieId,
  content: comment.content,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
  author: comment.user,
  likeCount: comment._count?.likes || 0,
  likedByMe: Boolean(userId && comment.likes?.length),
  canEdit: comment.userId === userId,
});

const list = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, 10, 50);
  const where = { tmdbMovieId: Number(req.params.tmdbMovieId) };
  const include = {
    user: { select: { id: true, name: true, avatarUrl: true } },
    _count: { select: { likes: true } },
    likes: req.user ? { where: { userId: req.user.id }, select: { id: true } } : false,
  };
  const [comments, total] = await Promise.all([
    prisma.comment.findMany({ where, include, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.comment.count({ where }),
  ]);
  res.json({ comments: comments.map((item) => serialize(item, req.user?.id)), pagination: pageMeta(page, limit, total) });
};

const create = async (req, res) => {
  const comment = await prisma.comment.create({
    data: { userId: req.user.id, tmdbMovieId: Number(req.params.tmdbMovieId), content: req.body.content },
    include: { user: { select: { id: true, name: true, avatarUrl: true } }, _count: { select: { likes: true } }, likes: true },
  });
  res.status(201).json({ comment: serialize(comment, req.user.id) });
};

const update = async (req, res) => {
  const current = await prisma.comment.findUnique({ where: { id: Number(req.params.id) } });
  if (!current) throw new AppError(404, "COMMENT_NOT_FOUND", "Comment not found");
  if (current.userId !== req.user.id) throw new AppError(403, "FORBIDDEN", "You cannot edit this comment");
  const comment = await prisma.comment.update({
    where: { id: current.id },
    data: { content: req.body.content },
    include: { user: { select: { id: true, name: true, avatarUrl: true } }, _count: { select: { likes: true } }, likes: { where: { userId: req.user.id } } },
  });
  res.json({ comment: serialize(comment, req.user.id) });
};

const remove = async (req, res) => {
  const current = await prisma.comment.findUnique({ where: { id: Number(req.params.id) } });
  if (!current) throw new AppError(404, "COMMENT_NOT_FOUND", "Comment not found");
  if (current.userId !== req.user.id && req.user.role !== "ADMIN") {
    throw new AppError(403, "FORBIDDEN", "You cannot delete this comment");
  }
  await prisma.comment.delete({ where: { id: current.id } });
  res.status(204).send();
};

const like = async (req, res) => {
  const commentId = Number(req.params.id);
  const comment = await prisma.comment.findUnique({ where: { id: commentId }, select: { id: true } });
  if (!comment) throw new AppError(404, "COMMENT_NOT_FOUND", "Comment not found");
  const existing = await prisma.commentLike.findUnique({ where: { userId_commentId: { userId: req.user.id, commentId } } });
  if (existing) throw new AppError(409, "COMMENT_ALREADY_LIKED", "Comment already liked");
  await prisma.commentLike.create({ data: { userId: req.user.id, commentId } });
  const likeCount = await prisma.commentLike.count({ where: { commentId } });
  res.status(201).json({ liked: true, likeCount });
};

const unlike = async (req, res) => {
  const commentId = Number(req.params.id);
  const result = await prisma.commentLike.deleteMany({ where: { userId: req.user.id, commentId } });
  if (!result.count) throw new AppError(404, "COMMENT_LIKE_NOT_FOUND", "Like not found");
  const likeCount = await prisma.commentLike.count({ where: { commentId } });
  res.json({ liked: false, likeCount });
};

module.exports = { list, create, update, remove, like, unlike };
