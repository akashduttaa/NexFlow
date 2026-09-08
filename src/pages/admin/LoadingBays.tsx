import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, AlertTriangle } from 'lucide-react';
import { Card, StatusBadge, Badge, LoadingState } from '@/components/ui';
import { FreightMap } from '@/components/FreightMap';
import { apiClient } from '@/services/api-client';
import type { Bay, BaySlot } from '@/types';

export default function LoadingBays() {
  const [bays, setBays] = useState<Bay[]>([]);
  const [slots, setSlots] = useState<BaySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([apiClient.getBays(), apiClient.getBaySlots()]).then(([b, s]) => {
      setBays(b);
      setSlots(s);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingState />;

  const filtered = bays.filter(b => b.bayId.toLowerCase().includes(search.toLowerCase()) || b.name.toLowerCase().includes(search.toLowerCase()));
  const conflicts = slots.filter(s => s.status === 'CONFLICT');
  const availableBays = bays.filter(b => b.state === 'AVAILABLE');
  const avgUtilization = Math.round(bays.reduce((sum, b) => sum + b.utilizationPct, 0) / bays.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Loading Bay Management</h1>
        <p className="text-sm text-ink-500 mt-1">Monitor bay availability, reservations, and conflicts</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4"><p className="kpi-label">Total Bays</p><p className="kpi-value">{bays.length}</p></Card>
        <Card className="p-4"><p className="kpi-label">Available</p><p className="kpi-value text-accent-600">{availableBays.length}</p></Card>
        <Card className="p-4"><p className="kpi-label">Avg Utilization</p><p className="kpi-value">{avgUtilization}%</p></Card>
        <Card className="p-4"><p className="kpi-label">Conflicts</p><p className="kpi-value text-error-600">{conflicts.length}</p></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="p-4">
            <h2 className="section-title mb-3">Bay Map — Burrabazar / Posta</h2>
            <FreightMap bays={bays} height="450px" />
          </Card>
        </div>

        {/* Conflicts */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-error-600" />
            <h3 className="section-title">Bay Conflicts</h3>
          </div>
          {conflicts.length === 0 ? (
            <p className="text-sm text-ink-400">No active conflicts</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {conflicts.map(s => (
                <div key={s.id} className="p-3 rounded-lg bg-error-50 border border-error-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-error-700">{s.slotId}</span>
                    <StatusBadge status={s.status} />
                  </div>
                  <p className="text-xs text-ink-500 mt-1">Bay: {s.bayId} — {s.startTime}–{s.endTime}</p>
                  {s.deliveryId && <p className="text-xs text-ink-500">Delivery: {s.deliveryId}</p>}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input type="text" placeholder="Search bays..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-9" />
          </div>
          <Badge variant="demo">SIMULATED PILOT DATA</Badge>
        </div>
      </Card>

      {/* Bay Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-200 bg-ink-50">
                <th className="table-header">Bay ID</th>
                <th className="table-header">Name</th>
                <th className="table-header">Zone</th>
                <th className="table-header">Compatibility</th>
                <th className="table-header">Service (min)</th>
                <th className="table-header">Utilization</th>
                <th className="table-header">State</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} className="border-b border-ink-100 hover:bg-ink-50">
                  <td className="table-cell"><Link to={`/dashboard/bays/${b.id}`} className="text-primary-600 hover:text-primary-700 font-medium">{b.bayId}</Link></td>
                  <td className="table-cell">{b.name}</td>
                  <td className="table-cell">{b.zone}</td>
                  <td className="table-cell text-xs">{b.compatibility.join(', ')}</td>
                  <td className="table-cell">{b.serviceDurationMin}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-ink-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${b.utilizationPct > 80 ? 'bg-error-500' : b.utilizationPct > 60 ? 'bg-warning-500' : 'bg-accent-500'}`} style={{ width: `${b.utilizationPct}%` }} />
                      </div>
                      <span className="text-xs text-ink-600">{b.utilizationPct}%</span>
                    </div>
                  </td>
                  <td className="table-cell"><StatusBadge status={b.state} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Bay Slots */}
      <Card className="p-4">
        <h2 className="section-title mb-3">Active Reservations</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-200">
                <th className="table-header">Slot ID</th>
                <th className="table-header">Bay</th>
                <th className="table-header">Delivery</th>
                <th className="table-header">Vehicle</th>
                <th className="table-header">Time</th>
                <th className="table-header">Expected Arrival</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {slots.map(s => (
                <tr key={s.id} className="border-b border-ink-100 hover:bg-ink-50">
                  <td className="table-cell font-medium">{s.slotId}</td>
                  <td className="table-cell">{s.bayId}</td>
                  <td className="table-cell">{s.deliveryId ?? '—'}</td>
                  <td className="table-cell">{s.vehicleId ?? '—'}</td>
                  <td className="table-cell text-xs">{s.startTime}–{s.endTime}</td>
                  <td className="table-cell text-xs">{s.expectedArrival}</td>
                  <td className="table-cell"><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
