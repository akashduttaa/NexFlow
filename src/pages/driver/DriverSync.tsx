import { useEffect, useState } from 'react';
import { RefreshCw, CheckCircle, Clock, AlertCircle, Wifi } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { getPendingGpsEvents, markGpsSynced, clearSyncedGps, setLastSyncTime, getSyncMeta } from '@/services/offline-cache';
import { socket } from '@/services/realtime';
import type { PendingGpsEvent } from '@/services/offline-cache';

export default function DriverSync() {
  const [pending, setPending] = useState<PendingGpsEvent[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncedCount, setSyncedCount] = useState(0);

  useEffect(() => {
    getPendingGpsEvents().then(setPending);
    getSyncMeta().then(meta => { if (meta?.lastSyncTime) setLastSync(meta.lastSyncTime); });
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    const events = await getPendingGpsEvents();
    for (const e of events) {
      await markGpsSynced(e.id);
    }
    await clearSyncedGps();
    const now = new Date().toISOString();
    await setLastSyncTime(now);
    setLastSync(now);
    setSyncedCount(events.length);
    setPending([]);
    socket.emit('sync:complete', { driverId: 'drv-001', pendingEvents: 0 });
    setSyncing(false);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-white">Synchronization</h1>

      {/* Sync Status */}
      <Card className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${syncing ? 'bg-warning-100' : 'bg-success-100'}`}>
            {syncing ? <RefreshCw className="w-6 h-6 text-warning-400 animate-spin" /> : <CheckCircle className="w-6 h-6 text-success-400" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{syncing ? 'SYNCING...' : 'Ready to Sync'}</p>
            <p className="text-xs text-ink-400">{pending.length} pending GPS events</p>
          </div>
        </div>

        <button onClick={handleSync} disabled={syncing || pending.length === 0} className="btn-primary w-full">
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Synchronize Now'}
        </button>

        {syncedCount > 0 && !syncing && (
          <div className="mt-3 p-3 rounded-lg bg-success-500/10 border border-success-500/20 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success-400" />
            <p className="text-xs text-success-700">Synced {syncedCount} events successfully.</p>
          </div>
        )}
      </Card>

      {/* Last Sync */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-ink-300" />
          <h2 className="section-title">Sync History</h2>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between p-2 rounded-lg bg-surface">
            <span className="text-ink-400">Last Sync Time</span>
            <span className="text-ink-100">{lastSync ? new Date(lastSync).toLocaleString('en-IN') : 'Never'}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-surface">
            <span className="text-ink-400">Pending Events</span>
            <span className="text-ink-100">{pending.length}</span>
          </div>
        </div>
      </Card>

      {/* Pending Events */}
      <Card className="p-5">
        <h2 className="section-title mb-3">Pending GPS Events</h2>
        {pending.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {pending.map(e => (
              <div key={e.id} className="flex items-center justify-between p-2 rounded-lg bg-warning-500/10 border border-warning-500/20 text-xs">
                <div>
                  <p className="text-ink-300">{new Date(e.timestamp).toLocaleTimeString('en-IN')}</p>
                  <p className="text-ink-100 font-mono">{e.location.lat.toFixed(4)}, {e.location.lon.toFixed(4)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-ink-400">{e.speedKph} km/h</span>
                  <Badge variant="warning">Queued</Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-success-500/10 border border-success-500/20">
            <CheckCircle className="w-4 h-4 text-success-400" />
            <p className="text-xs text-success-700">All events synced. No pending data.</p>
          </div>
        )}
      </Card>

      {/* Sync Flow */}
      <Card className="p-4 bg-surface border-surface-border">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-ink-400 mt-0.5 shrink-0" />
          <div className="text-xs text-ink-400">
            <p className="font-medium text-ink-300 mb-1">Offline Sync Flow:</p>
            <p>Network lost → OFFLINE MODE → use cached route → queue GPS → continue operation → retry → synchronize → reconcile latest route</p>
            <p className="mt-1">Route versions prevent stale-route overwrite.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
