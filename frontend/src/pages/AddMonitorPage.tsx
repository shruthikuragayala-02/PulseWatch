import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Globe } from "lucide-react";
import type { CreateMonitorRequest } from "../types";
import { apiClient } from "../api/client";
import { LoadingSpinner } from "../components/Loading";
import { ErrorMessage } from "../components/ErrorMessage";
import { Input } from "../components/ui/input";

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
          className="p-2 text-pw-text-muted hover:text-pw-text rounded-md hover:bg-pw-surface transition"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-pw-text">Add Monitor</h1>
          <p className="text-pw-text-muted">Set up monitoring for a new endpoint</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="max-w-2xl bg-pw-card p-8 rounded-xl border border-pw-border space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-pw-text-muted">Monitor Name</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Production API"
              required
            />
            <p className="text-xs text-pw-text-muted">A friendly name for this monitor</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-pw-text-muted">URL</label>
            <div className="relative">
              <Globe size={18} className="absolute left-3 top-3 text-pw-text-muted" />
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/health"
                required
              />
            </div>
            <p className="text-xs text-pw-text-muted">Must start with http:// or https://</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-pw-text-muted">Check Interval (minutes)</label>
            <Input
              type="number"
              value={intervalMinutes}
              onChange={(e) => setIntervalMinutes(e.target.value)}
              min="1"
            />
            <p className="text-xs text-pw-text-muted">How often to check</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-pw-text-muted">Timeout (ms)</label>
            <Input
              type="number"
              value={timeoutMs}
              onChange={(e) => setTimeoutMs(e.target.value)}
              min="1000"
            />
            <p className="text-xs text-pw-text-muted">Request timeout</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-pw-text-muted">Failure Threshold</label>
            <Input
              type="number"
              value={failureThreshold}
              onChange={(e) => setFailureThreshold(e.target.value)}
              min="1"
            />
            <p className="text-xs text-pw-text-muted">Consecutive failures before incident</p>
          </div>
        </div>

        <div className="bg-pw-warning-bg/10 border border-pw-warning-border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-pw-warning mt-0.5">!</span>
            <div>
              <p className="text-sm font-medium text-pw-warning">Security Note</p>
              <p className="text-sm text-pw-text-muted mt-1">
                Only monitor public endpoints you own or have permission to test. Localhost, private
                IPs, and cloud metadata endpoints are blocked by the backend.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="Button w-full"
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
