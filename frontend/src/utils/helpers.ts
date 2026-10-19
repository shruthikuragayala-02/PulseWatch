export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "Never";
  return new Date(dateString).toLocaleString();
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
  return `${ms} ms`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "UP": return "text-green-600 bg-green-100 border-green-200";
    case "DOWN": return "text-red-600 bg-red-100 border-red-200";
    case "UNKNOWN": return "text-yellow-600 bg-yellow-100 border-yellow-200";
    default: return "text-gray-600 bg-gray-100 border-gray-200";
  }
}

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "UP": return "bg-green-100 text-green-800 border border-green-200";
    case "DOWN": return "bg-red-100 text-red-800 border border-red-200";
    case "UNKNOWN": return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    default: return "bg-gray-100 text-gray-800 border border-gray-200";
  }
}

export function truncateUrl(url: string, maxLength: number = 50): string {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + "...";
}