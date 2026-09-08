import { useEffect, useState } from 'react';
import { MapPin, Clock, Activity, CheckCircle } from 'lucide-react';
import { Card, StatusBadge } from '@/components/ui';
import { FreightMap } from '@/components/FreightMap';
import { apiClient } from '@/services/api-client';
import { getCachedBay, getCachedBaySlot } from '@/services/offline-cache';
import type { Bay, BaySlot } from '@/types';

export default function DriverBay() {
  const [bay, setBay] = useState<Bay | null>(null);
  const [slot, setSlot] = useState<BaySlot | null>(null);
  const [cachedBay, setCachedBay] = useState<Awaited<ReturnType<typeof getCachedBay>> | null>(null);
  const [cachedSlot, setCachedSlot] = useState<Awaited<ReturnType<typeof getCachedBaySlot>> | null>(null);

  useEffect(() => {
    apiClient.getVehicles().then(vs => {
      if (vs[0]?.assignedBayId) {
        apiClient.getBay(vs[0].assignedBayId).then(setBay);
      }
    });
    apiClient.getBaySlots().then(slots => {
      setSlot(slots.find(s => s.vehicleId === 'veh-001') ?? null);
    });
    getCachedBay().then(setCachedBay);
    getCachedBaySlot().then(setCachedSlot);
  }, []);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-ink-900">Loading Bay</h1>

      {bay ? (
        <>
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent-600" />
                <span className="font-semibold text-ink-900">Bay {bay.bayId}</span>
              </div>
              <StatusBadge status={bay.state} />
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between"><span className="text-ink-500">Name</span><span className="text-ink-800">{bay.name}</span></div>
              <div className="flex items-center justify-between"><span className="text-ink-500">Zone</span><span className="text-ink-800">{bay.zone}</span></div>
              <div className="flex items-center justify-between"><span className="text-ink-500">Service Duration</span><span className="text-ink-800">{bay.serviceDurationMin} min</span></div>
              <div className="flex items-center justify-between"><span className="text-ink-500">Compatibility</span><span className="text-ink-800 text-xs">{bay.compatibility.join(', ')}</span></div>
            </div>
          </Card>

          {slot && (
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-primary-600" />
                <h3 className="section-title">Reservation Slot</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between"><span className="text-ink-500">Slot ID</span><span className="text-ink-800 font-medium">{slot.slotId}</span></div>
                <div className="flex items-center justify-between"><span className="text-ink-500">Time</span><span className="text-ink-800">{slot.startTime}–{slot.endTime}</span></div>
                <div className="flex items-center justify-between"><span className="text-ink-500">Expected Arrival</span><span className="text-ink-800">{slot.expectedArrival}</span></div>
                <div className="flex items-center justify-between"><span className="text-ink-500">Status</span><StatusBadge status={slot.status} /></div>
              </div>
            </Card>
          )}

          <Card className="p-4">
            <h2 className="section-title mb-3">Bay Location</h2>
            <FreightMap bays={[bay]} height="250px" />
          </Card>
        </>
      ) : (
        <Card className="p-8 text-center text-ink-400">No bay assigned.</Card>
      )}

      {/* Cached bay info */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-warning-600" />
          <h3 className="text-sm font-semibold text-ink-700">Cached Bay (Offline)</h3>
        </div>
        {cachedBay ? (
          <div className="text-xs space-y-1">
            <div className="flex justify-between"><span className="text-ink-500">Bay ID</span><span className="text-ink-800">{cachedBay.bayId}</span></div>
            <div className="flex justify-between"><span className="text-ink-500">State</span><span className="text-ink-800">{cachedBay.state}</span></div>
          </div>
        ) : <p className="text-xs text-ink-400">No cached bay available.</p>}
        {cachedSlot && (
          <div className="mt-2 text-xs space-y-1">
            <div className="flex justify-between"><span className="text-ink-500">Cached Slot</span><span className="text-ink-800">{cachedSlot.slotId}</span></div>
            <div className="flex justify-between"><span className="text-ink-500">Window</span><span className="text-ink-800">{cachedSlot.startTime}–{cachedSlot.endTime}</span></div>
          </div>
        )}
      </Card>
    </div>
  );
}
