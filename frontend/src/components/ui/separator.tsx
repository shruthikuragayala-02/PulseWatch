import * as React from "react";

interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  className?: string;
}

export function Separator({ className, ...props }: SeparatorProps) {
  return (
    <hr
      className="border-t border-pw-border my-6"
      {...props}
    />
  );
}
