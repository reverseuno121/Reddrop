const User = require("../models/User");
const {
  getCompatibleDonorGroups,
} = require("../utils/bloodCompatibility");

// GET RECIPIENT PROFILE
const getRecipientProfile = async (req, res) => {
  try {
    const recipient = await User.findById(req.user.id).select("-password");

    if (!recipient) {
      return res.status(404).json({
        message: "Recipient not found",
      });
    }

    res.json({
      message: "Recipient profile fetched successfully",
      recipient,
    });
  } catch (error) {
    console.error("Get Recipient Profile Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// FIND AVAILABLE DONORS
const findDonors = async (req, res) => {
  try {
    const {
      bloodGroup,
      state,
      district,
      city,
    } = req.query;

    const filter = {
      role: "donor",
      availability: true,
    };

    // Optional filters
    if (bloodGroup) {
          const compatibleGroups =
            getCompatibleDonorGroups(bloodGroup);

          filter.bloodGroup = {
            $in: compatibleGroups,
          };
        }

    if (state) {
      filter.state = state;
    }

    if (district) {
      filter.district = district;
    }

    if (city) {
      filter.city = city;
    }

    const donors = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      message: "Available donors fetched successfully",
      count: donors.length,
      donors,
    });
  } catch (error) {
    console.error("Find Donors Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// UPDATE RECIPIENT PROFILE
const updateRecipientProfile = async (req, res) => {
  try {
    const {
  name,
  phone,
  gender,
  dateOfBirth,
  bloodGroup,
  state,
  district,
  city,
} = req.body;

    const recipient = await User.findById(req.user.id);

    if (!recipient) {
      return res.status(404).json({
        message: "Recipient not found",
      });
    }

    recipient.name = name || recipient.name;
    recipient.phone = phone || recipient.phone;
    recipient.gender = gender || recipient.gender;
    recipient.dateOfBirth = dateOfBirth || recipient.dateOfBirth;
    recipient.bloodGroup =
      bloodGroup || recipient.bloodGroup;
    recipient.state = state || recipient.state;
    recipient.district =
      district || recipient.district;
    recipient.city = city || recipient.city;

    await recipient.save();

    res.json({
      message: "Recipient profile updated successfully",
      recipient: {
        id: recipient._id,
        name: recipient.name,
        email: recipient.email,
        phone: recipient.phone,
        role: recipient.role,
        gender: recipient.gender,
        dateOfBirth: recipient.dateOfBirth,
        bloodGroup: recipient.bloodGroup,
        state: recipient.state,
        district: recipient.district,
        city: recipient.city,
      },
    });
  } catch (error) {
    console.error(
      "Update Recipient Profile Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getRecipientProfile,
  updateRecipientProfile,
  findDonors,
};