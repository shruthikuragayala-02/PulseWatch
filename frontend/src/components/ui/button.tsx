import * as React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  disabled,
  fullWidth = false,
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: Record<string, string> = {
    primary: "bg-pw-accent text-pw-text-inverse hover:bg-pw-accent-hover hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] shadow-[0_0_15px_rgba(34,211,238,0.15)]",
    outline: "border border-pw-border bg-pw-card text-pw-text hover:bg-pw-surface hover:border-pw-border-hover",
    ghost: "text-pw-text-muted hover:text-pw-text hover:bg-pw-surface",
    danger: "bg-pw-danger text-pw-text-inverse hover:bg-red-600 hover:shadow-[0_0_20px_rgba(248,113,113,0.3)]",
  };
  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
}
