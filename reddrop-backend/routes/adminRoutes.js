const express = require("express");

const {
  getAdminProfile,
  updateAdminProfile,
  getAllUsers,
  getAllDonors,
  getAllBloodRequests,
  getDashboardStats,
} = require("../controllers/adminController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/profile",
  protect,
  authorizeRoles("admin"),
  getAdminProfile
);

router.put(
  "/profile",
  protect,
  authorizeRoles("admin"),
  updateAdminProfile
);

// Admin gets all users
router.get(
  "/users",
  protect,
  authorizeRoles("admin"),
  getAllUsers
);

// Admin gets all donors
router.get(
  "/donors",
  protect,
  authorizeRoles("admin"),
  getAllDonors
);

// Admin gets all blood requests
router.get(
  "/blood-requests",
  protect,
  authorizeRoles("admin"),
  getAllBloodRequests
);

// Admin dashboard statistics
router.get(
  "/dashboard-stats",
  protect,
  authorizeRoles("admin"),
  getDashboardStats
);


module.exports = router;