const express = require("express");
const { protect } = require("../controllers/authController");
const { restrictTo } = require("../utils/helper");
const route = express.Router();
route.use(protect);
route.route("/").get();
route.route("/").post(restrictTo("trainer", "admin"));
route.route("/:id").patch(restrictTo("trainer"));

module.exports = route;
