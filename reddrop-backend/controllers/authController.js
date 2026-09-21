const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// =========================
// REGISTER USER
// =========================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
      dateOfBirth,
      gender,
      bloodGroup,
      state,
      district,
      city,
    } = req.body;

    // Check basic required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // Phone number validation
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Phone number must contain exactly 10 digits",
      });
    }

    // Password validation
    const passwordPattern =
      /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])[A-Z].{7,}$/;

    if (!passwordPattern.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters, start with a capital letter, contain at least one number and one special character",
      });
    }

    // Check Step 2 required fields
    if (!role || !dateOfBirth || !gender || !bloodGroup) {
      return res.status(400).json({
        message: "Please fill all profile details",
      });
    }

    if (!state || !district || !city) {
      return res.status(400).json({
        message: "Please complete your location details",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      phone,
      role,
      dateOfBirth,
      gender,
      bloodGroup,
      state,
      district,
      city,
    });

    // Create JWT token
      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        bloodGroup: user.bloodGroup,
        state: user.state,
        district: user.district,
        city: user.city,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// LOGIN USER
// =========================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        bloodGroup: user.bloodGroup,
        state: user.state,
        district: user.district,
        city: user.city,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

//Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  changePassword,
};