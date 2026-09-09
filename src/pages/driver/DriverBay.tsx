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
      if (vs && vs.length > 0 && vs[0]?.assignedBayId) {
        apiClient.getBay(vs[0].assignedBayId).then(setBay);
      }
    }).catch(console.error);

    apiClient.getBaySlots().then(slots => {
      if (slots && Array.isArray(slots)) {
        setSlot(slots.find(s => s.vehicleId === 'veh-001') ?? null);
      }
    }).catch(console.error);

    getCachedBay().then(setCachedBay).catch(() => {});
    getCachedBaySlot().then(setCachedSlot).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-white">Loading Bay</h1>

      {bay ? (
        <>
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent-400" />
                <span className="font-semibold text-white">Bay {bay.bayId}</span>
              </div>
              <StatusBadge status={bay.state} />
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between"><span className="text-ink-400">Name</span><span className="text-ink-100">{bay.name}</span></div>
              <div className="flex items-center justify-between"><span className="text-ink-400">Zone</span><span className="text-ink-100">{bay.zone}</span></div>
              <div className="flex items-center justify-between"><span className="text-ink-400">Service Duration</span><span className="text-ink-100">{bay.serviceDurationMin} min</span></div>
              <div className="flex items-center justify-between"><span className="text-ink-400">Compatibility</span><span className="text-ink-100 text-xs">{bay.compatibility.join(', ')}</span></div>
            </div>
          </Card>

          {slot && (
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-primary-400" />
                <h3 className="section-title">Reservation Slot</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between"><span className="text-ink-400">Slot ID</span><span className="text-ink-100 font-medium">{slot.slotId}</span></div>
                <div className="flex items-center justify-between"><span className="text-ink-400">Time</span><span className="text-ink-100">{slot.startTime}–{slot.endTime}</span></div>
                <div className="flex items-center justify-between"><span className="text-ink-400">Expected Arrival</span><span className="text-ink-100">{slot.expectedArrival}</span></div>
                <div className="flex items-center justify-between"><span className="text-ink-400">Status</span><StatusBadge status={slot.status} /></div>
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
          <Activity className="w-4 h-4 text-warning-400" />
          <h3 className="text-sm font-semibold text-ink-200">Cached Bay (Offline)</h3>
        </div>
        {cachedBay ? (
          <div className="text-xs space-y-1">
            <div className="flex justify-between"><span className="text-ink-400">Bay ID</span><span className="text-ink-100">{cachedBay.bayId}</span></div>
            <div className="flex justify-between"><span className="text-ink-400">State</span><span className="text-ink-100">{cachedBay.state}</span></div>
          </div>
        ) : <p className="text-xs text-ink-400">No cached bay available.</p>}
        {cachedSlot && (
          <div className="mt-2 text-xs space-y-1">
            <div className="flex justify-between"><span className="text-ink-400">Cached Slot</span><span className="text-ink-100">{cachedSlot.slotId}</span></div>
            <div className="flex justify-between"><span className="text-ink-400">Window</span><span className="text-ink-100">{cachedSlot.startTime}–{cachedSlot.endTime}</span></div>
          </div>
        )}
      </Card>
    </div>
  );
}
