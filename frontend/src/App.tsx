import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { MainLayout } from "./layouts/MainLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { MonitorsPage } from "./pages/MonitorsPage";
import { AddMonitorPage } from "./pages/AddMonitorPage";
import { MonitorDetailPage } from "./pages/MonitorDetailPage";
import { IncidentsPage } from "./pages/IncidentsPage";
import { IncidentDetailPage } from "./pages/IncidentDetailPage";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, initializeUser, isAuthenticated } = useAuth();

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          element={
            <ProtectedRoute>
              <MainLayout user={user || { token: "", email: "", fullName: "", role: "USER" } as any}>
                <Outlet />
              </MainLayout>
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/monitors" element={<MonitorsPage />} />
          <Route path="/monitors/add" element={<AddMonitorPage />} />
          <Route path="/monitors/:id" element={<MonitorDetailPage />} />
          <Route path="/incidents" element={<IncidentsPage />} />
          <Route path="/incidents/:id" element={<IncidentDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;