const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middlewares/validate");
const { requireAuth, optionalAuth } = require("../middlewares/auth");
const schemas = require("../validators/schemas");
const comments = require("../controllers/commentController");
const ratings = require("../controllers/ratingController");

router.get("/:tmdbMovieId/comments", validate(schemas.movieId, "params"), validate(schemas.paginationQuery, "query"), optionalAuth, asyncHandler(comments.list));
router.post("/:tmdbMovieId/comments", validate(schemas.movieId, "params"), requireAuth, validate(schemas.comment), asyncHandler(comments.create));
router.get("/:tmdbMovieId/ratings", validate(schemas.movieId, "params"), asyncHandler(ratings.stats));
router.get("/:tmdbMovieId/my-rating", validate(schemas.movieId, "params"), requireAuth, asyncHandler(ratings.mine));
router.post("/:tmdbMovieId/rating", validate(schemas.movieId, "params"), requireAuth, validate(schemas.rating), asyncHandler(ratings.upsert));
router.delete("/:tmdbMovieId/rating", validate(schemas.movieId, "params"), requireAuth, asyncHandler(ratings.remove));

module.exports = router;
