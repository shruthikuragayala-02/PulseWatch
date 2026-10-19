interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ className = "", size = "md" }: LoadingSpinnerProps) {
  const sizes: Record<string, string> = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className={cnWrapper("flex items-center justify-center", className)}>
      <div
        className={cnWrapper("animate-spin rounded-full border-b-2 border-[var(--pw-accent)] text-[var(--pw-accent)]", sizes[size])}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

function cnWrapper(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface PageLoaderProps {
  className?: string;
}

export function PageLoader({ className = "" }: PageLoaderProps) {
  return (
    <div className={cnWrapper("flex flex-col items-center justify-center gap-3 py-20", className)} role="status" aria-label="Loading">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-[var(--pw-text-muted)]">Loading...</p>
    </div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function LoadingSkeleton({ className = "", width = "100%", height = "1rem" }: LoadingSkeletonProps) {
  return (
    <div
      className={cnWrapper("animate-pulse bg-[var(--pw-border)] rounded-[var(--pw-radius-sm)]", className)}
      style={{ width, height }}
      role="status"
      aria-label="Loading"
    />
  );
}
