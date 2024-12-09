const express = require("express");
const { protect } = require("../controllers/authController");
const { restrictTo } = require("../utils/helper");
const route = express.Router();
// add role's prevelage for trainers only
// protect,restrictTo('trainer'),
route.route("/").get();
route.route("/").post();
route.route("/:id").patch();

module.exports = route;
