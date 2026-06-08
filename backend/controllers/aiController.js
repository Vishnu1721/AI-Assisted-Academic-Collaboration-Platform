// AI endpoints controller.
const { analyzeCode } = require("../services/aiCodeAnalysis");

// POST /api/ai/analyze  { code: string }
async function analyze(req, res) {
  try {
    const result = await analyzeCode(req.body.code || "");
    res.json(result);
  } catch (err) {
    console.error("analyze error:", err.message);
    res.status(500).json({ error: "Analysis failed" });
  }
}

module.exports = { analyze };
