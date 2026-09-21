const express = require("express");

const {
  registerUser,
  loginUser,
  changePassword,
} = require("../controllers/authController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Logged-in users
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user,
  });
});

// Donor only
router.get(
  "/donor-test",
  protect,
  authorizeRoles("donor"),
  (req, res) => {
    res.json({
      message: "Donor access granted",
      user: req.user,
    });
  }
);

// Recipient only
router.get(
  "/recipient-test",
  protect,
  authorizeRoles("recipient"),
  (req, res) => {
    res.json({
      message: "Recipient access granted",
      user: req.user,
    });
  }
);

// Admin only
router.get(
  "/admin-test",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      message: "Admin access granted",
      user: req.user,
    });
  }
);

//change password
router.put(
  "/change-password",
  protect,
  changePassword
);

module.exports = router;