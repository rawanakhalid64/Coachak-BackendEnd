const express = require("express");
const { createRating, getTrainerRatings } = require("../controllers/ratingController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.post("/", protect, createRating);
router.get("/trainer/:trainerId", getTrainerRatings);

module.exports = router;