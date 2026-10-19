import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, LayoutDashboard, Monitor as MonitorIcon, AlertCircle, LogOut } from "lucide-react";
import type { AuthResponse } from "../types";
import { apiClient } from "../api/client";

interface MainLayoutProps {
  children: React.ReactNode;
  user: AuthResponse | null;
}

export function MainLayout({ children, user }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Monitors", icon: <MonitorIcon size={20} />, path: "/monitors" },
    { name: "Incidents", icon: <AlertCircle size={20} />, path: "/incidents" },
  ];

  const handleLogout = () => {
    apiClient.clearToken();
    window.location.href = "/login";
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                P
              </div>
              <span className="text-xl font-bold text-gray-800 tracking-tight">PulseWatch</span>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive(item.path)
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.icon} <span className="ml-2">{item.name}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={18} className="mr-2" /> Sign out
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden md:block text-sm text-gray-600">{user?.email}</span>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                {user?.fullName?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:static md:translate-x-0`}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                P
              </div>
              <span className="text-lg font-bold text-gray-800">PulseWatch</span>
            </div>
          </div>
          <nav className="px-3 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.icon} <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={18} className="mr-2" /> Sign out
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}