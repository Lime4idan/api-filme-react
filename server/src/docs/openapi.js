const errorSchema = {
  type: "object",
  properties: {
    error: {
      type: "object",
      properties: {
        code: { type: "string", example: "VALIDATION_ERROR" },
        message: { type: "string", example: "Dados inválidos" },
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
const ok = (description = "Operação concluída") => ({ description });

module.exports = {
  openapi: "3.0.3",
  info: {
    title: "MovieHub API",
    version: "1.0.0",
    description: "API REST do MovieHub. A sessão principal usa cookie httpOnly; Bearer JWT também é aceito para clientes não navegadores.",
  },
  servers: [{ url: "/api", description: "Servidor atual" }],
  tags: [
    { name: "Autenticação" }, { name: "Usuários" }, { name: "Filmes" },
    { name: "Favoritos" }, { name: "Listas" }, { name: "Comentários" },
    { name: "Avaliações" }, { name: "Recomendações" }, { name: "Administração" },
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
          tmdbMovieId: { type: "integer", example: 550 }, title: { type: "string", example: "Clube da Luta" },
          posterPath: { type: "string", nullable: true, example: "/poster.jpg" }, releaseDate: { type: "string", nullable: true, example: "1999-10-15" },
          voteAverage: { type: "number", nullable: true, example: 8.4 },
        },
      },
    },
  },
  paths: {
    "/auth/register": { post: { tags: ["Autenticação"], summary: "Criar conta", requestBody: json({ type: "object", required: ["name", "email", "password"], properties: { name: { type: "string" }, email: { type: "string", format: "email" }, password: { type: "string", minLength: 8 }, confirmPassword: { type: "string" } } }, { name: "Ana Lima", email: "ana@example.com", password: "senha-segura", confirmPassword: "senha-segura" }), responses: { 201: ok("Conta criada e sessão iniciada"), 409: ok("E-mail já cadastrado") } } },
    "/auth/login": { post: { tags: ["Autenticação"], summary: "Entrar", requestBody: json({ type: "object", properties: { email: { type: "string" }, password: { type: "string" } } }, { email: "ana@example.com", password: "senha-segura" }), responses: { 200: ok("Sessão iniciada"), 401: ok("Credenciais inválidas") } } },
    "/auth/me": { get: { tags: ["Autenticação"], summary: "Ler sessão", security: authSecurity, responses: { 200: ok(), 401: ok("Não autenticado") } } },
    "/auth/logout": { post: { tags: ["Autenticação"], summary: "Encerrar sessão", responses: { 204: ok() } } },
    "/profile": { get: { tags: ["Usuários"], summary: "Ver perfil e contagens", security: authSecurity, responses: { 200: ok() } }, put: { tags: ["Usuários"], summary: "Editar perfil", security: authSecurity, requestBody: json({ type: "object" }, { name: "Ana", bio: "Cinema é memória." }), responses: { 200: ok() } } },
    "/profile/password": { put: { tags: ["Usuários"], summary: "Alterar senha", security: authSecurity, requestBody: json({ type: "object" }, { currentPassword: "senha-atual", newPassword: "nova-senha-segura" }), responses: { 204: ok() } } },
    "/users/{id}": { get: { tags: ["Usuários"], summary: "Perfil público", parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }], responses: { 200: ok(), 404: ok() } } },
    "/movies/popular": { get: { tags: ["Filmes"], summary: "Filmes populares", responses: { 200: ok() } } },
    "/movies/top-rated": { get: { tags: ["Filmes"], summary: "Melhores avaliados", responses: { 200: ok() } } },
    "/movies/upcoming": { get: { tags: ["Filmes"], summary: "Próximos lançamentos", responses: { 200: ok() } } },
    "/movies/now-playing": { get: { tags: ["Filmes"], summary: "Em cartaz", responses: { 200: ok() } } },
    "/movies/search": { get: { tags: ["Filmes"], summary: "Pesquisa avançada", parameters: [{ in: "query", name: "query", required: true, schema: { type: "string" } }, { in: "query", name: "page", schema: { type: "integer" } }, { in: "query", name: "genre", schema: { type: "integer" } }, { in: "query", name: "year", schema: { type: "integer" } }, { in: "query", name: "voteMin", schema: { type: "number" } }, { in: "query", name: "language", schema: { type: "string" } }, { in: "query", name: "sort", schema: { type: "string", enum: ["popularity", "rating", "release"] } }], responses: { 200: ok() } } },
    "/movies/genres": { get: { tags: ["Filmes"], summary: "Gêneros do TMDB", responses: { 200: ok() } } },
    "/movies/discover": { get: { tags: ["Filmes"], summary: "Descobrir com filtros", responses: { 200: ok() } } },
    "/movies/{id}": { get: { tags: ["Filmes"], summary: "Detalhes do filme", parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }], responses: { 200: ok(), 404: ok() } } },
    "/favorites": { get: { tags: ["Favoritos"], summary: "Listar favoritos", security: authSecurity, responses: { 200: ok() } }, post: { tags: ["Favoritos"], summary: "Adicionar favorito", security: authSecurity, requestBody: json({ $ref: "#/components/schemas/MovieSnapshot" }, { tmdbMovieId: 550, title: "Clube da Luta", posterPath: "/poster.jpg", releaseDate: "1999-10-15", voteAverage: 8.4 }), responses: { 201: ok(), 409: ok() } } },
    "/favorites/{tmdbMovieId}": { delete: { tags: ["Favoritos"], summary: "Remover favorito", security: authSecurity, responses: { 204: ok() } } },
    "/lists": { get: { tags: ["Listas"], summary: "Listar minhas listas", security: authSecurity, responses: { 200: ok() } }, post: { tags: ["Listas"], summary: "Criar lista", security: authSecurity, requestBody: json({ type: "object" }, { name: "Clássicos", description: "Para rever sempre", isPublic: true }), responses: { 201: ok() } } },
    "/lists/{id}": { get: { tags: ["Listas"], summary: "Abrir lista própria", security: authSecurity, responses: { 200: ok() } }, put: { tags: ["Listas"], summary: "Editar lista", security: authSecurity, responses: { 200: ok() } }, delete: { tags: ["Listas"], summary: "Excluir lista", security: authSecurity, responses: { 204: ok() } } },
    "/lists/{id}/items": { post: { tags: ["Listas"], summary: "Adicionar filme", security: authSecurity, requestBody: json({ $ref: "#/components/schemas/MovieSnapshot" }, { tmdbMovieId: 550, title: "Clube da Luta" }), responses: { 201: ok() } } },
    "/public/lists/{shareCode}": { get: { tags: ["Listas"], summary: "Abrir lista pública", responses: { 200: ok(), 404: ok() } } },
    "/movies/{tmdbMovieId}/comments": { get: { tags: ["Comentários"], summary: "Listar comentários", responses: { 200: ok() } }, post: { tags: ["Comentários"], summary: "Comentar", security: authSecurity, requestBody: json({ type: "object" }, { content: "Uma direção memorável." }), responses: { 201: ok() } } },
    "/comments/{id}": { put: { tags: ["Comentários"], summary: "Editar comentário próprio", security: authSecurity, responses: { 200: ok() } }, delete: { tags: ["Comentários"], summary: "Excluir comentário", security: authSecurity, responses: { 204: ok() } } },
    "/comments/{id}/like": { post: { tags: ["Comentários"], summary: "Curtir", security: authSecurity, responses: { 201: ok() } }, delete: { tags: ["Comentários"], summary: "Remover curtida", security: authSecurity, responses: { 200: ok() } } },
    "/movies/{tmdbMovieId}/ratings": { get: { tags: ["Avaliações"], summary: "Média MovieHub", responses: { 200: ok() } } },
    "/movies/{tmdbMovieId}/rating": { post: { tags: ["Avaliações"], summary: "Criar ou atualizar nota", security: authSecurity, requestBody: json({ type: "object" }, { score: 9 }), responses: { 200: ok() } }, delete: { tags: ["Avaliações"], summary: "Remover nota", security: authSecurity, responses: { 204: ok() } } },
    "/recommendations/personalized": { get: { tags: ["Recomendações"], summary: "Recomendações pessoais", security: authSecurity, responses: { 200: ok() } } },
    "/admin/dashboard": { get: { tags: ["Administração"], summary: "Indicadores e moderação", security: authSecurity, responses: { 200: ok(), 403: ok() } } },
  },
};
