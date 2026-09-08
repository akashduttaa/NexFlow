import { useEffect, useState } from 'react';
import { Brain, TrendingUp, Clock, AlertTriangle, Activity } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { apiClient } from '@/services/api-client';
import type { Prediction } from '@/types';

export default function Predictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    apiClient.getPredictions().then(setPredictions);
  }, []);

  const iconFor = (type: Prediction['type']) => {
    if (type === 'DEMAND') return <TrendingUp className="w-5 h-5" />;
    if (type === 'TRAFFIC_RISK') return <AlertTriangle className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  const colorFor = (type: Prediction['type']) => {
    if (type === 'DEMAND') return 'text-primary-600 bg-primary-100';
    if (type === 'TRAFFIC_RISK') return 'text-warning-600 bg-warning-100';
    return 'text-accent-600 bg-accent-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">AI Predictions</h1>
          <p className="text-sm text-ink-500 mt-1">Freight demand, traffic risk, and ETA forecasting</p>
        </div>
        <Badge variant="demo">DEMO / SIMULATED</Badge>
      </div>

      {/* Model Status */}
      <Card className="p-5 border-primary-200 bg-primary-50/50">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-primary-600" />
          <div>
            <p className="text-sm font-semibold text-ink-900">MODEL STATUS: CONNECTOR READY</p>
            <p className="text-xs text-primary-600">Inference service not connected. XGBoost model deployment pending.</p>
          </div>
        </div>
      </Card>

      {/* Model Health */}
      <Card className="p-5">
        <h2 className="section-title mb-4">Model Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-ink-50 border border-ink-200">
            <p className="kpi-label">Model</p>
            <p className="text-sm font-semibold text-ink-900">XGBoost</p>
          </div>
          <div className="p-3 rounded-lg bg-ink-50 border border-ink-200">
            <p className="kpi-label">Version</p>
            <p className="text-sm font-semibold text-ink-900">0.1.0-dev</p>
          </div>
          <div className="p-3 rounded-lg bg-ink-50 border border-ink-200">
            <p className="kpi-label">Status</p>
            <p className="text-sm font-semibold text-primary-600">CONNECTOR READY</p>
          </div>
          <div className="p-3 rounded-lg bg-ink-50 border border-ink-200">
            <p className="kpi-label">Last Updated</p>
            <p className="text-sm font-semibold text-ink-900">{new Date().toLocaleDateString('en-IN')}</p>
          </div>
        </div>
      </Card>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {predictions.map(p => (
          <Card key={p.id} hover className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorFor(p.type)}`}>
                {iconFor(p.type)}
              </div>
              <Badge variant="demo">DEMO / SIMULATED</Badge>
            </div>
            <h3 className="font-semibold text-ink-900">{p.type.replace(/_/g, ' ')}</h3>
            <p className="text-3xl font-bold text-ink-900 mt-2">{p.value} <span className="text-base font-normal text-ink-500">{p.unit}</span></p>
            <div className="mt-4 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-ink-500">Zone</span><span className="text-ink-800">{p.zone}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Horizon</span><span className="text-ink-800">{p.horizonMin} min</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Confidence</span><span className="text-ink-800">{(p.confidence * 100).toFixed(0)}%</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Model</span><span className="text-ink-800">{p.model} v{p.version}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Timestamp</span><span className="text-ink-800 text-xs">{new Date(p.timestamp).toLocaleString('en-IN')}</span></div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-ink-500">Confidence</span>
                <span className="text-ink-700">{(p.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-ink-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full" style={{ width: `${p.confidence * 100}%` }} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Info */}
      <Card className="p-4 bg-ink-50 border-ink-200">
        <div className="flex items-start gap-2">
          <Activity className="w-4 h-4 text-ink-500 mt-0.5 shrink-0" />
          <p className="text-xs text-ink-500">
            Prediction values shown above are deterministic demo fixtures. Actual XGBoost inference will be connected via the FastAI service connector.
            Do not treat these values as real model outputs.
          </p>
        </div>
      </Card>
    </div>
  );
}
