import { useEffect, useState } from 'react';
import { Navigation, Clock, MapPin, Package, CheckCircle, Truck } from 'lucide-react';
import { Card, StatusBadge } from '@/components/ui';
import { apiClient } from '@/services/api-client';
import type { Vehicle, Delivery, Bay, RoutePlan } from '@/types';

export default function DriverTrip() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [bay, setBay] = useState<Bay | null>(null);
  const [route, setRoute] = useState<RoutePlan | null>(null);
  const [step, setStep] = useState<string>('EN_ROUTE');

  useEffect(() => {
    apiClient.getVehicles().then(vs => {
      const v = vs[0];
      setVehicle(v);
      if (v.assignedDeliveryId) apiClient.getDelivery(v.assignedDeliveryId).then(setDelivery);
      if (v.assignedBayId) apiClient.getBay(v.assignedBayId).then(setBay);
    });
    apiClient.getRoutes().then(rs => setRoute(rs.find(r => r.status === 'ACTIVE') ?? null));
  }, []);

  const steps = ['START_TRIP', 'EN_ROUTE', 'ARRIVED', 'AT_BAY', 'SERVICING', 'DELIVERY_COMPLETE'];
  const currentIdx = steps.indexOf(step);

  const advance = () => {
    if (currentIdx < steps.length - 1) setStep(steps[currentIdx + 1]);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-ink-900">Trip Details</h1>

      {delivery ? (
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-600" />
              <span className="font-semibold text-ink-900">Delivery {delivery.id}</span>
            </div>
            <StatusBadge status={delivery.status} />
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-ink-400 mt-0.5" /><div><p className="text-ink-500 text-xs">Pickup</p><p className="text-ink-800">{delivery.pickup}</p></div></div>
            <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-ink-400 mt-0.5" /><div><p className="text-ink-500 text-xs">Destination</p><p className="text-ink-800">{delivery.destination}</p></div></div>
            <div className="flex items-start gap-2"><Clock className="w-4 h-4 text-ink-400 mt-0.5" /><div><p className="text-ink-500 text-xs">Delivery Window</p><p className="text-ink-800">{delivery.windowStart}–{delivery.windowEnd}</p></div></div>
            <div className="flex items-start gap-2"><Navigation className="w-4 h-4 text-ink-400 mt-0.5" /><div><p className="text-ink-500 text-xs">ETA</p><p className="text-ink-800">{delivery.eta ?? '—'}</p></div></div>
          </div>

          {bay && (
            <div className="p-3 rounded-lg bg-accent-50 border border-accent-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-accent-700">Loading Bay {bay.bayId}</span>
                <StatusBadge status={bay.state} />
              </div>
              <p className="text-xs text-ink-600 mt-1">{bay.name} — Service: {bay.serviceDurationMin} min</p>
            </div>
          )}

          {route && (
            <div className="p-3 rounded-lg bg-ink-50 border border-ink-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink-700">Route {route.routeId}</span>
                <span className="text-xs text-ink-500">Version v{route.routeVersion}</span>
              </div>
            </div>
          )}

          {/* Trip Progress */}
          <div className="flex items-center gap-1">
            {steps.map((s, i) => (
              <div key={s} className="flex-1">
                <div className={`h-2 rounded-full ${i <= currentIdx ? 'bg-primary-600' : 'bg-ink-200'}`} />
                <p className={`text-[10px] mt-1 text-center ${i <= currentIdx ? 'text-primary-600 font-medium' : 'text-ink-400'}`}>{s.replace(/_/g, ' ')}</p>
              </div>
            ))}
          </div>

          <button onClick={advance} className="btn-primary w-full">
            {currentIdx < steps.length - 1 ? `Advance to: ${steps[currentIdx + 1].replace(/_/g, ' ')}` : 'Trip Complete'}
          </button>
        </Card>
      ) : (
        <Card className="p-8 text-center text-ink-400">No active trip assigned.</Card>
      )}
    </div>
  );
}
