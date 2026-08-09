const { PrismaClient } = require("@prisma/client");

const globalPrisma = global;

const prisma = globalPrisma.__moviehubPrisma || new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

if (process.env.NODE_ENV !== "production") {
  globalPrisma.__moviehubPrisma = prisma;
}

module.exports = prisma;
