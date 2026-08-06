const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middlewares/validate");
const schemas = require("../validators/schemas");
const controller = require("../controllers/movieController");

router.get("/popular", validate(schemas.paginationQuery, "query"), asyncHandler(controller.popular));
router.get("/top-rated", validate(schemas.paginationQuery, "query"), asyncHandler(controller.topRated));
router.get("/upcoming", validate(schemas.paginationQuery, "query"), asyncHandler(controller.upcoming));
router.get("/now-playing", validate(schemas.paginationQuery, "query"), asyncHandler(controller.nowPlaying));
router.get("/search", validate(schemas.searchQuery, "query"), asyncHandler(controller.search));
router.get("/genres", asyncHandler(controller.genres));
router.get("/discover", validate(schemas.discoverQuery, "query"), asyncHandler(controller.discover));
router.get("/:id", validate(schemas.numericId, "params"), asyncHandler(controller.details));
router.get("/:id/credits", validate(schemas.numericId, "params"), asyncHandler(controller.credits));
router.get("/:id/videos", validate(schemas.numericId, "params"), asyncHandler(controller.videos));
router.get("/:id/recommendations", validate(schemas.numericId, "params"), validate(schemas.paginationQuery, "query"), asyncHandler(controller.recommendations));
router.get("/:id/similar", validate(schemas.numericId, "params"), validate(schemas.paginationQuery, "query"), asyncHandler(controller.similar));

module.exports = router;
