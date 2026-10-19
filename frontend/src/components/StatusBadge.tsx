interface StatusBadgeProps {
  status: "UP" | "DOWN" | "UNKNOWN";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config: Record<string, { label: string; bg: string; text: string; border: string }> = {
    UP: { label: "Up", bg: "bg-green-100", text: "text-green-800", border: "border border-green-200" },
    DOWN: { label: "Down", bg: "bg-red-100", text: "text-red-800", border: "border border-red-200" },
    UNKNOWN: { label: "Unknown", bg: "bg-yellow-100", text: "text-yellow-800", border: "border border-yellow-200" },
  };

  const c = config[status] || config.UNKNOWN;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text} ${c.border} ${className || ""}`}>
      {c.label}
    </span>
  );
}