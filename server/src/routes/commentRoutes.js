const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middlewares/validate");
const { requireAuth } = require("../middlewares/auth");
const schemas = require("../validators/schemas");
const controller = require("../controllers/commentController");

router.use(requireAuth);
router.put("/:id", validate(schemas.numericId, "params"), validate(schemas.comment), asyncHandler(controller.update));
router.delete("/:id", validate(schemas.numericId, "params"), asyncHandler(controller.remove));
router.post("/:id/like", validate(schemas.numericId, "params"), asyncHandler(controller.like));
router.delete("/:id/like", validate(schemas.numericId, "params"), asyncHandler(controller.unlike));

module.exports = router;
