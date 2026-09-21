const express = require("express");

const {
  getRecipientProfile,
  updateRecipientProfile,
  findDonors,
} = require("../controllers/recipientController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Recipient profile
router.get(
  "/profile",
  protect,
  authorizeRoles("recipient"),
  getRecipientProfile
);

// Update recipient profile
router.put(
  "/profile",
  protect,
  authorizeRoles("recipient"),
  updateRecipientProfile
);

// Recipient finds available donors
router.get(
  "/donors",
  protect,
  authorizeRoles("recipient"),
  findDonors
);

module.exports = router;