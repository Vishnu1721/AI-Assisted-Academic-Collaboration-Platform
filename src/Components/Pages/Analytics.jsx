// Analytics dashboard.
// Reads aggregated metrics from GET /api/analytics (produced by the PySpark job,
// served by the Express analytics controller) and renders them with charts.
// Uses the caching useFetch hook so revisiting this page is instant.
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from "recharts";
import Navbar_login from "../Navbar_Login/Navbar_login";
import Sidebar from "../Sidebar/Sidebar";
import useFetch from "../../hooks/useFetch";

const Analytics = () => {
  const { data, loading, error } = useFetch("/analytics");

  return (
    <div className="section-body">
      <Navbar_login />
      <Sidebar />
      <div className="question-body" style={{ padding: 24 }}>
        <h1>Platform Analytics</h1>

        {loading && <p>Loading analytics…</p>}
        {error && <p>Could not load analytics. Is the backend running?</p>}

        {data && (
          <>
            <p style={{ opacity: 0.7 }}>
              Source: {data.source} &nbsp;|&nbsp;
              Questions: {data.totals?.totalQuestions} &nbsp;|&nbsp;
              Answers: {data.totals?.totalAnswers} &nbsp;|&nbsp;
              Answer rate: {data.totals?.answerRate}
            </p>

            <h3>Top tags</h3>
            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={data.topTags || []}>
                  <XAxis dataKey="tag" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {Array.isArray(data.dailyActivity) && data.dailyActivity.length > 0 && (
              <>
                <h3>Daily question activity</h3>
                <div style={{ width: "100%", height: 280 }}>
                  <ResponsiveContainer>
                    <LineChart data={data.dailyActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" hide />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="questions" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
