import * as React from "react";
import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  error?: string;
  className?: string;
}

export function Input({ label, helper, error, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="pw-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn("pw-input", error ? "pw-input-error" : "", className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="pw-field-error" role="alert">
          {error}
        </p>
      )}
      {helper && !error && <p className="pw-helper">{helper}</p>}
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
      {label && <label htmlFor={inputId} className="pw-label">{label}</label>}
      <textarea
        id={inputId}
        className={cn("pw-input", "min-h-[100px] resize-y", error ? "pw-input-error" : "", className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && <p id={`${inputId}-error`} className="pw-field-error" role="alert">{error}</p>}
      {helper && !error && <p className="pw-helper">{helper}</p>}
    </div>
  );
}
