// AI-based code analysis service.
//
// When a question contains a code snippet, this analyzes it and returns:
//   - detected language
//   - a short review (readability, likely bugs, suggestions)
//   - a list of optimization recommendations
//
// If ANTHROPIC_API_KEY is set, it uses the Anthropic API for a real LLM review.
// If not, it falls back to a deterministic local heuristic analyzer so the
// feature still works in a demo/offline environment.
const axios = require("axios");

const HEURISTIC_RULES = [
  { re: /==(?!=)/g, msg: "Uses loose equality (==). Prefer === to avoid type-coercion bugs." },
  { re: /\bvar\b/g, msg: "Uses 'var'. Prefer 'let'/'const' for block scoping." },
  { re: /SELECT \*/gi, msg: "SELECT * fetches all columns; select only what you need for performance." },
  { re: /console\.log/g, msg: "Leftover console.log statements; remove before production." },
  { re: /for\s*\(.*\.length.*\)/g, msg: "Caching array.length outside the loop can be marginally faster in hot paths." },
  { re: /password/gi, msg: "Possible credential in code; never hardcode secrets — use environment variables." },
];

function detectLanguage(code) {
  if (/def\s+\w+\(|import\s+\w+|print\(/.test(code)) return "python";
  if (/#include|std::|int\s+main\s*\(/.test(code)) return "c/c++";
  if (/public\s+class|System\.out\.println/.test(code)) return "java";
  if (/function\s+\w+|=>|const\s+\w+\s*=/.test(code)) return "javascript";
  if (/SELECT|INSERT|UPDATE|DELETE/i.test(code)) return "sql";
  return "unknown";
}

function heuristicAnalyze(code) {
  const recommendations = [];
  for (const rule of HEURISTIC_RULES) {
    if (rule.re.test(code)) recommendations.push(rule.msg);
  }
  const lines = code.split("\n").length;
  return {
    source: "heuristic",
    language: detectLanguage(code),
    summary: `Analyzed ${lines} line(s). Found ${recommendations.length} potential improvement(s).`,
    recommendations: recommendations.length ? recommendations : ["No common issues detected by the local analyzer."],
  };
}

async function llmAnalyze(code) {
  const prompt =
    "You are a code reviewer for a student Q&A platform. Analyze the code snippet below. " +
    'Respond ONLY with JSON: {"language": string, "summary": string, "recommendations": string[]}. ' +
    "Keep summary under 40 words and give at most 5 concrete recommendations.\n\nCODE:\n" +
    code;

  const resp = await axios.post(
    "https://api.anthropic.com/v1/messages",
    {
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
      max_tokens: 600,
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      timeout: 20000,
    }
  );

  const text = (resp.data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .replace(/```json|```/g, "")
    .trim();

  const parsed = JSON.parse(text);
  return { source: "llm", ...parsed };
}

async function analyzeCode(code) {
  if (!code || !code.trim()) {
    return { source: "none", language: "unknown", summary: "No code provided.", recommendations: [] };
  }
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      return await llmAnalyze(code);
    } catch (err) {
      console.error("LLM analysis failed, falling back to heuristic:", err.message);
      return heuristicAnalyze(code);
    }
  }
  return heuristicAnalyze(code);
}

module.exports = { analyzeCode, heuristicAnalyze, detectLanguage };
