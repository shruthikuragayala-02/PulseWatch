import { cn } from "../../lib/utils";

interface AvatarProps {
  src?: string;
  fallback?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ src, fallback = "?", className, size = "md" }: AvatarProps) {
  const sizes: Record<string, string> = {
    sm: "w-6 h-6 text-[0.7rem]",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };
  return (
    <div
      className={cn(
        "relative flex-shrink-0 rounded-full border border-pw-border overflow-hidden bg-pw-surface",
        sizes[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex items-center justify-center bg-pw-accent text-pw-text-inverse font-semibold">
          {fallback}
        </div>
      )}
    </div>
  );
}
