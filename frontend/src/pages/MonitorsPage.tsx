import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import type { MonitorResponse } from "../types";
import { apiClient } from "../api/client";
import { StatusBadge } from "../components/StatusBadge";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { LoadingSpinner } from "../components/Loading";
import { ErrorMessage } from "../components/ErrorMessage";
import { formatDate, formatResponseTime, truncateUrl } from "../lib/utils";
import { Button } from "../components/ui/button";

export function MonitorsPage() {
  const [monitors, setMonitors] = useState<MonitorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadMonitors();
  }, []);

  const loadMonitors = async () => {
    try {
      const data = await apiClient.getMonitors();
      setMonitors(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load monitors");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number, name: string) => {
    setDeleteConfirm({ id, name });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await apiClient.deleteMonitor(deleteConfirm.id);
      setMonitors(monitors.filter((m) => m.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete monitor");
    }
  };

  const handlePause = async (id: number) => {
    try {
      await apiClient.pauseMonitor(id);
      setMonitors(monitors.map((m) => (m.id === id ? { ...m, enabled: false } : m)));
    } catch (err: any) {
      setError(err.message || "Failed to pause monitor");
    }
  };

  const handleResume = async (id: number) => {
    try {
      await apiClient.resumeMonitor(id);
      setMonitors(monitors.map((m) => (m.id === id ? { ...m, enabled: true } : m)));
    } catch (err: any) {
      setError(err.message || "Failed to resume monitor");
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-pw-text mb-6">Monitors</h1>
        <div className="flex justify-center py-20"><LoadingSpinner /></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-pw-text">Monitors</h1>
          <p className="text-pw-text-muted">Manage your monitoring endpoints</p>
        </div>
        <Button onClick={() => navigate("/monitors/add")} variant="primary">
          <Plus size={18} className="mr-2" /> Add Monitor
        </Button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {monitors.length === 0 ? (
        <div className="bg-pw-card rounded-xl border border-pw-border p-8 text-center">
          <div className="w-16 h-16 bg-pw-surface rounded-full flex items-center justify-center mx-auto mb-4 text-pw-text-muted">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-9.747a5 5 0 117.896 0l5.447 9.747z"/></svg>
          </div>
          <h3 className="text-lg font-medium text-pw-text mb-2">No monitors yet</h3>
          <p className="text-pw-text-muted mb-6">Add your first monitor to start tracking uptime and response times.</p>
          <Button onClick={() => navigate("/monitors/add")} variant="primary">Add Your First Monitor</Button>
        </div>
      ) : (
        <div className="bg-pw-card rounded-xl border border-pw-border overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-pw-border bg-pw-surface/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-pw-text-muted uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-pw-text-muted uppercase">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-pw-text-muted uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-pw-text-muted uppercase">Response Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-pw-text-muted uppercase">Last Checked</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-pw-text-muted uppercase">Interval</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-pw-text-muted uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pw-border">
              {monitors.map((monitor) => (
                <tr key={monitor.id} className="hover:bg-pw-surface transition">
                  <td className="px-6 py-4">
                    <div className="font-medium text-pw-text">{monitor.name}</div>
                    <div className="text-sm text-pw-text-muted truncate" title={monitor.url}>{truncateUrl(monitor.url)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={monitor.status} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-pw-text">{monitor.lastResponseTimeMs ? formatResponseTime(monitor.lastResponseTimeMs) : "N/A"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-pw-text-muted">{formatDate(monitor.lastCheckedAt)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-pw-text-muted">{monitor.intervalMinutes} min</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/monitors/${monitor.id}`)}
                        className="p-2 text-pw-text-muted hover:text-pw-text rounded-md hover:bg-pw-surface transition"
                        title="View details"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6L15 15m0 0l-4 4m-4-4L5 15"/></svg>
                      </button>
                      {monitor.enabled ? (
                        <button
                          onClick={() => handlePause(monitor.id)}
                          className="p-2 text-pw-warning hover:text-pw-warning rounded-md hover:bg-pw-warning-bg/10 transition"
                          title="Pause"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleResume(monitor.id)}
                          className="p-2 text-pw-success hover:text-pw-success rounded-md hover:bg-pw-success-bg/10 transition"
                          title="Resume"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(monitor.id, monitor.name)}
                        className="p-2 text-pw-danger hover:text-pw-danger rounded-md hover:bg-pw-danger-bg/10 transition"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Monitor"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </div>
  );
}
