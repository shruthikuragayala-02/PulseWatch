import type * as React from "react";
import { cn } from "../../lib/utils";
import { getStatusConfig } from "../../lib/utils";

interface StatusBadgeProps {
  status: "UP" | "DOWN" | "UNKNOWN" | "PAUSED" | string;
  className?: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, className, size = "sm" }: StatusBadgeProps) {
  const config = getStatusConfig(status);
  const sizes: Record<string, string> = {
    sm: "text-xs px-2.5 py-1",
    md: "text-sm px-3 py-1.5",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border",
        "font-semibold uppercase tracking-tighter",
        config.bg,
        sizes[size],
        className
      )}
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      <span className={`h-2 w-2 rounded-full ${config.dot}`} aria-hidden="true" />
      {config.label}
    </span>
  );
}

interface BadgeProps {
  variant?: "default" | "secondary" | "success" | "warning" | "danger";
  className?: string;
  children?: React.ReactNode;
}

export function Badge({ variant = "default", className, children }: BadgeProps) {
  const variants: Record<string, string> = {
    default: "bg-pw-surface text-pw-text-muted border border-pw-border",
    success: "bg-pw-success-bg text-pw-success border border-pw-success-border",
    warning: "bg-pw-warning-bg text-pw-warning border border-pw-warning-border",
    danger: "bg-pw-danger-bg text-pw-danger border border-pw-danger-border",
    secondary: "bg-pw-card text-pw-text-muted border border-pw-border",
  };
  return (
    <span className={cn("pw-badge", variants[variant], className)}>{children}</span>
  );
}
