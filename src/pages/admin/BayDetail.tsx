import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Activity } from 'lucide-react';
import { Card, StatusBadge, Badge, LoadingState } from '@/components/ui';
import { FreightMap } from '@/components/FreightMap';
import { apiClient } from '@/services/api-client';
import type { Bay, BaySlot } from '@/types';

export default function BayDetail() {
  const { id } = useParams<{ id: string }>();
  const [bay, setBay] = useState<Bay | null>(null);
  const [slots, setSlots] = useState<BaySlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([apiClient.getBay(id), apiClient.getBaySlots()]).then(([b, s]) => {
      setBay(b);
      setSlots(s.filter(slot => slot.bayId === id));
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingState />;
  if (!bay) return <Card className="p-8 text-center text-ink-400">Bay not found.</Card>;

  return (
    <div className="space-y-6">
      <Link to="/dashboard/bays" className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700">
        <ArrowLeft className="w-4 h-4" /> Back to Loading Bays
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center">
            <MapPin className="w-6 h-6 text-accent-600" />
          </div>
          <div>
            <h1 className="page-title">{bay.bayId}</h1>
            <p className="text-sm text-ink-500">{bay.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={bay.state} />
          <Badge variant="demo">SIMULATED</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 space-y-4">
          <h2 className="section-title">Bay Information</h2>
          <div className="space-y-3 text-sm">
            <Row icon={<MapPin className="w-4 h-4" />} label="Location" value={`${bay.location.lat.toFixed(4)}, ${bay.location.lon.toFixed(4)}`} />
            <Row icon={<MapPin className="w-4 h-4" />} label="Zone" value={bay.zone} />
            <Row icon={<Activity className="w-4 h-4" />} label="Compatibility" value={bay.compatibility.join(', ')} />
            <Row icon={<Clock className="w-4 h-4" />} label="Service Duration" value={`${bay.serviceDurationMin} min`} />
            <Row icon={<Activity className="w-4 h-4" />} label="Utilization" value={`${bay.utilizationPct}%`} />
            <Row icon={<Activity className="w-4 h-4" />} label="Current Slot" value={bay.currentSlotId ?? 'None'} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink-700 mb-2">Utilization</h3>
            <div className="w-full h-3 bg-ink-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${bay.utilizationPct > 80 ? 'bg-error-500' : bay.utilizationPct > 60 ? 'bg-warning-500' : 'bg-accent-500'}`} style={{ width: `${bay.utilizationPct}%` }} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="section-title mb-3">Bay Location</h2>
          <FreightMap bays={[bay]} height="350px" />
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="section-title mb-3">Reservation Slots</h2>
        {slots.length === 0 ? (
          <p className="text-sm text-ink-400">No reservations for this bay.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-200">
                  <th className="table-header">Slot</th>
                  <th className="table-header">Delivery</th>
                  <th className="table-header">Vehicle</th>
                  <th className="table-header">Time</th>
                  <th className="table-header">Expected Arrival</th>
                  <th className="table-header">Status</th>
                </tr>
              </thead>
              <tbody>
                {slots.map(s => (
                  <tr key={s.id} className="border-b border-ink-100">
                    <td className="table-cell font-medium">{s.slotId}</td>
                    <td className="table-cell">{s.deliveryId ?? '—'}</td>
                    <td className="table-cell">{s.vehicleId ?? '—'}</td>
                    <td className="table-cell text-xs">{s.startTime}–{s.endTime}</td>
                    <td className="table-cell text-xs">{s.expectedArrival}</td>
                    <td className="table-cell"><StatusBadge status={s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
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
