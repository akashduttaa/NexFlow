import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Truck, User, MapPin, Clock, Activity, Package } from 'lucide-react';
import { Card, StatusBadge, Badge, LoadingState } from '@/components/ui';
import { FreightMap } from '@/components/FreightMap';
import { apiClient } from '@/services/api-client';
import type { Vehicle, RoutePlan, Delivery, Bay } from '@/types';

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [route, setRoute] = useState<RoutePlan | null>(null);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [bay, setBay] = useState<Bay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      apiClient.getVehicle(id),
      apiClient.getRoutes(),
      apiClient.getDeliveries(),
      apiClient.getBays(),
    ]).then(([v, routes, deliveries, bays]) => {
      setVehicle(v);
      const r = routes.find(rt => rt.vehicleId === id);
      setRoute(r ?? null);
      if (v?.assignedDeliveryId) setDelivery(deliveries.find(d => d.id === v.assignedDeliveryId) ?? null);
      if (v?.assignedBayId) setBay(bays.find(b => b.id === v.assignedBayId) ?? null);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingState />;
  if (!vehicle) return <Card className="p-8 text-center text-ink-400">Vehicle not found.</Card>;

  return (
    <div className="space-y-6">
      <Link to="/dashboard/fleet" className="flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300">
        <ArrowLeft className="w-4 h-4" /> Back to Fleet
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary-500/15 flex items-center justify-center">
            <Truck className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <h1 className="page-title">{vehicle.vehicleNo}</h1>
            <p className="text-sm text-ink-400">{vehicle.type} — {vehicle.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={vehicle.status} />
          <StatusBadge status={vehicle.connectionStatus} />
          <Badge variant="demo">SIMULATED</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle Info */}
        <Card className="p-5 space-y-4">
          <h2 className="section-title">Vehicle Information</h2>
          <div className="space-y-3 text-sm">
            <InfoRow icon={<Truck className="w-4 h-4" />} label="Type" value={vehicle.type} />
            <InfoRow icon={<Package className="w-4 h-4" />} label="Capacity" value={`${vehicle.capacityKg} kg`} />
            <InfoRow icon={<Package className="w-4 h-4" />} label="Current Load" value={`${vehicle.currentLoadKg} kg`} />
            <InfoRow icon={<User className="w-4 h-4" />} label="Driver" value={vehicle.driverName ?? 'Unassigned'} />
            <InfoRow icon={<Activity className="w-4 h-4" />} label="Route Version" value={`v${vehicle.routeVersion}`} />
            <InfoRow icon={<Clock className="w-4 h-4" />} label="ETA" value={vehicle.eta ?? '—'} />
            <InfoRow icon={<Clock className="w-4 h-4" />} label="Last Heartbeat" value={new Date(vehicle.lastHeartbeat).toLocaleString('en-IN')} />
          </div>
        </Card>

        {/* Assigned Delivery & Bay */}
        <Card className="p-5 space-y-4">
          <h2 className="section-title">Assignments</h2>
          <div className="space-y-3">
            {delivery ? (
              <Link to={`/dashboard/deliveries/${delivery.id}`} className="block p-3 rounded-lg bg-primary-500/10 border border-primary-500/20 hover:bg-primary-500/15 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-primary-400" />
                  <span className="text-sm font-medium text-primary-300">Delivery {delivery.id}</span>
                </div>
                <p className="text-xs text-ink-300">{delivery.destination}</p>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={delivery.status} />
                  <span className="text-xs text-ink-400">{delivery.priority}</span>
                </div>
              </Link>
            ) : <p className="text-sm text-ink-400">No delivery assigned</p>}

            {bay ? (
              <Link to={`/dashboard/bays/${bay.id}`} className="block p-3 rounded-lg bg-accent-500/10 border border-accent-500/20 hover:bg-accent-100 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-accent-400" />
                  <span className="text-sm font-medium text-accent-300">Bay {bay.bayId}</span>
                </div>
                <p className="text-xs text-ink-300">{bay.name}</p>
                <StatusBadge status={bay.state} />
              </Link>
            ) : <p className="text-sm text-ink-400">No bay assigned</p>}

            {route && (
              <div className="p-3 rounded-lg bg-surface border border-surface-border">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-ink-300" />
                  <span className="text-sm font-medium text-ink-200">Route {route.routeId}</span>
                </div>
                <p className="text-xs text-ink-400">Version: v{route.routeVersion} — Duration: {route.estimatedDurationMin} min</p>
                <StatusBadge status={route.status} />
              </div>
            )}
          </div>
        </Card>

        {/* Map */}
        <Card className="p-4">
          <h2 className="section-title mb-3">Location</h2>
          <FreightMap vehicles={[vehicle]} bays={bay ? [bay] : []} routes={route ? [route] : []} highlightedRouteId={route?.id ?? null} height="350px" />
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-ink-400">
        {icon} {label}
      </span>
      <span className="text-ink-100 font-medium">{value}</span>
    </div>
  );
}
