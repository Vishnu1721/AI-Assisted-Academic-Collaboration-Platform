#!/usr/bin/env python3
"""
Apache Spark distributed analytics job for the AI-Assisted Academic Collaboration Platform.

What it does
------------
Reads the platform's questions, answers, and tags, then computes engagement
analytics in parallel using Spark DataFrames:
  - total questions / answers and overall answer rate
  - top tags by question volume
  - most active contributors (by answers authored)
  - daily question activity (time series)

Output is written to ../analytics_output.json, which the Express /api/analytics
endpoint serves to the frontend Analytics dashboard.

Two data sources are supported:
  1. MySQL via JDBC  (production-like; needs the MySQL JDBC connector jar)
  2. CSV files       (offline/demo; see sample_data/ and generate_sample_data.py)

Run (CSV mode, no DB needed):
    pip install -r requirements.txt
    python spark_analytics.py --source csv --input sample_data

Run (MySQL mode):
    python spark_analytics.py --source mysql \
        --jdbc-url "jdbc:mysql://localhost:3306/MINI_PROJECT" \
        --jdbc-user root --jdbc-password password
"""
import argparse
import json
import os

from pyspark.sql import SparkSession
from pyspark.sql import functions as F


def build_spark():
    return (
        SparkSession.builder
        .appName("AcademicCollab-Analytics")
        .master(os.environ.get("SPARK_MASTER", "local[*]"))  # local[*] = all cores; swap for a cluster URL
        .getOrCreate()
    )


def load_csv(spark, input_dir):
    q = spark.read.option("header", True).csv(os.path.join(input_dir, "questions.csv"))
    a = spark.read.option("header", True).csv(os.path.join(input_dir, "answers.csv"))
    return q, a


def load_mysql(spark, url, user, password):
    def tbl(name):
        return (
            spark.read.format("jdbc")
            .option("url", url)
            .option("dbtable", name)
            .option("user", user)
            .option("password", password)
            .option("driver", "com.mysql.cj.jdbc.Driver")
            .load()
        )
    return tbl("QUESTION"), tbl("ANSWER")


def compute(questions, answers):
    total_questions = questions.count()
    total_answers = answers.count()
    answer_rate = round(total_answers / total_questions, 3) if total_questions else 0.0

    top_tags = (
        questions
        .filter(F.col("TAGS").isNotNull() & (F.col("TAGS") != ""))
        .groupBy("TAGS")
        .agg(F.count("*").alias("count"))
        .orderBy(F.desc("count"))
        .limit(10)
        .collect()
    )

    top_contributors = (
        answers
        .filter(F.col("AUTHOR_EMAIL").isNotNull())
        .groupBy("AUTHOR_EMAIL")
        .agg(F.count("*").alias("answers"))
        .orderBy(F.desc("answers"))
        .limit(10)
        .collect()
    )

    daily = []
    if "CREATED_AT" in questions.columns:
        daily = (
            questions
            .withColumn("day", F.to_date("CREATED_AT"))
            .groupBy("day")
            .agg(F.count("*").alias("questions"))
            .orderBy("day")
            .collect()
        )

    return {
        "totals": {
            "totalQuestions": total_questions,
            "totalAnswers": total_answers,
            "answerRate": answer_rate,
        },
        "topTags": [{"tag": r["TAGS"], "count": r["count"]} for r in top_tags],
        "topContributors": [
            {"author": r["AUTHOR_EMAIL"], "answers": r["answers"]} for r in top_contributors
        ],
        "dailyActivity": [
            {"day": str(r["day"]), "questions": r["questions"]} for r in daily
        ],
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", choices=["csv", "mysql"], default="csv")
    parser.add_argument("--input", default="sample_data")
    parser.add_argument("--jdbc-url")
    parser.add_argument("--jdbc-user")
    parser.add_argument("--jdbc-password")
    parser.add_argument("--output", default=os.path.join("..", "analytics_output.json"))
    args = parser.parse_args()

    spark = build_spark()
    spark.sparkContext.setLogLevel("WARN")

    if args.source == "mysql":
        questions, answers = load_mysql(spark, args.jdbc_url, args.jdbc_user, args.jdbc_password)
    else:
        questions, answers = load_csv(spark, args.input)

    result = compute(questions, answers)

    with open(args.output, "w") as fh:
        json.dump(result, fh, indent=2)

    print("Analytics written to", os.path.abspath(args.output))
    print(json.dumps(result, indent=2))
    spark.stop()


if __name__ == "__main__":
    main()
