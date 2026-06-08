// Controllers for answers, tags, and articles resources.
const pool = require("../config/db");

// ---- Answers ----
async function listAnswers(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM ANSWER");
    res.json(rows);
  } catch (err) {
    console.error("listAnswers error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function createAnswer(req, res) {
  const { answer, title } = req.body;
  if (!answer || !title) {
    return res.status(400).json({ error: "Answer and question title are required" });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO ANSWER (ANSWER, QUESTION_TITLE, AUTHOR_EMAIL) VALUES (?, ?, ?)",
      [answer, title, req.user.email]
    );
    res.status(201).json({ id: result.insertId, message: "Answer created" });
  } catch (err) {
    console.error("createAnswer error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ---- Tags ----
async function listTags(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM TAGS");
    res.json(rows);
  } catch (err) {
    console.error("listTags error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function createTag(req, res) {
  const { name, content } = req.body;
  if (!name) return res.status(400).json({ error: "Tag name is required" });
  try {
    await pool.query("INSERT INTO TAGS (TAGS_NAME, TAGS_CONTENT) VALUES (?, ?)", [name, content || null]);
    res.status(201).json({ message: "Tag created" });
  } catch (err) {
    console.error("createTag error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ---- Articles ----
async function listArticles(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM ARTICLE");
    res.json(rows);
  } catch (err) {
    console.error("listArticles error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function createArticle(req, res) {
  const { title, content, link } = req.body;
  if (!title) return res.status(400).json({ error: "Article title is required" });
  try {
    await pool.query(
      "INSERT INTO ARTICLE (ARTICLE_TITLE, ARTICLE_CONTENT, LINK) VALUES (?, ?, ?)",
      [title, content || null, link || null]
    );
    res.status(201).json({ message: "Article created" });
  } catch (err) {
    console.error("createArticle error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  listAnswers, createAnswer,
  listTags, createTag,
  listArticles, createArticle,
};
