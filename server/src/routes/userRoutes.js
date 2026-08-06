const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middlewares/validate");
const schemas = require("../validators/schemas");
const { getPublicProfile } = require("../controllers/profileController");

router.get("/:id", validate(schemas.numericId, "params"), asyncHandler(getPublicProfile));

module.exports = router;
