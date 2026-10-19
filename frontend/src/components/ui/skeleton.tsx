import * as React from "react";
import { cn } from "../../lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className = "", width = "100%", height = "1rem", ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-pw-border", className)}
      style={{ width, height }}
      {...props}
    />
  );
}

interface SkeletonTextProps {
  className?: string;
  count?: number;
}

export function SkeletonText({ className = "", count = 3 }: SkeletonTextProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} height="0.875rem" width={i === count - 1 ? "60%" : "100%"} />
      ))}
    </div>
  );
}
