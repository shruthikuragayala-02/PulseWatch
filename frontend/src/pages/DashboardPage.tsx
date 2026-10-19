import { useState, useEffect } from "react";
import type { DashboardSummary } from "../types";
import { apiClient } from "../api/client";
import { getStatusColor } from "../utils/helpers";
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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-full mb-4" />
                <div className="h-8 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const statCards = [
    { label: "Total Monitors", value: summary.totalMonitors, color: "bg-blue-100 text-blue-800 border-blue-200" },
    { label: "Up", value: summary.monitorsUp, color: "bg-green-100 text-green-800 border-green-200" },
    { label: "Down", value: summary.monitorsDown, color: "bg-red-100 text-red-800 border-red-200" },
    { label: "Open Incidents", value: summary.openIncidents, color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your monitoring endpoints</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className={`flex items-center gap-1 ${getStatusColor("UP")}`}>
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Uptime: {summary.uptimePercentage.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm ${card.color}`}>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{card.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Response Time</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tickFormatter={(v) => `${v} ms`} stroke="#9ca3af" />
                <Tooltip />
                <Line type="monotone" dataKey="responseTime" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="up" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="down" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="unknown" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}