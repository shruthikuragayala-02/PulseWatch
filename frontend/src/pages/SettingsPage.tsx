import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTheme, type Theme } from "../lib/theme";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Avatar } from "../components/ui/avatar";

export function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-8">
        <Link to="/dashboard" className="p-2 text-[var(--pw-text-muted)] hover:text-[var(--pw-text)] rounded-md hover:bg-[var(--pw-surface)] transition">
          <ArrowLeftIcon size={18} />
        </Link>
        <h1 className="text-2xl font-bold text-[var(--pw-text)]">Settings</h1>
      </div>

      <Card className="mb-6">
        <div className="p-6 border-b border-[var(--pw-border)]">
          <h2 className="text-lg font-semibold text-[var(--pw-text)]">Account</h2>
          <p className="text-sm text-[var(--pw-text-muted)] mt-1">Manage your PulseWatch account.</p>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar src={undefined} fallback={user?.fullName?.charAt(0) || "U"} size="lg" />
            <div>
              <p className="font-medium text-[var(--pw-text)]">{user?.fullName || "Unknown"}</p>
              <p className="text-sm text-[var(--pw-text-muted)]">{user?.email}</p>
              <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                user?.role === "ADMIN"
                  ? "bg-[var(--pw-accent-bg)] text-[var(--pw-accent-text)] border-[var(--pw-accent)]"
                  : "bg-[var(--pw-surface)] text-[var(--pw-text-muted)] border-[var(--pw-border)]"
              }`}>
                {user?.role}
              </span>
            </div>
          </div>
          <Button variant="danger" onClick={logout} className="w-full">
            <LogOut size={16} className="mr-2" /> Sign out
          </Button>
        </div>
      </Card>

      <Card>
        <div className="p-6 border-b border-[var(--pw-border)]">
          <h2 className="text-lg font-semibold text-[var(--pw-text)]">Appearance</h2>
          <p className="text-sm text-[var(--pw-text-muted)] mt-1">Choose your preferred theme.</p>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--pw-text-muted)] w-24">Theme</span>
            <div className="flex gap-2">
              {["light", "dark", "system"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t as Theme)}
                  className={`px-4 py-2 rounded-md text-sm font-medium border transition ${
                    theme === t
                      ? "bg-[var(--pw-accent)] text-[var(--pw-text-inverse)] border-[var(--pw-accent)]"
                      : "bg-[var(--pw-card)] text-[var(--pw-text)] border-[var(--pw-border)] hover:bg-[var(--pw-surface)]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ArrowLeftIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}
