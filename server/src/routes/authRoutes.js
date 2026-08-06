const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middlewares/validate");
const { requireAuth } = require("../middlewares/auth");
const schemas = require("../validators/schemas");
const controller = require("../controllers/authController");

router.post("/register", validate(schemas.register), asyncHandler(controller.register));
router.post("/login", validate(schemas.login), asyncHandler(controller.login));
router.get("/me", requireAuth, asyncHandler(controller.me));
router.post("/logout", controller.logout);

module.exports = router;
