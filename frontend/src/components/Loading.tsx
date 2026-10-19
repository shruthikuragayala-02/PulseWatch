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
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full ${sizes[size]} border-b-2 border-blue-600`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
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
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={{ width, height }}
    />
  );
}