export type UserRole = "USER" | "ADMIN";

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface MonitorResponse {
  id: number;
  name: string;
  url: string;
  intervalMinutes: number;
  timeoutMs: number;
  failureThreshold: number;
  enabled: boolean;
  status: "UP" | "DOWN" | "UNKNOWN" | "PAUSED";
  lastCheckedAt: string | null;
  lastStatusCode: number | null;
  lastResponseTimeMs: number | null;
  lastFailureReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMonitorRequest {
  name: string;
  url: string;
  intervalMinutes?: number;
  timeoutMs?: number;
  failureThreshold?: number;
}

export interface UpdateMonitorRequest {
  name?: string;
  url?: string;
  intervalMinutes?: number;
  timeoutMs?: number;
  failureThreshold?: number;
  enabled?: boolean;
}

export interface HealthCheckResponse {
  id: number;
  monitorId: number;
  checkedAt: string;
  statusCode: number | null;
  responseTimeMs: number;
  result: "UP" | "DOWN" | "UNKNOWN";
  failureReason: string | null;
  errorDetails: string | null;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface RecentFailedCheck {
  monitorId: number;
  monitorName: string | null;
  monitorUrl: string | null;
  checkedAt: string;
  failureReason: string | null;
}

export interface IncidentResponse {
  id: number;
  monitorId: number;
  title: string;
  description: string;
  status: "OPEN" | "RESOLVED" | "ACKNOWLEDGED";
  startedAt: string;
  resolvedAt: string | null;
  durationSeconds: number | null;
  failureReason: string | null;
  acknowledgedBy: string | null;
  acknowledgedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AcknowledgeRequest {
  acknowledgedBy: string;
}

export interface DashboardSummary {
  totalMonitors: number;
  monitorsUp: number;
  monitorsDown: number;
  monitorsUnknown: number;
  openIncidents: number;
  resolvedIncidents: number;
  uptimePercentage: number;
}

export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: "success" | "error" | "info";
  duration?: number;
}
