// Backend throughput benchmark.
//
// Measures requests/sec and latency against a running backend so any
// "throughput" number you cite is reproducible rather than guessed.
//
// Usage:
//   1. Start the backend:  cd backend && npm start
//   2. node benchmark/loadtest.js
//
// To produce a *before/after* comparison (e.g. "+X% throughput from connection
// pooling / caching"), run this against the old single-connection version and
// the new pooled version and compare the rps numbers it prints.
const autocannon = require("autocannon");

const url = process.env.BENCH_URL || "http://localhost:3001/api/questions";
const connections = Number(process.env.BENCH_CONN) || 50;
const duration = Number(process.env.BENCH_DUR) || 10;

console.log(`Benchmarking ${url}  (${connections} connections, ${duration}s)`);

autocannon({ url, connections, duration }, (err, result) => {
  if (err) {
    console.error("Benchmark error:", err.message);
    process.exit(1);
  }
  console.log("Requests/sec (avg):", result.requests.average);
  console.log("Latency p50 (ms):  ", result.latency.p50);
  console.log("Latency p99 (ms):  ", result.latency.p99);
  console.log("Total 2xx:         ", result["2xx"]);
});
