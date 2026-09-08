import { Link } from 'react-router-dom';
import {
  Building2,
  Truck,
  CalendarClock,
  CheckCircle2,
  ArrowRight,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { Card, Badge } from '@/components/ui';

const tiers = [
  {
    icon: Building2,
    label: 'B2G',
    name: 'City Zone Pro',
    price: '₹5–15 L',
    unit: '/ year / zone',
    desc: 'For municipal authorities managing freight pressure and curb access across a city zone.',
    features: [
      'Municipal command dashboard',
      'Block-level freight forecasts',
      'Curb access controls & reservations',
      'Zone-level analytics & reporting',
      'ICCC infrastructure integration',
    ],
    highlight: false,
  },
  {
    icon: Truck,
    label: 'B2B',
    name: 'Fleet Pro',
    price: '₹150–300',
    unit: '/ active vehicle / month',
    desc: 'For fleet operators running dynamic routing and ETA-protected deliveries.',
    features: [
      'Dynamic route optimization',
      'ETA protection with time windows',
      'Fleet analytics & utilization',
      'Vehicle assignment & coordination',
      'Curb allocation & bay booking',
    ],
    highlight: true,
  },
  {
    icon: CalendarClock,
    label: 'Curb Access',
    name: 'Curb Access',
    price: '₹10–20',
    unit: '/ peak reserved slot',
    desc: 'For individual operators booking loading slots on demand.',
    features: [
      'Loading slot booking',
      'Reservation management',
      'Transaction records & history',
    ],
    highlight: false,
  },
];

export default function Business() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-ink-50 to-primary-50 border-b border-ink-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="warning">Indicative Business Model</Badge>
          <h1 className="mt-4 text-4xl lg:text-5xl font-bold text-ink-900 tracking-tight">
            Business Model
          </h1>
          <p className="mt-4 text-xl text-ink-600 max-w-3xl">
            A tiered model serving municipal authorities, fleet operators, and curb users. Pricing is indicative and subject to deployment scope.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning-50 border border-warning-200">
              <Info className="w-4 h-4 text-warning-600" />
              <span className="text-sm font-semibold text-warning-800">INDICATIVE BUSINESS MODEL</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={`p-8 relative ${tier.highlight ? 'border-primary-400 ring-2 ring-primary-300 lg:scale-105' : ''}`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="info">Most Comprehensive</Badge>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center">
                    <tier.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider">{tier.label}</p>
                    <h3 className="text-lg font-bold text-ink-900">{tier.name}</h3>
                  </div>
                </div>
                <p className="text-sm text-ink-500 mb-5 min-h-[40px]">{tier.desc}</p>
                <div className="mb-6 pb-6 border-b border-ink-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-ink-900">{tier.price}</span>
                    <span className="text-sm font-medium text-ink-500">{tier.unit}</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-ink-700">{f}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          {/* Enterprise Note */}
          <div className="mt-10 p-6 rounded-xl bg-ink-50 border border-ink-200">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-ink-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-ink-800">Enterprise Organization Model</p>
                <p className="mt-1 text-sm text-ink-500 leading-relaxed">
                  Pricing is indicative and does not imply signed customers. NexFlow follows an enterprise organization model — deployments are scoped per city zone, fleet, or operator, with integration and support tailored to each. Contact the team for deployment-specific pricing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-ink-50 border-t border-ink-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-8 lg:p-12 rounded-xl bg-gradient-to-br from-ink-900 to-primary-950">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white">See the platform in action</h2>
              <p className="mt-2 text-ink-400">Explore the live demo with simulated data for the Kolkata pilot zone.</p>
            </div>
            <Link to="/login" className="btn-primary px-6 py-3">
              Enter Command Center
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
