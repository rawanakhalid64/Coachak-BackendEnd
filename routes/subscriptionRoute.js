const express = require("express");
const { protect } = require("../controllers/authController");
const { updateSubsciption } = require("../controllers/subscriptionController");
const { restrictTo } = require("../utils/helper");
const route = express.Router();
// protect,restrictTo('trainer'),
route.use(protect);
route.route("/").get();

// add role's prevelage for client - for adding - only
// verify  payment before creating subscription
route.route("/").post();
// add role's prevelage for trainers - for editing - only
route.route("/:id").patch(restrictTo("trainer"), updateSubsciption);

module.exports = route;
