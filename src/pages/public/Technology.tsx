import { Link } from 'react-router-dom';
import {
  Code2,
  Server,
  Database,
  Brain,
  Route,
  Settings2,
  Box,
  ArrowRight,
  Layers,
  Cpu,
  HardDrive,
  Zap,
  MapPin,
} from 'lucide-react';
import { Card, Badge } from '@/components/ui';

const stacks = [
  {
    icon: Code2, title: 'Frontend', color: 'primary',
    items: [
      { name: 'React', desc: 'Component-based UI' },
      { name: 'Vite', desc: 'Build tooling & dev server' },
      { name: 'TypeScript', desc: 'Type-safe codebase' },
      { name: 'Tailwind CSS', desc: 'Utility-first styling' },
      { name: 'React Router', desc: 'Client-side routing' },
      { name: 'Leaflet', desc: 'Interactive maps' },
      { name: 'Recharts', desc: 'Data visualization' },
    ],
  },
  {
    icon: Server, title: 'Backend', color: 'primary',
    items: [
      { name: 'Node.js', desc: 'JavaScript runtime' },
      { name: 'Express', desc: 'HTTP API framework' },
      { name: 'TypeScript', desc: 'Type-safe server' },
      { name: 'JWT', desc: 'Authentication tokens' },
      { name: 'RBAC', desc: 'Role-based access control' },
      { name: 'Socket.IO', desc: 'Real-time communication' },
      { name: 'Zod', desc: 'Schema validation' },
    ],
  },
  {
    icon: Database, title: 'Database', color: 'accent',
    items: [
      { name: 'PostgreSQL', desc: 'Relational database' },
      { name: 'PostGIS', desc: 'Geospatial extension' },
      { name: 'Redis', desc: 'In-memory cache & queues' },
    ],
  },
  {
    icon: Brain, title: 'AI / ML', color: 'accent',
    items: [
      { name: 'Python', desc: 'ML runtime' },
      { name: 'FastAPI', desc: 'Python API framework' },
      { name: 'Pandas', desc: 'Data manipulation' },
      { name: 'NumPy', desc: 'Numerical computing' },
      { name: 'scikit-learn', desc: 'Classical ML' },
      { name: 'XGBoost', desc: 'Gradient-boosted trees' },
    ],
  },
  {
    icon: Route, title: 'Routing', color: 'primary',
    items: [
      { name: 'OSRM', desc: 'Open Source Routing Machine' },
    ],
  },
  {
    icon: Settings2, title: 'Optimization', color: 'accent',
    items: [
      { name: 'OR-Tools CP-SAT', desc: 'Constraint programming solver' },
    ],
  },
  {
    icon: Box, title: 'Infrastructure', color: 'primary',
    items: [
      { name: 'Docker', desc: 'Container runtime' },
      { name: 'Docker Compose', desc: 'Multi-container orchestration' },
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  primary: { bg: 'bg-primary-500/10', text: 'text-primary-400', border: 'border-primary-500/20' },
  accent: { bg: 'bg-accent-500/10', text: 'text-accent-400', border: 'border-accent-500/20' },
};

export default function Technology() {
  return (
    <div className="bg-ink-950">
      {/* Header */}
      <section className="py-16 lg:py-20 border-b border-surface-border relative overflow-hidden">
        <div className="absolute inset-0 animated-mesh-bg opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="info">Technology</Badge>
          <h1 className="mt-4 text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="gradient-text">Technology Stack</span>
          </h1>
          <p className="mt-4 text-xl text-ink-300 max-w-3xl">
            A modern, open-source stack spanning frontend, backend, database, AI, routing, optimization, and infrastructure.
          </p>
        </div>
      </section>

      {/* Stack Cards */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stacks.map((stack) => {
              const c = colorMap[stack.color];
              return (
                <Card key={stack.title} hover className={`p-6 ${c.border}`}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center`}>
                      <stack.icon className={`w-5 h-5 ${c.text}`} />
                    </div>
                    <h3 className="text-lg font-bold text-white">{stack.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {stack.items.map((item) => (
                      <li key={item.name} className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-ink-100">{item.name}</p>
                          <p className="text-xs text-ink-400">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="py-16 lg:py-20 border-y border-surface-border" style={{ background: 'linear-gradient(180deg, rgba(15,23,41,0.5) 0%, rgba(10,14,26,0.8) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="neutral">Architecture</Badge>
            <h2 className="mt-4 text-3xl font-bold text-white tracking-tight">System Architecture</h2>
            <p className="mt-3 text-ink-400">
              Three tiers — client, API services, and data/AI — connected by real-time channels.
            </p>
          </div>

          <Card className="p-8 lg:p-10">
            <div className="space-y-6">
              {/* Client Tier */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-5 h-5 text-primary-400" />
                  <h3 className="text-sm font-bold text-ink-200 uppercase tracking-wider">Client Tier</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {['Admin Dashboard', 'Driver App (Offline-First)', 'Public Site'].map((t) => (
                    <div key={t} className="p-3 rounded-lg bg-primary-500/10 border border-primary-500/20 text-center">
                      <p className="text-sm font-medium text-primary-300">{t}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-ink-600 rotate-90" />
              </div>

              {/* API Tier */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Server className="w-5 h-5 text-primary-400" />
                  <h3 className="text-sm font-bold text-ink-200 uppercase tracking-wider">API Tier</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Express REST', 'Socket.IO Realtime', 'FastAPI ML Service', 'OSRM Router'].map((t) => (
                    <div key={t} className="p-3 rounded-lg bg-surface border border-surface-border-bright text-center">
                      <p className="text-sm font-medium text-ink-200">{t}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-ink-600 rotate-90" />
              </div>

              {/* Data Tier */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <HardDrive className="w-5 h-5 text-accent-400" />
                  <h3 className="text-sm font-bold text-ink-200 uppercase tracking-wider">Data & AI Tier</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: 'PostgreSQL', icon: Database },
                    { name: 'PostGIS', icon: MapPin },
                    { name: 'Redis', icon: Zap },
                    { name: 'OR-Tools CP-SAT', icon: Cpu },
                  ].map((t) => (
                    <div key={t.name} className="p-3 rounded-lg bg-accent-500/10 border border-accent-500/20 text-center">
                      <t.icon className="w-5 h-5 text-accent-400 mx-auto mb-1" />
                      <p className="text-sm font-medium text-accent-300">{t.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 lg:p-12 border-0 relative overflow-hidden" glow>
            <div className="absolute inset-0 animated-mesh-bg opacity-60" />
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white">Explore the documentation</h2>
                <p className="mt-2 text-ink-400">Deep dive into data flow, ERD, deployment, and the optimization algorithm.</p>
              </div>
              <Link to="/documentation" className="btn-primary px-6 py-3">
                View Documentation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
