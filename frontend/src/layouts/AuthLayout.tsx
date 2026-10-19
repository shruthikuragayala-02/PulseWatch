import type * as React from "react";
import { useTheme } from "../lib/theme";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { toggleTheme, theme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--pw-surface)] px-4 py-8 text-[var(--pw-text)]">
      <div className="max-w-md w-full">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--pw-accent)] rounded-[var(--pw-radius-sm)] flex items-center justify-center text-white font-bold text-sm">
              P
            </div>
            <span className="font-bold text-xl tracking-tight text-[var(--pw-text)]">PulseWatch</span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 text-[var(--pw-text-muted)] hover:text-[var(--pw-text)] rounded-md hover:bg-[var(--pw-surface)] transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Moon /> : <Sun />}
          </button>
        </div>
        {children}
        <div className="mt-8 text-center text-sm text-[var(--pw-text-muted)]">
          © {new Date().getFullYear()} PulseWatch. Monitoring for teams.
        </div>
      </div>
    </div>
  );
}

function Moon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}
function Sun() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
