import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, XCircle } from "lucide-react";
import type { MonitorResponse, HealthCheckResponse } from "../types";
import { apiClient } from "../api/client";
import { StatusBadge } from "../components/StatusBadge";
import { LoadingSpinner } from "../components/Loading";
import { formatDate, formatRelativeTime, formatResponseTime } from "../lib/utils";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

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
        <h1 className="text-2xl font-bold text-pw-text mb-4">Error</h1>
        <p className="text-pw-danger mb-4">{error}</p>
        <Button onClick={() => navigate("/monitors")} variant="primary">Back to Monitors</Button>
      </div>
    );
  }

  if (!monitor) return null;

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/monitors")}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-pw-text">{monitor.name}</h1>
            <p className="text-pw-text-muted truncate max-w-xs" title={monitor.url}>{monitor.url}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={monitor.status} className="mb-0" />
          <Button
            variant={monitor.enabled ? "outline" : "primary"}
            size="sm"
            onClick={monitor.enabled ? handlePause : handleResume}
          >
            {monitor.enabled ? "Pause" : "Resume"}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            <XCircle size={18} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="p-6">
            <p className="text-sm font-medium text-pw-text-muted uppercase tracking-wider">Status</p>
            <div className="mt-2">
              <StatusBadge status={monitor.status} size="md" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <p className="text-sm font-medium text-pw-text-muted uppercase tracking-wider">Last Response Time</p>
            <p className="text-2xl font-bold text-pw-text mt-2">{formatResponseTime(monitor.lastResponseTimeMs)}</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <p className="text-sm font-medium text-pw-text-muted uppercase tracking-wider">Last Checked</p>
            <p className="text-2xl font-bold text-pw-text mt-2">{formatRelativeTime(monitor.lastCheckedAt)}</p>
            <p className="text-xs text-pw-text-muted mt-1">{formatDate(monitor.lastCheckedAt)}</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6 border-b border-pw-border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-pw-text">Health Check History</h2>
          <Button variant="ghost" size="sm" onClick={loadChecks}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Refresh
          </Button>
        </div>
        <div className="overflow-x-auto p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-pw-border">
                <th className="px-4 py-3 text-left text-xs font-medium text-pw-text-muted uppercase">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-pw-text-muted uppercase">Result</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-pw-text-muted uppercase">Status Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-pw-text-muted uppercase">Response Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-pw-text-muted uppercase">Failure Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pw-border">
              {checks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-pw-text-muted">
                    No health check data yet. Checks run automatically on schedule.
                  </td>
                </tr>
              ) : (
                checks.map((check) => (
                  <tr key={check.id} className="hover:bg-pw-surface/50 transition">
                    <td className="px-4 py-4 text-sm text-pw-text-muted">
                      {formatRelativeTime(check.checkedAt)}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={check.result} size="sm" />
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {check.statusCode ? (
                        <span className={`font-medium ${check.statusCode >= 200 && check.statusCode < 400 ? "text-pw-success" : "text-pw-danger"}`}>
                          {check.statusCode}
                        </span>
                      ) : (
                        <span className="text-pw-text-light">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-pw-text-muted">
                      {formatResponseTime(check.responseTimeMs)}
                    </td>
                    <td className="px-4 py-4 text-sm text-pw-text-muted">
                      {check.failureReason || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}