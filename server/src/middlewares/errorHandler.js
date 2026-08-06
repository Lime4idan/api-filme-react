const { Prisma } = require("@prisma/client");
const AppError = require("../utils/AppError");

const notFound = (req, _res, next) => {
  next(new AppError(404, "ROUTE_NOT_FOUND", `Rota não encontrada: ${req.method} ${req.originalUrl}`));
};

const errorHandler = (error, _req, res, _next) => {
  let normalized = error;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      normalized = new AppError(409, "DUPLICATE_RESOURCE", "Este registro já existe");
    } else if (error.code === "P2025") {
      normalized = new AppError(404, "RESOURCE_NOT_FOUND", "Recurso não encontrado");
    } else {
      normalized = new AppError(500, "DATABASE_ERROR", "Não foi possível concluir a operação no banco");
    }
  }

  const status = normalized.statusCode || 500;
  const body = {
    error: {
      code: normalized.code || "INTERNAL_ERROR",
      message: status >= 500 ? "Ocorreu um erro interno" : normalized.message,
    },
  };

  if (normalized.details) body.error.details = normalized.details;
  if (process.env.NODE_ENV !== "production" && status >= 500) body.error.debug = normalized.message;
  res.status(status).json(body);
};

module.exports = { notFound, errorHandler };
