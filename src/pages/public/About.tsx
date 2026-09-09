import { Link } from 'react-router-dom';
import {
  Users,
  Trophy,
  FileText,
  MapPin,
  Truck,
  Target,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import indianFreightBg from '@/assets/images/indian_freight_bg.jpg';

export default function About() {
  return (
    <div className="bg-ink-950">
      {/* Header */}
      <section className="py-16 lg:py-20 border-b border-surface-border relative overflow-hidden">
        <div className="absolute inset-0 animated-mesh-bg opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="info">About</Badge>
          <h1 className="mt-4 text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="gradient-text">Team NexGen</span>
          </h1>
          <p className="mt-4 text-xl text-ink-300 max-w-3xl">
            Building NexFlow for Smart India Hackathon 2026 — a joint route-and-curb optimization platform for urban freight.
          </p>
        </div>
      </section>

      {/* SIH Details */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="p-6">
              <Trophy className="w-8 h-8 text-primary-400 mb-3" />
              <p className="text-xs font-bold text-ink-500 uppercase tracking-[0.15em]">Event</p>
              <p className="mt-1 text-lg font-bold text-white">SIH 2026</p>
              <p className="text-sm text-ink-400 mt-1">Smart India Hackathon</p>
            </Card>
            <Card className="p-6">
              <FileText className="w-8 h-8 text-primary-400 mb-3" />
              <p className="text-xs font-bold text-ink-500 uppercase tracking-[0.15em]">Problem Statement</p>
              <p className="mt-1 text-lg font-bold text-white">SIH26205</p>
              <p className="text-sm text-ink-400 mt-1">Problem ID</p>
            </Card>
            <Card className="p-6">
              <Truck className="w-8 h-8 text-primary-400 mb-3" />
              <p className="text-xs font-bold text-ink-500 uppercase tracking-[0.15em]">Theme</p>
              <p className="mt-1 text-lg font-bold text-white">Transportation</p>
              <p className="text-sm text-ink-400 mt-1">& Logistics</p>
            </Card>
            <Card className="p-6">
              <MapPin className="w-8 h-8 text-primary-400 mb-3" />
              <p className="text-xs font-bold text-ink-500 uppercase tracking-[0.15em]">Pilot Zone</p>
              <p className="mt-1 text-lg font-bold text-white">Kolkata</p>
              <p className="text-sm text-ink-400 mt-1">Burrabazar / Posta</p>
            </Card>
          </div>

          {/* Indian Freight Context Pilot Showcase Card */}
          <div className="mb-12 relative group rounded-3xl p-4 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl border border-white/20 shadow-2xl overflow-hidden">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-primary-500/20 to-blue-600/20 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none" />
            
            <div className="grid md:grid-cols-12 gap-6 items-center relative z-10">
              <div className="md:col-span-6 rounded-2xl overflow-hidden aspect-[16/9] bg-ink-900 border border-white/15 shadow-inner">
                <img
                  src={indianFreightBg || '/images/indian_freight_bg.jpg'}
                  alt="Kolkata Burrabazar Posta Commercial Freight District"
                  className="w-full h-full object-cover filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/indian_freight_bg.jpg';
                  }}
                />
              </div>

              <div className="md:col-span-6 space-y-3 p-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Pilot Context • Kolkata Commercial Freight Corridor</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  Kolkata Burrabazar & Posta Trade District
                </h3>
                <p className="text-xs lg:text-sm text-ink-300 leading-relaxed">
                  One of Eastern India's largest and most congested commercial freight hubs. NexFlow combines joint route-and-curb optimization with PM Gati Shakti alignment to resolve peak loading bay bottlenecks.
                </p>
                <div className="pt-2 flex items-center gap-4 text-xs font-mono text-ink-400 border-t border-white/10">
                  <span>Alignment: <strong className="text-emerald-400">PM Gati Shakti</strong></span>
                  <span>ULIP: <strong className="text-cyan-300">Adapter Active</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Problem Statement */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-bold text-white">The Problem</h2>
              </div>
              <div className="space-y-4 text-ink-300 leading-relaxed">
                <p>
                  Urban freight movement in dense commercial districts like Kolkata's Burrabazar suffers from a fundamental mismatch: routing software optimizes the road, but the bottleneck is often at the curb — the loading bay.
                </p>
                <p>
                  A truck with the fastest road route can still lose 30–60 minutes waiting for an occupied loading bay to free up. This idle time compounds across fleets, producing congestion, emissions, and missed delivery windows.
                </p>
                <p>
                  Standard navigation treats the journey as a point-to-point road problem. NexFlow treats it as a joint optimization: the road <span className="font-semibold text-ink-100">and</span> the curb, the vehicle <span className="font-semibold text-ink-100">and</span> the bay, the route <span className="font-semibold text-ink-100">and</span> the time window.
                </p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-accent-400" />
                <h2 className="text-2xl font-bold text-white">Our Approach</h2>
              </div>
              <div className="space-y-4 text-ink-300 leading-relaxed">
                <p>
                  NexFlow is an urban freight intelligence layer that predicts freight pressure at the block level, allocates curb access through reserved loading-bay slots, and re-routes fleets in response to live incidents.
                </p>
                <p>
                  The platform integrates with existing ICCC infrastructure — it does not replace it. It aligns with PM GatiShakti, the National Logistics Policy, and the ULIP platform for inter-system data exchange.
                </p>
                <p>
                  The pilot zone is the Burrabazar / Posta trade district in Kolkata — one of India's largest wholesale markets, where freight pressure and curb conflict are daily, acute problems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-20 border-y border-surface-border" style={{ background: 'linear-gradient(180deg, rgba(15,23,41,0.5) 0%, rgba(10,14,26,0.8) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="info">Team</Badge>
            <h2 className="mt-4 text-3xl font-bold text-white tracking-tight">Team NexGen</h2>
            <p className="mt-3 text-ink-400">
              A multidisciplinary team working across full-stack engineering, AI/ML, optimization, and transportation policy.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { role: 'Full-Stack Engineering', desc: 'React, Node.js, PostgreSQL, real-time systems' },
              { role: 'AI / ML', desc: 'Demand prediction, XGBoost, feature engineering' },
              { role: 'Optimization', desc: 'OR-Tools CP-SAT, joint route + bay allocation' },
              { role: 'Domain & Integration', desc: 'Transportation policy, ICCC, ULIP adapter' },
            ].map((m) => (
              <Card key={m.role} hover className="p-6 text-center group">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(59,130,246,0.15))' }}>
                  <Users className="w-8 h-8 text-primary-400 group-hover:text-primary-300 transition-colors" />
                </div>
                <h3 className="text-base font-semibold text-white">{m.role}</h3>
                <p className="mt-2 text-sm text-ink-400">{m.desc}</p>
              </Card>
            ))}
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
                <h2 className="text-2xl lg:text-3xl font-bold text-white">Explore the solution</h2>
                <p className="mt-2 text-ink-400">See how NexFlow's joint optimization pipeline works in detail.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/solution" className="btn-primary px-6 py-3">
                  View Solution
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className="btn-secondary px-6 py-3">
                  Enter Demo
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
