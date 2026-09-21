const mongoose = require("mongoose");

const bloodInventorySchema = new mongoose.Schema(
  {
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
      unique: true,
    },

    unitsAvailable: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const BloodInventory = mongoose.model(
  "BloodInventory",
  bloodInventorySchema
);

module.exports = BloodInventory;