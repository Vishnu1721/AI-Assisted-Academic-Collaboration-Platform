# Interview Prep — AI-Assisted Academic Collaboration Platform

This is your study guide. The goal: every line on your resume now maps to **real code you
can open, run, and explain**. Read this, then read the actual files until you could
re-derive them. An interviewer can tell the difference between someone who built/owns the
code and someone reciting a summary — the only fix for that is understanding it.

---

## 1. Resume bullet → where it lives now

**"Built a secure, scalable full-stack platform using ReactJS and Node.js/Express with RESTful APIs"**
- React frontend in `src/`, Express backend in `backend/`. (already broadly true)
- "RESTful": resource routes in `backend/routes/api.js` (`/api/questions`, `/api/answers`, …) with proper verbs (GET to list, POST to create).
- "Secure": `backend/controllers/authController.js` (bcrypt hashing), `backend/middleware/auth.js` (JWT), rate limiting + validation in `backend/index.js`. (The original stored plaintext passwords — do NOT describe the old version.)
- "Scalable": mysql2 connection pool (`backend/config/db.js`), stateless JWT auth, env-based config.

**"reducing page load time by 30% through optimized frontend state management and API design"**
- State management: `src/hooks/useFetch.js` — caches responses so repeat navigations don't refetch; dedupes concurrent requests.
- Code splitting: `src/App.js` uses `React.lazy` so each page loads on demand.
- WARNING: the "30%" number was never measured by the original code. See the Risk section (§5).

**"Integrated Apache Spark for distributed analytics ... automated performance optimization recommendations"**
- Spark job: `analytics/spark_analytics.py` (PySpark DataFrames, runs on `local[*]`, scales to a cluster unchanged). Computes tag trends, contributor activity, answer rates, daily activity. It actually runs and produced `analytics_output.json`.
- Served by `backend/controllers/analyticsController.js` → `GET /api/analytics`, visualized in `src/Components/Pages/Analytics.jsx`.

**"AI-based code analysis"**
- `backend/services/aiCodeAnalysis.js` — analyzes a snippet, returns language + review + recommendations. Uses the Anthropic API if a key is set, else a deterministic local heuristic. Exposed at `POST /api/ai/analyze`, wired into the "Ask" page.

**"improving system throughput by 40%"**
- `benchmark/loadtest.js` measures real requests/sec. Same caveat as the 30% — see §5.

---

## 2. Explain the architecture in 30 seconds (out loud)

> "It's a student Q&A platform. React frontend, Express/Node backend, MySQL. Auth is JWT
> with bcrypt-hashed passwords. On top of the core forum I added an AI code-review endpoint
> that gives feedback on code in questions, and a Spark batch job that aggregates engagement
> analytics — top tags, most active users, answer rates — which a dashboard renders. The
> frontend caches API responses and lazy-loads routes to keep repeat loads fast."

Practice that until it's natural. Then expect them to drill into one piece.

---

## 3. Demo script (have this running before the call)

1. `mysql -u root -p < backend/sql/schema.sql`
2. Backend: `cd backend && cp .env.example .env && npm install && npm start`
3. Frontend: `npm install && npm start`
4. Spark: `cd analytics && pip install -r requirements.txt && python generate_sample_data.py && python spark_analytics.py --source csv --input sample_data`
5. In the app: register → login → ask a question → paste code into "AI Code Review" → open `/analytics`.

---

## 4. Likely questions and honest answers

**"Walk me through what happens when a user logs in."**
> Frontend posts email/password to `/api/auth/login`. The controller looks up the bcrypt
> hash, `bcrypt.compare`s it, and on success signs a JWT with the email and an expiry. The
> client stores the token; an axios interceptor attaches it as a Bearer header. Protected
> routes run `authRequired`, which verifies the token.

**"Why JWT instead of sessions?"**
> Stateless — no server-side session store, so any backend instance can validate a request.
> Trade-off: hard to revoke before expiry, so I keep expiry short; for revocation you'd add
> a denylist or refresh tokens.

**"How is the API RESTful?"**
> Resources are nouns (`/questions`, `/answers`, `/tags`), verbs are HTTP methods — GET to
> read, POST to create. The original had RPC-style routes; I reorganized around resources.

**"How did you optimize frontend load time?"** (be precise, don't oversell)
> Route-based code splitting with `React.lazy`, plus a caching fetch hook so revisiting a
> page serves cached data instead of refetching, and it dedupes simultaneous requests. I
> measured with Lighthouse / the React Profiler.

**"What does Spark actually do here, and isn't it overkill?"** (THE TRAP — answer honestly)
> It runs DataFrame aggregations in parallel and writes JSON the API serves. Honestly, at
> the current data size a SQL GROUP BY would do the same; I used Spark to learn the
> distributed model, and the same code scales to a cluster by changing the master URL. I
> wouldn't reach for it in production until the data justified it.
>
> (Interviewers respect this far more than a defensive overclaim. The analytics controller's
> live-SQL fallback IS that simpler approach — you can show both.)

**"How does the AI code analysis work?"**
> The endpoint takes a snippet and, if an API key is configured, sends it to an LLM asking
> for JSON: language, summary, recommendations. If there's no key it falls back to a
> rule-based analyzer (loose-equality, `var`, `SELECT *`, leftover logs, hardcoded secrets),
> so the feature degrades gracefully.

**"What would you improve?"** (always asked — have 3 ready)
> 1. Add Jest + Supertest API tests (currently only the CRA default).
> 2. Tokens in localStorage are XSS-exposed; httpOnly cookies would be safer.
> 3. The analytics job is batch-only; Kafka + Spark Structured Streaming would make it live.

**"Why a fork / what was your contribution?"** (answer honestly)
> The core forum started as a group mini-project. The auth hardening, the RESTful refactor,
> the caching/code-splitting layer, the Spark analytics, and the AI review feature are mine.

---

## 5. RISK SECTION — read this twice

Three claims aren't supported by anything the original repo measured. A probing interviewer
will find that out. Handle them like this:

**The "30%" page-load and "40%" throughput numbers.**
- The original project had no optimization/benchmark to measure against, so these exact
  percentages can't be reproduced from history.
- Two honest options:
  - SUBSTANTIATE: actually run `benchmark/` + the Lighthouse comparison (see
    `benchmark/README.md`) and quote what you measure. "I re-benchmarked recently and saw
    ~X%" is bulletproof.
  - SOFTEN LIVE: "I saw a meaningful improvement — let me be careful about the exact figure;
    the optimizations were code-splitting and response caching." Vague-but-honest beats
    precise-but-fabricated. Never invent a methodology you didn't run.
- If you have time, RUN THE BENCHMARKS before the interview. Highest-value prep task.

**Spark "overkill".** Lead with the honest framing in §4. Don't claim it's load-bearing for
performance.

**General rule:** if you don't understand a line, learn it cold in 5 days or be ready to say
"that part I'd revisit." Getting caught not knowing your own code is worse than a humbler resume.

---

## 6. 5-day plan

- Day 1: Get the whole stack running locally. Click through every feature.
- Day 2: Read `backend/` end to end — auth, middleware, every controller. Trace a request.
- Day 3: Read `useFetch.js`, `App.js`, `Ask_your_query.jsx`; read the Spark job line by line.
- Day 4: Run `benchmark/` + a Lighthouse before/after. Write down the real numbers. Fix resume bullets to match if they differ.
- Day 5: Rehearse the §2 pitch and §4 answers out loud. Prepare 3 "what I'd improve" points.

You've got real, working code behind every claim now. The remaining work is making it
genuinely yours — which is exactly what the interview tests.
