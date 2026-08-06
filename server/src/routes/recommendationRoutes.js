const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const { requireAuth } = require("../middlewares/auth");
const { personalized } = require("../controllers/recommendationController");

router.get("/personalized", requireAuth, asyncHandler(personalized));

module.exports = router;
