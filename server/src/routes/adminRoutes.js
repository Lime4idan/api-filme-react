const { z } = require("zod");
const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middlewares/validate");
const { requireAuth, requireAdmin } = require("../middlewares/auth");
const schemas = require("../validators/schemas");
const controller = require("../controllers/adminController");

router.use(requireAuth, requireAdmin);
router.get("/dashboard", asyncHandler(controller.dashboard));
router.delete("/comments/:id", validate(schemas.numericId, "params"), asyncHandler(controller.deleteComment));
router.put("/users/:id/status", validate(schemas.numericId, "params"), validate(z.object({ isActive: z.boolean() })), asyncHandler(controller.updateUserStatus));

module.exports = router;
