const express = require("express");

const {
    createBloodRequest,
    getBloodRequests,
    acceptBloodRequest,
    issueBlood,
    getMyBloodRequests,
    cancelBloodRequest,
} = require("../controllers/bloodRequestController");

const {
    protect,
    authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Recipient creates a blood request
router.post(
    "/",
    protect,
    authorizeRoles("recipient"),
    createBloodRequest
);

// Donor views open blood requests
router.get(
  "/",
  protect,
  authorizeRoles("donor"),
  getBloodRequests
);

// Recipient views their own blood requests
router.get(
  "/my-requests",
  protect,
  authorizeRoles("recipient"),
  getMyBloodRequests
);

// Recipient cancels their own blood request
router.put(
  "/:id/cancel",
  protect,
  authorizeRoles("recipient"),
  cancelBloodRequest
);

// Donor accepts a blood request
router.put(
  "/:id/accept",
  protect,
  authorizeRoles("donor"),
  acceptBloodRequest
);

router.put(
  "/:id/issue",
  protect,
  authorizeRoles("admin"),
  issueBlood
);

module.exports = router;