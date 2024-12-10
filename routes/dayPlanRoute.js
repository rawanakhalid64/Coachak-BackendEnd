const express = require("express");
const { protect } = require("../controllers/authController");
const { restrictTo } = require("../utils/helper");
const route = express.Router();
// add role's prevelage for trainers only
// protect,restrictTo('trainer'),
route.use(protect);
route.route("/").get();
route.route("/").post(restrictTo("trainer"));
route.route("/:id").patch(restrictTo("trainer"));

module.exports = route;