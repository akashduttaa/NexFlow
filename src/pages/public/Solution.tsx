import { Link } from 'react-router-dom';
import {
  BarChart3,
  Brain,
  Truck,
  Route,
  MapPin,
  GitMerge,
  Package,
  Radio,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowDown,
  Layers,
} from 'lucide-react';
import { Card, Badge } from '@/components/ui';

const pipeline = [
  { icon: BarChart3, title: 'Freight Demand', desc: 'Historical flow, market calendars, weather, and event data establish baseline demand per block.' },
  { icon: Brain, title: 'Prediction', desc: 'XGBoost models forecast freight pressure and curb congestion at block-level granularity.' },
  { icon: Truck, title: 'Vehicle Selection', desc: 'Match demand to available fleet — capacity, type, driver hours, proximity.' },
  { icon: Route, title: 'Route Candidate Generation', desc: 'OSRM generates multiple route candidates per vehicle, filtered by constraints.' },
  { icon: MapPin, title: 'Loading-Bay Candidate Generation', desc: 'Identify feasible bays near the destination, filtered by slot availability and vehicle type.' },
  { icon: GitMerge, title: 'Joint Optimization', desc: 'OR-Tools CP-SAT solves for vehicle + route + bay + time window simultaneously.' },
  { icon: Package, title: 'Vehicle + Route + Bay + Time Window', desc: 'The optimizer outputs a complete assignment: which truck, which road, which bay, when.' },
  { icon: Radio, title: 'Live Dispatch', desc: 'Assignments pushed to drivers via real-time Socket.IO with offline fallback.' },
  { icon: RefreshCw, title: 'Re-optimization', desc: 'Incidents trigger re-optimization of affected trips; drivers acknowledge changes.' },
];

const standardDetail = [
  { label: 'Route model', value: 'Point-to-point, fastest road' },
  { label: 'Curb visibility', value: 'None — bay occupancy unknown' },
  { label: 'Fleet awareness', value: 'Single vehicle, one journey' },
  { label: 'Time windows', value: 'Not modeled' },
  { label: 'Incident response', value: 'Manual re-dispatch' },
  { label: 'Bay allocation', value: 'First-come, first-served' },
];

const nexflowDetail = [
  { label: 'Route model', value: 'Joint route + curb allocation' },
  { label: 'Curb visibility', value: 'Live bay status + reserved slots' },
  { label: 'Fleet awareness', value: 'Multi-vehicle, capacity + hours' },
  { label: 'Time windows', value: 'Modeled as CP-SAT constraints' },
  { label: 'Incident response', value: 'Automatic re-optimization' },
  { label: 'Bay allocation', value: 'Conflict-free slot reservation' },
];

export default function Solution() {
  return (
    <div className="bg-ink-950">
      {/* Header */}
      <section className="py-16 lg:py-20 border-b border-surface-border relative overflow-hidden">
        <div className="absolute inset-0 animated-mesh-bg opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="info">Solution</Badge>
          <h1 className="mt-4 text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="gradient-text">The NexFlow Approach</span>
          </h1>
          <p className="mt-4 text-xl text-ink-300 max-w-3xl">
            A joint optimization pipeline that treats the road and the curb as a single problem — from freight demand prediction to live dispatch and re-optimization.
          </p>
        </div>
      </section>

      {/* Pipeline Diagram */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="neutral">Pipeline</Badge>
            <h2 className="mt-4 text-3xl font-bold text-white tracking-tight">Optimization Pipeline</h2>
            <p className="mt-3 text-ink-400">
              Nine stages from raw freight demand to live dispatch and continuous re-optimization.
            </p>
          </div>

          <div className="space-y-0">
            {pipeline.map((stage, idx) => (
              <div key={stage.title}>
                <div className="flex items-center gap-4 lg:gap-6">
                  {/* Number / Icon */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-glow" style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }}>
                      <stage.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  {/* Content */}
                  <Card className="flex-1 p-5 lg:p-6">
                    <div className="flex items-start gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-primary-400">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <h3 className="text-lg font-semibold text-white">{stage.title}</h3>
                        </div>
                        <p className="mt-1 text-sm text-ink-400 leading-relaxed">{stage.desc}</p>
                      </div>
                    </div>
                  </Card>
                </div>
                {idx < pipeline.length - 1 && (
                  <div className="flex justify-start pl-7 py-1">
                    <ArrowDown className="w-5 h-5 text-ink-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Detail */}
      <section className="py-16 lg:py-20 border-y border-surface-border" style={{ background: 'linear-gradient(180deg, rgba(15,23,41,0.5) 0%, rgba(10,14,26,0.8) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="neutral">Detailed Comparison</Badge>
            <h2 className="mt-4 text-3xl font-bold text-white tracking-tight">
              Standard Navigation vs NexFlow
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-ink-600/30 flex items-center justify-center">
                  <Route className="w-5 h-5 text-ink-400" />
                </div>
                <h3 className="text-xl font-bold text-ink-300">Standard Navigation</h3>
              </div>
              <div className="space-y-4">
                {standardDetail.map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4 pb-3 border-b border-surface-border last:border-0">
                    <span className="text-sm font-medium text-ink-400">{row.label}</span>
                    <span className="text-sm text-ink-300 text-right flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-ink-500 flex-shrink-0" />
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-8 glow-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }}>
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">NexFlow</h3>
                <Badge variant="info">Joint</Badge>
              </div>
              <div className="space-y-4">
                {nexflowDetail.map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4 pb-3 border-b border-surface-border last:border-0">
                    <span className="text-sm font-medium text-ink-400">{row.label}</span>
                    <span className="text-sm text-ink-100 font-medium text-right flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent-400 flex-shrink-0" />
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 lg:p-12 border-0 relative overflow-hidden" glow>
            <div className="absolute inset-0 animated-mesh-bg opacity-60" />
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white">See it in action</h2>
                <p className="mt-2 text-ink-400">Explore the live demo with simulated data for the Kolkata pilot.</p>
              </div>
              <Link to="/login" className="btn-primary px-6 py-3">
                Enter Command Center
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
