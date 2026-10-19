import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Globe } from "lucide-react";
import type { CreateMonitorRequest } from "../types";
import { apiClient } from "../api/client";
import { LoadingSpinner } from "../components/Loading";
import { ErrorMessage } from "../components/ErrorMessage";

export function AddMonitorPage() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [intervalMinutes, setIntervalMinutes] = useState("5");
  const [timeoutMs, setTimeoutMs] = useState("5000");
  const [failureThreshold, setFailureThreshold] = useState("2");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const data: CreateMonitorRequest = {
      name,
      url,
      intervalMinutes: parseInt(intervalMinutes) || 5,
      timeoutMs: parseInt(timeoutMs) || 5000,
      failureThreshold: parseInt(failureThreshold) || 2,
    };

    try {
      await apiClient.createMonitor(data);
      navigate("/monitors");
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Failed to create monitor";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate("/monitors")}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Monitor</h1>
          <p className="text-gray-600">Set up monitoring for a new endpoint</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Monitor Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Production API"
              className="w-full pl-4 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
            <p className="text-xs text-gray-500">A friendly name for this monitor</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <div className="relative">
              <Globe size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/health"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>
            <p className="text-xs text-gray-500">Must start with http:// or https://</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Check Interval (minutes)</label>
            <input
              type="number"
              value={intervalMinutes}
              onChange={(e) => setIntervalMinutes(e.target.value)}
              min="1"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <p className="text-xs text-gray-500">How often to check</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Timeout (ms)</label>
            <input
              type="number"
              value={timeoutMs}
              onChange={(e) => setTimeoutMs(e.target.value)}
              min="1000"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <p className="text-xs text-gray-500">Request timeout</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Failure Threshold</label>
            <input
              type="number"
              value={failureThreshold}
              onChange={(e) => setFailureThreshold(e.target.value)}
              min="1"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <p className="text-xs text-gray-500">Consecutive failures before incident</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-blue-600 mt-0.5">!</span>
            <div>
              <p className="text-sm font-medium text-blue-800">Security Note</p>
              <p className="text-sm text-blue-700 mt-1">
                Only monitor public endpoints you own or have permission to test. Localhost, private
                IPs, and cloud metadata endpoints are blocked by the backend.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              Create Monitor
            </>
          )}
        </button>
      </form>
    </div>
  );
}