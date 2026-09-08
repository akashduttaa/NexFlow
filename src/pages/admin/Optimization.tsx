import { useEffect, useState } from 'react';
import { Cpu, Play, RefreshCw, ArrowRight, AlertCircle } from 'lucide-react';
import { Card, StatusBadge, Badge } from '@/components/ui';
import { apiClient } from '@/services/api-client';
import type { OptimizationRun } from '@/types';

export default function Optimization() {
  const [runs, setRuns] = useState<OptimizationRun[]>([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    apiClient.getOptimizationRuns().then(setRuns);
  }, []);

  const startRun = async () => {
    setRunning(true);
    const vehicles = await apiClient.getVehicles();
    const deliveries = await apiClient.getDeliveries();
    const bays = await apiClient.getBays();
    await apiClient.createOptimizationRun({
      deliveries: deliveries.filter(d => d.status === 'PENDING' || d.status === 'ASSIGNED'),
      vehicles: vehicles.filter(v => v.status !== 'OFFLINE'),
      routeCandidates: [],
      bayCandidates: bays,
      predictions: [],
      incidents: [],
      objectiveWeights: { deliveryDelay: 1, curbWaiting: 1, latePenalty: 2, distance: 0.5, reroutingCost: 1 },
      horizonMinutes: 60,
    });
    apiClient.getOptimizationRuns().then(setRuns);
    setRunning(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Optimization</h1>
          <p className="text-sm text-ink-500 mt-1">Rolling-Horizon Joint Route + Curb Optimization</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={startRun} disabled={running} className="btn-primary">
            <Play className="w-4 h-4" /> {running ? 'Starting...' : 'Start Optimization Run'}
          </button>
          <Badge variant="demo">DEMO MODE</Badge>
        </div>
      </div>

      {/* Optimizer Status */}
      <Card className="p-5 border-primary-200 bg-primary-50/50">
        <div className="flex items-center gap-3">
          <Cpu className="w-6 h-6 text-primary-600" />
          <div>
            <p className="text-sm font-semibold text-ink-900">OPTIMIZER STATUS: CONNECTOR READY</p>
            <p className="text-xs text-primary-600">OR-Tools CP-SAT solver connector ready. Awaiting solver service deployment.</p>
          </div>
        </div>
      </Card>

      {/* Core Algorithm */}
      <Card className="p-5">
        <h2 className="section-title mb-4">Core Algorithm</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-ink-700 mb-2">MVP Solver</h3>
            <p className="text-sm text-ink-600 mb-4">OR-Tools CP-SAT — Constraint Programming</p>
            <h3 className="text-sm font-semibold text-ink-700 mb-2">Decisions</h3>
            <ul className="text-sm text-ink-600 space-y-1">
              <li>• Vehicle assignment</li>
              <li>• Route candidate selection</li>
              <li>• Loading-bay slot allocation</li>
              <li>• Delivery sequence</li>
              <li>• Re-routing decision</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink-700 mb-2">Objective: MINIMIZE</h3>
            <ul className="text-sm text-ink-600 space-y-1">
              <li>• Delivery Delay</li>
              <li>• Curb Waiting</li>
              <li>• Late Penalties</li>
              <li>• Unnecessary Distance</li>
              <li>• Rerouting Cost</li>
            </ul>
            <h3 className="text-sm font-semibold text-ink-700 mt-4 mb-2">Subject To</h3>
            <ul className="text-sm text-ink-600 space-y-1">
              <li>• Vehicle Capacity</li>
              <li>• Delivery Windows</li>
              <li>• Bay Exclusivity</li>
              <li>• Fleet Availability</li>
              <li>• Road Closures</li>
              <li>• Service Duration</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Pipeline */}
      <Card className="p-5">
        <h2 className="section-title mb-4">Optimization Pipeline</h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['CURRENT STATE', 'PREDICT', 'ROUTE CANDIDATES', 'BAY CANDIDATES', 'CP-SAT', 'PLAN', 'DISPATCH'].map((step, i) => (
            <div key={step} className="flex items-center gap-2 shrink-0">
              <div className={`px-4 py-2 rounded-lg text-xs font-medium ${i === 4 ? 'bg-primary-600 text-white' : 'bg-ink-100 text-ink-700'}`}>
                {step}
              </div>
              {i < 6 && <ArrowRight className="w-4 h-4 text-ink-400 shrink-0" />}
            </div>
          ))}
        </div>
      </Card>

      {/* Run Table */}
      <Card className="overflow-hidden">
        <h2 className="section-title p-4 border-b border-ink-200">Optimization Runs</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-200 bg-ink-50">
                <th className="table-header">Run ID</th>
                <th className="table-header">Status</th>
                <th className="table-header">Solver</th>
                <th className="table-header">Runtime</th>
                <th className="table-header">Objective</th>
                <th className="table-header">Vehicles</th>
                <th className="table-header">Deliveries</th>
                <th className="table-header">Bays</th>
                <th className="table-header">Created</th>
              </tr>
            </thead>
            <tbody>
              {runs.map(r => (
                <tr key={r.id} className="border-b border-ink-100 hover:bg-ink-50">
                  <td className="table-cell font-medium">{r.runId}</td>
                  <td className="table-cell"><StatusBadge status={r.status} /></td>
                  <td className="table-cell">{r.solverStatus ?? '—'}</td>
                  <td className="table-cell">{r.runtimeMs ? `${r.runtimeMs} ms` : '—'}</td>
                  <td className="table-cell">{r.objectiveValue ?? '—'}</td>
                  <td className="table-cell">{r.vehicles}</td>
                  <td className="table-cell">{r.deliveries}</td>
                  <td className="table-cell">{r.bays}</td>
                  <td className="table-cell text-xs">{new Date(r.createdAt).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {runs.some(r => r.warnings.length > 0) && (
        <Card className="p-4 border-warning-300 bg-warning-50/50">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-warning-600" />
            <h3 className="text-sm font-semibold text-ink-700">Warnings</h3>
          </div>
          {runs.filter(r => r.warnings.length > 0).flatMap(r => r.warnings.map((w, i) => (
            <p key={`${r.id}-${i}`} className="text-xs text-warning-700">{w}</p>
          )))}
        </Card>
      )}
    </div>
  );
}
