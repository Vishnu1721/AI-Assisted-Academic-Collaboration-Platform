# Benchmarking — how to get *real* numbers

Your resume cites two quantitative claims. This folder lets you reproduce them honestly
instead of guessing. **Run these yourself and use the numbers you actually get.**

## 1. Backend throughput ("system throughput")

`loadtest.js` hits a running endpoint and reports requests/sec and latency.

```bash
cd backend && npm install && npm start      # terminal 1
node benchmark/loadtest.js                   # terminal 2
```

To talk about an *improvement* percentage truthfully, measure two configurations and
compare. Honest comparisons you can actually run here:

- **Connection pooling vs single connection**: the original `index.js` used one
  `mysql.createConnection`; the new code uses a pool of 10. Point the benchmark at each
  and report the delta.
- **Cached vs uncached endpoint**: compare a cold endpoint vs the cached `/analytics`.

Record the two `Requests/sec` numbers and compute the percentage difference. That is a
number you can defend, because you ran it.

## 2. Frontend page-load time ("page load time")

Use Lighthouse (built into Chrome DevTools) or the React Profiler.

```bash
npm install && npm run build
npx serve -s build        # serve the production build
# Open Chrome DevTools > Lighthouse > Analyze page load
```

To show an improvement from code-splitting + the `useFetch` cache:
- Measure first-load and repeat-navigation timings **with** lazy routes + cache (current code).
- Temporarily revert `App.js` to eager imports and remove the cache, rebuild, measure again.
- Compare "Largest Contentful Paint" / "Total Blocking Time" and repeat-visit timing.

## Honesty note

If your measured numbers differ from the resume (they probably will — the original
project had no optimization to measure against), say the measured number in the
interview. "I re-benchmarked it recently and saw roughly X%" is strong. A number you
can't reproduce on request is a liability.
