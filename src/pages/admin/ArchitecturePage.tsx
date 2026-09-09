import { Network, ArrowDown, Database, Cpu, Radio, FileText, Boxes } from 'lucide-react';
import { Card, Badge } from '@/components/ui';

export default function ArchitecturePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">System Architecture</h1>
        <p className="text-sm text-ink-400 mt-1">NexFlow system architecture, data flow, and entity relationships</p>
      </div>

      {/* A. System Architecture */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Network className="w-5 h-5 text-primary-400" />
          <h2 className="section-title">A. System Architecture</h2>
        </div>
        <div className="space-y-2">
          {[
            { label: 'Data Ingestion (OSM | GTFS | Weather | GPS | Orders | Incidents)', icon: <Radio className="w-5 h-5" />, color: 'bg-accent-100 text-accent-300' },
            { label: 'Data & State (PostgreSQL + PostGIS | Redis)', icon: <Database className="w-5 h-5" />, color: 'bg-primary-500/15 text-primary-300' },
            { label: 'AI + Optimization (XGBoost | OSRM | OR-Tools CP-SAT)', icon: <Cpu className="w-5 h-5" />, color: 'bg-warning-100 text-warning-700' },
            { label: 'API + Dispatch (FastAPI | Node.js | Socket.IO)', icon: <Network className="w-5 h-5" />, color: 'bg-surface-hover text-ink-200' },
          ].map((layer, i, arr) => (
            <div key={i}>
              <div className={`flex items-center gap-3 p-4 rounded-lg ${layer.color}`}>
                {layer.icon}
                <span className="text-sm font-medium">{layer.label}</span>
              </div>
              {i < arr.length - 1 && <div className="flex justify-center py-1"><ArrowDown className="w-4 h-4 text-ink-400" /></div>}
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-surface border border-surface-border">
          <p className="text-xs text-ink-400">Outputs: City Console | Fleet Ops | Driver PWA | Offline Cache | SMS Adapter</p>
        </div>
      </Card>

      {/* B. Project Workflow */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Boxes className="w-5 h-5 text-primary-400" />
          <h2 className="section-title">B. Project Workflow</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {['Data Sources', 'Ingest', 'Normalize / Map Match', 'Predict', 'OSRM Route Candidates + PostGIS Bay Candidates', 'CP-SAT', 'Vehicle + Route + Bay + Time', 'Dispatch', 'GPS / Incident', 'Re-optimization'].map((step, i, arr) => (
            <div key={step} className="flex items-center gap-2">
              <div className="px-3 py-2 rounded-lg bg-primary-500/10 border border-primary-500/20 text-xs font-medium text-primary-300 whitespace-nowrap">{step}</div>
              {i < arr.length - 1 && <ArrowDown className="w-3 h-3 text-ink-400 rotate-[-90deg]" />}
            </div>
          ))}
        </div>
      </Card>

      {/* C. Level-1 DFD */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary-400" />
          <h2 className="section-title">C. Level-1 Data Flow Diagram</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-semibold text-ink-400 uppercase">Inputs</span>
            <div className="flex gap-2">
              {['OSM', 'GTFS', 'Weather', 'GPS', 'Orders'].map(s => (
                <div key={s} className="px-3 py-1.5 rounded-lg bg-accent-500/10 border border-accent-500/20 text-xs font-medium text-accent-300">{s}</div>
              ))}
            </div>
          </div>
          <ArrowDown className="w-4 h-4 text-ink-400 mx-auto" />
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['P1 Ingest', 'P2 Predict', 'P3 Optimize', 'P4 Dispatch'].map(p => (
              <div key={p} className="px-4 py-2 rounded-lg bg-primary-600 text-white text-xs font-medium">{p}</div>
            ))}
          </div>
          <ArrowDown className="w-4 h-4 text-ink-400 mx-auto" />
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['City Console', 'Fleet Ops', 'Driver App'].map(c => (
              <div key={c} className="px-3 py-1.5 rounded-lg bg-surface-hover border border-surface-border text-xs font-medium text-ink-200">{c}</div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-surface border border-surface-border text-center"><span className="text-xs font-medium text-ink-300">D1: PostgreSQL + PostGIS</span></div>
            <div className="p-3 rounded-lg bg-surface border border-surface-border text-center"><span className="text-xs font-medium text-ink-300">D2: Redis</span></div>
            <div className="p-3 rounded-lg bg-surface border border-surface-border text-center"><span className="text-xs font-medium text-ink-300">D3: Audit / Event Log</span></div>
          </div>
        </div>
      </Card>

      {/* D. ER Diagram */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-primary-400" />
          <h2 className="section-title">D. Entity Relationship Diagram</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { entity: 'USER', rel: '→ FLEET' },
            { entity: 'FLEET', rel: '→ VEHICLE' },
            { entity: 'VEHICLE', rel: '→ DRIVER' },
            { entity: 'VEHICLE', rel: '→ DELIVERY' },
            { entity: 'DELIVERY', rel: '→ BAY_SLOT' },
            { entity: 'BAY_SLOT', rel: '→ BAY' },
            { entity: 'VEHICLE', rel: '→ ROUTE_PLAN' },
            { entity: 'ROAD_SEGMENT', rel: '→ INCIDENT' },
            { entity: 'INCIDENT', rel: '→ PREDICTION' },
            { entity: 'VEHICLE', rel: '→ TELEMETRY' },
            { entity: 'ORGANIZATION', rel: '→ USER' },
            { entity: 'ORGANIZATION', rel: '→ PLAN' },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-2 p-3 rounded-lg border border-surface-border bg-surface">
              <div className="px-3 py-1.5 rounded bg-primary-500/15 text-primary-300 text-xs font-semibold">{r.entity}</div>
              <span className="text-xs text-ink-400">{r.rel}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Deployment Architecture */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Network className="w-5 h-5 text-primary-400" />
          <h2 className="section-title">Deployment Architecture</h2>
        </div>
        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-surface border border-surface-border">
            <p className="text-sm font-medium text-ink-200">Municipal ICCC / TMC</p>
            <p className="text-xs text-ink-400">Existing infrastructure — NexFlow integrates, does not replace</p>
          </div>
          <ArrowDown className="w-4 h-4 text-ink-400 mx-auto" />
          <div className="p-3 rounded-lg bg-primary-500/10 border border-primary-500/20">
            <p className="text-sm font-medium text-primary-300">NexFlow Adapter Layer</p>
            <p className="text-xs text-primary-400">ICCC Adapter + ULIP-aligned contract</p>
          </div>
          <ArrowDown className="w-4 h-4 text-ink-400 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-accent-500/10 border border-accent-500/20"><p className="text-sm font-medium text-accent-300">Docker Compose</p><p className="text-xs text-ink-400">postgres + postgis, redis, osrm, api, ai, optimizer, web</p></div>
            <div className="p-3 rounded-lg bg-warning-500/10 border border-warning-500/20"><p className="text-sm font-medium text-warning-700">AWS-compatible</p><p className="text-xs text-ink-400">Deployment-ready for AWS-compatible infrastructure</p></div>
          </div>
        </div>
        <div className="mt-4"><Badge variant="success">LIVE SYSTEM ARCHITECTURE — ONLINE</Badge></div>
      </Card>
    </div>
  );
}
