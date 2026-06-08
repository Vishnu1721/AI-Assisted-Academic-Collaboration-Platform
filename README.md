# AI-Assisted Academic Collaboration Platform

A full-stack academic Q&A / collaboration platform where students post questions,
answer each other, organize content with tags, and share articles. It adds two
capabilities on top of the core forum: **AI-based code analysis** for questions that
contain code, and **Apache Spark distributed analytics** over platform activity.

> Originally an "Online Query System" college mini-project; extended into the platform
> described here.

## Architecture

```
React (CRA) frontend  ──HTTP/REST──►  Express API  ──►  MySQL
        │                                  │
        │                                  ├──►  AI code analysis (Anthropic API / local heuristic)
        │                                  │
   Analytics dashboard  ◄── /api/analytics ┘ ◄── analytics_output.json ◄── PySpark batch job
```

- **Frontend**: React 18, React Router, axios, recharts. Route-based code splitting
  (`React.lazy`) and a caching data-fetch hook (`src/hooks/useFetch.js`) for fast
  repeat loads.
- **Backend**: Node.js + Express. JWT auth, bcrypt password hashing, rate limiting,
  RESTful resource routes, mysql2 connection pool.
- **Analytics**: PySpark job (`analytics/spark_analytics.py`) aggregating engagement
  metrics; output served by the API and visualized on the dashboard.
- **AI**: `backend/services/aiCodeAnalysis.js` reviews code snippets, with a local
  heuristic fallback when no API key is configured.

## Run it

### 1. Database
```bash
mysql -u root -p < backend/sql/schema.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env          # fill in DB creds + JWT secret
npm install
npm start                     # http://localhost:3001
```

### 3. Frontend
```bash
npm install
npm start                     # http://localhost:3000
```

### 4. Analytics (Spark)
```bash
cd analytics
pip install -r requirements.txt
python generate_sample_data.py            # or skip and use MySQL mode
python spark_analytics.py --source csv --input sample_data
# writes analytics_output.json, picked up by GET /api/analytics
```

## API (REST)

| Method | Path                | Auth | Description              |
|--------|---------------------|------|--------------------------|
| POST   | /api/auth/register  | —    | Create account           |
| POST   | /api/auth/login     | —    | Login, returns JWT       |
| GET    | /api/questions      | —    | List questions           |
| POST   | /api/questions      | JWT  | Create question          |
| GET    | /api/answers        | —    | List answers             |
| POST   | /api/answers        | JWT  | Create answer            |
| GET    | /api/tags           | —    | List tags                |
| POST   | /api/tags           | JWT  | Create tag               |
| GET    | /api/articles       | —    | List articles            |
| POST   | /api/articles       | JWT  | Create article           |
| GET    | /api/analytics      | —    | Spark-computed analytics |
| POST   | /api/ai/analyze     | —    | AI code review           |

## Security

Passwords are bcrypt-hashed; sessions use signed JWTs; inputs are validated and all
SQL uses parameterized queries; the API is rate-limited. Credentials are read from
environment variables, never hardcoded.
