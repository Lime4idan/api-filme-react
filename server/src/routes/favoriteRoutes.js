const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middlewares/validate");
const { requireAuth } = require("../middlewares/auth");
const schemas = require("../validators/schemas");
const controller = require("../controllers/favoriteController");

router.use(requireAuth);
router.get("/", validate(schemas.paginationQuery, "query"), asyncHandler(controller.list));
router.post("/", validate(schemas.movieSnapshot), asyncHandler(controller.create));
router.delete("/:tmdbMovieId", validate(schemas.movieId, "params"), asyncHandler(controller.remove));
router.get("/check/:tmdbMovieId", validate(schemas.movieId, "params"), asyncHandler(controller.check));

module.exports = router;
