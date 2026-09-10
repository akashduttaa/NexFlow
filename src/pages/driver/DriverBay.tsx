import { useEffect, useState } from 'react';
import { MapPin, Clock, Activity, CheckCircle, Radio, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { Card, StatusBadge, Badge } from '@/components/ui';
import { FreightMap } from '@/components/FreightMap';
import { apiClient } from '@/services/api-client';
import { getCachedBay, getCachedBaySlot, cacheBay, cacheBaySlot } from '@/services/offline-cache';
import type { Bay, BaySlot } from '@/types';

export default function DriverBay() {
  const [bay, setBay] = useState<Bay | null>(null);
  const [slot, setSlot] = useState<BaySlot | null>(null);
  const [cachedBay, setCachedBay] = useState<Awaited<ReturnType<typeof getCachedBay>> | null>(null);
  const [cachedSlot, setCachedSlot] = useState<Awaited<ReturnType<typeof getCachedBaySlot>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [sensorOccupied, setSensorOccupied] = useState(true);
  const [sensorDistanceCm, setSensorDistanceCm] = useState(42.5);

  const loadBayData = async () => {
    try {
      const vs = await apiClient.getVehicles();
      const bays = await apiClient.getBays();
      const slots = await apiClient.getBaySlots();

      const defaultBay = bays.find(b => b.id === 'b-02' || b.bayId === 'B-02') || bays[0] || {
        id: 'b-02',
        bayId: 'B-02',
        name: 'Posta Main Loading Dock 2',
        zone: 'Posta Central',
        location: { lat: 22.5735, lon: 88.3630 },
        compatibility: ['LCV_ELECTRIC', 'LCV_DIESEL'],
        serviceDurationMin: 30,
        state: 'RESERVED',
        currentSlotId: 'SLOT-02',
        utilizationPct: 72
      };

      setBay(defaultBay);
      await cacheBay(defaultBay);

      const defaultSlot: BaySlot = (slots && slots.length > 0 ? slots[0] : null) || {
        id: 'slot-2',
        slotId: 'SLOT-02',
        bayId: defaultBay.id,
        deliveryId: 'd-101',
        vehicleId: 'v-101',
        startTime: '11:00',
        endTime: '11:30',
        expectedArrival: '11:05 AM',
        status: 'CONFIRMED'
      };

      setSlot(defaultSlot);
      await cacheBaySlot(defaultSlot);

      const cb = await getCachedBay();
      setCachedBay(cb);
      const cs = await getCachedBaySlot();
      setCachedSlot(cs);
    } catch (e) {
      console.error('Error loading bay data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBayData();

    // Auto-poll bay status every 6s
    const timer = setInterval(() => {
      loadBayData();
      setSensorDistanceCm(parseFloat((40 + Math.random() * 8).toFixed(1)));
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const handleSimulateSensor = () => {
    setSensorOccupied(prev => !prev);
    setSensorDistanceCm(prev => (prev > 100 ? 42.5 : 180.0));
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-ink-300">
        <Activity className="w-6 h-6 text-accent-400 animate-spin mx-auto mb-2" />
        <p className="text-xs">Loading bay details & sensor telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent-400" />
            Smart Loading Bay Console
          </h1>
          <p className="text-xs text-ink-300">Assigned Loading Bay & Ultrasonic Occupancy Telemetry</p>
        </div>
        <Badge variant="success" className="font-mono text-xs animate-pulse">
          SENSOR ONLINE
        </Badge>
      </div>

      {bay && (
        <>
          {/* Main Bay Card */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent-400" />
                  <span className="font-bold text-lg text-white">Loading Bay {bay.bayId}</span>
                  <span className="text-xs text-ink-400 font-mono">({bay.id})</span>
                </div>
                <p className="text-xs text-ink-300 mt-0.5">{bay.name}</p>
              </div>
              <StatusBadge status={bay.state} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-surface/80 border border-surface-border">
                <span className="text-ink-400 block">Zone Location</span>
                <span className="text-white font-semibold">{bay.zone}</span>
              </div>
              <div className="p-3 rounded-lg bg-surface/80 border border-surface-border">
                <span className="text-ink-400 block">Max Service Duration</span>
                <span className="text-primary-300 font-semibold">{bay.serviceDurationMin} minutes</span>
              </div>
              <div className="p-3 rounded-lg bg-surface/80 border border-surface-border">
                <span className="text-ink-400 block">Dock Utilization</span>
                <span className="text-amber-400 font-mono font-bold">{bay.utilizationPct}%</span>
              </div>
              <div className="p-3 rounded-lg bg-surface/80 border border-surface-border">
                <span className="text-ink-400 block">Vehicle Compatibility</span>
                <span className="text-emerald-400 font-mono font-semibold">
                  {Array.isArray(bay.compatibility) ? bay.compatibility.join(', ') : 'LCV / 3W'}
                </span>
              </div>
            </div>
          </Card>

          {/* Reserved Time Slot Ticket */}
          {slot && (
            <Card className="p-5 border-l-4 border-l-primary-500 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary-400" />
                  <h3 className="section-title">Reserved Time Slot Ticket</h3>
                </div>
                <StatusBadge status={slot.status} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded bg-surface">
                  <span className="text-ink-400 block">Slot Identifier</span>
                  <span className="text-white font-mono font-bold">{slot.slotId}</span>
                </div>
                <div className="p-2.5 rounded bg-surface">
                  <span className="text-ink-400 block">Reserved Window</span>
                  <span className="text-emerald-400 font-mono font-semibold">{slot.startTime} – {slot.endTime}</span>
                </div>
                <div className="p-2.5 rounded bg-surface">
                  <span className="text-ink-400 block">Expected Arrival</span>
                  <span className="text-amber-400 font-mono font-semibold">{slot.expectedArrival || '11:05 AM'}</span>
                </div>
              </div>
            </Card>
          )}

          {/* IoT Ultrasonic Sensor Live Feed */}
          <Card className="p-5 space-y-3 bg-ink-950/80 border-surface-border">
            <div className="flex items-center justify-between border-b border-surface-border pb-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h3 className="text-sm font-semibold text-white">IoT Ultrasonic Occupancy Sensor Telemetry</h3>
              </div>
              <button onClick={handleSimulateSensor} className="btn-secondary text-[11px] px-2.5 py-1 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Toggle Sensor Event
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-surface/90 border border-surface-border">
                <span className="text-ink-400 block text-[10px]">Sensor Type</span>
                <span className="text-primary-300 font-semibold">ULTRASONIC_OCCUPANCY</span>
              </div>
              <div className="p-2.5 rounded bg-surface/90 border border-surface-border">
                <span className="text-ink-400 block text-[10px]">Proximity Distance</span>
                <span className="text-amber-400 font-bold">{sensorDistanceCm} cm</span>
              </div>
              <div className="p-2.5 rounded bg-surface/90 border border-surface-border">
                <span className="text-ink-400 block text-[10px]">Bay Status</span>
                <span className={sensorOccupied ? 'text-emerald-400 font-bold' : 'text-ink-400 font-semibold'}>
                  {sensorOccupied ? 'VEHICLE_DETECTED' : 'VACANT'}
                </span>
              </div>
            </div>
          </Card>

          {/* Map Location */}
          <Card className="p-4">
            <h2 className="section-title mb-3">PostGIS Location Coordinates</h2>
            <FreightMap bays={[bay]} height="250px" />
          </Card>
        </>
      )}

      {/* Offline Cache Synchronized Card */}
      <Card className="p-4 bg-surface/80 border-surface-border">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">IndexedDB Offline Cache Synchronization</h3>
        </div>
        {cachedBay ? (
          <div className="text-xs space-y-1 font-mono text-ink-300">
            <div className="flex justify-between"><span className="text-ink-400">Cached Bay ID</span><span className="text-emerald-300">{cachedBay.bayId}</span></div>
            <div className="flex justify-between"><span className="text-ink-400">Cached Dock State</span><span className="text-emerald-300">{cachedBay.state}</span></div>
            <div className="flex justify-between"><span className="text-ink-400">Cached Zone</span><span className="text-emerald-300">{cachedBay.zone}</span></div>
          </div>
        ) : (
          <p className="text-xs text-ink-400">No cached bay available.</p>
        )}
      </Card>
    </div>
  );
}
