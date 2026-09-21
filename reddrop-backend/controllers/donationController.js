const Donation = require("../models/Donation");
const User = require("../models/User");
const BloodInventory = require("../models/BloodInventory");
const BloodRequest = require("../models/BloodRequest");
// GET DONOR'S DONATION HISTORY
const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      donor: req.user.id,
    })
      .sort({ donationDate: -1 });

    res.json({
      message: "Donation history fetched successfully",
      count: donations.length,
      donations,
    });
  } catch (error) {
    console.error("Get Donation History Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// GET ALL DONATIONS FOR ADMIN
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate(
        "donor",
        "name email phone bloodGroup state district city"
      )
      .sort({ donationDate: -1 });

    res.json({
      message: "All donations fetched successfully",
      count: donations.length,
      donations,
    });
  } catch (error) {
    console.error("Get All Donations Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// CREATE DONATION RECORD
const createDonation = async (req, res) => {
  try {
    const {
      donor,
      bloodRequest,
      bloodGroup,
      donationDate,
      hospitalName,
      unitsDonated,
      notes,
    } = req.body;

    if (
      !donor ||
      !bloodGroup ||
      !donationDate ||
      !hospitalName ||
      !unitsDonated
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    if (Number(unitsDonated) < 1) {
      return res.status(400).json({
        message: "Units donated must be at least 1",
      });
    }

    // Check donor
    const donorUser = await User.findById(donor);

    if (!donorUser) {
      return res.status(404).json({
        message: "Donor not found",
      });
    }

    if (donorUser.role !== "donor") {
      return res.status(400).json({
        message: "Selected user is not a donor",
      });
    }

    // Make sure blood group matches donor's registered blood group
    if (
      donorUser.bloodGroup &&
      donorUser.bloodGroup !== bloodGroup
    ) {
      return res.status(400).json({
        message:
          "Donation blood group does not match donor blood group",
      });
    }

    // Create donation record
    const donation = await Donation.create({
      donor: donorUser._id,
      bloodRequest: bloodRequest || undefined,
      bloodGroup,
      donationDate,
      hospitalName,
      unitsDonated: Number(unitsDonated),
      notes,
    });

    // Add donated units to blood inventory
    const inventory = await BloodInventory.findOneAndUpdate(
      { bloodGroup },
      {
        $inc: {
          unitsAvailable: Number(unitsDonated),
        },
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      }
    );

    // Update related blood request
if (bloodRequest) {
  const request = await BloodRequest.findById(bloodRequest);

  if (request) {
    request.status = "Donation Recorded";
    await request.save();
  }
}

    // Return populated donation
    const populatedDonation = await Donation.findById(
        donation._id
      )
        .populate(
          "donor",
          "name email phone bloodGroup state district city"
        )
        .populate(
          "bloodRequest",
          "patientName bloodGroup unitsRequired hospitalName state district city urgency requiredDate status"
        );

    res.status(201).json({
      message: "Donation record created successfully",
      donation: populatedDonation,
      inventory,
    });
  } catch (error) {
    console.error("Create Donation Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getMyDonations,
  getAllDonations,
  createDonation,
};