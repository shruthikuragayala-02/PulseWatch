import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { UpdateMonitorRequest } from "../types";
import { apiClient } from "../api/client";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/Loading";

export function EditMonitorPage() {
  const { id } = useParams<{ id: string }>();
  const monitorId = id ? parseInt(id) : 0;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [intervalMinutes, setIntervalMinutes] = useState("");
  const [timeoutMs, setTimeoutMs] = useState("");
  const [failureThreshold, setFailureThreshold] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!monitorId) return;
    apiClient
      .getMonitor(monitorId)
      .then((data: any) => {
        setName(data.name);
        setUrl(data.url);
        setIntervalMinutes(String(data.intervalMinutes ?? ""));
        setTimeoutMs(String(data.timeoutMs ?? ""));
        setFailureThreshold(String(data.failureThreshold ?? ""));
        setEnabled(Boolean(data.enabled));
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message || "Failed to load monitor");
        setLoading(false);
      });
  }, [monitorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const data: UpdateMonitorRequest = {
      name,
      url,
      intervalMinutes: parseInt(intervalMinutes) || undefined,
      timeoutMs: parseInt(timeoutMs) || undefined,
      failureThreshold: parseInt(failureThreshold) || undefined,
      enabled,
    };
    try {
      await apiClient.updateMonitor(monitorId, data);
      navigate(`/monitors/${monitorId}`);
    } catch (err: any) {
      setError(err.message || "Failed to update monitor");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-2 mb-6">
        <Link to={`/monitors/${monitorId}`} className="p-2 text-[var(--pw-text-muted)] hover:text-[var(--pw-text)] rounded-md hover:bg-[var(--pw-surface)] transition">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--pw-text)]">Edit Monitor</h1>
          <p className="text-sm text-[var(--pw-text-muted)]">Update monitoring settings</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Monitor Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input
                label="URL"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/health"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Input
                label="Check Interval (minutes)"
                type="number"
                value={intervalMinutes}
                onChange={(e) => setIntervalMinutes(e.target.value)}
                min="1"
              />
              <Input
                label="Timeout (ms)"
                type="number"
                value={timeoutMs}
                onChange={(e) => setTimeoutMs(e.target.value)}
                min="1000"
              />
              <Input
                label="Failure Threshold"
                type="number"
                value={failureThreshold}
                onChange={(e) => setFailureThreshold(e.target.value)}
                min="1"
              />
            </div>
            <div className="mt-6 flex items-center gap-3">
              <input id="enabled" type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="rounded border-[var(--pw-border)] text-[var(--pw-accent)] focus:ring-[var(--pw-accent)]" />
              <label htmlFor="enabled" className="text-sm text-[var(--pw-text)] font-medium">Monitor enabled</label>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => navigate(`/monitors/${monitorId}`)}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="w-auto">
            {saving ? <LoadingSpinner size="sm" /> : null}
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
