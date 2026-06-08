import React, { useState, useEffect } from "react";
import Navbar_login from "../Navbar_Login/Navbar_login";
import Sidebar from "../Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import client from "../../api/client";
import "../Style/Ask_your_query.css";

toast.configure();

const Ask_your_query = () => {
  const [question_title, setQuestionTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [dbtags, setDbtags] = useState([]);

  // AI code-analysis state
  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const navigate = useNavigate();

  // FIX: original had no dependency array, so this re-fired on every render
  // (a request per keystroke). Empty array => fetch once on mount.
  useEffect(() => {
    client
      .get("/tags")
      .then((res) => setDbtags(res.data))
      .catch((err) => console.log(err));
  }, []);

  const question = (e) => {
    e.preventDefault();
    client
      .post("/questions", { title: question_title, body: body, tags: tags })
      .then(() => {
        toast.success("Question added successfully", { position: toast.POSITION.TOP_RIGHT });
        navigate("/question");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Could not add question", { position: toast.POSITION.TOP_RIGHT });
      });
  };

  const analyzeCode = () => {
    if (!code.trim()) return;
    setAnalyzing(true);
    setAnalysis(null);
    client
      .post("/ai/analyze", { code })
      .then((res) => setAnalysis(res.data))
      .catch((err) => {
        console.log(err);
        toast.error("Analysis failed", { position: toast.POSITION.TOP_RIGHT });
      })
      .finally(() => setAnalyzing(false));
  };

  return (
    <div className="ask_your_query-body">
      <Navbar_login />
      <Sidebar />
      <div className="container">
        <form onSubmit={(e) => question(e)}>
          <div className="title">Question Box</div>
          <div className="input-box underline">
            <label>Title:</label>
            <input
              type="text"
              placeholder="Enter Your Title"
              onChange={(e) => setQuestionTitle(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <label>Body</label>
            <input
              type="text"
              placeholder="Enter Your Body"
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <label>Tags</label>
            <br />
            <select name="tags" id="tags-name" onChange={(e) => setTags(e.target.value)}>
              {dbtags.map((tag) => (
                <option key={tag.TAGS_NAME} value={tag.TAGS_NAME}>
                  {tag.TAGS_NAME}
                </option>
              ))}
            </select>
          </div>
          <div className="input-box button">
            <input type="submit" name="" value="Continue" />
          </div>
        </form>

        {/* AI-based code analysis: optional helper for questions that include code */}
        <div className="ai-code-analysis" style={{ marginTop: 24 }}>
          <div className="title">AI Code Review (optional)</div>
          <textarea
            rows={6}
            style={{ width: "100%" }}
            placeholder="Paste a code snippet to get AI feedback before posting…"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="button" onClick={analyzeCode} disabled={analyzing}>
            {analyzing ? "Analyzing…" : "Analyze code"}
          </button>

          {analysis && (
            <div className="analysis-result" style={{ marginTop: 12 }}>
              <p>
                <strong>Language:</strong> {analysis.language} &nbsp;
                <em>({analysis.source})</em>
              </p>
              <p>{analysis.summary}</p>
              <ul>
                {(analysis.recommendations || []).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ask_your_query;
