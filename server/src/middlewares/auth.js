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
    if (required) throw new AppError(401, "AUTH_REQUIRED", "Authentication required");
    return null;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: Number(payload.sub) } });
    if (!user) throw new AppError(401, "INVALID_TOKEN", "Invalid session");
    if (!user.isActive) throw new AppError(403, "USER_INACTIVE", "This account is disabled");
    req.user = user;
    return user;
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error.name === "TokenExpiredError") {
      throw new AppError(401, "TOKEN_EXPIRED", "Your session has expired");
    }
    throw new AppError(401, "INVALID_TOKEN", "Invalid session");
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
    return next(new AppError(403, "FORBIDDEN", "Access restricted to administrators"));
  }
  return next();
};

module.exports = { requireAuth, optionalAuth, requireAdmin, tokenFromRequest };
