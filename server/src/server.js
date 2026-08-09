const app = require("./app");
const prisma = require("./utils/prisma");

const port = Number(process.env.PORT) || 5000;

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET deve ter pelo menos 32 caracteres.");
  process.exit(1);
}

const server = app.listen(port, () => {
  console.log(`MovieHub API disponível na porta ${port}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} recebido. Encerrando com segurança.`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
