import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import client from "../../api/client";
import "./Question.css";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");
  const navigate = useNavigate();

  // FIX: original had two useEffects with no dependency array (refetched on every render).
  // Empty array => fetch once on mount.
  useEffect(() => {
    client.get("/questions").then((res) => setQuestions(res.data)).catch((err) => console.log(err));
    client.get("/answers").then((res) => setAnswers(res.data)).catch((err) => console.log(err));
  }, []);

  const submitAnswer = (e) => {
    e.preventDefault();
    if (!answerText) {
      toast.error("Enter the Answer", { position: toast.POSITION.TOP_RIGHT });
      return;
    }
    client
      .post("/answers", { answer: answerText, title: questionTitle })
      .then(() => {
        toast.success("Answer submitted", { position: toast.POSITION.TOP_RIGHT });
        navigate("/question");
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || "Could not submit answer", { position: toast.POSITION.TOP_RIGHT });
      });
  };

  return (
    <div className="question-body">
      <div className="question-header">
        <center><h1 className="question-h1">QUESTIONS</h1></center>
        <a href="/ask_your_query" className="question-button"><button className="quesiton-button-width"><center>ASK QUESTION</center></button></a>
      </div>
      <div className="question-field">
        {questions.map((qb) => (
          <div className="question-tag" key={qb.ID || qb.QUESTION_TITLE}>
            <div className="flex-div">
              <span className="tags-q tags-title">TITLE:</span><span className="tags-q main-title">{qb.QUESTION_TITLE}</span><br />
              <span className="tags-q tags-title">BODY:</span><span className="tags-q main-title">{qb.BODY}</span><br />
              <span className="tags-q tags-title">TAGS:</span><span className="tags-q main-title">{qb.TAGS}</span><br />
              <span className="tags-q tags-title">ANSWER:</span>
              {answers
                .filter((a) => a.QUESTION_TITLE === qb.QUESTION_TITLE)
                .map((a) => (
                  <div className="tags-q main-title" key={a.ID}>{a.ANSWER}</div>
                ))}
            </div>
            <input
              className="question-input"
              type="text"
              placeholder="Answer"
              onChange={(e) => setAnswerText(e.target.value)}
              onClick={() => setQuestionTitle(qb.QUESTION_TITLE)}
            />
            <button className="button-input" onClick={submitAnswer}>
              <span className="content-button">submit</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questions;
