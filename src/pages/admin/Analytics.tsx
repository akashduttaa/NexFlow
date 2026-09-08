import { useEffect, useState } from 'react';
import { BarChart3, TrendingDown, TrendingUp, Clock, MapPin, Truck, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, Badge } from '@/components/ui';

const baselineData = [
  { metric: 'Idle Time (min)', baseline: 42, nexflow: 34, target: -18 },
  { metric: 'Bay Turnover/hr', baseline: 1.8, nexflow: 2.25, target: 25 },
  { metric: 'Distance/Order (km)', baseline: 6.2, nexflow: 5.58, target: -10 },
  { metric: 'Late Orders (%)', baseline: 22, nexflow: 18.7, target: -15 },
];

const trendData = Array.from({ length: 12 }, (_, i) => ({
  hour: `${9 + i}:00`,
  baseline: 40 - i * 0.5 + Math.sin(i) * 5,
  nexflow: 32 - i * 0.4 + Math.sin(i) * 3,
}));

export default function Analytics() {
  const [tab, setTab] = useState<'metrics' | 'comparison'>('comparison');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="text-sm text-ink-500 mt-1">Operational metrics and baseline comparison</p>
        </div>
        <Badge variant="demo">DEMO DATA — TARGET HYPOTHESES</Badge>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab('comparison')} className={`btn ${tab === 'comparison' ? 'bg-primary-600 text-white' : 'bg-white text-ink-600 border border-ink-300'}`}>
          <Target className="w-4 h-4" /> Baseline vs NexFlow
        </button>
        <button onClick={() => setTab('metrics')} className={`btn ${tab === 'metrics' ? 'bg-primary-600 text-white' : 'bg-white text-ink-600 border border-ink-300'}`}>
          <BarChart3 className="w-4 h-4" /> Operational Metrics
        </button>
      </div>

      {tab === 'comparison' && (
        <>
          {/* Target Hypotheses */}
          <Card className="p-5 border-warning-300 bg-warning-50/50">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-warning-600" />
              <h2 className="section-title">TARGET HYPOTHESIS</h2>
            </div>
            <p className="text-xs text-ink-500 mb-4">Targets are hypotheses to be validated using matched baseline-vs-NexFlow replay runs. Not measured results.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-white border border-ink-200">
                <div className="flex items-center gap-1 text-success-600"><TrendingDown className="w-4 h-4" /><span className="text-sm font-semibold">-18%</span></div>
                <p className="text-xs text-ink-500 mt-1">Last-mile idle time</p>
              </div>
              <div className="p-3 rounded-lg bg-white border border-ink-200">
                <div className="flex items-center gap-1 text-success-600"><TrendingUp className="w-4 h-4" /><span className="text-sm font-semibold">+25%</span></div>
                <p className="text-xs text-ink-500 mt-1">Loading-bay turnover</p>
              </div>
              <div className="p-3 rounded-lg bg-white border border-ink-200">
                <div className="flex items-center gap-1 text-success-600"><TrendingDown className="w-4 h-4" /><span className="text-sm font-semibold">-10%</span></div>
                <p className="text-xs text-ink-500 mt-1">Distance per order</p>
              </div>
              <div className="p-3 rounded-lg bg-white border border-ink-200">
                <div className="flex items-center gap-1 text-success-600"><TrendingDown className="w-4 h-4" /><span className="text-sm font-semibold">-15%</span></div>
                <p className="text-xs text-ink-500 mt-1">Late orders</p>
              </div>
            </div>
          </Card>

          {/* Comparison Chart */}
          <Card className="p-5">
            <h2 className="section-title mb-4">Baseline vs NexFlow — Target Comparison</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={baselineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="baseline" fill="#94a3b8" name="Baseline" radius={[4, 4, 0, 0]} />
                <Bar dataKey="nexflow" fill="#3b82f6" name="NexFlow (Target)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Comparison Table */}
          <Card className="overflow-hidden">
            <h2 className="section-title p-4 border-b border-ink-200">Detailed Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ink-200 bg-ink-50">
                    <th className="table-header">Metric</th>
                    <th className="table-header">Baseline</th>
                    <th className="table-header">NexFlow (Target)</th>
                    <th className="table-header">Difference</th>
                    <th className="table-header">Target</th>
                  </tr>
                </thead>
                <tbody>
                  {baselineData.map(d => {
                    const diff = d.nexflow - d.baseline;
                    const pct = ((diff / d.baseline) * 100).toFixed(1);
                    const isImprovement = d.target < 0 ? diff < 0 : diff > 0;
                    return (
                      <tr key={d.metric} className="border-b border-ink-100">
                        <td className="table-cell font-medium">{d.metric}</td>
                        <td className="table-cell">{d.baseline}</td>
                        <td className="table-cell text-primary-600 font-medium">{d.nexflow}</td>
                        <td className={`table-cell ${isImprovement ? 'text-success-600' : 'text-error-600'}`}>
                          {diff > 0 ? '+' : ''}{diff.toFixed(2)} ({pct}%)
                        </td>
                        <td className="table-cell"><Badge variant="warning">{d.target > 0 ? `+${d.target}%` : `${d.target}%`}</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-4 bg-ink-50 border-ink-200">
            <p className="text-xs text-ink-500">
              Note: Targets are hypotheses to be validated using matched baseline-vs-NexFlow replay runs. These are not measured results.
            </p>
          </Card>
        </>
      )}

      {tab === 'metrics' && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4"><p className="kpi-label">Last-mile Idle</p><p className="kpi-value">34 min</p><p className="text-xs text-success-600">-18% target</p></Card>
            <Card className="p-4"><p className="kpi-label">Bay Turnover</p><p className="kpi-value">2.25/hr</p><p className="text-xs text-success-600">+25% target</p></Card>
            <Card className="p-4"><p className="kpi-label">Distance/Order</p><p className="kpi-value">5.58 km</p><p className="text-xs text-success-600">-10% target</p></Card>
            <Card className="p-4"><p className="kpi-label">Late Orders</p><p className="kpi-value">18.7%</p><p className="text-xs text-success-600">-15% target</p></Card>
          </div>

          {/* Trend Chart */}
          <Card className="p-5">
            <h2 className="section-title mb-4">Idle Time Trend — Baseline vs NexFlow (Target)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="baseline" stroke="#94a3b8" strokeWidth={2} dot={false} name="Baseline" />
                <Line type="monotone" dataKey="nexflow" stroke="#3b82f6" strokeWidth={2} dot={false} name="NexFlow (Target)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3"><Clock className="w-5 h-5 text-primary-600" /><h3 className="section-title">Average ETA</h3></div>
              <p className="text-3xl font-bold text-ink-900">14 min</p>
              <p className="text-xs text-ink-500 mt-1">Across 12 active routes</p>
            </Card>
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3"><MapPin className="w-5 h-5 text-accent-600" /><h3 className="section-title">Bay Utilization</h3></div>
              <p className="text-3xl font-bold text-ink-900">57%</p>
              <p className="text-xs text-ink-500 mt-1">Across 10 loading bays</p>
            </Card>
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3"><Truck className="w-5 h-5 text-warning-600" /><h3 className="section-title">Vehicle Utilization</h3></div>
              <p className="text-3xl font-bold text-ink-900">68%</p>
              <p className="text-xs text-ink-500 mt-1">Across 20 vehicles</p>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
