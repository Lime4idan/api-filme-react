const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const { getPublicList } = require("../controllers/publicListController");

router.get("/lists/:shareCode", asyncHandler(getPublicList));

module.exports = router;
