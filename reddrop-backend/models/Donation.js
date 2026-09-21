const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bloodRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodRequest",
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

    donationDate: {
      type: Date,
      required: true,
    },

    hospitalName: {
      type: String,
      required: true,
      trim: true,
    },

    unitsDonated: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    status: {
      type: String,
      enum: ["Completed", "Cancelled"],
      default: "Completed",
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;