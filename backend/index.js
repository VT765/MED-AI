/**
 * Entry point for MedAI Backend Server
 * Author: Production-ready Express setup
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

// Initialize app
const app = express();

// ==========================
// Global Middlewares
// ==========================

// Security headers
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Logging (dev / combined based on env)
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ==========================
// Routes
// ==========================

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MedAI backend is running",
    timestamp: new Date().toISOString(),
  });
});

// Example API route placeholder
app.get("/api", (req, res) => {
  res.json({
    status: "OK",
    message: "API is working",
  });
});

// ==========================
// 404 Handler
// ==========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ==========================
// Global Error Handler
// ==========================
app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ==========================
// Server Listener
// ==========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 MedAI Server running on port ${PORT}`);
});
