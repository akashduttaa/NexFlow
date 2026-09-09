import { useEffect, useState } from 'react';
import { AlertTriangle, Route, CarFront, Building2, TrendingUp, WifiOff, MapPin } from 'lucide-react';
import { Card, StatusBadge, Badge } from '@/components/ui';
import { FreightMap } from '@/components/FreightMap';
import { apiClient } from '@/services/api-client';
import type { Incident, Vehicle } from '@/types';
import { PILOT_CENTER } from '@/data/fixtures';

export default function Incidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    apiClient.getIncidents().then(setIncidents);
    apiClient.getVehicles().then(setVehicles);
  }, []);

  const simulate = async (type: Incident['type']) => {
    setSimulating(true);
    try {
      const descriptions: Record<string, string> = {
        ROAD_CLOSURE: 'Simulated road closure on Cotton Street — DEMO',
        BAY_CONFLICT: 'Simulated double-booking at Bay B-03 — DEMO',
        DEMAND_SURGE: 'Simulated demand surge at Burrabazar Market — DEMO',
        VEHICLE_BREAKDOWN: 'Simulated vehicle breakdown on Strand Road — DEMO',
      };
      await apiClient.createIncident({
        type,
        severity: type === 'ROAD_CLOSURE' ? 'HIGH' : 'MEDIUM',
        status: 'ACTIVE',
        location: { lat: PILOT_CENTER[0] + (Math.random() - 0.5) * 0.01, lon: PILOT_CENTER[1] + (Math.random() - 0.5) * 0.01 },
        segment: 'Cotton Street',
        description: descriptions[type] ?? `Simulated ${type} — DEMO`,
      });
      const updated = await apiClient.getIncidents();
      setIncidents(updated);
    } catch (err) {
      console.error('Incident simulation error:', err);
    } finally {
      setSimulating(false);
    }
  };

  const resolve = async (id: string) => {
    await apiClient.updateIncident(id, { status: 'RESOLVED', resolvedAt: new Date().toISOString() });
    apiClient.getIncidents().then(setIncidents);
  };

  const active = incidents.filter(i => i.status === 'ACTIVE');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Incident Center</h1>
          <p className="text-sm text-ink-400 mt-1">Monitor and simulate freight disruption events</p>
        </div>
        <Badge variant="warning">LIVE DISPATCH REROUTER</Badge>
      </div>

      {/* Incident Simulator */}
      <Card className="p-5 border-warning-500/30 bg-warning-500/5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-warning-400" />
          <h2 className="section-title">Incident Simulator — LIVE DISPATCH REROUTER</h2>
        </div>
        <p className="text-sm text-ink-400 mb-4">Trigger simulated incidents to test re-optimization flows. These are deterministic demo scenarios.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <SimButton icon={<Route className="w-4 h-4" />} label="Road Closure" onClick={() => simulate('ROAD_CLOSURE')} disabled={simulating} />
          <SimButton icon={<Building2 className="w-4 h-4" />} label="Bay Conflict" onClick={() => simulate('BAY_CONFLICT')} disabled={simulating} />
          <SimButton icon={<TrendingUp className="w-4 h-4" />} label="Demand Surge" onClick={() => simulate('DEMAND_SURGE')} disabled={simulating} />
          <SimButton icon={<CarFront className="w-4 h-4" />} label="Vehicle Breakdown" onClick={() => simulate('VEHICLE_BREAKDOWN')} disabled={simulating} />
          <SimButton icon={<WifiOff className="w-4 h-4" />} label="Network Failure" onClick={() => simulate('VEHICLE_BREAKDOWN')} disabled={simulating} />
          <SimButton icon={<MapPin className="w-4 h-4" />} label="Stale GPS" onClick={() => simulate('VEHICLE_BREAKDOWN')} disabled={simulating} />
        </div>
      </Card>

      {/* Active Incidents Map */}
      <Card className="p-4">
        <h2 className="section-title mb-3">Active Incidents Map</h2>
        <FreightMap vehicles={vehicles} incidents={incidents} height="400px" />
      </Card>

      {/* Active Incidents List */}
      <Card className="p-4">
        <h2 className="section-title mb-3">Active Incidents ({active.length})</h2>
        {active.length === 0 ? (
          <p className="text-sm text-ink-400">No active incidents.</p>
        ) : (
          <div className="space-y-3">
            {active.map(inc => (
              <div key={inc.id} className="flex items-start gap-3 p-4 rounded-lg border border-error-500/20 bg-error-500/10">
                <AlertTriangle className="w-5 h-5 text-error-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white">{inc.incidentId}</span>
                    <StatusBadge status={inc.type} />
                    <StatusBadge status={inc.severity} />
                    <StatusBadge status={inc.status} />
                  </div>
                  <p className="text-sm text-ink-300 mt-1">{inc.description}</p>
                  <p className="text-xs text-ink-400 mt-1">{inc.segment} — {new Date(inc.createdAt).toLocaleString('en-IN')}</p>
                </div>
                <button onClick={() => resolve(inc.id)} className="btn-secondary text-xs shrink-0">Resolve</button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* All Incidents Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border bg-surface">
                <th className="table-header">Incident ID</th>
                <th className="table-header">Type</th>
                <th className="table-header">Severity</th>
                <th className="table-header">Segment</th>
                <th className="table-header">Status</th>
                <th className="table-header">Created</th>
                <th className="table-header">Resolved</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map(inc => (
                <tr key={inc.id} className="border-b border-surface-border hover:bg-surface">
                  <td className="table-cell font-medium">{inc.incidentId}</td>
                  <td className="table-cell">{inc.type.replace(/_/g, ' ')}</td>
                  <td className="table-cell"><StatusBadge status={inc.severity} /></td>
                  <td className="table-cell">{inc.segment}</td>
                  <td className="table-cell"><StatusBadge status={inc.status} /></td>
                  <td className="table-cell text-xs">{new Date(inc.createdAt).toLocaleString('en-IN')}</td>
                  <td className="table-cell text-xs">{inc.resolvedAt ? new Date(inc.resolvedAt).toLocaleString('en-IN') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function SimButton({ icon, label, onClick, disabled }: { icon: React.ReactNode; label: string; onClick: () => void; disabled: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className="flex flex-col items-center gap-2 p-3 rounded-lg border border-warning-500/30 bg-surface hover:bg-warning-500/15 transition-colors disabled:opacity-50">
      <span className="text-warning-400">{icon}</span>
      <span className="text-xs font-medium text-ink-200 text-center">{label}</span>
    </button>
  );
}
