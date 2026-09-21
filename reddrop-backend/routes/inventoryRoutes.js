const express = require("express");

const {
  getBloodInventory,
  updateBloodInventory,
} = require("../controllers/inventoryController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Admin views blood inventory
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getBloodInventory
);

// Admin updates blood inventory
router.put(
  "/",
  protect,
  authorizeRoles("admin"),
  updateBloodInventory
);

module.exports = router;