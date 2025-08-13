require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());

// ==================== MONGODB CONNECTION ====================
const mongoURI = process.env.MONGO_URI;

mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// ==================== API ROUTES ====================
// Since server.js is in root, routes are in backend/src/routes
const driverRoutes = require("./backend/src/routes/drivers");
const incidentRoutes = require("./backend/src/routes/incidents");

app.use("/api/drivers", driverRoutes);
app.use("/api/incidents", incidentRoutes);

// ==================== STATUS ROUTE ====================
app.get("/api/status", (req, res) => {
    res.json({ message: "Smart Car Safety Backend is running 🚗" });
});

// ==================== SERVE FRONTEND IN PRODUCTION ====================
if (process.env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "frontend", "dist");

    // Serve static React files
    app.use(express.static(frontendPath));

    // Catch-all: serve React app for non-API routes
    app.get("*", (req, res) => {
        if (!req.path.startsWith("/api")) {
            res.sendFile(path.join(frontendPath, "index.html"));
        } else {
            res.status(404).json({ error: "API route not found" });
        }
    });
}

// ==================== ROOT ENDPOINT ====================
app.get("/", (req, res) => {
    res.send("Smart Car Safety & Diagnostic System Backend is running 🚗");
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(
        `🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
    );
});
