import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTheme, type Theme } from "../lib/theme";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Avatar } from "../components/ui/avatar";
import { ArrowLeft } from "lucide-react";

export function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-8">
        <Link to="/dashboard" className="p-2 text-pw-text-muted hover:text-pw-text rounded-md hover:bg-pw-surface transition">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-bold text-pw-text">Settings</h1>
      </div>

      <Card className="mb-6">
        <div className="p-6 border-b border-pw-border">
          <h2 className="text-lg font-semibold text-pw-text">Account</h2>
          <p className="text-sm text-pw-text-muted mt-1">Manage your PulseWatch account.</p>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar src={undefined} fallback={user?.fullName?.charAt(0) || "U"} size="lg" />
            <div>
              <p className="font-medium text-pw-text">{user?.fullName || "Unknown"}</p>
              <p className="text-sm text-pw-text-muted">{user?.email}</p>
              <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                user?.role === "ADMIN"
                  ? "bg-pw-accent-bg/20 text-pw-accent border-pw-accent/30"
                  : "bg-pw-surface text-pw-text-muted border-pw-border"
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
        <div className="p-6 border-b border-pw-border">
          <h2 className="text-lg font-semibold text-pw-text">Appearance</h2>
          <p className="text-sm text-pw-text-muted mt-1">Choose your preferred theme.</p>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-pw-text-muted w-24">Theme</span>
            <div className="flex gap-2">
              {["light", "dark", "system"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t as Theme)}
                  className={`px-4 py-2 rounded-md text-sm font-medium border transition ${
                    theme === t
                      ? "bg-pw-accent text-pw-text-inverse border-pw-accent"
                      : "bg-pw-card text-pw-text border-pw-border hover:bg-pw-surface"
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