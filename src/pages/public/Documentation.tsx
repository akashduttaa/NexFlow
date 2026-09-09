import { Link } from 'react-router-dom';
import {
  FileText,
  GitBranch,
  Database,
  Server,
  Cpu,
  MapPin,
  Code2,
  ShieldCheck,
  Radio,
  Wifi,
  AlertTriangle,
  Play,
  BarChart3,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { Card, Badge } from '@/components/ui';

const docs = [
  { icon: FileText, title: 'System Overview', desc: 'High-level architecture, component responsibilities, and system boundaries.', tag: 'Architecture' },
  { icon: GitBranch, title: 'Data Flow', desc: 'How data moves from ingestion through prediction, optimization, and dispatch.', tag: 'Architecture' },
  { icon: Database, title: 'ERD', desc: 'Entity-relationship diagram covering all core domain tables and relationships.', tag: 'Data' },
  { icon: Server, title: 'Deployment', desc: 'Docker Compose setup, service configuration, and environment variables.', tag: 'Ops' },
  { icon: Cpu, title: 'Optimization Algorithm', desc: 'OR-Tools CP-SAT formulation: variables, constraints, objective, and search strategy.', tag: 'Core' },
  { icon: MapPin, title: 'Candidate Generation', desc: 'How route and loading-bay candidates are generated and filtered before optimization.', tag: 'Core' },
  { icon: Code2, title: 'OpenAPI', desc: 'REST API specification — endpoints, schemas, authentication, and error codes.', tag: 'API' },
  { icon: ShieldCheck, title: 'Data Provenance', desc: 'Provenance tracking for simulated, open, live-external, and operator-feed data sources.', tag: 'Data' },
  { icon: Radio, title: 'ICCC Integration', desc: 'How NexFlow integrates with existing ICCC infrastructure — augmentation, not replacement.', tag: 'Integration' },
  { icon: GitBranch, title: 'ULIP Adapter', desc: 'Unified Logistics Interface Platform adapter for inter-system data exchange.', tag: 'Integration' },
  { icon: Wifi, title: 'Offline Driver', desc: 'Offline-first driver app architecture — caching, queuing, and sync-on-reconnect.', tag: 'Client' },
  { icon: AlertTriangle, title: 'Failure Runbook', desc: 'Operational runbook for service failures, degraded modes, and recovery procedures.', tag: 'Ops' },
  { icon: Play, title: 'Live Demo', desc: 'Guide to the live demo environment — roles, simulated data, and walkthrough scenarios.', tag: 'Demo' },
  { icon: BarChart3, title: 'Baseline Experiment', desc: 'Baseline comparison: standard routing vs NexFlow joint optimization on pilot data.', tag: 'Research' },
];

export default function Documentation() {
  return (
    <div className="bg-ink-950">
      {/* Header */}
      <section className="py-16 lg:py-20 border-b border-surface-border relative overflow-hidden">
        <div className="absolute inset-0 animated-mesh-bg opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="info">Documentation</Badge>
          <h1 className="mt-4 text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="gradient-text">Documentation Index</span>
          </h1>
          <p className="mt-4 text-xl text-ink-300 max-w-3xl">
            Complete documentation covering architecture, data, optimization, integration, operations, and research.
          </p>
        </div>
      </section>

      {/* Docs Grid */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {docs.map((doc) => (
              <Card key={doc.title} hover className="p-6 group cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/20 transition-colors duration-300">
                    <doc.icon className="w-6 h-6 text-primary-400 group-hover:text-primary-300 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-base font-semibold text-white truncate">{doc.title}</h3>
                    </div>
                    <p className="text-sm text-ink-400 leading-relaxed mb-3">{doc.desc}</p>
                    <Badge variant="neutral">{doc.tag}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resource Banner */}
      <section className="py-16 lg:py-20 border-y border-surface-border" style={{ background: 'linear-gradient(180deg, rgba(15,23,41,0.5) 0%, rgba(10,14,26,0.8) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 lg:p-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent-500/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-accent-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">All demo data is simulated</h2>
                <p className="mt-2 text-ink-300 leading-relaxed">
                  Every data point shown in the NexFlow demo is simulated for demonstration purposes. Data provenance is tracked and surfaced throughout the platform — each record carries a provenance badge (DEMO DATA, OPEN DATA, LIVE EXTERNAL, or OPERATOR FEED).
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link to="/login" className="btn-primary px-5 py-2.5">
                    Enter Demo
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/solution" className="btn-secondary px-5 py-2.5">
                    View Solution
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
