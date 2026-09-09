import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { DriverLayout } from '@/layouts/DriverLayout';

// Public pages
import Landing from '@/pages/public/Landing';
import About from '@/pages/public/About';
import Solution from '@/pages/public/Solution';
import Technology from '@/pages/public/Technology';
import Business from '@/pages/public/Business';
import Documentation from '@/pages/public/Documentation';
import Login from '@/pages/public/Login';

// Admin pages
import CommandCenter from '@/pages/admin/CommandCenter';
import Fleet from '@/pages/admin/Fleet';
import VehicleDetail from '@/pages/admin/VehicleDetail';
import Deliveries from '@/pages/admin/Deliveries';
import DeliveryDetail from '@/pages/admin/DeliveryDetail';
import LoadingBays from '@/pages/admin/LoadingBays';
import BayDetail from '@/pages/admin/BayDetail';
import Incidents from '@/pages/admin/Incidents';
import Optimization from '@/pages/admin/Optimization';
import Predictions from '@/pages/admin/Predictions';
import Analytics from '@/pages/admin/Analytics';
import Experiments from '@/pages/admin/Experiments';
import ArchitecturePage from '@/pages/admin/ArchitecturePage';
import IcccIntegration from '@/pages/admin/IcccIntegration';
import UlipAdapter from '@/pages/admin/UlipAdapter';
import DataSources from '@/pages/admin/DataSources';
import SystemHealth from '@/pages/admin/SystemHealth';
import AuditLog from '@/pages/admin/AuditLog';
import Settings from '@/pages/admin/Settings';

import MqttTelemetry from '@/pages/admin/MqttTelemetry';

// Driver pages
import DriverHome from '@/pages/driver/DriverHome';
import DriverTrip from '@/pages/driver/DriverTrip';
import DriverRoute from '@/pages/driver/DriverRoute';
import DriverBay from '@/pages/driver/DriverBay';
import DriverOffline from '@/pages/driver/DriverOffline';
import DriverSync from '@/pages/driver/DriverSync';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/solution" element={<Solution />} />
        <Route path="/technology" element={<Technology />} />
        <Route path="/business" element={<Business />} />
        <Route path="/documentation" element={<Documentation />} />
      </Route>
      <Route path="/login" element={<Login />} />

      {/* Admin routes */}
      <Route path="/dashboard" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<CommandCenter />} />
        <Route path="fleet" element={<Fleet />} />
        <Route path="fleet/:id" element={<VehicleDetail />} />
        <Route path="deliveries" element={<Deliveries />} />
        <Route path="deliveries/:id" element={<DeliveryDetail />} />
        <Route path="bays" element={<LoadingBays />} />
        <Route path="bays/:id" element={<BayDetail />} />
        <Route path="incidents" element={<Incidents />} />
        <Route path="optimization" element={<Optimization />} />
        <Route path="predictions" element={<Predictions />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="experiments" element={<Experiments />} />
        <Route path="architecture" element={<ArchitecturePage />} />
        <Route path="iccc-integration" element={<IcccIntegration />} />
        <Route path="ulip-adapter" element={<UlipAdapter />} />
        <Route path="mqtt" element={<MqttTelemetry />} />
        <Route path="data-sources" element={<DataSources />} />
        <Route path="system-health" element={<SystemHealth />} />
        <Route path="audit" element={<AuditLog />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Driver routes */}
      <Route path="/driver" element={<DriverLayout />}>
        <Route index element={<DriverHome />} />
        <Route path="trip" element={<DriverTrip />} />
        <Route path="route" element={<DriverRoute />} />
        <Route path="bay" element={<DriverBay />} />
        <Route path="offline" element={<DriverOffline />} />
        <Route path="sync" element={<DriverSync />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import { ThemeProvider } from '@/contexts/ThemeContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
