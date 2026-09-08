import { Building2, ArrowDown, Activity, Shield, Radio } from 'lucide-react';
import { Card, Badge } from '@/components/ui';

export default function IcccIntegration() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">ICCC Integration</h1>
        <p className="text-sm text-ink-500 mt-1">Integration with existing municipal ICCC infrastructure</p>
      </div>

      <Card className="p-5 border-primary-200 bg-primary-50/50">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary-600" />
          <div>
            <p className="text-sm font-semibold text-ink-900">NexFlow integrates with ICCC; it does not replace ICCC.</p>
            <p className="text-xs text-primary-600">NexFlow serves as an Urban Freight Intelligence Layer on top of existing municipal infrastructure.</p>
          </div>
        </div>
      </Card>

      {/* Architecture Flow */}
      <Card className="p-6">
        <h2 className="section-title mb-4">Integration Architecture</h2>
        <div className="space-y-2">
          {[
            { label: 'Existing Municipal ICCC / TMC', sub: 'Current traffic management infrastructure', color: 'bg-ink-100 text-ink-700' },
            { label: 'NexFlow Adapter Layer', sub: 'Bidirectional event ingestion and dispatch', color: 'bg-primary-600 text-white' },
            { label: 'Freight Prediction', sub: 'XGBoost demand, traffic risk, ETA forecasts', color: 'bg-accent-100 text-accent-700' },
            { label: 'Curb + Route Optimization', sub: 'OR-Tools CP-SAT joint optimization', color: 'bg-warning-100 text-warning-700' },
            { label: 'Fleet + Driver Dispatch', sub: 'Socket.IO realtime + offline cache', color: 'bg-primary-100 text-primary-700' },
            { label: 'Existing ICCC', sub: 'Feedback loop — optimized plans sent back', color: 'bg-ink-100 text-ink-700' },
          ].map((layer, i, arr) => (
            <div key={i}>
              <div className={`flex items-center gap-3 p-4 rounded-lg ${layer.color}`}>
                <div className="flex-1">
                  <p className="text-sm font-medium">{layer.label}</p>
                  <p className="text-xs opacity-80">{layer.sub}</p>
                </div>
              </div>
              {i < arr.length - 1 && <div className="flex justify-center py-1"><ArrowDown className="w-4 h-4 text-ink-400" /></div>}
            </div>
          ))}
        </div>
      </Card>

      {/* Potential Deployment Partners */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-5 h-5 text-ink-600" />
          <h2 className="section-title">Potential Deployment Partners</h2>
        </div>
        <p className="text-xs text-ink-500 mb-4">These are potential deployment examples only. NexFlow does not imply partnership with any of these organizations.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: 'KMC / KMDA', desc: 'Kolkata Municipal Corporation / Metropolitan Development Authority' },
            { name: 'Delhi Traffic Police', desc: 'National Capital Territory traffic management' },
            { name: 'Other Municipal Authorities', desc: 'Cities with existing ICCC infrastructure' },
          ].map(org => (
            <div key={org.name} className="p-4 rounded-lg border border-ink-200 bg-white">
              <p className="text-sm font-semibold text-ink-900">{org.name}</p>
              <p className="text-xs text-ink-500 mt-1">{org.desc}</p>
              <Badge variant="neutral">Potential example</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Adapter Contract */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Radio className="w-5 h-5 text-primary-600" />
          <h2 className="section-title">ICCC Adapter Contract</h2>
        </div>
        <div className="p-4 rounded-lg bg-ink-900 text-ink-300 font-mono text-xs overflow-x-auto">
          <pre>{`// NexFlow → ICCC event contract
{
  "sourceSystem": "NEXFLOW",
  "eventType": "FREIGHT_PRESSURE_ALERT",
  "eventTime": "2026-09-08T10:30:00Z",
  "zone": "Burrabazar / Posta",
  "pressureIndex": 78,
  "recommendedActions": [
    "reserve_bay",
    "reroute_fleet",
    "notify_driver"
  ],
  "sourceVersion": "1.0"
}`}</pre>
        </div>
        <p className="text-xs text-ink-500 mt-2">Production government API integration is authorization-gated.</p>
      </Card>

      <Card className="p-4 bg-ink-50 border-ink-200">
        <div className="flex items-start gap-2">
          <Activity className="w-4 h-4 text-ink-500 mt-0.5 shrink-0" />
          <p className="text-xs text-ink-500">
            NexFlow is designed to integrate with existing ICCC infrastructure as a freight intelligence overlay.
            It does not replace traffic signal control, CCTV, or other existing ICCC capabilities.
          </p>
        </div>
      </Card>
    </div>
  );
}
