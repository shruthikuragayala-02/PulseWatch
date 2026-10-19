import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Menu, LayoutDashboard, Monitor as MonitorIcon, AlertCircle, LogOut, Moon, Sun, Settings as SettingsIcon } from "lucide-react";
import type { AuthResponse } from "../types";
import { apiClient } from "../api/client";
import { Button } from "../components/ui/button";
import { useTheme } from "../lib/theme";

interface MainLayoutProps {
  user: AuthResponse | null;
}

const navItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
  { name: "Monitors", icon: <MonitorIcon size={20} />, path: "/monitors" },
  { name: "Incidents", icon: <AlertCircle size={20} />, path: "/incidents" },
  { name: "Settings", icon: <SettingsIcon size={20} />, path: "/settings" },
];

export function MainLayout({ user }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    apiClient.clearToken();
    window.location.href = "/login";
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[var(--pw-bg)] text-[var(--pw-text)]">
      <nav className="sticky top-0 z-40 border-b border-[var(--pw-border)] bg-[var(--pw-card)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--pw-card)]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[var(--pw-accent)] rounded-[var(--pw-radius-sm)] flex items-center justify-center text-white font-bold text-sm">
                P
              </div>
              <span className="font-bold text-xl tracking-tight text-[var(--pw-text)]">PulseWatch</span>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cnNav(
                    "px-3 py-2 rounded-md text-sm font-medium transition-all",
                    isActive(item.path)
                      ? "bg-[var(--pw-accent-bg)] text-[var(--pw-accent-text)]"
                      : "text-[var(--pw-text-muted)] hover:text-[var(--pw-text)] hover:bg-[var(--pw-surface)]"
                  )}
                >
                  {item.icon} <span className="ml-2">{item.name}</span>
                </Link>
              ))}
              <div className="px-3">
                <Button variant="outline" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </Button>
              </div>
              <Button variant="danger" size="sm" onClick={handleLogout}>
                <LogOut size={16} className="mr-2" /> Sign out
              </Button>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-[var(--pw-text-muted)] hover:text-[var(--pw-text)] rounded-md hover:bg-[var(--pw-surface)] transition"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-[var(--pw-text-muted)]">{user?.email}</span>
              <AvatarFallback className="w-8 h-8" fallback={user?.fullName?.charAt(0) || "U"} />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[var(--pw-card)] border-r border-[var(--pw-border)] transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:translate-x-0 md:border-r-0`}
      >
        <div className="px-6 py-4 border-b border-[var(--pw-border)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--pw-accent)] rounded-[var(--pw-radius-sm)] flex items-center justify-center text-white font-bold text-sm">
              P
            </div>
            <span className="font-bold text-lg tracking-tight text-[var(--pw-text)]">PulseWatch</span>
          </div>
        </div>
        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={cnNav(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all",
                isActive(item.path)
                  ? "bg-[var(--pw-accent-bg)] text-[var(--pw-accent-text)]"
                  : "text-[var(--pw-text-muted)] hover:text-[var(--pw-text)] hover:bg-[var(--pw-surface)]"
              )}
            >
              {item.icon} <span>{item.name}</span>
            </Link>
          ))}
          <div className="px-3 py-2">
            <Button variant="outline" size="sm" fullWidth onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </Button>
          </div>
          <div className="px-3 py-2">
            <Button variant="danger" size="sm" fullWidth onClick={handleLogout}>Sign out</Button>
          </div>
        </nav>
      </div>

      <main className="flex-1 p-6 lg:p-8"><Outlet /></main>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function cnNav(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

function AvatarFallback({ className, fallback }: { className?: string; fallback: string }) {
  return (
    <div className={cnNav("flex-shrink-0 rounded-full border border-[var(--pw-border)] overflow-hidden bg-[var(--pw-accent-bg)] text-[var(--pw-accent-text)] font-semibold flex items-center justify-center", className)}>
      {fallback}
    </div>
  );
}
