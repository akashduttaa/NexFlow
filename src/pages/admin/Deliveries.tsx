import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Package } from 'lucide-react';
import { Card, StatusBadge, Badge, LoadingState } from '@/components/ui';
import { apiClient } from '@/services/api-client';
import type { Delivery } from '@/types';

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    apiClient.getDeliveries().then(d => {
      setDeliveries(d);
      setLoading(false);
    });
  }, []);

  const filtered = deliveries
    .filter(d => d.id.toLowerCase().includes(search.toLowerCase()) || d.destination.toLowerCase().includes(search.toLowerCase()))
    .filter(d => statusFilter === 'ALL' || d.status === statusFilter);

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Delivery Management</h1>
          <p className="text-sm text-ink-400 mt-1">Create, track, and manage freight deliveries</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary">
          <Plus className="w-4 h-4" /> Create Delivery
        </button>
      </div>

      {showCreate && <CreateDeliveryForm onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); setLoading(true); apiClient.getDeliveries().then(d => { setDeliveries(d); setLoading(false); }); }} />}

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input type="text" placeholder="Search deliveries..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-9" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input w-auto">
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="EN_ROUTE">En Route</option>
            <option value="AT_BAY">At Bay</option>
            <option value="SERVICING">Servicing</option>
            <option value="DELIVERED">Delivered</option>
            <option value="DELAYED">Delayed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <Badge variant="demo">SIMULATED PILOT DATA</Badge>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border bg-surface">
                <th className="table-header">ID</th>
                <th className="table-header">Destination</th>
                <th className="table-header">Zone</th>
                <th className="table-header">Priority</th>
                <th className="table-header">Weight</th>
                <th className="table-header">Window</th>
                <th className="table-header">Vehicle</th>
                <th className="table-header">Bay</th>
                <th className="table-header">ETA</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} className="border-b border-surface-border hover:bg-surface">
                  <td className="table-cell"><Link to={`/dashboard/deliveries/${d.id}`} className="text-primary-400 hover:text-primary-300 font-medium">{d.id}</Link></td>
                  <td className="table-cell max-w-[180px] truncate">{d.destination}</td>
                  <td className="table-cell">{d.zone}</td>
                  <td className="table-cell"><StatusBadge status={d.priority} /></td>
                  <td className="table-cell">{d.weightKg} kg</td>
                  <td className="table-cell text-xs">{d.windowStart}–{d.windowEnd}</td>
                  <td className="table-cell">{d.assignedVehicleId ?? '—'}</td>
                  <td className="table-cell">{d.assignedBayId ?? '—'}</td>
                  <td className="table-cell">{d.eta ?? '—'}</td>
                  <td className="table-cell"><StatusBadge status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filtered.length === 0 && <Card className="p-8 text-center text-ink-400">No deliveries match your filters.</Card>}
    </div>
  );
}

function CreateDeliveryForm({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [destination, setDestination] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [weightKg, setWeightKg] = useState('100');
  const [windowStart, setWindowStart] = useState('10:00');
  const [windowEnd, setWindowEnd] = useState('10:30');
  const [serviceDurationMin, setServiceDurationMin] = useState('15');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.createDelivery({
        pickup: 'NexGen Distribution Hub, Howrah',
        pickupLocation: { lat: 22.5958, lon: 88.2636 },
        destination: destination || 'Burrabazar Wholesale Market',
        destinationLocation: { lat: 22.5957, lon: 88.3716 },
        zone: 'Burrabazar / Posta',
        priority: priority as Delivery['priority'],
        weightKg: parseInt(weightKg) || 100,
        windowStart,
        windowEnd,
        serviceDurationMin: parseInt(serviceDurationMin) || 15,
        assignedVehicleId: null,
        assignedBayId: null,
        eta: null,
        status: 'PENDING',
      });
      onCreated();
    } catch (err) {
      console.error('Create delivery error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Create New Delivery</h2>
        <button onClick={onClose} className="btn-ghost text-sm">Cancel</button>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="label">Destination</label><input className="input" value={destination} onChange={e => setDestination(e.target.value)} placeholder="Burrabazar Wholesale Market" /></div>
        <div><label className="label">Priority</label><select className="input" value={priority} onChange={e => setPriority(e.target.value)}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option></select></div>
        <div><label className="label">Weight (kg)</label><input type="number" className="input" value={weightKg} onChange={e => setWeightKg(e.target.value)} /></div>
        <div><label className="label">Service Duration (min)</label><input type="number" className="input" value={serviceDurationMin} onChange={e => setServiceDurationMin(e.target.value)} /></div>
        <div><label className="label">Window Start</label><input type="time" className="input" value={windowStart} onChange={e => setWindowStart(e.target.value)} /></div>
        <div><label className="label">Window End</label><input type="time" className="input" value={windowEnd} onChange={e => setWindowEnd(e.target.value)} /></div>
        <div className="md:col-span-2"><button type="submit" disabled={saving} className="btn-primary w-full">{saving ? 'Creating...' : 'Create Delivery'}</button></div>
      </form>
    </Card>
  );
}
