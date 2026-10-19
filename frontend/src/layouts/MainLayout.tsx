import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Menu, LayoutDashboard, Monitor as MonitorIcon, AlertCircle, LogOut, Moon, Sun, Settings as SettingsIcon } from "lucide-react";
import type { AuthResponse } from "../types";
import { apiClient } from "../api/client";
import { Button } from "../components/ui/button";
import { useTheme } from "../lib/theme";
import { Avatar } from "../components/ui/avatar";

interface MainLayoutProps {
  user: AuthResponse | null;
}

const navItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
  { name: "Monitors", icon: <MonitorIcon size={18} />, path: "/monitors" },
  { name: "Incidents", icon: <AlertCircle size={18} />, path: "/incidents" },
  { name: "Settings", icon: <SettingsIcon size={18} />, path: "/settings" },
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
    <div className="min-h-screen bg-pw-bg text-pw-text">
      <nav className="sticky top-0 z-40 border-b border-pw-border bg-pw-card/90 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-pw-accent to-cyan-600 rounded-lg flex items-center justify-center text-pw-text-inverse font-bold text-sm shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                P
              </div>
              <span className="font-bold text-xl tracking-tight text-pw-text">PulseWatch</span>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const linkClass = isActive(item.path)
                  ? "bg-pw-accent-bg text-pw-accent-text border border-pw-accent/30"
                  : "text-pw-text-muted hover:text-pw-text hover:bg-pw-surface";
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${linkClass}`}
                  >
                    {item.icon} <span className="ml-2">{item.name}</span>
                  </Link>
                );
              })}
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
                className="p-2 text-pw-text-muted hover:text-pw-text rounded-lg hover:bg-pw-surface transition-colors"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-pw-text-muted">{user?.email}</span>
              <Avatar fallback={user?.fullName?.charAt(0) || "U"} size="sm" />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-pw-card border-r border-pw-border transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:translate-x-0 md:border-r-0`}
      >
        <div className="px-6 py-4 border-b border-pw-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-pw-accent to-cyan-600 rounded-lg flex items-center justify-center text-pw-text-inverse font-bold text-sm shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              P
            </div>
            <span className="font-bold text-lg tracking-tight text-pw-text">PulseWatch</span>
          </div>
        </div>
        <nav className="px-3 py-4 space-y-1">
{navItems.map((item) => {
              const linkClass = isActive(item.path)
                ? "bg-pw-accent-bg text-pw-accent-text border border-pw-accent/30"
                : "text-pw-text-muted hover:text-pw-text hover:bg-pw-surface";
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${linkClass}`}
                >
                  {item.icon} <span>{item.name}</span>
                </Link>
              );
            })}
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
          className="fixed inset-0 z-40 bg-black/40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
