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
  Github,
  Mail,
} from 'lucide-react';
import { Card, Badge } from '@/components/ui';

export default function About() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-ink-50 to-primary-50 border-b border-ink-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="info">About</Badge>
          <h1 className="mt-4 text-4xl lg:text-5xl font-bold text-ink-900 tracking-tight">
            Team NexGen
          </h1>
          <p className="mt-4 text-xl text-ink-600 max-w-3xl">
            Building NexFlow for Smart India Hackathon 2026 — a joint route-and-curb optimization platform for urban freight.
          </p>
        </div>
      </section>

      {/* SIH Details */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="p-6">
              <Trophy className="w-8 h-8 text-primary-600 mb-3" />
              <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Event</p>
              <p className="mt-1 text-lg font-bold text-ink-900">SIH 2026</p>
              <p className="text-sm text-ink-500 mt-1">Smart India Hackathon</p>
            </Card>
            <Card className="p-6">
              <FileText className="w-8 h-8 text-primary-600 mb-3" />
              <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Problem Statement</p>
              <p className="mt-1 text-lg font-bold text-ink-900">SIH26205</p>
              <p className="text-sm text-ink-500 mt-1">Problem ID</p>
            </Card>
            <Card className="p-6">
              <Truck className="w-8 h-8 text-primary-600 mb-3" />
              <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Theme</p>
              <p className="mt-1 text-lg font-bold text-ink-900">Transportation</p>
              <p className="text-sm text-ink-500 mt-1">& Logistics</p>
            </Card>
            <Card className="p-6">
              <MapPin className="w-8 h-8 text-primary-600 mb-3" />
              <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Pilot Zone</p>
              <p className="mt-1 text-lg font-bold text-ink-900">Kolkata</p>
              <p className="text-sm text-ink-500 mt-1">Burrabazar / Posta</p>
            </Card>
          </div>

          {/* Problem Statement */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-bold text-ink-900">The Problem</h2>
              </div>
              <div className="space-y-4 text-ink-600 leading-relaxed">
                <p>
                  Urban freight movement in dense commercial districts like Kolkata's Burrabazar suffers from a fundamental mismatch: routing software optimizes the road, but the bottleneck is often at the curb — the loading bay.
                </p>
                <p>
                  A truck with the fastest road route can still lose 30–60 minutes waiting for an occupied loading bay to free up. This idle time compounds across fleets, producing congestion, emissions, and missed delivery windows.
                </p>
                <p>
                  Standard navigation treats the journey as a point-to-point road problem. NexFlow treats it as a joint optimization: the road <span className="font-semibold text-ink-800">and</span> the curb, the vehicle <span className="font-semibold text-ink-800">and</span> the bay, the route <span className="font-semibold text-ink-800">and</span> the time window.
                </p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-accent-600" />
                <h2 className="text-2xl font-bold text-ink-900">Our Approach</h2>
              </div>
              <div className="space-y-4 text-ink-600 leading-relaxed">
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
      <section className="py-16 lg:py-20 bg-ink-50 border-y border-ink-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="info">Team</Badge>
            <h2 className="mt-4 text-3xl font-bold text-ink-900 tracking-tight">Team NexGen</h2>
            <p className="mt-3 text-ink-500">
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
              <Card key={m.role} className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-base font-semibold text-ink-900">{m.role}</h3>
                <p className="mt-2 text-sm text-ink-500">{m.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 lg:p-12 bg-gradient-to-br from-ink-900 to-primary-950 border-0">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white">Explore the solution</h2>
                <p className="mt-2 text-ink-400">See how NexFlow's joint optimization pipeline works in detail.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/solution" className="btn-primary px-6 py-3">
                  View Solution
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className="btn px-6 py-3 bg-white/10 text-white border border-white/20 hover:bg-white/20">
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
