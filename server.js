// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// Example API route
app.get("/api/status", (req, res) => {
    res.json({ message: "Smart Car Safety Backend is running 🚗" });
});

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "frontend", "dist");

    // Serve static files
    app.use(express.static(frontendPath));

    // Catch-all to serve index.html for React routing
    app.get("*", (req, res) => {
        // Only serve index.html for non-API routes
        if (!req.path.startsWith("/api")) {
            res.sendFile(path.join(frontendPath, "index.html"));
        } else {
            res.status(404).json({ error: "API route not found" });
        }
    });
}

// Root endpoint for development
app.get("/", (req, res) => {
    res.send("Smart Car Safety & Diagnostic System Backend is running 🚗");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(
        `🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
    );
});
