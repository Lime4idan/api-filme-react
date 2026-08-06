const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");
const AppError = require("../utils/AppError");

const tokenFromRequest = (req) => {
  const authorization = req.get("authorization");
  if (authorization?.startsWith("Bearer ")) return authorization.slice(7);
  return req.cookies?.moviehub_token;
};

const decodeToken = async (req, required) => {
  const token = tokenFromRequest(req);
  if (!token) {
    if (required) throw new AppError(401, "AUTH_REQUIRED", "Autenticação necessária");
    return null;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: Number(payload.sub) } });
    if (!user) throw new AppError(401, "INVALID_TOKEN", "Sessão inválida");
    if (!user.isActive) throw new AppError(403, "USER_INACTIVE", "Esta conta está desativada");
    req.user = user;
    return user;
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error.name === "TokenExpiredError") {
      throw new AppError(401, "TOKEN_EXPIRED", "Sua sessão expirou");
    }
    throw new AppError(401, "INVALID_TOKEN", "Sessão inválida");
  }
};

const requireAuth = async (req, _res, next) => {
  try {
    await decodeToken(req, true);
    next();
  } catch (error) {
    next(error);
  }
};

const optionalAuth = async (req, _res, next) => {
  try {
    await decodeToken(req, false);
    next();
  } catch (error) {
    if (["TOKEN_EXPIRED", "INVALID_TOKEN"].includes(error.code)) {
      req.user = null;
      return next();
    }
    next(error);
  }
};

const requireAdmin = (req, _res, next) => {
  if (req.user?.role !== "ADMIN") {
    return next(new AppError(403, "FORBIDDEN", "Acesso restrito a administradores"));
  }
  return next();
};

module.exports = { requireAuth, optionalAuth, requireAdmin, tokenFromRequest };
