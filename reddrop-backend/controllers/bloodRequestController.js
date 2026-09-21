const BloodRequest = require("../models/BloodRequest");
const BloodInventory = require("../models/BloodInventory");
const User = require("../models/User");
const {
  getCompatibleDonorGroups,
  getCompatibleRecipientGroups,
  isBloodCompatible,
} = require("../utils/bloodCompatibility");

// CREATE BLOOD REQUEST
const createBloodRequest = async (req, res) => {
  try {
    const {
      patientName,
      bloodGroup,
      unitsRequired,
      hospitalName,
      state,
      district,
      city,
      urgency,
      requiredDate,
      description,
    } = req.body;

    if (
      !patientName ||
      !bloodGroup ||
      !unitsRequired ||
      !hospitalName ||
      !state ||
      !district ||
      !city ||
      !requiredDate
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const bloodRequest = await BloodRequest.create({
      recipient: req.user.id,
      patientName,
      bloodGroup,
      unitsRequired,
      hospitalName,
      state,
      district,
      city,
      urgency: urgency || "Normal",
      requiredDate,
      description,
    });

    res.status(201).json({
      message: "Blood request created successfully",
      request: bloodRequest,
    });
  } catch (error) {
    console.error("Create Blood Request Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET BLOOD REQUESTS FOR DONOR
// GET BLOOD REQUESTS FOR DONOR
const getBloodRequests = async (req, res) => {
  try {
    // Get logged-in donor's blood group
    const donor = await User.findById(req.user.id).select(
      "bloodGroup"
    );

    if (!donor) {
      return res.status(404).json({
        message: "Donor not found",
      });
    }

    // Get recipient blood groups this donor can donate to
    const compatibleRecipientGroups =
      getCompatibleRecipientGroups(donor.bloodGroup);

    const requests = await BloodRequest.find({
      $or: [
        // New requests:
        // show only compatible blood groups
        {
          status: "Open",
          acceptedDonor: null,
          bloodGroup: {
            $in: compatibleRecipientGroups,
          },
        },

        // Requests already accepted by this donor
        {
          acceptedDonor: req.user.id,
          status: {
            $in: [
              "Donor Assigned",
              "Donation Recorded",
              "Fulfilled",
            ],
          },
        },
      ],
    })
      .populate(
        "recipient",
        "name email phone"
      )
      .populate(
        "acceptedDonor",
        "name email phone bloodGroup"
      )
      .sort({ createdAt: -1 });

    res.json({
      message: "Blood requests fetched successfully",
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error(
      "Get Blood Requests Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};
  

// ACCEPT BLOOD REQUEST
const acceptBloodRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await BloodRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        message: "Blood request not found",
      });
    }

    if (request.status !== "Open") {
      return res.status(400).json({
        message: "Only open blood requests can be accepted",
      });
    }

    // Get logged-in donor's blood group
    const donor = await User.findById(req.user.id).select(
      "bloodGroup"
    );

    if (!donor) {
      return res.status(404).json({
        message: "Donor not found",
      });
    }

    // Final blood compatibility check
    const compatible = isBloodCompatible(
      donor.bloodGroup,
      request.bloodGroup
    );

    if (!compatible) {
      return res.status(400).json({
        message:
          `Your blood group (${donor.bloodGroup}) ` +
          `is not compatible with this request (${request.bloodGroup}).`,
      });
    }

    // Save the donor who accepted the request
    request.acceptedDonor = req.user.id;

    // Change request status
    request.status = "Donor Assigned";

    // IMPORTANT:
    // Do NOT change blood inventory here.
    // Inventory will increase only when admin records the donation.

    await request.save();

    const updatedRequest = await BloodRequest.findById(id)
      .populate("recipient", "name email phone")
      .populate(
        "acceptedDonor",
        "name email phone bloodGroup"
      );

    res.json({
      message: "Blood request accepted successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error(
      "Accept Blood Request Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};
// ISSUE BLOOD TO RECIPIENT
const issueBlood = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await BloodRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        message: "Blood request not found",
      });
    }

    // Blood can be issued in two cases:
    // 1. Directly from inventory (Open)
    // 2. After donor donation is recorded (Donation Recorded)
    if (
      request.status !== "Open" &&
      request.status !== "Donation Recorded"
    ) {
      return res.status(400).json({
        message:
          "This blood request is not ready to be issued",
      });
    }

      // Get compatible blood groups for this recipient
        const compatibleBloodGroups =
          getCompatibleDonorGroups(
            request.bloodGroup
          );

      // Fetch all compatible inventory records
      const inventories = await BloodInventory.find({
        bloodGroup: {
          $in: compatibleBloodGroups,
        },
      });

      // Calculate total available compatible units
      const totalAvailableUnits = inventories.reduce(
        (total, inventory) =>
          total + inventory.unitsAvailable,
        0
      );

      if (totalAvailableUnits < request.unitsRequired) {
        return res.status(400).json({
          message:
            `Insufficient compatible blood inventory for ${request.bloodGroup}`,
          availableUnits: totalAvailableUnits,
          requiredUnits: request.unitsRequired,
        });
      }

      // Deduct units from compatible inventory
      let remainingUnits = request.unitsRequired;
      const updatedInventories = [];

      // compatibleBloodGroups already puts the exact group first
      for (const bloodGroup of compatibleBloodGroups) {
        if (remainingUnits <= 0) {
          break;
        }

        const inventory = inventories.find(
          (item) => item.bloodGroup === bloodGroup
        );

        if (!inventory || inventory.unitsAvailable <= 0) {
          continue;
        }

        const unitsToDeduct = Math.min(
          inventory.unitsAvailable,
          remainingUnits
        );

        inventory.unitsAvailable -= unitsToDeduct;

        await inventory.save();

        remainingUnits -= unitsToDeduct;

        updatedInventories.push({
          bloodGroup: inventory.bloodGroup,
          unitsAvailable: inventory.unitsAvailable,
          unitsUsed: unitsToDeduct,
        });
      }

      // Mark request fulfilled
      request.status = "Fulfilled";

      await request.save();

    const updatedRequest = await BloodRequest.findById(id)
      .populate(
        "recipient",
        "name email phone"
      )
      .populate(
        "acceptedDonor",
        "name email phone bloodGroup"
      );

    res.json({
      message: "Blood issued to recipient successfully",
      request: updatedRequest,
      inventory: updatedInventories,
    });
  } catch (error) {
    console.error(
      "Issue Blood Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET RECIPIENT'S OWN BLOOD REQUESTS
const getMyBloodRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({
      recipient: req.user.id,
    })
      .populate("acceptedDonor", 
      "name phone email bloodGroup")
      .sort({ createdAt: -1 });

    res.json({
      message: "Your blood requests fetched successfully",
      requests,
    });
  } catch (error) {
    console.error("Get My Blood Requests Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// CANCEL BLOOD REQUEST
const cancelBloodRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const bloodRequest = await BloodRequest.findById(id);

    if (!bloodRequest) {
      return res.status(404).json({
        message: "Blood request not found",
      });
    }

    // Make sure this request belongs to the logged-in recipient
    if (bloodRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only cancel your own blood requests",
      });
    }

    // Only open requests can be cancelled
    if (bloodRequest.status !== "Open") {
      return res.status(400).json({
        message: "Only open blood requests can be cancelled",
      });
    }

    bloodRequest.status = "Cancelled";

    await bloodRequest.save();

    res.json({
      message: "Blood request cancelled successfully",
      request: bloodRequest,
    });
  } catch (error) {
    console.error("Cancel Blood Request Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createBloodRequest,
  getBloodRequests,
  acceptBloodRequest,
  issueBlood,
  getMyBloodRequests,
  cancelBloodRequest,
};