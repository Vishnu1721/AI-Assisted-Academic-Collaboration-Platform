# Spark Analytics

Distributed analytics over platform activity using Apache Spark (PySpark).

## What it computes
- Total questions / answers and overall answer rate
- Top tags by question volume
- Most active contributors (by answers authored)
- Daily question activity (time series)

## Why Spark here
Spark processes the data with DataFrame operations that run in parallel across all
local cores (`local[*]`) and scale to a cluster unchanged by swapping the master URL.
For a class-sized dataset it's modest; the value is the parallel, scalable aggregation
pattern that works identically on millions of rows.

> Interview-honest note: for the current data volume this is more than the workload
> strictly needs. Be ready to say that — "I used Spark to learn the distributed
> DataFrame model; it scales without code changes, though at current volume a plain
> SQL aggregate would also work." That framing is far stronger than overclaiming.

## Run

Offline (CSV, no DB):
```bash
pip install -r requirements.txt
python generate_sample_data.py
python spark_analytics.py --source csv --input sample_data
```

Against MySQL (needs the MySQL JDBC connector jar on the Spark classpath):
```bash
python spark_analytics.py --source mysql \
  --jdbc-url "jdbc:mysql://localhost:3306/MINI_PROJECT" \
  --jdbc-user root --jdbc-password password
```

Output: `../analytics_output.json`, served by `GET /api/analytics`.
