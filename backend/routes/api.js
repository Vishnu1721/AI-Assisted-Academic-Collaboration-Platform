// Central API router. Mounts all resource routes under /api.
const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const { listQuestions, createQuestion } = require("../controllers/questionController");
const {
  listAnswers, createAnswer,
  listTags, createTag,
  listArticles, createArticle,
} = require("../controllers/contentController");
const { getAnalytics } = require("../controllers/analyticsController");
const { analyze } = require("../controllers/aiController");
const { authRequired } = require("../middleware/auth");

// Auth
router.post("/auth/register", register);
router.post("/auth/login", login);

// Questions
router.get("/questions", listQuestions);
router.post("/questions", authRequired, createQuestion);

// Answers
router.get("/answers", listAnswers);
router.post("/answers", authRequired, createAnswer);

// Tags
router.get("/tags", listTags);
router.post("/tags", authRequired, createTag);

// Articles
router.get("/articles", listArticles);
router.post("/articles", authRequired, createArticle);

// Analytics (Spark-backed)
router.get("/analytics", getAnalytics);

// AI code analysis
router.post("/ai/analyze", analyze);

module.exports = router;
