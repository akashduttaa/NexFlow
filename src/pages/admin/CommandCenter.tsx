import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Package, MapPin, Clock, AlertTriangle, Wifi, Activity, TrendingUp } from 'lucide-react';
import { FreightMap } from '@/components/FreightMap';
import { Card, KpiCard, StatusBadge, Badge } from '@/components/ui';
import { apiClient } from '@/services/api-client';
import type { KpiSummary, Vehicle, Bay, Incident, RoutePlan } from '@/types';

export default function CommandCenter() {
  const [kpis, setKpis] = useState<KpiSummary | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bays, setBays] = useState<Bay[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [routes, setRoutes] = useState<RoutePlan[]>([]);

  useEffect(() => {
    Promise.all([
      apiClient.getKpiSummary(),
      apiClient.getVehicles(),
      apiClient.getBays(),
      apiClient.getIncidents(),
      apiClient.getRoutes(),
    ]).then(([k, v, b, i, r]) => {
      setKpis(k);
      setVehicles(v);
      setBays(b);
      setIncidents(i);
      setRoutes(r);
    });
  }, []);

  const activeIncidents = incidents.filter(i => i.status === 'ACTIVE');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Command Center</h1>
          <p className="text-sm text-ink-400 mt-1">Urban freight operations — Burrabazar / Posta pilot zone</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">LIVE OPERATIONAL</Badge>
          <Badge variant="info">LIVE OSRM ROAD NETWORK</Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Active Vehicles" value={kpis?.activeVehicles ?? '—'} icon={<Truck className="w-5 h-5" />} accent="primary" />
        <KpiCard label="Open Deliveries" value={kpis?.openDeliveries ?? '—'} icon={<Package className="w-5 h-5" />} accent="primary" />
        <KpiCard label="Available Bays" value={kpis?.availableBays ?? '—'} icon={<MapPin className="w-5 h-5" />} accent="accent" />
        <KpiCard label="Reserved Bays" value={kpis?.reservedBays ?? '—'} icon={<MapPin className="w-5 h-5" />} accent="warning" />
        <KpiCard label="Average ETA" value={kpis?.averageEta ?? '—'} icon={<Clock className="w-5 h-5" />} accent="neutral" />
        <KpiCard label="Predicted Pressure" value={kpis?.predictedFreightPressure ?? '—'} icon={<TrendingUp className="w-5 h-5" />} accent="warning" />
        <KpiCard label="Active Incidents" value={kpis?.activeIncidents ?? '—'} icon={<AlertTriangle className="w-5 h-5" />} accent="error" />
        <KpiCard label="Driver Connectivity" value={`${kpis?.driverConnectivityPct ?? 0}%`} icon={<Wifi className="w-5 h-5" />} accent="accent" />
      </div>

      {/* Map + Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">Live Operations Map</h2>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-primary-500" style={{ boxShadow: '0 0 6px rgba(6,182,212,0.5)' }} /> Vehicle</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-accent-500" style={{ boxShadow: '0 0 6px rgba(16,185,129,0.5)' }} /> Bay</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-warning-500" style={{ boxShadow: '0 0 6px rgba(245,158,11,0.5)' }} /> Incident</span>
              </div>
            </div>
            <FreightMap
              vehicles={vehicles}
              bays={bays}
              incidents={incidents}
              routes={routes}
              height="500px"
            />
          </Card>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Active Incidents */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="section-title">Active Incidents</h3>
              <Link to="/dashboard/incidents" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">View all</Link>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {activeIncidents.length === 0 ? (
                <p className="text-sm text-ink-400">No active incidents</p>
              ) : (
                activeIncidents.map(inc => (
                  <div key={inc.id} className="flex items-start gap-2 p-2 rounded-lg bg-error-500/10 border border-error-500/20">
                    <AlertTriangle className="w-4 h-4 text-error-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-100">{inc.type.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-ink-400 truncate">{inc.description}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <StatusBadge status={inc.severity} />
                        <StatusBadge status={inc.status} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Bay Status */}
          <Card className="p-4">
            <h3 className="section-title mb-3">Bay Status</h3>
            <div className="space-y-2">
              {bays.slice(0, 5).map(b => (
                <div key={b.id} className="flex items-center justify-between text-sm">
                  <Link to={`/dashboard/bays/${b.id}`} className="text-ink-200 hover:text-primary-400 transition-colors">
                    {b.bayId} — {b.name}
                  </Link>
                  <StatusBadge status={b.state} />
                </div>
              ))}
            </div>
          </Card>

          {/* Optimization Status */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="section-title">Optimization</h3>
              <Link to="/dashboard/optimization" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">Details</Link>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-500/10 border border-primary-500/20">
              <Activity className="w-5 h-5 text-primary-400" />
              <div>
                <p className="text-sm font-medium text-ink-100">CP-SAT Solver</p>
                <p className="text-xs text-primary-400">CONNECTOR READY</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Vehicles */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="section-title">Active Vehicles</h3>
          <Link to="/dashboard/fleet" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">View fleet</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="table-header">Vehicle</th>
                <th className="table-header">Type</th>
                <th className="table-header">Driver</th>
                <th className="table-header">Status</th>
                <th className="table-header">ETA</th>
                <th className="table-header">Route v</th>
                <th className="table-header">Connection</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.filter(v => v.status !== 'IDLE').slice(0, 8).map(v => (
                <tr key={v.id} className="border-b border-surface-border hover:bg-surface-hover transition-colors">
                  <td className="table-cell">
                    <Link to={`/dashboard/fleet/${v.id}`} className="text-primary-400 hover:text-primary-300 font-medium transition-colors">{v.vehicleNo}</Link>
                  </td>
                  <td className="table-cell">{v.type}</td>
                  <td className="table-cell">{v.driverName}</td>
                  <td className="table-cell"><StatusBadge status={v.status} /></td>
                  <td className="table-cell">{v.eta ?? '—'}</td>
                  <td className="table-cell">v{v.routeVersion}</td>
                  <td className="table-cell"><StatusBadge status={v.connectionStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
