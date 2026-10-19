import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Toast } from "../../types";
import { cn } from "../../lib/utils";

const ToastContext = createContext<{
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
} | null>(null);

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = `toast-${++toastId}`;
    const newToast: Toast = { ...toast, id, duration: toast.duration ?? 5000 };
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    toasts.forEach((toast) => {
      if (toast.duration && toast.duration > 0) {
        const timer = setTimeout(() => removeToast(toast.id), toast.duration);
        timeouts.push(timer);
      }
    });
    return () => timeouts.forEach((t) => clearTimeout(t));
  }, [toasts, removeToast]);

  const value = { toasts, addToast, removeToast };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

export function Toast({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const variants: Record<string, string> = {
    success: "border-l-3 border-pw-success bg-pw-success-bg/10",
    error: "border-l-3 border-pw-danger bg-pw-danger-bg/10",
    info: "border-l-3 border-pw-accent bg-pw-accent-bg/10",
  };
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-pw-border bg-pw-card shadow-lg p-4 text-pw-text",
        "animate-[fade-in_slide_0.3s_ease-out_forwards]",
        variants[toast.variant]
      )}
      role="alert"
    >
      <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border">
        {toast.variant === "success" ? (
          <svg className="text-pw-success border-pw-success" fill="none" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" d="M5 13l4 4L19 7"></path>
          </svg>
        ) : toast.variant === "error" ? (
          <svg className="text-pw-danger border-pw-danger" fill="none" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        ) : (
          <svg className="text-pw-accent border-pw-accent" fill="none" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-pw-text">{toast.title}</h4>
        {toast.description && <p className="text-sm text-pw-text-muted mt-1">{toast.description}</p>}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 p-1.5 text-pw-text-light hover:text-pw-text rounded-md hover:bg-pw-surface transition"
        aria-label="Dismiss"
      >
        <span className="sr-only">Dismiss</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  );
}

export function ToastList() {
  const { toasts, removeToast } = useToast();
  return (
    <div className="fixed top-24 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto w-full max-w-xs w-[400px]">
          <Toast toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
}
