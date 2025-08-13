// server.js (CommonJS)
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ===== MongoDB Connection =====
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== API Routes =====
app.get("/api/status", (req, res) => {
    res.json({ message: "Smart Car Safety Backend is running 🚗" });
});

// Example: you can add more routes like
// const carsRouter = require("./routes/cars");
// app.use("/api/cars", carsRouter);

// ===== Serve React Frontend in Production =====
if (process.env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "frontend/dist"); // Adjust if needed

    // Serve static files
    app.use(express.static(frontendPath));

    // Serve index.html for non-API routes
    app.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}

// ===== Root Endpoint (Development) =====
app.get("/", (req, res) => {
    res.send("Smart Car Safety & Diagnostic System Backend is running 🚗");
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(
        `🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
    );
});
