import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, XCircle } from "lucide-react";
import type { MonitorResponse, HealthCheckResponse } from "../types";
import { apiClient } from "../api/client";
import { StatusBadge } from "../components/StatusBadge";
import { LoadingSpinner } from "../components/Loading";
import { formatDate, formatRelativeTime, formatResponseTime } from "../utils/helpers";

export function MonitorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const monitorId = id ? parseInt(id) : 0;
  const navigate = useNavigate();

  const [monitor, setMonitor] = useState<MonitorResponse | null>(null);
  const [checks, setChecks] = useState<HealthCheckResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!monitorId) return;
    Promise.all([loadMonitor(), loadChecks()]).finally(() => setLoading(false));
  }, [monitorId]);

  const loadMonitor = async () => {
    try {
      const data = await apiClient.getMonitor(monitorId);
      setMonitor(data);
    } catch (err: any) {
      setError(err.message || "Failed to load monitor");
    }
  };

  const loadChecks = async () => {
    try {
      const data = await apiClient.getHealthChecks(monitorId, 0, 50);
      setChecks(Array.isArray(data.content) ? data.content : []);
    } catch {
      // Non-fatal
    }
  };

  const handlePause = async () => {
    if (!monitor) return;
    try {
      await apiClient.pauseMonitor(monitorId);
      setMonitor({ ...monitor, enabled: false });
    } catch (err: any) {
      setError(err.message || "Failed to pause monitor");
    }
  };

  const handleResume = async () => {
    if (!monitor) return;
    try {
      await apiClient.resumeMonitor(monitorId);
      setMonitor({ ...monitor, enabled: true });
    } catch (err: any) {
      setError(err.message || "Failed to resume monitor");
    }
  };

  const handleDelete = async () => {
    if (!monitor || !window.confirm(`Delete "${monitor.name}"?`)) return;
    try {
      await apiClient.deleteMonitor(monitorId);
      navigate("/monitors");
    } catch (err: any) {
      setError(err.message || "Failed to delete monitor");
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => navigate("/monitors")} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Back to Monitors
        </button>
      </div>
    );
  }

  if (!monitor) return null;

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/monitors")}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{monitor.name}</h1>
            <p className="text-gray-600 truncate max-w-xs" title={monitor.url}>{monitor.url}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={monitor.status} className="mb-0" />
          <button
            onClick={monitor.enabled ? handlePause : handleResume}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
              monitor.enabled
                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {monitor.enabled ? "Pause" : "Resume"}
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:text-red-800 rounded-md hover:bg-red-50 transition"
            title="Delete"
          >
            <XCircle size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Status</p>
          <div className="mt-2">
            <StatusBadge status={monitor.status} className="text-sm" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Last Response Time</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formatResponseTime(monitor.lastResponseTimeMs)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Last Checked</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formatRelativeTime(monitor.lastCheckedAt)}</p>
          <p className="text-xs text-gray-500 mt-1">{formatDate(monitor.lastCheckedAt)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Health Check History</h2>
          <button
            onClick={() => loadChecks()}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Failure Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {checks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No health check data yet. Checks run automatically on schedule.
                  </td>
                </tr>
              ) : (
                checks.map((check) => (
                  <tr key={check.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatRelativeTime(check.checkedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={check.result} className="text-xs" />
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {check.statusCode ? (
                        <span className={`font-medium ${check.statusCode >= 200 && check.statusCode < 400 ? "text-green-600" : "text-red-600"}`}>
                          {check.statusCode}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatResponseTime(check.responseTimeMs)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {check.failureReason || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}