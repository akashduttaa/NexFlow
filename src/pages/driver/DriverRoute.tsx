import { useEffect, useState } from 'react';
import { Activity, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { FreightMap } from '@/components/FreightMap';
import { apiClient } from '@/services/api-client';
import { getCachedRoute } from '@/services/offline-cache';
import type { RoutePlan, Vehicle, Bay } from '@/types';

export default function DriverRoute() {
  const [route, setRoute] = useState<RoutePlan | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [bay, setBay] = useState<Bay | null>(null);
  const [cached, setCached] = useState<Awaited<ReturnType<typeof getCachedRoute>> | null>(null);

  useEffect(() => {
    apiClient.getVehicles().then(vs => {
      setVehicle(vs[0] ?? null);
      if (vs[0]?.assignedBayId) apiClient.getBay(vs[0].assignedBayId).then(setBay);
    });
    apiClient.getRoutes().then(rs => setRoute(rs.find(r => r.status === 'ACTIVE') ?? null));
    getCachedRoute().then(setCached);
  }, []);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-ink-900">Route</h1>

      {route ? (
        <>
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-600" />
                <span className="font-semibold text-ink-900">Route {route.routeId}</span>
              </div>
              <Badge variant="info">Version v{route.routeVersion}</Badge>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between"><span className="text-ink-500">Estimated Duration</span><span className="text-ink-800">{route.estimatedDurationMin} min</span></div>
              <div className="flex items-center justify-between"><span className="text-ink-500">Loading Window</span><span className="text-ink-800">{route.windowStart}–{route.windowEnd}</span></div>
              <div className="flex items-center justify-between"><span className="text-ink-500">Assigned Bay</span><span className="text-ink-800">{route.bayId}</span></div>
              <div className="flex items-center justify-between"><span className="text-ink-500">Status</span><Badge variant={route.status === 'ACTIVE' ? 'success' : 'error'}>{route.status}</Badge></div>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="section-title mb-3">Route Map</h2>
            <FreightMap vehicles={vehicle ? [vehicle] : []} bays={bay ? [bay] : []} routes={[route]} highlightedRouteId={route.id} height="300px" />
          </Card>

          {route.status === 'INVALIDATED' && (
            <div className="p-4 rounded-lg bg-error-50 border border-error-200 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-error-600" />
              <div>
                <p className="text-sm font-semibold text-error-700">Route Invalidated</p>
                <p className="text-xs text-error-600">Re-optimization required. A new route will be assigned.</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <Card className="p-8 text-center text-ink-400">No active route assigned.</Card>
      )}

      {/* Cached route info */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-warning-600" />
          <h3 className="text-sm font-semibold text-ink-700">Cached Route (Offline)</h3>
        </div>
        {cached ? (
          <div className="text-xs space-y-1">
            <div className="flex justify-between"><span className="text-ink-500">Route ID</span><span className="text-ink-800">{cached.routeId}</span></div>
            <div className="flex justify-between"><span className="text-ink-500">Version</span><span className="text-ink-800">v{cached.routeVersion}</span></div>
            <div className="flex justify-between"><span className="text-ink-500">Bay</span><span className="text-ink-800">{cached.bayId}</span></div>
            <div className="flex justify-between"><span className="text-ink-500">Window</span><span className="text-ink-800">{cached.windowStart}–{cached.windowEnd}</span></div>
            <div className="flex justify-between"><span className="text-ink-500">Cached At</span><span className="text-ink-800">{new Date(cached.cachedAt).toLocaleString('en-IN')}</span></div>
          </div>
        ) : <p className="text-xs text-ink-400">No cached route available.</p>}
      </Card>
    </div>
  );
}
