const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const donorRoutes = require("./routes/donorRoutes");
const bloodRequestRoutes = require("./routes/bloodRequestRoutes");

const adminRoutes = require("./routes/adminRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const recipientRoutes = require("./routes/recipientRoutes");
const donationRoutes = require("./routes/donationRoutes");

dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/blood-requests", bloodRequestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/recipient", recipientRoutes);
app.use("/api/donations", donationRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("RedDrop Backend is Running!");
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`RedDrop server running on http://localhost:${PORT}`);
});