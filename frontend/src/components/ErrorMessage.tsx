interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div className="pw-toast pw-toast-error flex items-start gap-3 mb-4" role="alert">
      <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[var(--pw-danger)] border border-[var(--pw-danger)]">
        <span className="text-xs font-bold">!</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--pw-danger)]">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1.5 text-[var(--pw-text-light)] hover:text-[var(--pw-danger)] rounded-md transition"
          aria-label="Dismiss"
        >
          <span className="sr-only">Dismiss</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      )}
    </div>
  );
}
