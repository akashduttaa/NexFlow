import { useEffect, useState } from 'react';
import { WifiOff, Wifi, RefreshCw, Activity, MapPin, Clock, Database } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { getCachedRoute, getCachedDelivery, getCachedBay, getPendingGpsEvents, getSyncMeta, clearAllCache, queueGpsEvent } from '@/services/offline-cache';
import { PILOT_CENTER } from '@/data/fixtures';

export default function DriverOffline() {
  const [cachedRoute, setCachedRoute] = useState<Awaited<ReturnType<typeof getCachedRoute>> | null>(null);
  const [cachedDelivery, setCachedDelivery] = useState<Awaited<ReturnType<typeof getCachedDelivery>> | null>(null);
  const [cachedBay, setCachedBay] = useState<Awaited<ReturnType<typeof getCachedBay>> | null>(null);
  const [pendingGps, setPendingGps] = useState<Awaited<ReturnType<typeof getPendingGpsEvents>> | null>(null);
  const [syncMeta, setSyncMeta] = useState<Awaited<ReturnType<typeof getSyncMeta>> | null>(null);
  const [online, setOnline] = useState(true);

  const refresh = async () => {
    setCachedRoute(await getCachedRoute());
    setCachedDelivery(await getCachedDelivery());
    setCachedBay(await getCachedBay());
    setPendingGps(await getPendingGpsEvents());
    setSyncMeta(await getSyncMeta());
  };

  useEffect(() => { refresh(); }, []);

  const toggleOnline = async () => {
    setOnline(!online);
    if (!online) {
      // Reconnecting — sync will happen on sync page
    } else {
      // Going offline — queue a GPS event
      await queueGpsEvent({
        vehicleId: 'veh-001',
        location: { lat: PILOT_CENTER[0], lon: PILOT_CENTER[1] },
        speedKph: 0,
        heading: 0,
        timestamp: new Date().toISOString(),
      });
      refresh();
    }
  };

  const handleClearCache = async () => {
    await clearAllCache();
    refresh();
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-ink-900">Offline Mode</h1>

      {/* Connection toggle */}
      <div className={`p-5 rounded-lg ${online ? 'bg-success-50 border border-success-200' : 'bg-error-50 border border-error-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {online ? <Wifi className="w-6 h-6 text-success-600" /> : <WifiOff className="w-6 h-6 text-error-600" />}
            <div>
              <p className="text-sm font-bold text-ink-900">{online ? 'ONLINE' : 'OFFLINE MODE'}</p>
              <p className="text-xs text-ink-500">{online ? 'Connected to dispatch' : 'Operating on cached data'}</p>
            </div>
          </div>
          <button onClick={toggleOnline} className="btn-secondary text-xs">{online ? 'Simulate Offline' : 'Reconnect'}</button>
        </div>
      </div>

      {!online && (
        <div className="p-4 rounded-lg bg-warning-50 border border-warning-300 flex items-start gap-2">
          <WifiOff className="w-5 h-5 text-warning-600 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-warning-800">Offline Mode Active</p>
            <p className="text-xs text-warning-700 mt-1">Using cached route. GPS events are being queued. Route version is protected — older routes cannot overwrite newer ones.</p>
          </div>
        </div>
      )}

      {/* Cached Route */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-5 h-5 text-primary-600" />
          <h2 className="section-title">Cached Route</h2>
        </div>
        {cachedRoute ? (
          <div className="space-y-2 text-sm">
            <Row label="Route ID" value={cachedRoute.routeId} />
            <Row label="Version" value={`v${cachedRoute.routeVersion}`} />
            <Row label="Bay" value={cachedRoute.bayId} />
            <Row label="Window" value={`${cachedRoute.windowStart}–${cachedRoute.windowEnd}`} />
            <Row label="Cached At" value={new Date(cachedRoute.cachedAt).toLocaleString('en-IN')} />
          </div>
        ) : <p className="text-sm text-ink-400">No cached route available.</p>}
      </Card>

      {/* Cached Delivery */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-primary-600" />
          <h2 className="section-title">Cached Delivery</h2>
        </div>
        {cachedDelivery ? (
          <div className="space-y-2 text-sm">
            <Row label="Delivery ID" value={cachedDelivery.id} />
            <Row label="Destination" value={cachedDelivery.destination} />
            <Row label="Window" value={`${cachedDelivery.windowStart}–${cachedDelivery.windowEnd}`} />
          </div>
        ) : <p className="text-sm text-ink-400">No cached delivery available.</p>}
      </Card>

      {/* Cached Bay */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-accent-600" />
          <h2 className="section-title">Cached Bay</h2>
        </div>
        {cachedBay ? (
          <div className="space-y-2 text-sm">
            <Row label="Bay ID" value={cachedBay.bayId} />
            <Row label="Name" value={cachedBay.name} />
            <Row label="Service Duration" value={`${cachedBay.serviceDurationMin} min`} />
          </div>
        ) : <p className="text-sm text-ink-400">No cached bay available.</p>}
      </Card>

      {/* Pending GPS Queue */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-warning-600" />
          <h2 className="section-title">Pending GPS Events</h2>
        </div>
        {pendingGps && pendingGps.length > 0 ? (
          <div className="space-y-2">
            {pendingGps.map(e => (
              <div key={e.id} className="flex items-center justify-between p-2 rounded-lg bg-warning-50 border border-warning-200 text-xs">
                <span className="text-ink-600">{new Date(e.timestamp).toLocaleTimeString('en-IN')}</span>
                <span className="text-ink-800 font-mono">{e.location.lat.toFixed(4)}, {e.location.lon.toFixed(4)}</span>
                <Badge variant="warning">Queued</Badge>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-ink-400">No pending GPS events.</p>}
      </Card>

      {/* Sync Info */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <RefreshCw className="w-5 h-5 text-primary-600" />
          <h2 className="section-title">Sync Status</h2>
        </div>
        {syncMeta ? (
          <div className="space-y-2 text-sm">
            <Row label="Last Sync" value={syncMeta.lastSyncTime ? new Date(syncMeta.lastSyncTime).toLocaleString('en-IN') : 'Never'} />
            <Row label="Pending Events" value={String(syncMeta.pendingCount)} />
          </div>
        ) : <p className="text-sm text-ink-400">No sync data.</p>}
      </Card>

      <button onClick={handleClearCache} className="btn-secondary w-full text-xs">
        <Database className="w-4 h-4" /> Clear All Cached Data
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between"><span className="text-ink-500">{label}</span><span className="text-ink-800 font-medium">{value}</span></div>;
}
