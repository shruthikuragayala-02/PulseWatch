import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, UserRound, AlertCircle, CheckCircle2 } from "lucide-react";
import type { IncidentResponse } from "../types";
import { StatusBadge } from "../components/StatusBadge";
import { LoadingSpinner } from "../components/Loading";
import { formatRelativeTime, formatDuration } from "../lib/utils";
import { apiClient } from "../api/client";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const incidentId = id ? parseInt(id) : 0;
  const navigate = useNavigate();

  const [incident, setIncident] = useState<IncidentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acknowledging, setAcknowledging] = useState(false);

  useEffect(() => {
    if (!incidentId) return;
    apiClient
      .getIncident(incidentId)
      .then((data) => {
        setIncident(data);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message || "Failed to load incident");
        setLoading(false);
      });
  }, [incidentId]);

  const handleAcknowledge = async () => {
    const name = window.prompt("Enter your name to acknowledge this incident:");
    if (!name) return;
    setAcknowledging(true);
    try {
      await apiClient.acknowledgeIncident(incidentId, name);
      setIncident((prev) =>
        prev ? { ...prev, acknowledgedBy: name, acknowledgedAt: new Date().toISOString() } : prev
      );
    } catch (err: any) {
      setError(err.message || "Failed to acknowledge incident");
    } finally {
      setAcknowledging(false);
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
        <Button onClick={() => navigate("/incidents")} variant="primary">Back to Incidents</Button>
      </div>
    );
  }

  if (!incident) return null;

  const isOpen = incident.status === "OPEN";

  const acknowledgeButton = isOpen ? (
    <Button variant="outline" size="sm" disabled={acknowledging} onClick={handleAcknowledge}>
      {acknowledging ? "Acknowledging..." : "Acknowledge"}
    </Button>
  ) : null;

  const resolvedTimeline = incident.resolvedAt ? (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-pw-success-bg/20 text-pw-success flex items-center justify-center text-sm font-bold border border-pw-success-border">
        <CheckCircle2 size={16} />
      </div>
      <div>
        <p className="font-medium text-pw-text">Incident Resolved</p>
        <p className="text-sm text-pw-text-muted">{formatRelativeTime(incident.resolvedAt)}</p>
      </div>
    </div>
  ) : (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-pw-warning-bg/20 text-pw-warning flex items-center justify-center text-sm font-bold border border-pw-warning-border">
        <AlertCircle size={16} />
      </div>
      <div>
        <p className="font-medium text-pw-text">Still Open</p>
        <p className="text-sm text-pw-text-muted">Waiting for recovery</p>
      </div>
    </div>
  );

  const acknowledgedTimeline = incident.acknowledgedAt ? (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-pw-accent-bg/20 text-pw-accent-text flex items-center justify-center text-sm font-bold border border-pw-accent/30">
        <UserRound size={16} />
      </div>
      <div>
        <p className="font-medium text-pw-text">Acknowledged</p>
        <p className="text-sm text-pw-text-muted">
          {incident.acknowledgedBy || "Unknown"} • {formatRelativeTime(incident.acknowledgedAt)}
        </p>
      </div>
    </div>
  ) : null;

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/incidents")}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-pw-text">Incident Details</h1>
            <p className="text-pw-text-muted">Incident #{incident.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">{acknowledgeButton}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="p-6">
            <p className="text-sm font-medium text-pw-text-muted uppercase tracking-wider">Status</p>
            <div className="mt-2">
              <StatusBadge status={incident.status as any} size="md" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <p className="text-sm font-medium text-pw-text-muted uppercase tracking-wider">Started</p>
            <p className="text-2xl font-bold text-pw-text mt-2">{formatRelativeTime(incident.startedAt)}</p>
            <p className="text-xs text-pw-text-muted mt-1">{new Date(incident.startedAt).toLocaleString()}</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <p className="text-sm font-medium text-pw-text-muted uppercase tracking-wider">Duration</p>
            <p className="text-2xl font-bold text-pw-text mt-2">{formatDuration(incident.durationSeconds)}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-pw-text mb-4">Incident Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-pw-text-muted">Title</p>
                <p className="text-pw-text">{incident.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-pw-text-muted">Description</p>
                <p className="text-pw-text-muted whitespace-pre-line">{incident.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-pw-text-muted">Failure Reason</p>
                <p className="text-pw-text-muted">{incident.failureReason || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-pw-text-muted">Monitor ID</p>
                <p className="text-pw-text-muted">#{incident.monitorId}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-pw-text mb-4">Timeline</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-pw-accent-bg/20 text-pw-accent-text flex items-center justify-center text-sm font-bold border border-pw-accent/30">
                  1
                </div>
                <div>
                  <p className="font-medium text-pw-text">Incident Started</p>
                  <p className="text-sm text-pw-text-muted">{formatRelativeTime(incident.startedAt)}</p>
                </div>
              </div>
              {resolvedTimeline}
              {acknowledgedTimeline}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}