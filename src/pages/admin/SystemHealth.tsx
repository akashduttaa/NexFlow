import { useEffect, useState } from 'react';
import { HeartPulse, CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';
import { Card, StatusBadge, Badge } from '@/components/ui';
import { apiClient } from '@/services/api-client';
import type { ServiceHealth } from '@/types';

export default function SystemHealth() {
  const [services, setServices] = useState<ServiceHealth[]>([]);

  useEffect(() => {
    apiClient.getServiceHealth().then(setServices);
  }, []);

  const iconFor = (status: string) => {
    if (status === 'HEALTHY') return <CheckCircle className="w-5 h-5 text-success-400" />;
    if (status === 'DEGRADED') return <AlertCircle className="w-5 h-5 text-warning-400" />;
    if (status === 'OFFLINE') return <XCircle className="w-5 h-5 text-error-400" />;
    return <Clock className="w-5 h-5 text-primary-400" />;
  };

  const colorFor = (status: string) => {
    if (status === 'HEALTHY') return 'border-success-500/20 bg-success-500/10/50';
    if (status === 'DEGRADED') return 'border-warning-500/20 bg-warning-500/5';
    if (status === 'OFFLINE') return 'border-error-500/20 bg-error-500/10/50';
    return 'border-primary-500/20 bg-primary-500/10/50';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">System Health</h1>
          <p className="text-sm text-ink-400 mt-1">Service status and connectivity</p>
        </div>
        <Badge variant="success">LIVE SYSTEM HEALTH</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(svc => (
          <Card key={svc.name} className={`p-5 ${colorFor(svc.status)}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {iconFor(svc.status)}
                <div>
                  <p className="font-semibold text-white">{svc.name}</p>
                  <p className="text-xs text-ink-400 mt-0.5">{svc.detail}</p>
                </div>
              </div>
              <div className="text-right">
                <StatusBadge status={svc.status} />
                {svc.latencyMs !== null && <p className="text-xs text-ink-400 mt-1">{svc.latencyMs} ms</p>}
              </div>
            </div>
            <p className="text-xs text-ink-400 mt-3">Last checked: {new Date(svc.lastChecked).toLocaleString('en-IN')}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <HeartPulse className="w-5 h-5 text-primary-400" />
          <h2 className="section-title">Health Summary</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center"><p className="kpi-label">Healthy</p><p className="text-2xl font-bold text-success-400">{services.filter(s => s.status === 'HEALTHY').length}</p></div>
          <div className="text-center"><p className="kpi-label">Connector Ready</p><p className="text-2xl font-bold text-primary-400">{services.filter(s => s.status === 'CONNECTOR_READY').length}</p></div>
          <div className="text-center"><p className="kpi-label">Degraded</p><p className="text-2xl font-bold text-warning-400">{services.filter(s => s.status === 'DEGRADED').length}</p></div>
          <div className="text-center"><p className="kpi-label">Offline</p><p className="text-2xl font-bold text-error-400">{services.filter(s => s.status === 'OFFLINE').length}</p></div>
        </div>
      </Card>
    </div>
  );
}
