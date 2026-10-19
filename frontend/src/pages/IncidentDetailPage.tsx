import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, UserRound, AlertCircle, CheckCircle2 } from "lucide-react";
import type { IncidentResponse } from "../types";
import { StatusBadge } from "../components/StatusBadge";
import { LoadingSpinner } from "../components/Loading";
import { formatRelativeTime, formatDuration } from "../utils/helpers";
import { apiClient } from "../api/client";

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
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate("/incidents")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Incidents
        </button>
      </div>
    );
  }

  if (!incident) return null;

  const isOpen = incident.status === "OPEN";

  const acknowledgeButton = isOpen ? (
    <button
      onClick={handleAcknowledge}
      disabled={acknowledging}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
        acknowledging ? "opacity-70 cursor-not-allowed" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
      }`}
    >
      {acknowledging ? "Acknowledging..." : "Acknowledge"}
    </button>
  ) : null;

  const resolvedTimeline = incident.resolvedAt ? (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">
        <CheckCircle2 size={16} />
      </div>
      <div>
        <p className="font-medium text-gray-900">Incident Resolved</p>
        <p className="text-sm text-gray-500">{formatRelativeTime(incident.resolvedAt)}</p>
      </div>
    </div>
  ) : (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-sm font-bold">
        <AlertCircle size={16} />
      </div>
      <div>
        <p className="font-medium text-gray-900">Still Open</p>
        <p className="text-sm text-gray-500">Waiting for recovery</p>
      </div>
    </div>
  );

  const acknowledgedTimeline = incident.acknowledgedAt ? (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">
        <UserRound size={16} />
      </div>
      <div>
        <p className="font-medium text-gray-900">Acknowledged</p>
        <p className="text-sm text-gray-500">
          {incident.acknowledgedBy || "Unknown"} • {formatRelativeTime(incident.acknowledgedAt)}
        </p>
      </div>
    </div>
  ) : null;

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/incidents")}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Incident Details</h1>
            <p className="text-gray-600">Incident #{incident.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">{acknowledgeButton}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Status</p>
          <div className="mt-2">
            <StatusBadge status={incident.status as any} className="text-sm" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Started</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formatRelativeTime(incident.startedAt)}</p>
          <p className="text-xs text-gray-500 mt-1">{new Date(incident.startedAt).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Duration</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formatDuration(incident.durationSeconds)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Incident Details</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Title</p>
              <p className="text-gray-900">{incident.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Description</p>
              <p className="text-gray-700 whitespace-pre-line">{incident.description}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Failure Reason</p>
              <p className="text-gray-700">{incident.failureReason || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Monitor ID</p>
              <p className="text-gray-700">#{incident.monitorId}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900">Incident Started</p>
                <p className="text-sm text-gray-500">{formatRelativeTime(incident.startedAt)}</p>
              </div>
            </div>
            {resolvedTimeline}
            {acknowledgedTimeline}
          </div>
        </div>
      </div>
    </div>
  );
}