const User = require("../models/User");

// GET DONOR PROFILE
const getDonorProfile = async (req, res) => {
  try {
    const donor = await User.findById(req.user.id).select("-password");

    if (!donor) {
      return res.status(404).json({
        message: "Donor not found",
      });
    }

    res.json({
      message: "Donor profile fetched successfully",
      donor,
    });
  } catch (error) {
    console.error("Get Donor Profile Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// UPDATE DONOR PROFILE
const updateDonorProfile = async (req, res) => {
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

    const donor = await User.findById(req.user.id);

    if (!donor) {
      return res.status(404).json({
        message: "Donor not found",
      });
    }

    donor.name = name || donor.name;
    donor.phone = phone || donor.phone;
    donor.gender = gender || donor.gender;
    donor.dateOfBirth = dateOfBirth || donor.dateOfBirth;
    donor.bloodGroup = bloodGroup || donor.bloodGroup;
    donor.state = state || donor.state;
    donor.district = district || donor.district;
    donor.city = city || donor.city;

    await donor.save();

    res.json({
      message: "Donor profile updated successfully",
      donor: {
        id: donor._id,
        name: donor.name,
        email: donor.email,
        phone: donor.phone,
        role: donor.role,
        gender: donor.gender,
        dateOfBirth: donor.dateOfBirth,
        bloodGroup: donor.bloodGroup,
        state: donor.state,
        district: donor.district,
        city: donor.city,
        availability: donor.availability,
      },
    });
  } catch (error) {
    console.error(
      "Update Donor Profile Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET DONOR AVAILABILITY
const getDonorAvailability = async (req, res) => {
  try {
    const donor = await User.findById(req.user.id).select(
      "availability"
    );

    if (!donor) {
      return res.status(404).json({
        message: "Donor not found",
      });
    }

    res.json({
      message: "Donor availability fetched successfully",
      availability: donor.availability,
    });
  } catch (error) {
    console.error(
      "Get Donor Availability Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// UPDATE DONOR AVAILABILITY
const updateDonorAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    if (typeof availability !== "boolean") {
      return res.status(400).json({
        message: "Availability must be true or false",
      });
    }

    const donor = await User.findById(req.user.id);

    if (!donor) {
      return res.status(404).json({
        message: "Donor not found",
      });
    }

    donor.availability = availability;

    await donor.save();

    res.json({
      message: "Donor availability updated successfully",
      availability: donor.availability,
    });
  } catch (error) {
    console.error(
      "Update Donor Availability Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getDonorProfile,
  updateDonorProfile,
  getDonorAvailability,
  updateDonorAvailability,
};