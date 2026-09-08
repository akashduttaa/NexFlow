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
          <p className="text-sm text-ink-500 mt-1">Urban freight operations — Burrabazar / Posta pilot zone</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="demo">DEMO ENVIRONMENT</Badge>
          <Badge variant="demo">SIMULATED PILOT DATA</Badge>
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
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-primary-500" /> Vehicle</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-accent-500" /> Bay</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-warning-500" /> Incident</span>
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
              <Link to="/dashboard/incidents" className="text-xs text-primary-600 hover:text-primary-700">View all</Link>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {activeIncidents.length === 0 ? (
                <p className="text-sm text-ink-400">No active incidents</p>
              ) : (
                activeIncidents.map(inc => (
                  <div key={inc.id} className="flex items-start gap-2 p-2 rounded-lg bg-error-50 border border-error-200">
                    <AlertTriangle className="w-4 h-4 text-error-600 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-800">{inc.type.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-ink-500 truncate">{inc.description}</p>
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

          {/* Bay Conflicts */}
          <Card className="p-4">
            <h3 className="section-title mb-3">Bay Status</h3>
            <div className="space-y-2">
              {bays.slice(0, 5).map(b => (
                <div key={b.id} className="flex items-center justify-between text-sm">
                  <Link to={`/dashboard/bays/${b.id}`} className="text-ink-700 hover:text-primary-600">
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
              <Link to="/dashboard/optimization" className="text-xs text-primary-600 hover:text-primary-700">Details</Link>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-50 border border-primary-200">
              <Activity className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm font-medium text-ink-800">CP-SAT Solver</p>
                <p className="text-xs text-primary-600">CONNECTOR READY</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Vehicles */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="section-title">Active Vehicles</h3>
          <Link to="/dashboard/fleet" className="text-xs text-primary-600 hover:text-primary-700">View fleet</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-200">
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
                <tr key={v.id} className="border-b border-ink-100 hover:bg-ink-50">
                  <td className="table-cell">
                    <Link to={`/dashboard/fleet/${v.id}`} className="text-primary-600 hover:text-primary-700 font-medium">{v.vehicleNo}</Link>
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
