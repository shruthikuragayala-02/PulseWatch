import * as React from "react";
import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  error?: string;
  className?: string;
  leftIcon?: React.ReactNode;
}

export function Input({ label, helper, error, className, id, leftIcon, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-pw-text-muted uppercase tracking-tighter">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-pw-text-light">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            "w-full px-4 py-3 rounded-md border border-pw-border bg-pw-card text-pw-text placeholder-pw-text-light outline-none transition-colors duration-200",
            leftIcon ? "pl-10" : "pl-4",
            "focus:border-pw-accent focus:ring-1 focus:ring-pw-accent",
            error ? "border-pw-danger focus:border-pw-danger focus:ring-pw-danger" : "",
            className
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-pw-danger" role="alert">
          {error}
        </p>
      )}
      {helper && !error && <p className="text-sm text-pw-text-light">{helper}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helper?: string;
  error?: string;
  className?: string;
}

export function Textarea({ label, helper, error, className, id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1">
      {label && <label htmlFor={inputId} className="text-sm font-semibold text-pw-text-muted uppercase tracking-tighter">{label}</label>}
      <textarea
        id={inputId}
        className={cn(
          "w-full px-4 py-3 rounded-md border border-pw-border bg-pw-card text-pw-text placeholder-pw-text-light outline-none transition-colors duration-200",
          "min-h-[100px] resize-y",
          "focus:border-pw-accent focus:ring-1 focus:ring-pw-accent",
          error ? "border-pw-danger focus:border-pw-danger focus:ring-pw-danger" : "",
          className
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && <p id={`${inputId}-error`} className="text-sm text-pw-danger" role="alert">{error}</p>}
      {helper && !error && <p className="text-sm text-pw-text-light">{helper}</p>}
    </div>
  );
}
