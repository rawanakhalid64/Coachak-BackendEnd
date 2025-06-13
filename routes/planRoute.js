const express = require("express");
const { protect } = require("../controllers/authController");
const { restrictTo } = require("../utils/helper");
const {
  createPlan,
  updatePlan,
  getTrainersPlans,
  getMyPlans,
  getPlanById,
} = require("../controllers/planController");
const route = express.Router();
// add role's prevelage for trainers only
// protect,restrictTo('trainer'),
// get trainersplans
route.use(protect);
// get my plans
route.route("/").get(getMyPlans);

route.route("/").post(protect, restrictTo("trainer"), createPlan);
route
  .route("/:id")
  .get(protect, getPlanById)
  .patch(protect, restrictTo("trainer"), updatePlan);

module.exports = route;
