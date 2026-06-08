// Analytics controller.
//
// Serves aggregated platform analytics. The numbers are produced by the
// PySpark batch job in /analytics (spark_analytics.py), which writes its
// output to analytics_output.json. If that file is missing (job not run yet),
// this falls back to computing the same aggregates live from MySQL so the
// endpoint always returns something usable in a demo.
const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

const SPARK_OUTPUT = path.join(__dirname, "..", "..", "analytics", "analytics_output.json");

// GET /api/analytics
async function getAnalytics(req, res) {
  // Prefer pre-computed Spark output.
  try {
    if (fs.existsSync(SPARK_OUTPUT)) {
      const data = JSON.parse(fs.readFileSync(SPARK_OUTPUT, "utf-8"));
      return res.json({ source: "spark", ...data });
    }
  } catch (err) {
    console.error("Failed reading Spark output, falling back to live DB:", err.message);
  }

  // Live fallback computed in SQL.
  try {
    const [[{ totalQuestions }]] = await pool.query(
      "SELECT COUNT(*) AS totalQuestions FROM QUESTION"
    );
    const [[{ totalAnswers }]] = await pool.query(
      "SELECT COUNT(*) AS totalAnswers FROM ANSWER"
    );
    const [topTags] = await pool.query(
      "SELECT TAGS AS tag, COUNT(*) AS count FROM QUESTION WHERE TAGS IS NOT NULL GROUP BY TAGS ORDER BY count DESC LIMIT 10"
    );
    const answerRate = totalQuestions ? +(totalAnswers / totalQuestions).toFixed(3) : 0;

    return res.json({
      source: "live-sql",
      totals: { totalQuestions, totalAnswers, answerRate },
      topTags,
    });
  } catch (err) {
    console.error("getAnalytics error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getAnalytics };
