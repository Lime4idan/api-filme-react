const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/utils/prisma");

const movie = { tmdbMovieId: 550, title: "Clube da Luta", posterPath: "/poster.jpg", releaseDate: "1999-10-15", voteAverage: 8.4 };

beforeAll(async () => {
  await prisma.commentLike.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.movieListItem.deleteMany();
  await prisma.movieList.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => prisma.$disconnect());

describe("authentication", () => {
  test("registers, persists the session, and does not expose the hash", async () => {
    const agent = request.agent(app);
    const response = await agent.post("/api/auth/register").send({ name: "Ana Teste", email: "  ANA@EXAMPLE.COM ", password: "SenhaSegura123!", confirmPassword: "SenhaSegura123!" });
    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe("ana@example.com");
    expect(response.body.user.passwordHash).toBeUndefined();
    const me = await agent.get("/api/auth/me");
    expect(me.status).toBe(200);
    expect(me.body.user.name).toBe("Ana Teste");
  });

  test("validates duplicate registration and login", async () => {
    const duplicate = await request(app).post("/api/auth/register").send({ name: "Outra Ana", email: "ana@example.com", password: "SenhaSegura123!" });
    expect(duplicate.status).toBe(409);
    expect(duplicate.body.error.code).toBe("EMAIL_IN_USE");
    const invalid = await request(app).post("/api/auth/login").send({ email: "ana@example.com", password: "errada" });
    expect(invalid.status).toBe(401);
    expect(invalid.body.error.message).toBe("Invalid email or password");
    const valid = await request(app).post("/api/auth/login").send({ email: "ana@example.com", password: "SenhaSegura123!" });
    expect(valid.status).toBe(200);
  });

  test("protege rotas privadas e efetua logout", async () => {
    expect((await request(app).get("/api/favorites")).status).toBe(401);
    const agent = request.agent(app);
    await agent.post("/api/auth/login").send({ email: "ana@example.com", password: "SenhaSegura123!" });
    expect((await agent.post("/api/auth/logout")).status).toBe(204);
    expect((await agent.get("/api/auth/me")).status).toBe(401);
  });
});

describe("recursos privados e sociais", () => {
  let owner;
  let outsider;
  let listId;
  let commentId;

  beforeAll(async () => {
    owner = request.agent(app);
    await owner.post("/api/auth/login").send({ email: "ana@example.com", password: "SenhaSegura123!" });
    outsider = request.agent(app);
    await outsider.post("/api/auth/register").send({ name: "Beto Teste", email: "beto@example.com", password: "OutraSenha123!" });
  });

  test("adds a favorite without duplicates", async () => {
    expect((await owner.post("/api/favorites").send(movie)).status).toBe(201);
    const duplicate = await owner.post("/api/favorites").send(movie);
    expect(duplicate.status).toBe(409);
    const items = await owner.get("/api/favorites");
    expect(items.body.items).toHaveLength(1);
    expect(items.body.items[0].tmdbMovieId).toBe(550);
  });

  test("creates a list and restricts editing to its owner", async () => {
    const created = await owner.post("/api/lists").send({ name: "My classics", description: "Favorites", isPublic: false });
    expect(created.status).toBe(201);
    listId = created.body.list.id;
    expect((await owner.post(`/api/lists/${listId}/items`).send(movie)).status).toBe(201);
    expect((await outsider.get(`/api/lists/${listId}`)).status).toBe(404);
    expect((await outsider.put(`/api/lists/${listId}`).send({ name: "Intrusion" })).status).toBe(404);
  });

  test("posts comments, prevents unauthorized editing, and allows likes", async () => {
    const created = await owner.post("/api/movies/550/comments").send({ content: "An important comment." });
    expect(created.status).toBe(201);
    commentId = created.body.comment.id;
    expect((await outsider.put(`/api/comments/${commentId}`).send({ content: "Alterado" })).status).toBe(403);
    expect((await outsider.post(`/api/comments/${commentId}/like`)).status).toBe(201);
    expect((await outsider.post(`/api/comments/${commentId}/like`)).status).toBe(409);
    const comments = await outsider.get("/api/movies/550/comments");
    expect(comments.body.comments[0].likeCount).toBe(1);
    expect(comments.body.comments[0].likedByMe).toBe(true);
  });

  test("creates and updates a single rating per movie", async () => {
    expect((await owner.post("/api/movies/550/rating").send({ score: 8 })).body.rating.score).toBe(8);
    const updated = await owner.post("/api/movies/550/rating").send({ score: 10 });
    expect(updated.body.rating.score).toBe(10);
    expect(updated.body.count).toBe(1);
    const invalid = await owner.post("/api/movies/550/rating").send({ score: 11 });
    expect(invalid.status).toBe(400);
  });
});
