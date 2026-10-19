import { useState, useEffect } from "react";
import type { DashboardSummary } from "../types";
import { apiClient } from "../api/client";
import { Card } from "../components/ui/card";
import { getStatusConfig } from "../lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .getDashboardSummary()
      .then((data) => {
        setSummary(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load dashboard");
        setLoading(false);
      });
  }, []);

  if (!summary) {
    if (loading) {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold text-pw-text mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-pw-card p-6 rounded-xl border border-pw-border animate-pulse">
                <div className="h-10 bg-pw-border rounded w-full mb-4" />
                <div className="h-8 bg-pw-border rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-pw-text mb-6">Dashboard</h1>
        <p className="text-pw-danger">{error}</p>
      </div>
    );
  }

  const uptimeConfig = getStatusConfig(summary.monitorsDown > 0 ? "DOWN" : "UP");

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-pw-text">Dashboard</h1>
          <p className="text-pw-text-muted mt-1">Overview of your monitoring endpoints</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-pw-text-muted">
          <span className={`flex items-center gap-1 ${uptimeConfig.bg} ${uptimeConfig.dot} rounded-full px-2 py-0.5`}>
            Uptime: {summary.uptimePercentage.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="p-6">
            <p className="text-sm font-medium text-pw-text-muted uppercase tracking-wider">Total Monitors</p>
            <p className="text-3xl font-bold text-pw-text mt-2">{summary.totalMonitors}</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <p className="text-sm font-medium text-pw-success uppercase tracking-wider">Up</p>
            <p className="text-3xl font-bold text-pw-text mt-2">{summary.monitorsUp}</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <p className="text-sm font-medium text-pw-danger uppercase tracking-wider">Down</p>
            <p className="text-3xl font-bold text-pw-text mt-2">{summary.monitorsDown}</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <p className="text-sm font-medium text-pw-warning uppercase tracking-wider">Open Incidents</p>
            <p className="text-3xl font-bold text-pw-text mt-2">{summary.openIncidents}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-pw-text mb-4">Response Time</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(30, 41, 59, 0.5)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="rgba(148, 163, 184, 0.5)" />
                  <YAxis tickFormatter={(v) => `${v} ms`} stroke="rgba(148, 163, 184, 0.5)" />
                  <Tooltip />
                  <Line type="monotone" dataKey="responseTime" stroke="#22d3ee" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-pw-text mb-4">Status Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(30, 41, 59, 0.5)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="rgba(148, 163, 184, 0.5)" />
                  <YAxis stroke="rgba(148, 163, 184, 0.5)" />
                  <Tooltip />
                  <Bar dataKey="up" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="down" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="unknown" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
