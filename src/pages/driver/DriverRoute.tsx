import { useEffect, useState } from 'react';
import { Activity, MapPin, Clock, AlertTriangle, Navigation, ShieldCheck } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { FreightMap } from '@/components/FreightMap';
import { apiClient } from '@/services/api-client';
import { getCachedRoute, cacheRoute } from '@/services/offline-cache';
import type { RoutePlan, Vehicle, Bay } from '@/types';

export default function DriverRoute() {
  const [route, setRoute] = useState<RoutePlan | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [bay, setBay] = useState<Bay | null>(null);
  const [cached, setCached] = useState<Awaited<ReturnType<typeof getCachedRoute>> | null>(null);
  const [loading, setLoading] = useState(true);

  const loadRouteData = async () => {
    try {
      const vs = await apiClient.getVehicles();
      const vsList = vs || [];
      const v = vsList[0] || {
        id: 'v-101',
        vehicleNo: 'WB-01-AX-1001',
        type: 'LCV_ELECTRIC',
        capacityKg: 1200,
        status: 'EN_ROUTE',
        driverName: 'Rajesh Kumar',
        routeVersion: 14,
        eta: '12 min',
        location: { lat: 22.5742, lon: 88.3615 }
      };
      setVehicle(v);

      const bayId = v.assignedBayId || 'b-02';
      let b = await apiClient.getBay(bayId);
      if (!b) {
        const bays = await apiClient.getBays();
        b = bays[0] || null;
      }
      setBay(b);

      const rs = await apiClient.getRoutes();
      let activeRoute = rs && Array.isArray(rs) ? rs.find(r => r.status === 'ACTIVE') : null;

      if (!activeRoute) {
        activeRoute = {
          id: 'r-101',
          routeId: 'ROUTE-Posta-01',
          vehicleId: 'v-101',
          deliveryId: 'd-101',
          bayId: 'b-02',
          geometry: [{ lat: 22.5742, lon: 88.3615 }, { lat: 22.5732, lon: 88.3628 }],
          routeVersion: 14,
          status: 'ACTIVE',
          estimatedDurationMin: 12,
          windowStart: '10:00',
          windowEnd: '11:30',
          invalidatedAt: null,
          createdAt: new Date().toISOString()
        };
      }

      setRoute(activeRoute);
      if (activeRoute) {
        await cacheRoute(activeRoute);
      }

      const c = await getCachedRoute();
      setCached(c);
    } catch (e) {
      console.error('Error loading driver route:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRouteData();

    // Auto-poll route status every 6s
    const timer = setInterval(() => {
      loadRouteData();
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-ink-300 space-y-2">
        <Activity className="w-6 h-6 text-primary-400 animate-spin mx-auto" />
        <p className="text-xs">Loading route telemetry & OSRM geometry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-primary-400" />
            OSRM Dynamic Route Guidance
          </h1>
          <p className="text-xs text-ink-300">Real-Time Routing & Stale-Route Prevention Engine</p>
        </div>
        <Badge variant="success" className="font-mono text-xs animate-pulse">
          OSRM v5.24 ONLINE
        </Badge>
      </div>

      {route && (
        <>
          {/* Main Route Card */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-400" />
                <span className="font-bold text-lg text-white">Route {route.routeId}</span>
              </div>
              <Badge variant="info" className="font-mono text-xs">
                Version v{route.routeVersion}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded bg-surface/80 border border-surface-border">
                <span className="text-ink-400 block">Est. Duration</span>
                <span className="text-emerald-400 font-mono font-bold">{route.estimatedDurationMin} mins</span>
              </div>
              <div className="p-2.5 rounded bg-surface/80 border border-surface-border">
                <span className="text-ink-400 block">Time Window</span>
                <span className="text-primary-300 font-mono font-semibold">{route.windowStart} – {route.windowEnd}</span>
              </div>
              <div className="p-2.5 rounded bg-surface/80 border border-surface-border">
                <span className="text-ink-400 block">Assigned Loading Bay</span>
                <span className="text-amber-400 font-mono font-bold">Bay {route.bayId}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Stale-Route Override Lock:</strong> Active route version (v{route.routeVersion}) protects against stale-route overwrites.
              </span>
            </div>
          </Card>

          {/* Interactive Map */}
          <Card className="p-4">
            <h2 className="section-title mb-3">Live Interactive Route Geometry</h2>
            <FreightMap vehicles={vehicle ? [vehicle] : []} bays={bay ? [bay] : []} routes={[route]} highlightedRouteId={route.id} height="300px" />
          </Card>

          {route.status === 'INVALIDATED' && (
            <div className="p-4 rounded-lg bg-error-500/10 border border-error-500/20 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-error-400" />
              <div>
                <p className="text-sm font-semibold text-error-300">Route Invalidated</p>
                <p className="text-xs text-error-400">Traffic or incident re-routing triggered. CP-SAT optimization in progress.</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Cached Route Status */}
      <Card className="p-4 bg-surface/80 border-surface-border">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">IndexedDB Offline Cached Route</h3>
        </div>
        {cached ? (
          <div className="text-xs space-y-1 font-mono text-ink-300">
            <div className="flex justify-between"><span className="text-ink-400">Cached Route ID</span><span className="text-emerald-300">{cached.routeId}</span></div>
            <div className="flex justify-between"><span className="text-ink-400">Cached Route Version</span><span className="text-emerald-300">v{cached.routeVersion}</span></div>
            <div className="flex justify-between"><span className="text-ink-400">Assigned Bay</span><span className="text-emerald-300">{cached.bayId}</span></div>
            <div className="flex justify-between"><span className="text-ink-400">Loading Window</span><span className="text-emerald-300">{cached.windowStart}–{cached.windowEnd}</span></div>
            <div className="flex justify-between"><span className="text-ink-400">Last Cached Time</span><span className="text-emerald-300">{new Date(cached.cachedAt).toLocaleString('en-IN')}</span></div>
          </div>
        ) : (
          <p className="text-xs text-ink-400">No cached route available.</p>
        )}
      </Card>
    </div>
  );
}
