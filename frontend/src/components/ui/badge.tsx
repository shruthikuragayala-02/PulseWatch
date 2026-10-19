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
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
  };
  return (
    <span
      className={cn("pw-badge inline-flex items-center gap-1.5", config.bg, sizes[size], className)}
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
    default: "bg-[var(--pw-surface)] text-[var(--pw-text-muted)] border border-[var(--pw-border)]",
    success: "bg-[var(--pw-success-bg)] text-[var(--pw-success)] border border-[var(--pw-success-border)]",
    warning: "bg-[var(--pw-warning-bg)] text-[var(--pw-warning)] border border-[var(--pw-warning-border)]",
    danger: "bg-[var(--pw-danger-bg)] text-[var(--pw-danger)] border border-[var(--pw-danger-border)]",
    secondary: "bg-[var(--pw-card)] text-[var(--pw-text-muted)] border border-[var(--pw-border)]",
  };
  return (
    <span className={cn("pw-badge", variants[variant], className)}>{children}</span>
  );
}
