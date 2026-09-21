const BloodInventory = require("../models/BloodInventory");

// GET BLOOD INVENTORY
const getBloodInventory = async (req, res) => {
  try {
    const bloodGroups = [
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "O+",
      "O-",
    ];

    // Create missing blood-group records.
    // Existing records and their units remain unchanged.
    for (const bloodGroup of bloodGroups) {
      await BloodInventory.updateOne(
        { bloodGroup },
        {
          $setOnInsert: {
            bloodGroup,
            unitsAvailable: 0,
          },
        },
        { upsert: true }
      );
    }

    const inventory = await BloodInventory.find()
      .sort({ bloodGroup: 1 });

    res.json({
      message: "Blood inventory fetched successfully",
      inventory,
    });
  } catch (error) {
    console.error("Get Blood Inventory Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ADD OR UPDATE BLOOD UNITS
const updateBloodInventory = async (req, res) => {
  try {
    const { bloodGroup, unitsAvailable } = req.body;

    if (!bloodGroup || unitsAvailable === undefined) {
      return res.status(400).json({
        message: "Blood group and units are required",
      });
    }

    if (unitsAvailable < 0) {
      return res.status(400).json({
        message: "Units cannot be negative",
      });
    }

    const inventory = await BloodInventory.findOneAndUpdate(
      { bloodGroup },
      { unitsAvailable },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      }
    );

    res.json({
      message: "Blood inventory updated successfully",
      inventory,
    });
  } catch (error) {
    console.error("Update Blood Inventory Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getBloodInventory,
  updateBloodInventory,
};