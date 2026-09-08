import { useEffect, useState } from 'react';
import { FlaskConical, Play, Plus } from 'lucide-react';
import { Card, StatusBadge, Badge } from '@/components/ui';
import { apiClient } from '@/services/api-client';
import type { ExperimentRecord } from '@/types';

export default function Experiments() {
  const [experiments, setExperiments] = useState<ExperimentRecord[]>([]);

  useEffect(() => {
    apiClient.getExperiments().then(setExperiments);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Experiments</h1>
          <p className="text-sm text-ink-500 mt-1">Baseline vs NexFlow comparison under identical inputs</p>
        </div>
        <Badge variant="demo">DEMO MODE</Badge>
      </div>

      {/* Policies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 border-ink-300">
          <h3 className="font-semibold text-ink-900 mb-2">BASELINE</h3>
          <p className="text-sm text-ink-600 mb-3">Point-to-point routing without shared curb optimization</p>
          <ul className="text-xs text-ink-500 space-y-1">
            <li>• Standard navigation approach</li>
            <li>• No bay allocation coordination</li>
            <li>• No re-optimization on incidents</li>
          </ul>
        </Card>
        <Card className="p-5 border-primary-300 bg-primary-50/50">
          <h3 className="font-semibold text-primary-700 mb-2">NEXFLOW</h3>
          <p className="text-sm text-ink-600 mb-3">Prediction + Route candidates + Vehicle assignment + Bay allocation + Re-optimization</p>
          <ul className="text-xs text-ink-500 space-y-1">
            <li>• Freight pressure prediction</li>
            <li>• Joint route + curb optimization</li>
            <li>• Incident-triggered re-optimization</li>
            <li>• Route versioning prevents stale routes</li>
          </ul>
        </Card>
      </div>

      {/* Required Identical Inputs */}
      <Card className="p-5">
        <h2 className="section-title mb-3">Required Identical Inputs</h2>
        <p className="text-sm text-ink-500 mb-4">Both baseline and NexFlow experiments must use the same inputs for valid comparison.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Vehicles', 'Deliveries', 'Starting Positions', 'Road Network', 'Weather', 'Incident Scenario', 'Bay Inventory', 'Seed'].map(item => (
            <div key={item} className="p-2 rounded-lg bg-ink-50 border border-ink-200 text-center text-xs font-medium text-ink-600">{item}</div>
          ))}
        </div>
      </Card>

      {/* Experiment Records */}
      <Card className="overflow-hidden">
        <h2 className="section-title p-4 border-b border-ink-200">Experiment Records</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-200 bg-ink-50">
                <th className="table-header">Experiment</th>
                <th className="table-header">Seed</th>
                <th className="table-header">Policy</th>
                <th className="table-header">Vehicles</th>
                <th className="table-header">Deliveries</th>
                <th className="table-header">Bays</th>
                <th className="table-header">Incidents</th>
                <th className="table-header">Status</th>
                <th className="table-header">Created</th>
              </tr>
            </thead>
            <tbody>
              {experiments.map(exp => (
                <tr key={exp.id} className="border-b border-ink-100 hover:bg-ink-50">
                  <td className="table-cell font-medium">{exp.experimentId}</td>
                  <td className="table-cell text-xs">{exp.seed}</td>
                  <td className="table-cell"><Badge variant={exp.policy === 'NEXFLOW' ? 'info' : 'neutral'}>{exp.policy}</Badge></td>
                  <td className="table-cell">{exp.vehicles}</td>
                  <td className="table-cell">{exp.deliveries}</td>
                  <td className="table-cell">{exp.bays}</td>
                  <td className="table-cell">{exp.incidents}</td>
                  <td className="table-cell"><StatusBadge status={exp.status} /></td>
                  <td className="table-cell text-xs">{new Date(exp.createdAt).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Results */}
      {experiments.filter(e => e.results).length > 0 && (
        <Card className="p-5">
          <h2 className="section-title mb-4">Baseline Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {experiments.filter(e => e.results).map(exp => (
              <div key={exp.id} className="space-y-2">
                <p className="text-xs font-semibold text-ink-500 uppercase">{exp.policy}</p>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between"><span className="text-ink-500">Idle Time</span><span className="text-ink-800">{exp.results!.avgIdleTimeMin} min</span></div>
                  <div className="flex justify-between"><span className="text-ink-500">Bay Turnover</span><span className="text-ink-800">{exp.results!.bayTurnoverPerHr}/hr</span></div>
                  <div className="flex justify-between"><span className="text-ink-500">Distance/Order</span><span className="text-ink-800">{exp.results!.distancePerOrderKm} km</span></div>
                  <div className="flex justify-between"><span className="text-ink-500">Late Orders</span><span className="text-ink-800">{exp.results!.lateOrdersPct}%</span></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-4 bg-ink-50 border-ink-200">
        <div className="flex items-start gap-2">
          <FlaskConical className="w-4 h-4 text-ink-500 mt-0.5 shrink-0" />
          <p className="text-xs text-ink-500">
            The interface will later allow actual experiment execution by Antigravity. NexFlow experiment results will be populated when the CP-SAT solver is connected.
          </p>
        </div>
      </Card>
    </div>
  );
}
