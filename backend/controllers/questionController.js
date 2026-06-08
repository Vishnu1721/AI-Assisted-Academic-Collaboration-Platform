// Questions resource controller.
const pool = require("../config/db");

// GET /api/questions
async function listQuestions(req, res) {
  try {
    const tag = req.query.tag;
    let rows;
    if (tag) {
      [rows] = await pool.query(
        "SELECT * FROM QUESTION WHERE TAGS = ? ORDER BY QUESTION_TITLE",
        [tag]
      );
    } else {
      [rows] = await pool.query("SELECT * FROM QUESTION");
    }
    res.json(rows);
  } catch (err) {
    console.error("listQuestions error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

// POST /api/questions  (protected)
async function createQuestion(req, res) {
  const { title, body, tags } = req.body;
  if (!title || !body) {
    return res.status(400).json({ error: "Title and body are required" });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO QUESTION (QUESTION_TITLE, BODY, TAGS, AUTHOR_EMAIL) VALUES (?, ?, ?, ?)",
      [title, body, tags || null, req.user.email]
    );
    res.status(201).json({ id: result.insertId, message: "Question created" });
  } catch (err) {
    console.error("createQuestion error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { listQuestions, createQuestion };
