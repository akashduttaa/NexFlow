import { useEffect, useState } from 'react';
import { Database, Map, Bus, CloudRain, Truck, Navigation, Activity } from 'lucide-react';
import { Card, StatusBadge, ProvenanceBadge, LoadingState } from '@/components/ui';
import { apiClient } from '@/services/api-client';
import type { DataSource } from '@/types';

const iconFor = (name: string) => {
  if (name.includes('OpenStreetMap')) return <Map className="w-5 h-5" />;
  if (name.includes('GTFS') || name.includes('Transit')) return <Bus className="w-5 h-5" />;
  if (name.includes('Weather') || name.includes('Meteo')) return <CloudRain className="w-5 h-5" />;
  if (name.includes('Operator')) return <Truck className="w-5 h-5" />;
  if (name.includes('TomTom')) return <Navigation className="w-5 h-5" />;
  if (name.includes('Simulated')) return <Activity className="w-5 h-5" />;
  return <Database className="w-5 h-5" />;
};

export default function DataSources() {
  const [sources, setSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getDataSources().then(s => {
      setSources(s);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Data Sources</h1>
        <p className="text-sm text-ink-500 mt-1">Provenance and freshness of all data sources</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map(src => (
          <Card key={src.id} hover className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-ink-100 flex items-center justify-center text-ink-600">
                  {iconFor(src.name)}
                </div>
                <div>
                  <p className="font-semibold text-ink-900">{src.name}</p>
                  <ProvenanceBadge type={src.type} />
                </div>
              </div>
              <StatusBadge status={src.status} />
            </div>
            <p className="text-sm text-ink-600 mb-3">{src.description}</p>
            <div className="flex items-center justify-between text-xs text-ink-500">
              <span>Last refresh: {src.lastRefresh === '—' ? '—' : new Date(src.lastRefresh).toLocaleString('en-IN')}</span>
              <span>Freshness: {src.freshness}</span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-ink-50 border-ink-200">
        <div className="flex items-start gap-2">
          <Database className="w-4 h-4 text-ink-500 mt-0.5 shrink-0" />
          <p className="text-xs text-ink-500">
            NexFlow never hides data provenance. Simulated data is clearly labelled. Live external sources require API keys and authorization.
          </p>
        </div>
      </Card>
    </div>
  );
}
