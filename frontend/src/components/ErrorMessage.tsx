interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-pw-border bg-pw-danger-bg/10 p-4 mb-4" role="alert">
      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-pw-danger border border-pw-danger">
        <span className="text-[0.7rem] font-bold">!</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-pw-danger">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1.5 text-pw-text-light hover:text-pw-danger rounded-md hover:bg-pw-surface transition"
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
