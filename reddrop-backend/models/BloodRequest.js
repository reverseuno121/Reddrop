const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    bloodGroup: {
      type: String,
      enum: [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ],
      required: true,
    },

    unitsRequired: {
      type: Number,
      required: true,
      min: 1,
    },

    hospitalName: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    district: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    urgency: {
      type: String,
      enum: ["Normal", "Urgent", "Emergency"],
      default: "Normal",
    },

    requiredDate: {
      type: Date,
      required: true,
    },

    acceptedDonor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  
    },

    status: {
      type: String,
      enum: [
        "Open",
        "Donor Assigned",
        "Donation Recorded",
        "Fulfilled",
        "Cancelled",
      ],
      default: "Open",
    },

    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const BloodRequest = mongoose.model(
  "BloodRequest",
  bloodRequestSchema
);

module.exports = BloodRequest;