import * as React from "react";
import { cn } from "../../lib/utils";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  className?: string;
}

export function Table({ className, children, ...props }: TableProps) {
  return (
    <div className="overflow-x-auto border border-[var(--pw-border)] rounded-[var(--pw-radius-sm)]">
      <table className={cn("pw-table", className)} {...props}>
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
  return <th className={cn(className)} {...props}>{children}</th>;
}

interface TdProps extends React.HTMLAttributes<HTMLTableCellElement> {
  className?: string;
}

export function Td({ className, children, ...props }: TdProps) {
  return <td className={cn(className)} {...props}>{children}</td>;
}
