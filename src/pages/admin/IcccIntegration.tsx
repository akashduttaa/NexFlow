import { useState } from 'react';
import { Building2, ArrowDown, Activity, Shield, Radio, Send, CheckCircle2 } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { apiClient } from '@/services/api-client';

export default function IcccIntegration() {
  const [transmitting, setTransmitting] = useState(false);
  const [transmitted, setTransmitted] = useState(false);

  const handleSendIcccAlert = async () => {
    setTransmitting(true);
    await apiClient.createAuditEvent({
      eventType: 'ICCC_COMMAND_SYNC',
      actor: 'ICCC_ADAPTER',
      entityType: 'municipal_iccc',
      entityId: 'kmc-posta-zone',
      metadata: { zone: 'Burrabazar / Posta', pressureIndex: 84, status: 'DISPATCHED' }
    });
    setTimeout(() => {
      setTransmitting(false);
      setTransmitted(true);
      setTimeout(() => setTransmitted(false), 4000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">ICCC Integration Layer</h1>
          <p className="text-sm text-ink-400 mt-1">Bidirectional event exchange with municipal ICCC infrastructure</p>
        </div>
        <button 
          onClick={handleSendIcccAlert} 
          disabled={transmitting}
          className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-primary-500/20 cursor-pointer disabled:opacity-50"
        >
          {transmitting ? (
            <span>Transmitting Alert...</span>
          ) : transmitted ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-success-400" />
              <span>Alert Dispatched to ICCC</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Test Live ICCC Alert Sync</span>
            </>
          )}
        </button>
      </div>

      <Card className="p-5 border-primary-500/20 bg-primary-500/10/50">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary-400" />
          <div>
            <p className="text-sm font-semibold text-white">NexFlow integrates with ICCC; it does not replace ICCC.</p>
            <p className="text-xs text-primary-400">NexFlow serves as an Urban Freight Intelligence Layer on top of existing municipal infrastructure.</p>
          </div>
        </div>
      </Card>

      {/* Architecture Flow */}
      <Card className="p-6">
        <h2 className="section-title mb-4">Integration Architecture</h2>
        <div className="space-y-2">
          {[
            { label: 'Existing Municipal ICCC / TMC', sub: 'Current traffic management infrastructure', color: 'bg-surface-hover text-ink-200' },
            { label: 'NexFlow Adapter Layer', sub: 'Bidirectional event ingestion and dispatch', color: 'bg-primary-600 text-white' },
            { label: 'Freight Prediction', sub: 'XGBoost demand, traffic risk, ETA forecasts', color: 'bg-accent-100 text-accent-300' },
            { label: 'Curb + Route Optimization', sub: 'OR-Tools CP-SAT joint optimization', color: 'bg-warning-100 text-warning-700' },
            { label: 'Fleet + Driver Dispatch', sub: 'Socket.IO realtime + offline cache', color: 'bg-primary-500/15 text-primary-300' },
            { label: 'Existing ICCC', sub: 'Feedback loop — optimized plans sent back', color: 'bg-surface-hover text-ink-200' },
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
          <Building2 className="w-5 h-5 text-ink-300" />
          <h2 className="section-title">Potential Deployment Partners</h2>
        </div>
        <p className="text-xs text-ink-400 mb-4">These are potential deployment examples only. NexFlow does not imply partnership with any of these organizations.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: 'KMC / KMDA', desc: 'Kolkata Municipal Corporation / Metropolitan Development Authority' },
            { name: 'Delhi Traffic Police', desc: 'National Capital Territory traffic management' },
            { name: 'Other Municipal Authorities', desc: 'Cities with existing ICCC infrastructure' },
          ].map(org => (
            <div key={org.name} className="p-4 rounded-lg border border-surface-border bg-surface">
              <p className="text-sm font-semibold text-white">{org.name}</p>
              <p className="text-xs text-ink-400 mt-1">{org.desc}</p>
              <Badge variant="info">Potential example</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Adapter Contract */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Radio className="w-5 h-5 text-primary-400" />
          <h2 className="section-title">ICCC Adapter Contract</h2>
        </div>
        <div className="p-4 rounded-lg bg-ink-900 text-ink-300 font-mono text-xs overflow-x-auto">
          <pre>{`// NexFlow → ICCC event contract
{
  "sourceSystem": "NEXFLOW",
  "eventType": "FREIGHT_PRESSURE_ALERT",
  "eventTime": "${new Date().toISOString()}",
  "zone": "Burrabazar / Posta",
  "pressureIndex": 84,
  "recommendedActions": [
    "reserve_bay",
    "reroute_fleet",
    "notify_driver"
  ],
  "sourceVersion": "1.0"
}`}</pre>
        </div>
        <p className="text-xs text-ink-400 mt-2">Production government API integration is authorization-gated.</p>
      </Card>

      <Card className="p-4 bg-surface border-surface-border">
        <div className="flex items-start gap-2">
          <Activity className="w-4 h-4 text-ink-400 mt-0.5 shrink-0" />
          <p className="text-xs text-ink-400">
            NexFlow is designed to integrate with existing ICCC infrastructure as a freight intelligence overlay.
            It does not replace traffic signal control, CCTV, or other existing ICCC capabilities.
          </p>
        </div>
      </Card>
    </div>
  );
}
