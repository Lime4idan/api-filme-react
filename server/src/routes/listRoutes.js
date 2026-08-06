const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middlewares/validate");
const { requireAuth } = require("../middlewares/auth");
const schemas = require("../validators/schemas");
const controller = require("../controllers/listController");

router.use(requireAuth);
router.get("/", asyncHandler(controller.listAll));
router.post("/", validate(schemas.listCreate), asyncHandler(controller.create));
router.get("/:id", validate(schemas.numericId, "params"), asyncHandler(controller.get));
router.put("/:id", validate(schemas.numericId, "params"), validate(schemas.listUpdate), asyncHandler(controller.update));
router.delete("/:id", validate(schemas.numericId, "params"), asyncHandler(controller.remove));
router.post("/:id/items", validate(schemas.numericId, "params"), validate(schemas.movieSnapshot), asyncHandler(controller.addItem));
router.delete("/:id/items/:tmdbMovieId", validate(zListItemParams(), "params"), asyncHandler(controller.removeItem));
router.put("/:id/reorder", validate(schemas.numericId, "params"), validate(schemas.reorder), asyncHandler(controller.reorder));

function zListItemParams() {
  const { z } = require("zod");
  return z.object({ id: z.coerce.number().int().positive(), tmdbMovieId: z.coerce.number().int().positive() });
}

module.exports = router;
