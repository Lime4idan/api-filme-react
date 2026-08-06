const { z } = require("zod");

const cleanText = (min, max, label) => z.string()
  .trim()
  .min(min, `${label} é obrigatório`)
  .max(max, `${label} deve ter no máximo ${max} caracteres`);

const optionalUrl = z.union([
  z.string().trim().url("URL inválida").refine((value) => /^https?:\/\//i.test(value), "Use uma URL HTTP ou HTTPS"),
  z.literal(""),
  z.null(),
])
  .optional()
  .transform((value) => value || null);

const register = z.object({
  name: cleanText(2, 80, "Nome"),
  email: z.string().trim().email("E-mail inválido").max(160).transform((value) => value.toLowerCase()),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres").max(128),
  confirmPassword: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["confirmPassword"], message: "As senhas não coincidem" });
  }
});

const login = z.object({
  email: z.string().trim().email("E-mail inválido").transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Senha é obrigatória").max(128),
});

const profile = z.object({
  name: cleanText(2, 80, "Nome").optional(),
  avatarUrl: optionalUrl,
  bio: z.union([z.string().trim().max(500), z.null()]).optional().transform((value) => value || null),
}).refine((data) => Object.keys(data).length > 0, "Informe ao menos um campo");

const password = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z.string().min(8, "A nova senha deve ter no mínimo 8 caracteres").max(128),
});

const movieSnapshot = z.object({
  tmdbMovieId: z.coerce.number().int().positive(),
  title: cleanText(1, 240, "Título"),
  posterPath: z.string().trim().max(500).nullable().optional().transform((value) => value || null),
  releaseDate: z.string().trim().max(30).nullable().optional().transform((value) => value || null),
  voteAverage: z.coerce.number().min(0).max(10).nullable().optional(),
});

const listCreate = z.object({
  name: cleanText(1, 80, "Nome"),
  description: z.union([z.string().trim().max(500), z.null()]).optional().transform((value) => value || null),
  isPublic: z.boolean().optional().default(false),
});

const listUpdate = listCreate.partial().refine((data) => Object.keys(data).length > 0, "Informe ao menos um campo");

const reorder = z.object({
  movieIds: z.array(z.coerce.number().int().positive()).min(1).max(500)
    .refine((ids) => new Set(ids).size === ids.length, "A ordem contém filmes duplicados"),
});

const comment = z.object({ content: cleanText(1, 1000, "Comentário") });
const rating = z.object({ score: z.coerce.number().int().min(1).max(10) });

const numericId = z.object({ id: z.coerce.number().int().positive() });
const movieId = z.object({ tmdbMovieId: z.coerce.number().int().positive() });
const page = z.coerce.number().int().min(1).max(500).optional();
const paginationQuery = z.object({ page, limit: z.coerce.number().int().min(1).max(50).optional() }).passthrough();
const discoverQuery = z.object({
  page,
  genre: z.coerce.number().int().positive().optional(),
  year: z.coerce.number().int().min(1870).max(new Date().getFullYear() + 5).optional(),
  voteMin: z.coerce.number().min(0).max(10).optional(),
  language: z.string().trim().min(2).max(8).optional(),
  sort: z.enum(["popularity", "rating", "release"]).optional(),
}).passthrough();
const searchQuery = discoverQuery.extend({ query: cleanText(1, 120, "Pesquisa") });

module.exports = {
  register,
  login,
  profile,
  password,
  movieSnapshot,
  listCreate,
  listUpdate,
  reorder,
  comment,
  rating,
  numericId,
  movieId,
  paginationQuery,
  discoverQuery,
  searchQuery,
};
