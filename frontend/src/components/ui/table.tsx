import * as React from "react";
import { cn } from "../../lib/utils";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  className?: string;
}

export function Table({ className, children, ...props }: TableProps) {
  return (
    <div className={cn("overflow-x-auto border border-pw-border rounded-lg bg-pw-card shadow-sm", className)}>
      <table className="w-full text-left border-collapse" {...props}>
        {children}
      </table>
    </div>
  );
}

interface THeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

export function THead({ className, children, ...props }: THeadProps) {
  return <thead className={cn(className)} {...props}>{children}</thead>;
}

interface TBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

export function TBody({ className, children, ...props }: TBodyProps) {
  return <tbody className={cn(className)} {...props}>{children}</tbody>;
}

interface TrProps extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string;
}

export function Tr({ className, children, ...props }: TrProps) {
  return <tr className={cn(className)} {...props}>{children}</tr>;
}

interface ThProps extends React.HTMLAttributes<HTMLTableCellElement> {
  className?: string;
}

export function Th({ className, children, ...props }: ThProps) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-tighter text-pw-text-muted border-b border-pw-border bg-pw-surface",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

interface TdProps extends React.HTMLAttributes<HTMLTableCellElement> {
  className?: string;
}

export function Td({ className, children, ...props }: TdProps) {
  return (
    <td
      className={cn(
        "px-4 py-4 text-sm text-pw-text border-b border-pw-border",
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}
