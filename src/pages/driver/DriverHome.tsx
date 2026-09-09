import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Clock, MapPin, Activity, Wifi, WifiOff, RefreshCw, Navigation, Package, CheckCircle } from 'lucide-react';
import { Card, StatusBadge } from '@/components/ui';
import { apiClient } from '@/services/api-client';
import { socket } from '@/services/realtime';
import { cacheRoute, cacheDelivery, cacheBay, getCachedRoute, getCachedDelivery, getCachedBay } from '@/services/offline-cache';
import type { Vehicle, RoutePlan, Delivery, Bay } from '@/types';

export default function DriverHome() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [route, setRoute] = useState<RoutePlan | null>(null);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [bay, setBay] = useState<Bay | null>(null);
  const [online, setOnline] = useState(true);
  const [cachedRoute, setCachedRoute] = useState<Awaited<ReturnType<typeof getCachedRoute>> | null>(null);
  const [cachedDelivery, setCachedDelivery] = useState<Awaited<ReturnType<typeof getCachedDelivery>> | null>(null);
  const [cachedBay, setCachedBay] = useState<Awaited<ReturnType<typeof getCachedBay>> | null>(null);

  useEffect(() => {
    socket.connect('driver-drv-001');
    apiClient.getVehicles().then(vs => {
      if (vs && vs.length > 0) {
        const v = vs[0];
        setVehicle(v);
        if (v && v.assignedDeliveryId) apiClient.getDelivery(v.assignedDeliveryId).then(d => { setDelivery(d); if (d) cacheDelivery(d); });
        if (v && v.assignedBayId) apiClient.getBay(v.assignedBayId).then(b => { setBay(b); if (b) cacheBay(b); });
      }
    }).catch(console.error);

    apiClient.getRoutes().then(rs => {
      if (rs && Array.isArray(rs)) {
        const r = rs.find(rt => rt.status === 'ACTIVE');
        setRoute(r ?? null);
        if (r) cacheRoute(r);
      }
    }).catch(console.error);

    getCachedRoute().then(setCachedRoute).catch(() => {});
    getCachedDelivery().then(setCachedDelivery).catch(() => {});
    getCachedBay().then(setCachedBay).catch(() => {});
  }, []);

  const toggleConnection = () => {
    setOnline(!online);
    if (!online) {
      socket.emit('driver:online', { driverId: 'drv-001', vehicleId: vehicle?.id ?? '' });
    } else {
      socket.emit('driver:offline', { driverId: 'drv-001', vehicleId: vehicle?.id ?? '' });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Connection Status & Eco Compliance */}
      <div className="space-y-3">
        <div className={`p-4 rounded-lg flex items-center justify-between ${online ? 'bg-success-500/10 border border-success-500/20' : 'bg-error-500/10 border border-error-500/20'}`}>
          <div className="flex items-center gap-3">
            {online ? <Wifi className="w-5 h-5 text-success-400" /> : <WifiOff className="w-5 h-5 text-error-400" />}
            <div>
              <p className="text-sm font-semibold text-white">{online ? 'ONLINE' : 'OFFLINE MODE'}</p>
              <p className="text-xs text-ink-400">{online ? 'Connected to NexFlow dispatch' : 'Using cached route data'}</p>
            </div>
          </div>
          <button onClick={toggleConnection} className="btn-secondary text-xs">
            {online ? 'Go Offline' : 'Reconnect'}
          </button>
        </div>

        {/* Eco-Friendly & 5% Discount Callout */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-950/80 via-surface/80 to-emerald-950/80 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs">⚡ 5% OFF</span>
            <div>
              <p className="text-xs font-semibold text-emerald-300">Green Fleet Eco Incentive Active</p>
              <p className="text-[11px] text-ink-300">5% Discount Applied • Zero Tailpipe Emissions (PUC Exempt)</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
            Compliant
          </span>
        </div>
      </div>

      {/* Current Trip */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Truck className="w-5 h-5 text-primary-400" />
          <h2 className="section-title">Current Trip</h2>
        </div>

        {delivery ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-primary-500/10 border border-primary-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-primary-300">Delivery {delivery.id}</span>
                <StatusBadge status={delivery.status} />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><Package className="w-4 h-4 text-ink-400" /><span className="text-ink-300">Pickup:</span><span className="text-ink-100">{delivery.pickup}</span></div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-ink-400" /><span className="text-ink-300">Destination:</span><span className="text-ink-100">{delivery.destination}</span></div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-ink-400" /><span className="text-ink-300">ETA:</span><span className="text-ink-100">{delivery.eta ?? '—'}</span></div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-ink-400" /><span className="text-ink-300">Window:</span><span className="text-ink-100">{delivery.windowStart}–{delivery.windowEnd}</span></div>
              </div>
            </div>

            {bay && (
              <div className="p-4 rounded-lg bg-accent-500/10 border border-accent-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-accent-300">Loading Bay {bay.bayId}</span>
                  <StatusBadge status={bay.state} />
                </div>
                <p className="text-xs text-ink-300">{bay.name}</p>
                <p className="text-xs text-ink-400 mt-1">Service: {bay.serviceDurationMin} min</p>
              </div>
            )}

            {route && (
              <div className="p-4 rounded-lg bg-surface border border-surface-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-ink-300" /><span className="text-sm font-medium text-ink-200">Route {route.routeId}</span></div>
                  <span className="text-xs text-ink-400">Version v{route.routeVersion}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="btn-primary"><Navigation className="w-4 h-4" /> Start Trip</button>
              <button className="btn-secondary"><MapPin className="w-4 h-4" /> Arrived</button>
              <button className="btn-secondary"><Truck className="w-4 h-4" /> At Bay</button>
              <button className="btn-secondary"><CheckCircle className="w-4 h-4" /> Service Complete</button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-ink-400">No active trip assigned.</p>
        )}
      </Card>

      {/* Offline Cache Status */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <WifiOff className="w-5 h-5 text-warning-400" />
          <h2 className="section-title">Offline Cache</h2>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between p-2 rounded-lg bg-surface">
            <span className="text-ink-300">Cached Route</span>
            <span className="text-ink-100">{cachedRoute ? `v${cachedRoute.routeVersion} — ${cachedRoute.routeId}` : 'Not cached'}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-surface">
            <span className="text-ink-300">Cached Delivery</span>
            <span className="text-ink-100">{cachedDelivery ? cachedDelivery.id : 'Not cached'}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-surface">
            <span className="text-ink-300">Cached Bay</span>
            <span className="text-ink-100">{cachedBay ? cachedBay.bayId : 'Not cached'}</span>
          </div>
        </div>
        <Link to="/driver/offline" className="btn-secondary w-full mt-3 text-xs">View Offline Details</Link>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-3">
        <Link to="/driver/trip" className="card p-3 text-center hover:shadow-md transition-shadow">
          <Navigation className="w-5 h-5 text-primary-400 mx-auto mb-1" />
          <span className="text-xs font-medium text-ink-200">Trip</span>
        </Link>
        <Link to="/driver/route" className="card p-3 text-center hover:shadow-md transition-shadow">
          <Activity className="w-5 h-5 text-primary-400 mx-auto mb-1" />
          <span className="text-xs font-medium text-ink-200">Route</span>
        </Link>
        <Link to="/driver/sync" className="card p-3 text-center hover:shadow-md transition-shadow">
          <RefreshCw className="w-5 h-5 text-primary-400 mx-auto mb-1" />
          <span className="text-xs font-medium text-ink-200">Sync</span>
        </Link>
      </div>
    </div>
  );
}
