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
  Zap,
  Sparkles,
  Cpu,
  Monitor,
} from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import urbanTruckImg from '@/assets/images/urban_truck.jpg';
import controlCenterImg from '@/assets/images/control_center.jpg';
import indianFreightBg from '@/assets/images/indian_freight_bg.jpg';

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

/* Animated route SVG decoration */
function RouteDecoration() {
  return (
    <svg className="absolute right-0 top-0 w-1/2 h-full opacity-[0.06] pointer-events-none" viewBox="0 0 600 600" fill="none">
      <path d="M50 550 Q200 400 150 250 Q100 100 300 50 Q500 0 550 200 Q600 400 400 500 Q200 600 50 550Z" stroke="url(#routeGrad)" strokeWidth="2" strokeDasharray="8 6" className="animate-route-dash" />
      <circle cx="150" cy="250" r="6" fill="#06b6d4" opacity="0.5" />
      <circle cx="300" cy="50" r="6" fill="#06b6d4" opacity="0.5" />
      <circle cx="400" cy="500" r="6" fill="#f59e0b" opacity="0.5" />
      <defs>
        <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Landing() {
  return (
    <div className="bg-ink-950">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 animated-mesh-bg" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
        <RouteDecoration />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface/80 border border-surface-border-bright backdrop-blur-md mb-6">
                <Zap className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium text-ink-200">Urban Freight Intelligence Layer</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight">
                <span className="gradient-text">NexFlow</span>
              </h1>
              <p className="mt-3 text-xl lg:text-2xl text-ink-300 font-medium">
                Urban Freight Intelligence Layer
              </p>
              <p className="mt-5 text-lg text-ink-400 leading-relaxed max-w-2xl">
                Predict Freight Pressure. Allocate Curb Access. Reroute Fleets. Measure Outcomes.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-ink-500 font-medium">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span>Pilot Zone: Kolkata Burrabazar / Posta Trade District</span>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/login?role=admin" className="btn-primary px-6 py-3.5 text-sm sm:text-base font-semibold flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Admin Portal Login
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login?role=driver" className="px-6 py-3.5 rounded-lg text-sm sm:text-base font-semibold bg-accent-500/10 text-accent-300 hover:bg-accent-500/20 border border-accent-500/30 transition-all duration-300 flex items-center justify-center gap-2">
                  <Truck className="w-4 h-4 text-accent-400" />
                  Truck Driver Login
                </Link>
                <Link to="/solution" className="btn-secondary px-6 py-3.5 text-sm sm:text-base font-semibold text-center">
                  Explore Solution
                </Link>
              </div>
            </div>

            {/* Right Side: Hero Glassmorphism Showcase Card (Indian Freight Context) */}
            <div className="lg:col-span-5 animate-slide-up">
              <div className="relative group rounded-3xl p-3 transition-all duration-500 overflow-hidden bg-gradient-to-br from-white/15 via-white/5 to-transparent backdrop-blur-2xl border border-white/20 shadow-2xl">
                
                {/* Glow Backdrop */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/30 via-primary-500/20 to-amber-500/30 blur-3xl opacity-50 pointer-events-none group-hover:opacity-80 transition-opacity duration-700" />

                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-ink-900 border border-white/10 shadow-inner">
                  <img
                    src={indianFreightBg || '/images/indian_freight_bg.jpg'}
                    alt="NexFlow Kolkata Burrabazar Posta Commercial Freight Corridor"
                    className="w-full h-full object-cover object-center filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/indian_freight_bg.jpg';
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/40 to-transparent" />

                  {/* Live Stream Floating Glass Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink-950/85 backdrop-blur-xl border border-cyan-500/40 shadow-lg text-xs font-semibold text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <span>LIVE DIGITAL TWIN</span>
                  </div>

                  {/* Top Left Pilot Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-ink-950/85 backdrop-blur-xl border border-white/20 shadow-lg text-xs font-medium text-ink-200">
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Kolkata Freight Corridor</span>
                  </div>

                  {/* Bottom Info Glass Card Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-ink-950/90 backdrop-blur-2xl border border-white/20 shadow-xl text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        Burrabazar / Posta Hub
                      </h3>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                        PM Gati Shakti
                      </span>
                    </div>
                    <p className="text-xs text-ink-300 leading-relaxed">
                      Joint AI Optimization of Indian Urban Freight Corridors & Loading Bays with CP-SAT Solver.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WHY NOW */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl animate-slide-up">
            <Badge variant="info">Why Now</Badge>
            <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-white tracking-tight">
              The urban-freight problem is not just a routing problem.
            </h2>
            <div className="mt-6 space-y-4 text-lg text-ink-300 leading-relaxed">
              <p>
                A truck can have the fastest road route and still lose time because the loading bay is occupied.
              </p>
              <p className="text-ink-100 font-medium">
                NexFlow optimizes the road <span className="text-primary-400">+</span> the curb together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INFRASTRUCTURE & FLEET GLASSMORPHISM SHOWCASE SECTION */}
      <section className="py-20 border-y border-surface-border relative overflow-hidden bg-gradient-to-b from-ink-950 via-surface/30 to-ink-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge variant="success">Project Assets & Field Deployment</Badge>
            <h2 className="mt-4 text-3xl lg:text-5xl font-extrabold text-white tracking-tight">
              Visualizing NexFlow Infrastructure
            </h2>
            <p className="mt-4 text-lg text-ink-300">
              Combining real-time AI command center control with smart electric freight vehicle coordination in Indian trading districts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Card 1: Indian Freight Corridor */}
            <div className="relative group rounded-3xl p-4 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl border border-white/15 shadow-2xl transition-all duration-500 hover:border-cyan-500/40">
              <div className="absolute -inset-2 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent blur-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-ink-900 border border-white/10 mb-4">
                <img
                  src={indianFreightBg || '/images/indian_freight_bg.jpg'}
                  alt="Kolkata Burrabazar Freight Trade District"
                  className="w-full h-full object-cover filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/indian_freight_bg.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-transparent" />
                
                {/* Floating Glass Chips */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-ink-950/85 backdrop-blur-md border border-cyan-500/30 text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Kolkata Freight Hub</span>
                </div>
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-ink-950/85 backdrop-blur-md border border-white/20 text-xs font-mono text-ink-200">
                  Burrabazar / Posta
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-ink-300 px-3 py-2 rounded-xl bg-ink-950/85 backdrop-blur-md border border-white/10">
                  <span>Alignment: <strong className="text-cyan-300">PM Gati Shakti</strong></span>
                  <span>District: <strong className="text-emerald-400">Posta Market</strong></span>
                </div>
              </div>

              <div className="px-2">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-cyan-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Indian Freight Corridor</h3>
                </div>
                <p className="text-xs text-ink-300 leading-relaxed">
                  Field-proven urban freight optimization designed specifically for high-density Indian trading markets like Kolkata Posta & Burrabazar.
                </p>
                <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-xs text-ink-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    Live Market Grid
                  </span>
                  <Link to="/login?role=admin" className="text-cyan-400 font-semibold hover:underline inline-flex items-center gap-1">
                    Portal Login →
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: Electric Freight Truck */}
            <div className="relative group rounded-3xl p-4 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl border border-white/15 shadow-2xl transition-all duration-500 hover:border-amber-500/40">
              <div className="absolute -inset-2 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent blur-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-ink-900 border border-white/10 mb-4">
                <img
                  src={urbanTruckImg || '/images/urban_truck.jpg'}
                  alt="Smart Electric Freight Delivery Truck"
                  className="w-full h-full object-cover filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/urban_truck.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-transparent" />
                
                {/* Floating Glass Chips */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-ink-950/85 backdrop-blur-md border border-amber-500/30 text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Smart Freight Fleet</span>
                </div>
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-ink-950/85 backdrop-blur-md border border-white/20 text-xs font-mono text-ink-200">
                  WB-04-E-8821
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-ink-300 px-3 py-2 rounded-xl bg-ink-950/85 backdrop-blur-md border border-white/10">
                  <span>Driver App: <strong className="text-amber-300">Offline PWA</strong></span>
                  <span>Bay Slot: <strong className="text-emerald-400">Reserved (#B-04)</strong></span>
                </div>
              </div>

              <div className="px-2">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-amber-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Smart Electric Fleet</h3>
                </div>
                <p className="text-xs text-ink-300 leading-relaxed">
                  Optimal routing, automated loading bay reservations, and offline mobile app sync for commercial vehicles.
                </p>
                <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-xs text-ink-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    Offline Driver Cache
                  </span>
                  <Link to="/login?role=driver" className="text-amber-400 font-semibold hover:underline inline-flex items-center gap-1">
                    Driver App →
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3: Command Center */}
            <div className="relative group rounded-3xl p-4 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl border border-white/15 shadow-2xl transition-all duration-500 hover:border-cyan-500/40">
              <div className="absolute -inset-2 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent blur-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-ink-900 border border-white/10 mb-4">
                <img
                  src={controlCenterImg || '/images/control_center.jpg'}
                  alt="AI Command Center Digital Twin"
                  className="w-full h-full object-cover filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/control_center.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-transparent" />
                
                {/* Floating Glass Chips */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-ink-950/85 backdrop-blur-md border border-cyan-500/30 text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Control Twin</span>
                </div>
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-ink-950/85 backdrop-blur-md border border-white/20 text-xs font-mono text-ink-200">
                  ICCC Stream
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-ink-300 px-3 py-2 rounded-xl bg-ink-950/85 backdrop-blur-md border border-white/10">
                  <span>Forecast: <strong className="text-cyan-300">142 Bays</strong></span>
                  <span>Engine: <strong className="text-emerald-400">CP-SAT</strong></span>
                </div>
              </div>

              <div className="px-2">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                    <Radio className="w-4 h-4 text-cyan-300 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-white">AI Command Center</h3>
                </div>
                <p className="text-xs text-ink-300 leading-relaxed">
                  Real-time freight pressure prediction, heatmap analytics, automated bay reservations, and ICCC integration.
                </p>
                <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-xs text-ink-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    ICCC Integration
                  </span>
                  <Link to="/login?role=admin" className="text-cyan-400 font-semibold hover:underline inline-flex items-center gap-1">
                    Command Portal →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STANDARD VS NEXFLOW */}
      <section className="py-20 lg:py-24 border-y border-surface-border" style={{ background: 'linear-gradient(180deg, rgba(15,23,41,0.5) 0%, rgba(10,14,26,0.8) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="neutral">Comparison</Badge>
            <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Standard Navigation vs NexFlow
            </h2>
            <p className="mt-3 text-ink-400">
              Standard routing optimizes the road. NexFlow optimizes the road, the curb, and the fleet — jointly.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-ink-600/30 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-ink-400" />
                </div>
                <h3 className="text-xl font-bold text-ink-300">Standard Navigation</h3>
              </div>
              <ul className="space-y-3">
                {standardNav.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-ink-500 flex-shrink-0 mt-0.5" />
                    <span className="text-ink-400">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-8 glow-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }}>
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">NexFlow</h3>
                <Badge variant="info">Joint Optimization</Badge>
              </div>
              <ul className="space-y-3">
                {nexflowNav.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
                    <span className="text-ink-100 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section className="py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <Badge variant="info">Solutions</Badge>
            <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-white tracking-tight">
              One platform, six operational layers
            </h2>
            <p className="mt-3 text-ink-400 text-lg">
              Each capability is independently useful — together they close the loop from prediction to dispatch to measurement.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((s) => (
              <Card key={s.title} hover className="p-6 group">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-5 group-hover:bg-primary-500/20 transition-colors duration-300" style={{ boxShadow: '0 0 0 1px rgba(6,182,212,0.1)' }}>
                  <s.icon className="w-6 h-6 text-primary-400 group-hover:text-primary-300 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-ink-400 leading-relaxed">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* GOVERNMENT ALIGNMENT */}
      <section className="py-20 lg:py-24 border-y border-surface-border" style={{ background: 'linear-gradient(180deg, rgba(15,23,41,0.5) 0%, rgba(10,14,26,0.8) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <Badge variant="success">Government Alignment</Badge>
            <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Built to integrate, not to replace
            </h2>
            <p className="mt-3 text-ink-400 text-lg">
              NexFlow aligns with national logistics infrastructure and integrates with existing command centers.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {govAlignment.map((g) => (
              <Card key={g.name} hover className="p-6 group">
                <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mb-5 group-hover:bg-accent-500/20 transition-colors duration-300">
                  <g.icon className="w-6 h-6 text-accent-400 group-hover:text-accent-300 transition-colors" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{g.name}</h3>
                <p className="text-sm text-ink-400 leading-relaxed">{g.desc}</p>
              </Card>
            ))}
          </div>
          <div className="mt-8 p-4 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-ink-200">
              <span className="font-semibold">Integration with existing ICCC infrastructure</span> — NexFlow augments the Integrated Command and Control Center; it does not replace ICCC.
            </p>
          </div>
        </div>
      </section>

      {/* BUSINESS MODEL PREVIEW */}
      <section className="py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <Badge variant="warning">Indicative Business Model</Badge>
            <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Three tiers, one platform
            </h2>
            <p className="mt-3 text-ink-400 text-lg">
              A tiered model serving municipal authorities, fleet operators, and curb users.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-primary-400" />
                <span className="text-sm font-semibold text-primary-400">B2G</span>
              </div>
              <h3 className="text-xl font-bold text-white">City Zone Pro</h3>
              <p className="mt-2 text-3xl font-bold text-white">₹5–15 L<span className="text-base font-medium text-ink-400"> / year / zone</span></p>
              <p className="mt-3 text-sm text-ink-400">Municipal dashboard, freight forecasts, curb controls, and ICCC integration.</p>
            </Card>
            <Card className="p-8 glow-border">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-primary-400" />
                <span className="text-sm font-semibold text-primary-400">B2B</span>
              </div>
              <h3 className="text-xl font-bold text-white">Fleet Pro</h3>
              <p className="mt-2 text-3xl font-bold text-white">₹150–300<span className="text-base font-medium text-ink-400"> / vehicle / month</span></p>
              <p className="mt-3 text-sm text-ink-400">Dynamic routing, ETA protection, fleet analytics, and curb allocation.</p>
            </Card>
            <Card className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <CalendarClock className="w-5 h-5 text-primary-400" />
                <span className="text-sm font-semibold text-primary-400">Curb Access</span>
              </div>
              <h3 className="text-xl font-bold text-white">Per Slot</h3>
              <p className="mt-2 text-3xl font-bold text-white">₹10–20<span className="text-base font-medium text-ink-400"> / peak slot</span></p>
              <p className="mt-3 text-sm text-ink-400">Loading slot booking, reservation management, and transaction records.</p>
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
      <section className="py-24 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 animated-mesh-bg" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Ready to see the command center?
          </h2>
          <p className="mt-4 text-lg text-ink-400 max-w-2xl mx-auto">
            Explore the live demo with simulated data for the Kolkata Burrabazar pilot zone.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="btn-primary px-8 py-3.5 text-base font-semibold">
              Enter Command Center
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/documentation" className="btn-secondary px-8 py-3.5 text-base font-semibold">
              Read Documentation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

