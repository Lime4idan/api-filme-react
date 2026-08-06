const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middlewares/validate");
const { requireAuth } = require("../middlewares/auth");
const schemas = require("../validators/schemas");
const controller = require("../controllers/profileController");

router.use(requireAuth);
router.get("/", asyncHandler(controller.getProfile));
router.put("/", validate(schemas.profile), asyncHandler(controller.updateProfile));
router.put("/password", validate(schemas.password), asyncHandler(controller.changePassword));

module.exports = router;
