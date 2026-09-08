import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Truck, Filter } from 'lucide-react';
import { Card, StatusBadge, Badge, LoadingState } from '@/components/ui';
import { apiClient } from '@/services/api-client';
import type { Vehicle } from '@/types';

export default function Fleet() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'vehicleNo' | 'status' | 'eta'>('vehicleNo');

  useEffect(() => {
    apiClient.getVehicles().then(v => {
      setVehicles(v);
      setLoading(false);
    });
  }, []);

  const filtered = vehicles
    .filter(v => v.vehicleNo.toLowerCase().includes(search.toLowerCase()) || v.driverName?.toLowerCase().includes(search.toLowerCase()))
    .filter(v => statusFilter === 'ALL' || v.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === 'vehicleNo') return a.vehicleNo.localeCompare(b.vehicleNo);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return (a.eta ?? 'z').localeCompare(b.eta ?? 'z');
    });

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Fleet Operations</h1>
        <p className="text-sm text-ink-500 mt-1">Manage vehicles, drivers, routes, and assignments</p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="text"
              placeholder="Search by vehicle no or driver..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input w-auto">
            <option value="ALL">All Statuses</option>
            <option value="IDLE">Idle</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="EN_ROUTE">En Route</option>
            <option value="AT_BAY">At Bay</option>
            <option value="SERVICING">Servicing</option>
            <option value="RETURNING">Returning</option>
            <option value="OFFLINE">Offline</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} className="input w-auto">
            <option value="vehicleNo">Sort: Vehicle No</option>
            <option value="status">Sort: Status</option>
            <option value="eta">Sort: ETA</option>
          </select>
          <Badge variant="demo">SIMULATED PILOT DATA</Badge>
        </div>
      </Card>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(v => (
          <Link key={v.id} to={`/dashboard/fleet/${v.id}`}>
            <Card hover className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900">{v.vehicleNo}</p>
                    <p className="text-xs text-ink-500">{v.type}</p>
                  </div>
                </div>
                <StatusBadge status={v.status} />
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-ink-500">Driver</span><span className="text-ink-800">{v.driverName ?? '—'}</span></div>
                <div className="flex justify-between"><span className="text-ink-500">Load</span><span className="text-ink-800">{v.currentLoadKg}/{v.capacityKg} kg</span></div>
                <div className="flex justify-between"><span className="text-ink-500">ETA</span><span className="text-ink-800">{v.eta ?? '—'}</span></div>
                <div className="flex justify-between"><span className="text-ink-500">Route</span><span className="text-ink-800">v{v.routeVersion}</span></div>
                <div className="flex justify-between"><span className="text-ink-500">Connection</span><StatusBadge status={v.connectionStatus} /></div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="p-8 text-center text-ink-400">No vehicles match your filters.</Card>
      )}
    </div>
  );
}
