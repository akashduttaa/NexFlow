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
      const v = vs[0];
      setVehicle(v);
      if (v.assignedDeliveryId) apiClient.getDelivery(v.assignedDeliveryId).then(d => { setDelivery(d); if (d) cacheDelivery(d); });
      if (v.assignedBayId) apiClient.getBay(v.assignedBayId).then(b => { setBay(b); if (b) cacheBay(b); });
    });
    apiClient.getRoutes().then(rs => {
      const r = rs.find(rt => rt.status === 'ACTIVE');
      setRoute(r ?? null);
      if (r) cacheRoute(r);
    });
    getCachedRoute().then(setCachedRoute);
    getCachedDelivery().then(setCachedDelivery);
    getCachedBay().then(setCachedBay);
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
      {/* Connection Status */}
      <div className={`p-4 rounded-lg flex items-center justify-between ${online ? 'bg-success-50 border border-success-200' : 'bg-error-50 border border-error-200'}`}>
        <div className="flex items-center gap-3">
          {online ? <Wifi className="w-5 h-5 text-success-600" /> : <WifiOff className="w-5 h-5 text-error-600" />}
          <div>
            <p className="text-sm font-semibold text-ink-900">{online ? 'ONLINE' : 'OFFLINE MODE'}</p>
            <p className="text-xs text-ink-500">{online ? 'Connected to NexFlow dispatch' : 'Using cached route data'}</p>
          </div>
        </div>
        <button onClick={toggleConnection} className="btn-secondary text-xs">
          {online ? 'Go Offline' : 'Reconnect'}
        </button>
      </div>

      {/* Current Trip */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Truck className="w-5 h-5 text-primary-600" />
          <h2 className="section-title">Current Trip</h2>
        </div>

        {delivery ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-primary-50 border border-primary-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-primary-700">Delivery {delivery.id}</span>
                <StatusBadge status={delivery.status} />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><Package className="w-4 h-4 text-ink-400" /><span className="text-ink-600">Pickup:</span><span className="text-ink-800">{delivery.pickup}</span></div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-ink-400" /><span className="text-ink-600">Destination:</span><span className="text-ink-800">{delivery.destination}</span></div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-ink-400" /><span className="text-ink-600">ETA:</span><span className="text-ink-800">{delivery.eta ?? '—'}</span></div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-ink-400" /><span className="text-ink-600">Window:</span><span className="text-ink-800">{delivery.windowStart}–{delivery.windowEnd}</span></div>
              </div>
            </div>

            {bay && (
              <div className="p-4 rounded-lg bg-accent-50 border border-accent-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-accent-700">Loading Bay {bay.bayId}</span>
                  <StatusBadge status={bay.state} />
                </div>
                <p className="text-xs text-ink-600">{bay.name}</p>
                <p className="text-xs text-ink-500 mt-1">Service: {bay.serviceDurationMin} min</p>
              </div>
            )}

            {route && (
              <div className="p-4 rounded-lg bg-ink-50 border border-ink-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-ink-600" /><span className="text-sm font-medium text-ink-700">Route {route.routeId}</span></div>
                  <span className="text-xs text-ink-500">Version v{route.routeVersion}</span>
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
          <WifiOff className="w-5 h-5 text-warning-600" />
          <h2 className="section-title">Offline Cache</h2>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between p-2 rounded-lg bg-ink-50">
            <span className="text-ink-600">Cached Route</span>
            <span className="text-ink-800">{cachedRoute ? `v${cachedRoute.routeVersion} — ${cachedRoute.routeId}` : 'Not cached'}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-ink-50">
            <span className="text-ink-600">Cached Delivery</span>
            <span className="text-ink-800">{cachedDelivery ? cachedDelivery.id : 'Not cached'}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-ink-50">
            <span className="text-ink-600">Cached Bay</span>
            <span className="text-ink-800">{cachedBay ? cachedBay.bayId : 'Not cached'}</span>
          </div>
        </div>
        <Link to="/driver/offline" className="btn-secondary w-full mt-3 text-xs">View Offline Details</Link>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-3">
        <Link to="/driver/trip" className="card p-3 text-center hover:shadow-md transition-shadow">
          <Navigation className="w-5 h-5 text-primary-600 mx-auto mb-1" />
          <span className="text-xs font-medium text-ink-700">Trip</span>
        </Link>
        <Link to="/driver/route" className="card p-3 text-center hover:shadow-md transition-shadow">
          <Activity className="w-5 h-5 text-primary-600 mx-auto mb-1" />
          <span className="text-xs font-medium text-ink-700">Route</span>
        </Link>
        <Link to="/driver/sync" className="card p-3 text-center hover:shadow-md transition-shadow">
          <RefreshCw className="w-5 h-5 text-primary-600 mx-auto mb-1" />
          <span className="text-xs font-medium text-ink-700">Sync</span>
        </Link>
      </div>
    </div>
  );
}
