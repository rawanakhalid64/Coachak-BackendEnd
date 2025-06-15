const express = require("express");
const {
  createProgram,
  getAllPrograms,
  getProgram,
  joinProgram,
  leaveProgram
} = require("../controllers/programController");
const { protect } = require("../controllers/authController");

const router = express.Router();

// Public routes
router.get("/", getAllPrograms);
router.get("/:id", getProgram);

// Protected routes (require authentication)
router.post("/", protect, createProgram);
router.post("/:programId/join", protect, joinProgram);
router.delete("/:programId/leave", protect, leaveProgram);

module.exports = router;