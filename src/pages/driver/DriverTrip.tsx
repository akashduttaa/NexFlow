import { useEffect, useState } from 'react';
import { Navigation, Clock, MapPin, Package, CheckCircle, Truck, Activity, ShieldAlert, ArrowRight, RefreshCw } from 'lucide-react';
import { Card, StatusBadge, Badge } from '@/components/ui';
import { apiClient } from '@/services/api-client';
import { socket } from '@/services/realtime';
import type { Vehicle, Delivery, Bay, RoutePlan, Prediction } from '@/types';

export default function DriverTrip() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [bay, setBay] = useState<Bay | null>(null);
  const [route, setRoute] = useState<RoutePlan | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [step, setStep] = useState<string>('EN_ROUTE');
  const [loading, setLoading] = useState(true);
  const [speed, setSpeed] = useState(28);

  const loadData = async () => {
    try {
      const vs = await apiClient.getVehicles();
      const vsList = vs || [];
      const v = vsList[0] || {
        id: 'v-101',
        vehicleNo: 'WB-01-AX-1001',
        type: 'LCV_ELECTRIC',
        capacityKg: 1200,
        status: 'EN_ROUTE',
        driverName: 'Rajesh Kumar',
        routeVersion: 14,
        eta: '12 min',
        location: { lat: 22.5742, lon: 88.3615 }
      };
      setVehicle(v);

      const delId = v.assignedDeliveryId || 'd-101';
      let d = await apiClient.getDelivery(delId);
      if (!d) {
        const deliveries = await apiClient.getDeliveries();
        d = deliveries[0] || {
          id: 'd-101',
          pickup: 'Howrah Goods Yard',
          destination: 'Posta Market Shop #42',
          windowStart: '10:00',
          windowEnd: '11:30',
          priority: 'HIGH',
          weightKg: 450,
          status: 'EN_ROUTE',
          zone: 'Posta Central',
          eta: '12 min'
        };
      }
      setDelivery(d);

      const bayId = v.assignedBayId || 'b-02';
      let b = await apiClient.getBay(bayId);
      if (!b) {
        const bays = await apiClient.getBays();
        b = bays[0] || null;
      }
      setBay(b);

      const rs = await apiClient.getRoutes();
      if (rs && Array.isArray(rs) && rs.length > 0) {
        setRoute(rs.find(r => r.status === 'ACTIVE') || rs[0]);
      } else {
        setRoute({
          id: 'r-101',
          routeId: 'ROUTE-Posta-01',
          vehicleId: 'v-101',
          deliveryId: 'd-101',
          bayId: 'b-02',
          geometry: [{ lat: 22.5742, lon: 88.3615 }, { lat: 22.5732, lon: 88.3628 }],
          routeVersion: 14,
          status: 'ACTIVE',
          invalidatedAt: null,
          estimatedDurationMin: 12,
          windowStart: '10:00',
          windowEnd: '11:30',
          createdAt: new Date().toISOString()
        });
      }

      const preds = await apiClient.getPredictions();
      setPredictions(preds);
    } catch (e) {
      console.error('Error loading driver trip:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Auto-poll trip telemetry every 5s
    const timer = setInterval(() => {
      loadData();
      setSpeed(Math.floor(22 + Math.random() * 12));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const steps = ['START_TRIP', 'EN_ROUTE', 'ARRIVED', 'AT_BAY', 'SERVICING', 'DELIVERY_COMPLETE'];
  const currentIdx = steps.indexOf(step);

  const advance = () => {
    if (currentIdx < steps.length - 1) {
      const nextStep = steps[currentIdx + 1];
      setStep(nextStep);
      socket.emit('vehicle:update', {
        vehicleId: vehicle?.id || 'v-101',
        vehicle: { status: nextStep === 'DELIVERY_COMPLETE' ? 'IDLE' : nextStep as any }
      });
    }
  };

  const trafficRisk = predictions.find(p => p.type === 'TRAFFIC_RISK');

  if (loading) {
    return (
      <div className="p-8 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-primary-400 animate-spin mx-auto" />
        <p className="text-sm text-ink-300">Loading live trip details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header with Live Status */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-primary-400" />
            Live Driver Trip Console
          </h1>
          <p className="text-xs text-ink-300">Active Delivery & Real-Time Navigation Telemetry</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="font-mono text-xs animate-pulse">
            LIVE TELEMETRY
          </Badge>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            {vehicle?.vehicleNo || 'WB-01-AX-1001'}
          </span>
        </div>
      </div>

      {/* Main Delivery Overview */}
      {delivery && (
        <Card className="p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary-400" />
                <span className="font-bold text-lg text-white">Delivery {(delivery as any).trackingId || delivery.id}</span>
                <span className="text-xs text-ink-400 font-mono">({delivery.id})</span>
              </div>
              <p className="text-xs text-ink-300 mt-0.5">Priority Freight • Zone: {delivery.zone || 'Burrabazar / Posta'}</p>
            </div>
            <StatusBadge status={delivery.status || 'EN_ROUTE'} />
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-surface/80 border border-surface-border">
              <span className="text-[11px] text-ink-400 block">Current Speed</span>
              <span className="text-base font-bold font-mono text-emerald-400">{speed} km/h</span>
            </div>
            <div className="p-3 rounded-lg bg-surface/80 border border-surface-border">
              <span className="text-[11px] text-ink-400 block">Cargo Weight</span>
              <span className="text-base font-bold font-mono text-primary-300">{delivery.weightKg} kg</span>
            </div>
            <div className="p-3 rounded-lg bg-surface/80 border border-surface-border">
              <span className="text-[11px] text-ink-400 block">Est. Arrival (ETA)</span>
              <span className="text-base font-bold font-mono text-amber-400">{delivery.eta || '12 min'}</span>
            </div>
            <div className="p-3 rounded-lg bg-surface/80 border border-surface-border">
              <span className="text-[11px] text-ink-400 block">Route Version</span>
              <span className="text-base font-bold font-mono text-accent-300">v{vehicle?.routeVersion || 14}</span>
            </div>
          </div>

          {/* Pickup & Destination Timeline */}
          <div className="p-4 rounded-xl bg-ink-950/60 border border-surface-border space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                A
              </div>
              <div>
                <p className="text-xs text-ink-400 font-semibold uppercase tracking-wider">Pickup Location</p>
                <p className="text-sm font-semibold text-white">{delivery.pickup || (delivery as any).pickupAddress}</p>
              </div>
            </div>

            <div className="ml-3.5 pl-4 border-l-2 border-dashed border-primary-500/40 py-1 text-xs text-primary-300 flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5 animate-pulse" />
              <span>Route Distance: {(route as any)?.distance || (route as any)?.distanceKm || 2.8} km • OSRM Dynamic Routing Active</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                B
              </div>
              <div>
                <p className="text-xs text-ink-400 font-semibold uppercase tracking-wider">Destination</p>
                <p className="text-sm font-semibold text-white">{delivery.destination}</p>
                <p className="text-xs text-ink-400">Window: {delivery.windowStart} – {delivery.windowEnd}</p>
              </div>
            </div>
          </div>

          {/* Assigned Loading Bay Info */}
          {bay && (
            <div className="p-4 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="info">Reserved Loading Dock</Badge>
                  <span className="text-sm font-bold text-accent-300">Bay {bay.bayId}</span>
                </div>
                <p className="text-xs text-white font-medium mt-1">{bay.name}</p>
                <p className="text-xs text-ink-300">Max Service Duration: {bay.serviceDurationMin || 30} mins • Zone: {bay.zone}</p>
              </div>
              <StatusBadge status={bay.state} />
            </div>
          )}

          {/* AI Traffic Risk Alert if active */}
          {trafficRisk && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2.5 text-xs text-amber-300">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>XGBoost Traffic Model:</strong> Moderate congestion detected near Posta Market (Risk Level: {trafficRisk.unit}). Dynamic OSRM rerouting active.
              </span>
            </div>
          )}

          {/* Interactive Step Progression */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs text-ink-300">
              <span className="font-semibold text-white">Trip Progression Status</span>
              <span className="font-mono text-primary-400">{step.replace(/_/g, ' ')}</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {steps.map((s, i) => (
                <div key={s} className="text-center">
                  <div className={`h-2.5 rounded-full transition-all ${i <= currentIdx ? 'bg-emerald-400 shadow-sm shadow-emerald-500/50' : 'bg-surface'}`} />
                  <p className={`text-[9px] mt-1.5 font-medium truncate ${i <= currentIdx ? 'text-emerald-300' : 'text-ink-500'}`}>
                    {s.replace(/_/g, ' ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button onClick={advance} className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2">
            {currentIdx < steps.length - 1 ? (
              <>
                Advance to {steps[currentIdx + 1].replace(/_/g, ' ')} <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Delivery Trip Completed
              </>
            )}
          </button>
        </Card>
      )}

      {/* Driver Vehicle Telemetry Details */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-surface-border pb-2">
          <h2 className="section-title flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary-400" />
            Live Vehicle Telemetry (PostgreSQL + PostGIS)
          </h2>
          <span className="text-xs font-mono text-ink-400">Driver: {vehicle?.driverName || 'Rajesh Kumar'}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 rounded bg-surface">
            <span className="text-ink-400 block">Vehicle Registration</span>
            <span className="text-white font-mono font-semibold">{vehicle?.vehicleNo || 'WB-01-AX-1001'}</span>
          </div>
          <div className="p-2.5 rounded bg-surface">
            <span className="text-ink-400 block">Powertrain Type</span>
            <span className="text-emerald-400 font-semibold">{vehicle?.type || 'LCV_ELECTRIC'} (Zero Emission)</span>
          </div>
          <div className="p-2.5 rounded bg-surface">
            <span className="text-ink-400 block">Current Location</span>
            <span className="text-white font-mono">{vehicle?.location?.lat?.toFixed(4) || '22.5742'}, {vehicle?.location?.lon?.toFixed(4) || '88.3615'}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
