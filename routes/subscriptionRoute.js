const express = require("express");
const { protect } = require("../controllers/authController");
const {
  updateSubsciption,
  addSubscription,
  getMySubscriptions,
} = require("../controllers/subscriptionController");
const weekPlanRouter = require("../routes/weekPlanRoute");
const { restrictTo } = require("../utils/helper");
const route = express.Router();

// protect,restrictTo('trainer'),
// The mergeParams option needs to be set to true in the parent router as well
// to allow params to be passed down to child routers
route.use("/:subscriptionId/weeks", weekPlanRouter);
// route.use("/:subscriptionId/weeks", (req, res) => {
//   res.json("success");
// });
route.use(protect);

route.route("/").get(getMySubscriptions);

// add role's prevelage for client - for adding - only
// verify  payment before creating subscription
route.route("/").post(restrictTo("client"), addSubscription);
// add role's prevelage for trainers - for editing - only
route.route("/:id").patch(restrictTo("trainer"), updateSubsciption);

module.exports = route;
