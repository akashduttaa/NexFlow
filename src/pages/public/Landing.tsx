import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Truck,
  MapPin,
  GitBranch,
  Layers,
  AlertTriangle,
  ShieldCheck,
  Gauge,
  Building2,
  Network,
  Database,
  CheckCircle2,
  XCircle,
  Radio,
  CalendarClock,
} from 'lucide-react';
import { Card, Badge } from '@/components/ui';

const solutions = [
  { icon: Gauge, title: 'Freight Pressure Prediction', desc: 'Forecast block-level freight demand and curb congestion before it peaks, using historical flow, market calendars, and weather.' },
  { icon: Truck, title: 'Route Optimization', desc: 'Joint routing that accounts for vehicle type, load, time windows, and live road conditions — not just the fastest path.' },
  { icon: MapPin, title: 'Loading-Bay Allocation', desc: 'Reserve and assign curb-side loading bays with conflict-free slots, so a truck never arrives to an occupied bay.' },
  { icon: GitBranch, title: 'Fleet Coordination', desc: 'Balance assignments across a fleet — capacity, driver hours, and proximity — to minimize empty miles and idle time.' },
  { icon: AlertTriangle, title: 'Incident Re-routing', desc: 'Detect road and bay incidents in real time and re-optimize affected trips automatically, with driver acknowledgment.' },
  { icon: ShieldCheck, title: 'Driver Resilience', desc: 'Offline-first driver app with cached routes, queued confirmations, and sync-on-reconnect for low-connectivity zones.' },
];

const standardNav = [
  'Point-to-point routing',
  'Fastest road route only',
  'One journey at a time',
  'No curb visibility',
  'No time-window awareness',
];

const nexflowNav = [
  'Joint route + curb allocation',
  'Fleet-aware assignment',
  'Bay-aware arrival planning',
  'Time-window aware scheduling',
  'Incident-aware re-optimization',
];

const govAlignment = [
  { icon: Network, name: 'PM Gati Shakti', desc: 'National Master Plan for multi-modal connectivity and infrastructure gap closure.' },
  { icon: Building2, name: 'National Logistics Policy', desc: 'Data-driven logistics efficiency, reduced freight cost, and unified digital platforms.' },
  { icon: Database, name: 'ULIP-aligned', desc: 'Unified Logistics Interface Platform adapter for inter-system data exchange.' },
  { icon: Radio, name: 'ICCC Integration', desc: 'Integration with existing ICCC infrastructure — not a replacement.' },
];

export default function Landing() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink-900 via-ink-900 to-primary-950">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(37,99,235,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16,185,129,0.15) 0%, transparent 40%)' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
              <Activity className="w-4 h-4 text-primary-300" />
              <span className="text-sm font-medium text-white/90">Urban Freight Intelligence Layer</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white tracking-tight">
              NexFlow
            </h1>
            <p className="mt-4 text-xl lg:text-2xl text-ink-300 font-medium">
              Urban Freight Intelligence Layer
            </p>
            <p className="mt-6 text-lg text-ink-400 leading-relaxed max-w-2xl">
              Predict Freight Pressure. Allocate Curb Access. Reroute Fleets. Measure Outcomes.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-ink-400">
              <MapPin className="w-4 h-4 text-primary-400" />
              <span>Pilot: Kolkata Burrabazar / Posta Trade District</span>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/login" className="btn-primary px-6 py-3 text-base">
                Enter Command Center
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/solution" className="btn px-6 py-3 text-base bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm">
                Explore Solution
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHY NOW */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="info">Why Now</Badge>
            <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-ink-900 tracking-tight">
              The urban-freight problem is not just a routing problem.
            </h2>
            <div className="mt-6 space-y-4 text-lg text-ink-600 leading-relaxed">
              <p>
                A truck can have the fastest road route and still lose time because the loading bay is occupied.
              </p>
              <p className="text-ink-700 font-medium">
                NexFlow optimizes the road <span className="text-primary-600">+</span> the curb together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STANDARD VS NEXFLOW */}
      <section className="py-16 lg:py-20 bg-ink-50 border-y border-ink-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="neutral">Comparison</Badge>
            <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-ink-900 tracking-tight">
              Standard Navigation vs NexFlow
            </h2>
            <p className="mt-3 text-ink-500">
              Standard routing optimizes the road. NexFlow optimizes the road, the curb, and the fleet — jointly.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-ink-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-ink-500" />
                </div>
                <h3 className="text-xl font-bold text-ink-700">Standard Navigation</h3>
              </div>
              <ul className="space-y-3">
                {standardNav.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-ink-400 flex-shrink-0 mt-0.5" />
                    <span className="text-ink-600">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-8 border-primary-300 ring-1 ring-primary-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-ink-900">NexFlow</h3>
                <Badge variant="info">Joint Optimization</Badge>
              </div>
              <ul className="space-y-3">
                {nexflowNav.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
                    <span className="text-ink-800 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <Badge variant="info">Solutions</Badge>
            <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-ink-900 tracking-tight">
              One platform, six operational layers
            </h2>
            <p className="mt-3 text-ink-500 text-lg">
              Each capability is independently useful — together they close the loop from prediction to dispatch to measurement.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((s) => (
              <Card key={s.title} hover className="p-6">
                <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                  <s.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-ink-900 mb-2">{s.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* GOVERNMENT ALIGNMENT */}
      <section className="py-16 lg:py-20 bg-ink-50 border-y border-ink-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <Badge variant="success">Government Alignment</Badge>
            <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-ink-900 tracking-tight">
              Built to integrate, not to replace
            </h2>
            <p className="mt-3 text-ink-500 text-lg">
              NexFlow aligns with national logistics infrastructure and integrates with existing command centers.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {govAlignment.map((g) => (
              <Card key={g.name} hover className="p-6">
                <div className="w-11 h-11 rounded-lg bg-accent-50 flex items-center justify-center mb-4">
                  <g.icon className="w-6 h-6 text-accent-600" />
                </div>
                <h3 className="text-base font-semibold text-ink-900 mb-2">{g.name}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{g.desc}</p>
              </Card>
            ))}
          </div>
          <div className="mt-8 p-4 rounded-lg bg-primary-50 border border-primary-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-ink-700">
              <span className="font-semibold">Integration with existing ICCC infrastructure</span> — NexFlow augments the Integrated Command and Control Center; it does not replace ICCC.
            </p>
          </div>
        </div>
      </section>

      {/* BUSINESS MODEL PREVIEW */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <Badge variant="warning">Indicative Business Model</Badge>
            <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-ink-900 tracking-tight">
              Three tiers, one platform
            </h2>
            <p className="mt-3 text-ink-500 text-lg">
              A tiered model serving municipal authorities, fleet operators, and curb users.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-semibold text-primary-700">B2G</span>
              </div>
              <h3 className="text-xl font-bold text-ink-900">City Zone Pro</h3>
              <p className="mt-2 text-3xl font-bold text-ink-900">₹5–15 L<span className="text-base font-medium text-ink-500"> / year / zone</span></p>
              <p className="mt-3 text-sm text-ink-500">Municipal dashboard, freight forecasts, curb controls, and ICCC integration.</p>
            </Card>
            <Card className="p-8 border-primary-300 ring-1 ring-primary-200">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-semibold text-primary-700">B2B</span>
              </div>
              <h3 className="text-xl font-bold text-ink-900">Fleet Pro</h3>
              <p className="mt-2 text-3xl font-bold text-ink-900">₹150–300<span className="text-base font-medium text-ink-500"> / vehicle / month</span></p>
              <p className="mt-3 text-sm text-ink-500">Dynamic routing, ETA protection, fleet analytics, and curb allocation.</p>
            </Card>
            <Card className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <CalendarClock className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-semibold text-primary-700">Curb Access</span>
              </div>
              <h3 className="text-xl font-bold text-ink-900">Per Slot</h3>
              <p className="mt-2 text-3xl font-bold text-ink-900">₹10–20<span className="text-base font-medium text-ink-500"> / peak slot</span></p>
              <p className="mt-3 text-sm text-ink-500">Loading slot booking, reservation management, and transaction records.</p>
            </Card>
          </div>
          <div className="mt-8 text-center">
            <Link to="/business" className="btn-secondary px-6 py-3">
              View full business model
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-ink-900 to-primary-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Ready to see the command center?
          </h2>
          <p className="mt-4 text-lg text-ink-400 max-w-2xl mx-auto">
            Explore the live demo with simulated data for the Kolkata Burrabazar pilot zone.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login" className="btn-primary px-6 py-3 text-base">
              Enter Command Center
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/documentation" className="btn px-6 py-3 text-base bg-white/10 text-white border border-white/20 hover:bg-white/20">
              Read Documentation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
