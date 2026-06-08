#!/usr/bin/env python3
"""Generate sample CSV data so spark_analytics.py can run without a live database."""
import csv
import os
import random
from datetime import datetime, timedelta

OUT = "sample_data"
os.makedirs(OUT, exist_ok=True)

TAGS = ["python", "java", "javascript", "sql", "algorithms", "react", "spark", "ml"]
USERS = [f"student{i}@ssn.edu.in" for i in range(1, 16)]

random.seed(42)
start = datetime(2024, 1, 1)

with open(os.path.join(OUT, "questions.csv"), "w", newline="") as fh:
    w = csv.writer(fh)
    w.writerow(["ID", "QUESTION_TITLE", "BODY", "TAGS", "AUTHOR_EMAIL", "CREATED_AT"])
    for i in range(1, 401):
        day = start + timedelta(days=random.randint(0, 120))
        w.writerow([
            i,
            f"How do I solve problem {i}?",
            "Sample body text for the question.",
            random.choice(TAGS),
            random.choice(USERS),
            day.strftime("%Y-%m-%d %H:%M:%S"),
        ])

with open(os.path.join(OUT, "answers.csv"), "w", newline="") as fh:
    w = csv.writer(fh)
    w.writerow(["ID", "ANSWER", "QUESTION_TITLE", "AUTHOR_EMAIL", "CREATED_AT"])
    aid = 1
    for qid in range(1, 401):
        for _ in range(random.randint(0, 3)):
            day = start + timedelta(days=random.randint(0, 120))
            w.writerow([
                aid,
                "Sample answer text.",
                f"How do I solve problem {qid}?",
                random.choice(USERS),
                day.strftime("%Y-%m-%d %H:%M:%S"),
            ])
            aid += 1

print("Sample data written to", OUT)
