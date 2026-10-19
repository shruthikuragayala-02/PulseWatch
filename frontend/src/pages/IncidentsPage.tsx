import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import type { IncidentResponse } from "../types";
import { apiClient } from "../api/client";
import { StatusBadge } from "../components/StatusBadge";
import { LoadingSpinner } from "../components/Loading";
import { ErrorMessage } from "../components/ErrorMessage";
import { formatRelativeTime, formatDuration } from "../lib/utils";
import { Card } from "../components/ui/card";

export function IncidentsPage() {
  const [incidents, setIncidents] = useState<IncidentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .getIncidents()
      .then((data) => {
        setIncidents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message || "Failed to load incidents");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-pw-text mb-6">Incidents</h1>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <Card>
        <div className="p-6 border-b border-pw-border">
          <h2 className="text-lg font-semibold text-pw-text">Open Incidents</h2>
          <p className="text-sm text-pw-text-muted mt-1">Incidents detected by health check failures</p>
        </div>
        <div className="overflow-x-auto p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-pw-border">
                <th className="px-4 py-3 text-left text-xs font-medium text-pw-text-muted uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-pw-text-muted uppercase">Monitor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-pw-text-muted uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-pw-text-muted uppercase">Started</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-pw-text-muted uppercase">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-pw-text-muted uppercase">Failure Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pw-border">
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-pw-text-muted">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle size={32} className="text-pw-text-light" />
                      <p>No open incidents</p>
                      <p className="text-xs text-pw-text-light">All systems are operating normally.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                incidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-pw-surface/50 transition">
                    <td className="px-4 py-4">
                      <div className="font-medium text-pw-text">{incident.title}</div>
                      <div className="text-sm text-pw-text-muted truncate max-w-xs">{incident.description}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-pw-text-muted">#{incident.monitorId}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={incident.status as any} size="sm" />
                    </td>
                    <td className="px-4 py-4 text-sm text-pw-text-muted">
                      {formatRelativeTime(incident.startedAt)}
                    </td>
                    <td className="px-4 py-4 text-sm text-pw-text-muted">
                      {formatDuration(incident.durationSeconds)}
                    </td>
                    <td className="px-4 py-4 text-sm text-pw-text-muted truncate max-w-xs">
                      {incident.failureReason || "-"}
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