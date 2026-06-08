// Server entry point.
// Upgraded from the original single-file implementation:
//  - env-based config (dotenv)            - bcrypt + JWT auth (no plaintext passwords)
//  - mysql2 promise pool                   - rate limiting
//  - RESTful resource routes under /api    - centralized error handling
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const apiRouter = require("./routes/api");

const app = express();

app.use(express.json());
app.use(cors());

// Basic rate limiting to make the "secure/scalable" claim defensible.
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api", apiRouter);

// Fallback error handler.
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
