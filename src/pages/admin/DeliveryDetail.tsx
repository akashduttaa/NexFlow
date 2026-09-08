import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, Clock, Truck, Weight } from 'lucide-react';
import { Card, StatusBadge, Badge, LoadingState } from '@/components/ui';
import { FreightMap } from '@/components/FreightMap';
import { apiClient } from '@/services/api-client';
import type { Delivery, Vehicle, Bay } from '@/types';

export default function DeliveryDetail() {
  const { id } = useParams<{ id: string }>();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [bay, setBay] = useState<Bay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([apiClient.getDelivery(id), apiClient.getVehicles(), apiClient.getBays()]).then(([d, vs, bs]) => {
      setDelivery(d);
      if (d?.assignedVehicleId) setVehicle(vs.find(v => v.id === d.assignedVehicleId) ?? null);
      if (d?.assignedBayId) setBay(bs.find(b => b.id === d.assignedBayId) ?? null);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingState />;
  if (!delivery) return <Card className="p-8 text-center text-ink-400">Delivery not found.</Card>;

  return (
    <div className="space-y-6">
      <Link to="/dashboard/deliveries" className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700">
        <ArrowLeft className="w-4 h-4" /> Back to Deliveries
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
            <Package className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="page-title">Delivery {delivery.id}</h1>
            <p className="text-sm text-ink-500">{delivery.destination}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={delivery.status} />
          <StatusBadge status={delivery.priority} />
          <Badge variant="demo">SIMULATED</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 space-y-4">
          <h2 className="section-title">Delivery Details</h2>
          <div className="space-y-3 text-sm">
            <Row icon={<MapPin className="w-4 h-4" />} label="Pickup" value={delivery.pickup} />
            <Row icon={<MapPin className="w-4 h-4" />} label="Destination" value={delivery.destination} />
            <Row icon={<MapPin className="w-4 h-4" />} label="Zone" value={delivery.zone} />
            <Row icon={<Weight className="w-4 h-4" />} label="Weight" value={`${delivery.weightKg} kg`} />
            <Row icon={<Clock className="w-4 h-4" />} label="Window" value={`${delivery.windowStart}–${delivery.windowEnd}`} />
            <Row icon={<Clock className="w-4 h-4" />} label="Service Duration" value={`${delivery.serviceDurationMin} min`} />
            <Row icon={<Truck className="w-4 h-4" />} label="Vehicle" value={delivery.assignedVehicleId ?? 'Unassigned'} />
            <Row icon={<MapPin className="w-4 h-4" />} label="Bay" value={delivery.assignedBayId ?? 'Unassigned'} />
            <Row icon={<Clock className="w-4 h-4" />} label="ETA" value={delivery.eta ?? '—'} />
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="section-title mb-3">Route Map</h2>
          <FreightMap
            vehicles={vehicle ? [vehicle] : []}
            bays={bay ? [bay] : []}
            height="350px"
          />
        </Card>
      </div>

      {vehicle && (
        <Card className="p-4">
          <h2 className="section-title mb-3">Assigned Vehicle</h2>
          <Link to={`/dashboard/fleet/${vehicle.id}`} className="flex items-center gap-3 p-3 rounded-lg bg-primary-50 border border-primary-200 hover:bg-primary-100 transition-colors">
            <Truck className="w-5 h-5 text-primary-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-primary-700">{vehicle.vehicleNo}</p>
              <p className="text-xs text-ink-500">{vehicle.driverName} — {vehicle.type}</p>
            </div>
            <StatusBadge status={vehicle.status} />
          </Link>
        </Card>
      )}
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-ink-500">{icon} {label}</span>
      <span className="text-ink-800 font-medium">{value}</span>
    </div>
  );
}
