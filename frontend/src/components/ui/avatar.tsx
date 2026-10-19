import { cn } from "../../lib/utils";

interface AvatarProps {
  src?: string;
  fallback?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ src, fallback = "?", className, size = "md" }: AvatarProps) {
  const sizes: Record<string, string> = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };
  return (
    <div
      className={cn("relative flex-shrink-0 rounded-full border border-[var(--pw-border)] overflow-hidden bg-[var(--pw-surface)]", sizes[size], className)}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex items-center justify-center bg-[var(--pw-accent-bg)] text-[var(--pw-accent-text)] font-semibold">
          {fallback}
        </div>
      )}
    </div>
  );
}
