require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());

// ==================== API ROUTES (define after middleware) ====================
const driverRoutes = require("./src/routes/drivers");
const incidentRoutes = require("./src/routes/incidents");

app.use("/api/drivers", driverRoutes);
app.use("/api/incidents", incidentRoutes);

// ==================== STATUS ROUTE ====================
app.get("/api/status", (req, res) => {
    res.json({ message: "Smart Car Safety Backend is running 🚗" });
});

// ==================== SERVE FRONTEND IN PRODUCTION ====================
if (process.env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "frontend", "dist");
    app.use(express.static(frontendPath));
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

// ==================== MONGODB CONNECTION & START SERVER ====================
const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("✅ MongoDB connected");
        app.listen(PORT, () => {
            console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1); // Stop app if DB fails
    });
