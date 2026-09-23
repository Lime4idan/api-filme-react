const errorSchema = {
  type: "object",
  properties: {
    error: {
      type: "object",
      properties: {
        code: { type: "string", example: "VALIDATION_ERROR" },
        message: { type: "string", example: "Invalid data" },
        details: { type: "array", items: { type: "object" } },
      },
    },
  },
};

const authSecurity = [{ cookieAuth: [] }, { bearerAuth: [] }];
const json = (schema, example) => ({
  required: true,
  content: { "application/json": { schema, example } },
});
const ok = (description = "Operation completed") => ({ description });

module.exports = {
  openapi: "3.0.3",
  info: {
    title: "MovieHub API",
    version: "1.0.0",
    description: "MovieHub REST API. The primary session uses an httpOnly cookie; Bearer JWT is also accepted for non-browser clients.",
  },
  servers: [{ url: "/api", description: "Current server" }],
  tags: [
    { name: "Authentication" }, { name: "Users" }, { name: "Movies" },
    { name: "Favorites" }, { name: "Lists" }, { name: "Comments" },
    { name: "Ratings" }, { name: "Recommendations" }, { name: "Administration" },
  ],
  components: {
    securitySchemes: {
      cookieAuth: { type: "apiKey", in: "cookie", name: "moviehub_token" },
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      Error: errorSchema,
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 }, name: { type: "string", example: "Ana Lima" },
          email: { type: "string", example: "ana@example.com" }, role: { type: "string", enum: ["USER", "ADMIN"] },
          avatarUrl: { type: "string", nullable: true }, bio: { type: "string", nullable: true },
        },
      },
      MovieSnapshot: {
        type: "object",
        required: ["tmdbMovieId", "title"],
        properties: {
          tmdbMovieId: { type: "integer", example: 550 }, title: { type: "string", example: "Fight Club" },
          posterPath: { type: "string", nullable: true, example: "/poster.jpg" }, releaseDate: { type: "string", nullable: true, example: "1999-10-15" },
          voteAverage: { type: "number", nullable: true, example: 8.4 },
        },
      },
    },
  },
  paths: {
    "/auth/register": { post: { tags: ["Authentication"], summary: "Create an account", requestBody: json({ type: "object", required: ["name", "email", "password"], properties: { name: { type: "string" }, email: { type: "string", format: "email" }, password: { type: "string", minLength: 8 }, confirmPassword: { type: "string" } } }, { name: "Ana Lima", email: "ana@example.com", password: "secure-password", confirmPassword: "secure-password" }), responses: { 201: ok("Account created and session started"), 409: ok("Email already registered") } } },
    "/auth/login": { post: { tags: ["Authentication"], summary: "Sign in", requestBody: json({ type: "object", properties: { email: { type: "string" }, password: { type: "string" } } }, { email: "ana@example.com", password: "secure-password" }), responses: { 200: ok("Session started"), 401: ok("Invalid credentials") } } },
    "/auth/me": { get: { tags: ["Authentication"], summary: "Read session", security: authSecurity, responses: { 200: ok(), 401: ok("Not authenticated") } } },
    "/auth/logout": { post: { tags: ["Authentication"], summary: "Sign out", responses: { 204: ok() } } },
    "/profile": { get: { tags: ["Users"], summary: "View profile and counts", security: authSecurity, responses: { 200: ok() } }, put: { tags: ["Users"], summary: "Edit profile", security: authSecurity, requestBody: json({ type: "object" }, { name: "Ana", bio: "Cinema is memory." }), responses: { 200: ok() } } },
    "/profile/password": { put: { tags: ["Users"], summary: "Change password", security: authSecurity, requestBody: json({ type: "object" }, { currentPassword: "current-password", newPassword: "new-secure-password" }), responses: { 204: ok() } } },
    "/users/{id}": { get: { tags: ["Users"], summary: "Public profile", parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }], responses: { 200: ok(), 404: ok() } } },
    "/movies/popular": { get: { tags: ["Movies"], summary: "Popular movies", responses: { 200: ok() } } },
    "/movies/top-rated": { get: { tags: ["Movies"], summary: "Top-rated movies", responses: { 200: ok() } } },
    "/movies/upcoming": { get: { tags: ["Movies"], summary: "Upcoming releases", responses: { 200: ok() } } },
    "/movies/now-playing": { get: { tags: ["Movies"], summary: "Now playing", responses: { 200: ok() } } },
    "/movies/search": { get: { tags: ["Movies"], summary: "Advanced search", parameters: [{ in: "query", name: "query", required: true, schema: { type: "string" } }, { in: "query", name: "page", schema: { type: "integer" } }, { in: "query", name: "genre", schema: { type: "integer" } }, { in: "query", name: "year", schema: { type: "integer" } }, { in: "query", name: "voteMin", schema: { type: "number" } }, { in: "query", name: "language", schema: { type: "string" } }, { in: "query", name: "sort", schema: { type: "string", enum: ["popularity", "rating", "release"] } }], responses: { 200: ok() } } },
    "/movies/genres": { get: { tags: ["Movies"], summary: "TMDB genres", responses: { 200: ok() } } },
    "/movies/discover": { get: { tags: ["Movies"], summary: "Discover with filters", responses: { 200: ok() } } },
    "/movies/{id}": { get: { tags: ["Movies"], summary: "Movie details", parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }], responses: { 200: ok(), 404: ok() } } },
    "/favorites": { get: { tags: ["Favorites"], summary: "List favorites", security: authSecurity, responses: { 200: ok() } }, post: { tags: ["Favorites"], summary: "Add favorite", security: authSecurity, requestBody: json({ $ref: "#/components/schemas/MovieSnapshot" }, { tmdbMovieId: 550, title: "Fight Club", posterPath: "/poster.jpg", releaseDate: "1999-10-15", voteAverage: 8.4 }), responses: { 201: ok(), 409: ok() } } },
    "/favorites/{tmdbMovieId}": { delete: { tags: ["Favorites"], summary: "Remove favorite", security: authSecurity, responses: { 204: ok() } } },
    "/lists": { get: { tags: ["Lists"], summary: "List my lists", security: authSecurity, responses: { 200: ok() } }, post: { tags: ["Lists"], summary: "Create list", security: authSecurity, requestBody: json({ type: "object" }, { name: "Classics", description: "Always worth rewatching", isPublic: true }), responses: { 201: ok() } } },
    "/lists/{id}": { get: { tags: ["Lists"], summary: "Open own list", security: authSecurity, responses: { 200: ok() } }, put: { tags: ["Lists"], summary: "Edit list", security: authSecurity, responses: { 200: ok() } }, delete: { tags: ["Lists"], summary: "Delete list", security: authSecurity, responses: { 204: ok() } } },
    "/lists/{id}/items": { post: { tags: ["Lists"], summary: "Add movie", security: authSecurity, requestBody: json({ $ref: "#/components/schemas/MovieSnapshot" }, { tmdbMovieId: 550, title: "Fight Club" }), responses: { 201: ok() } } },
    "/public/lists/{shareCode}": { get: { tags: ["Lists"], summary: "Open public list", responses: { 200: ok(), 404: ok() } } },
    "/movies/{tmdbMovieId}/comments": { get: { tags: ["Comments"], summary: "List comments", responses: { 200: ok() } }, post: { tags: ["Comments"], summary: "Post a comment", security: authSecurity, requestBody: json({ type: "object" }, { content: "Memorable direction." }), responses: { 201: ok() } } },
    "/comments/{id}": { put: { tags: ["Comments"], summary: "Edit own comment", security: authSecurity, responses: { 200: ok() } }, delete: { tags: ["Comments"], summary: "Delete comment", security: authSecurity, responses: { 204: ok() } } },
    "/comments/{id}/like": { post: { tags: ["Comments"], summary: "Like", security: authSecurity, responses: { 201: ok() } }, delete: { tags: ["Comments"], summary: "Remove like", security: authSecurity, responses: { 200: ok() } } },
    "/movies/{tmdbMovieId}/ratings": { get: { tags: ["Ratings"], summary: "MovieHub average", responses: { 200: ok() } } },
    "/movies/{tmdbMovieId}/rating": { post: { tags: ["Ratings"], summary: "Create or update rating", security: authSecurity, requestBody: json({ type: "object" }, { score: 9 }), responses: { 200: ok() } }, delete: { tags: ["Ratings"], summary: "Remove rating", security: authSecurity, responses: { 204: ok() } } },
    "/recommendations/personalized": { get: { tags: ["Recommendations"], summary: "Personal recommendations", security: authSecurity, responses: { 200: ok() } } },
    "/admin/dashboard": { get: { tags: ["Administration"], summary: "Metrics and moderation", security: authSecurity, responses: { 200: ok(), 403: ok() } } },
  },
};
