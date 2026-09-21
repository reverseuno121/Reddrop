const express = require("express");

const {
  getMyDonations,
  getAllDonations,
  createDonation,
} = require("../controllers/donationController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Donor views own donation history
router.get(
  "/my-donations",
  protect,
  authorizeRoles("donor"),
  getMyDonations
);

// Admin views all donation records
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllDonations
);

// Create donation record
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createDonation
);


module.exports = router;