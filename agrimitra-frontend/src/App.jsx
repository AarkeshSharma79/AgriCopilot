import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { FarmProvider } from "./context/FarmContext";
import { SidebarProvider } from "./context/SidebarContext";
import { SettingsProvider } from "./context/SettingsContext";

import Dashboard from "./pages/Dashboard";
import CropMonitoring from "./pages/CropMonitoring";
import Weather from "./pages/Weather";
import PrecisionFarming from "./pages/PrecisionFarming";
import SoilAnalysis from "./pages/SoilAnalysis";
import OrganicFarming from "./pages/OrganicFarming";
import AIChat from "./pages/AIChat";
import FarmerChat from "./pages/FarmerChat";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-sand flex items-center justify-center text-forest-950 font-display font-medium">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-sand">
        <Sidebar />
        {children}
      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FarmProvider>
        <SidebarProvider>
          <SettingsProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/"
                  element={
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  }
                />
                <Route
                  path="/farms"
                  element={
                    <AppLayout>
                      <Home />
                    </AppLayout>
                  }
                />
                <Route
                  path="/crop-monitoring"
                  element={
                    <AppLayout>
                      <CropMonitoring />
                    </AppLayout>
                  }
                />
                <Route
                  path="/weather"
                  element={
                    <AppLayout>
                      <Weather />
                    </AppLayout>
                  }
                />
                <Route
                  path="/soil-health"
                  element={
                    <AppLayout>
                      <SoilAnalysis />
                    </AppLayout>
                  }
                />
                <Route
                  path="/organic-farming"
                  element={
                    <AppLayout>
                      <OrganicFarming />
                    </AppLayout>
                  }
                />
                <Route
                  path="/precision-farming"
                  element={
                    <AppLayout>
                      <PrecisionFarming />
                    </AppLayout>
                  }
                />
                <Route
                  path="/ai-assistant"
                  element={
                    <AppLayout>
                      <AIChat />
                    </AppLayout>
                  }
                />
                <Route
                  path="/farmer-chat"
                  element={
                    <AppLayout>
                      <FarmerChat />
                    </AppLayout>
                  }
                />
                <Route
                  path="/alerts"
                  element={
                    <AppLayout>
                      <Alerts />
                    </AppLayout>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <AppLayout>
                      <Reports />
                    </AppLayout>
                  }
                />
                <Route
                  path="/market-prices"
                  element={
                    <AppLayout>
                      <Reports />
                    </AppLayout>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <AppLayout>
                      <Profile />
                    </AppLayout>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <AppLayout>
                      <Settings />
                    </AppLayout>
                  }
                />
                <Route
                  path="/help"
                  element={
                    <AppLayout>
                      <Help />
                    </AppLayout>
                  }
                />
              </Routes>
            </BrowserRouter>
          </SettingsProvider>
        </SidebarProvider>
      </FarmProvider>
    </AuthProvider>
  );
}
