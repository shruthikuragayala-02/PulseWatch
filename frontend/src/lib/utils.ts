export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "Never";
  return new Date(dateString).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

export function formatDuration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined) return "N/A";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function formatResponseTime(ms: number | null | undefined): string {
  if (ms === null || ms === undefined) return "N/A";
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${ms}ms`;
}

export function getStatusConfig(status: string | null | undefined) {
  const config: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
    UP: { label: "Up", bg: "bg-pw-success-bg/20", text: "text-pw-success", dot: "bg-pw-success", border: "border-pw-success-border" },
    DOWN: { label: "Down", bg: "bg-pw-danger-bg/20", text: "text-pw-danger", dot: "bg-pw-danger", border: "border-pw-danger-border" },
    UNKNOWN: { label: "Unknown", bg: "bg-pw-warning-bg/20", text: "text-pw-warning", dot: "bg-pw-warning", border: "border-pw-warning-border" },
    PAUSED: { label: "Paused", bg: "bg-pw-surface", text: "text-pw-text-light", dot: "bg-pw-text-light", border: "border-pw-border" },
  };
  return config[status || "UNKNOWN"] || config.UNKNOWN;
}

export function truncateUrl(url: string, maxLength: number = 60): string {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + "...";
}

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
