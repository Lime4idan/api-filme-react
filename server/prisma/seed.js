const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const production = process.env.NODE_ENV === "production";
  const adminPassword = process.env.DEMO_ADMIN_PASSWORD || (!production ? "MovieHubAdmin123!" : null);
  const userPassword = process.env.DEMO_USER_PASSWORD || (!production ? "MovieHubUser123!" : null);
  if (!adminPassword || !userPassword) {
    throw new Error("Set DEMO_ADMIN_PASSWORD and DEMO_USER_PASSWORD before running the seed in production.");
  }

  const admin = await prisma.user.upsert({
    where: { email: (process.env.DEMO_ADMIN_EMAIL || "admin@moviehub.local").toLowerCase() },
    update: {},
    create: {
      name: "Admin MovieHub",
      email: (process.env.DEMO_ADMIN_EMAIL || "admin@moviehub.local").toLowerCase(),
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: "ADMIN",
      bio: "MovieHub curation and moderation team.",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: (process.env.DEMO_USER_EMAIL || "usuario@moviehub.local").toLowerCase() },
    update: {},
    create: {
      name: "Demo Movie Fan",
      email: (process.env.DEMO_USER_EMAIL || "usuario@moviehub.local").toLowerCase(),
      passwordHash: await bcrypt.hash(userPassword, 12),
      bio: "Thrillers, science fiction, and great stories.",
    },
  });

  const list = await prisma.movieList.upsert({
    where: { shareCode: "demo-classicos" },
    update: {},
    create: {
      userId: user.id,
      name: "Classics to Rewatch",
      description: "Movies that remain incredible with every viewing.",
      isPublic: true,
      shareCode: "demo-classicos",
      items: {
        create: [
          { tmdbMovieId: 550, title: "Fight Club", posterPath: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", releaseDate: "1999-10-15", voteAverage: 8.4, position: 0 },
          { tmdbMovieId: 13, title: "Forrest Gump", posterPath: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg", releaseDate: "1994-06-23", voteAverage: 8.5, position: 1 },
        ],
      },
    },
  });

  const existingComment = await prisma.comment.findFirst({ where: { userId: user.id, tmdbMovieId: 550 } });
  if (!existingComment) {
    await prisma.comment.create({ data: { userId: user.id, tmdbMovieId: 550, content: "A provocative, visually striking movie with many layers." } });
    await prisma.comment.create({ data: { userId: admin.id, tmdbMovieId: 550, content: "Reminder: discuss the movie, not the person who commented." } });
  }

  console.log(`Seed completed. Public list: ${list.shareCode}`);
  if (!production && !process.env.DEMO_ADMIN_PASSWORD) console.log("Development admin credential documented in the README.");
}

main().finally(() => prisma.$disconnect());
