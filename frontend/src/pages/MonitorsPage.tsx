import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, ChevronRight } from "lucide-react";
import type { MonitorResponse } from "../types";
import { apiClient } from "../api/client";
import { StatusBadge } from "../components/StatusBadge";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { LoadingSpinner } from "../components/Loading";
import { ErrorMessage } from "../components/ErrorMessage";
import { formatDate, formatResponseTime, truncateUrl } from "../utils/helpers";

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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Monitors</h1>
        <div className="flex justify-center py-20"><LoadingSpinner /></div>
      </div>
    );
  }

  if (monitors.length === 0) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Monitors</h1>
            <p className="text-gray-600">Monitor your websites and APIs</p>
          </div>
          <button
            onClick={() => navigate("/monitors/add")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus size={18} /> Add Monitor
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-9.747a5 5 0 117.896 0l5.447 9.747z"/></svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No monitors yet</h3>
          <p className="text-gray-600 mb-6">Add your first monitor to start tracking uptime and response times.</p>
          <button
            onClick={() => navigate("/monitors/add")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Add Your First Monitor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monitors</h1>
          <p className="text-gray-600">Manage your monitoring endpoints</p>
        </div>
        <button
          onClick={() => navigate("/monitors/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus size={18} /> Add Monitor
        </button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Checked</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interval</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {monitors.map((monitor) => (
              <tr key={monitor.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{monitor.name}</div>
                  <div className="text-sm text-gray-500 truncate" title={monitor.url}>{truncateUrl(monitor.url)}</div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={monitor.status} />
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{monitor.lastResponseTimeMs ? formatResponseTime(monitor.lastResponseTimeMs) : "N/A"}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500">{formatDate(monitor.lastCheckedAt)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500">{monitor.intervalMinutes} min</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/monitors/${monitor.id}`)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition"
                      title="View details"
                    >
                      <ChevronRight size={16} />
                    </button>
                    {monitor.enabled ? (
                      <button
                        onClick={() => handlePause(monitor.id)}
                        className="p-2 text-yellow-600 hover:text-yellow-800 rounded-md hover:bg-yellow-50 transition"
                        title="Pause"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleResume(monitor.id)}
                        className="p-2 text-green-600 hover:text-green-800 rounded-md hover:bg-green-50 transition"
                        title="Resume"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(monitor.id, monitor.name)}
                      className="p-2 text-red-600 hover:text-red-800 rounded-md hover:bg-red-50 transition"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Monitor"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
      />
    </div>
  );
}