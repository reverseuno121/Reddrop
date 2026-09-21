const User = require("../models/User");
const BloodRequest = require("../models/BloodRequest");
const BloodInventory = require("../models/BloodInventory");

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      message: "Users fetched successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET ALL DONORS
const getAllDonors = async (req, res) => {
  try {
    const donors = await User.find({
      role: "donor",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      message: "Donors fetched successfully",
      count: donors.length,
      donors,
    });
  } catch (error) {
    console.error("Get All Donors Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET ALL BLOOD REQUESTS
const getAllBloodRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find()
      .populate("recipient", "name email phone")
      .populate("acceptedDonor", "name email phone bloodGroup")
      .sort({ createdAt: -1 });

    res.json({
      message: "Blood requests fetched successfully",
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get All Blood Requests Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET ADMIN DASHBOARD STATISTICS
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalDonors = await User.countDocuments({
      role: "donor",
    });

    const totalRecipients = await User.countDocuments({
      role: "recipient",
    });

    const totalRequests = await BloodRequest.countDocuments();

    const openRequests = await BloodRequest.countDocuments({
      status: "Open",
    });

    const fulfilledRequests = await BloodRequest.countDocuments({
      status: "Fulfilled",
    });

    const cancelledRequests = await BloodRequest.countDocuments({
      status: "Cancelled",
    });

    const inventory = await BloodInventory.find();

    const totalBloodUnits = inventory.reduce(
      (total, item) => total + item.unitsAvailable,
      0
    );

    res.json({
      message: "Dashboard statistics fetched successfully",
      stats: {
        totalUsers,
        totalDonors,
        totalRecipients,
        totalRequests,
        openRequests,
        fulfilledRequests,
        cancelledRequests,
        totalBloodUnits,
      },
    });
  } catch (error) {
    console.error("Get Dashboard Stats Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET ADMIN PROFILE
const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select("-password");

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    res.json({
      message: "Admin profile fetched successfully",
      admin,
    });
  } catch (error) {
    console.error("Get Admin Profile Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// UPDATE ADMIN PROFILE
const updateAdminProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const admin = await User.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    admin.name = name || admin.name;
    admin.phone = phone || admin.phone;

    await admin.save();

    res.json({
      message: "Admin profile updated successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Update Admin Profile Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getAdminProfile,
  updateAdminProfile,
  getAllUsers,
  getAllDonors,
  getAllBloodRequests,
  getDashboardStats,
};