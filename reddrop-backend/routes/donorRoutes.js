const express = require("express");

const {
  getDonorProfile,
  updateDonorProfile,
  getDonorAvailability,
  updateDonorAvailability,
} = require("../controllers/donorController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get donor profile
router.get(
  "/profile",
  protect,
  authorizeRoles("donor"),
  getDonorProfile
);

// Update donor profile
router.put(
  "/profile",
  protect,
  authorizeRoles("donor"),
  updateDonorProfile
);

// Get donor availability
router.get(
  "/availability",
  protect,
  authorizeRoles("donor"),
  getDonorAvailability
);

// Update donor availability
router.put(
  "/availability",
  protect,
  authorizeRoles("donor"),
  updateDonorAvailability
);

module.exports = router;