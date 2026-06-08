// Authentication controller.
// Replaces the original plaintext-password logic with bcrypt hashing and JWT-based sessions.
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const ALLOWED_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN || "";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/auth/register
async function register(req, res) {
  const { email, username, password, phone } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (ALLOWED_DOMAIN && !email.endsWith(ALLOWED_DOMAIN)) {
    return res.status(403).json({ error: `Registration limited to ${ALLOWED_DOMAIN} accounts` });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  try {
    const [existing] = await pool.query("SELECT EMAIL FROM LOGIN WHERE EMAIL = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO LOGIN (EMAIL, PASSWORD) VALUES (?, ?)", [email, hash]);
    await pool.query(
      "INSERT INTO USERLOGIN (EMAIL, USERNAME, PHONE) VALUES (?, ?, ?)",
      [email, username || null, phone || null]
    );

    return res.status(201).json({ message: "Account created" });
  } catch (err) {
    console.error("register error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const [rows] = await pool.query("SELECT EMAIL, PASSWORD FROM LOGIN WHERE EMAIL = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, rows[0].PASSWORD);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "2h",
    });
    return res.json({ token, email });
  } catch (err) {
    console.error("login error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { register, login };
