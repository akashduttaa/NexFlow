// ULIP-aligned adapter contract
// "ULIP-aligned adapter contract. Production government API integration is authorization-gated."
// This is NOT the official ULIP schema.

import type { AdapterEvent } from '@/types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateAdapterEvent(event: unknown): ValidationResult {
  const errors: string[] = [];
  if (typeof event !== 'object' || event === null) {
    return { valid: false, errors: ['Event must be an object'] };
  }
  const e = event as Record<string, unknown>;

  if (!e.sourceSystem || typeof e.sourceSystem !== 'string') errors.push('sourceSystem is required (string)');
  if (!e.eventType || typeof e.eventType !== 'string') errors.push('eventType is required (string)');
  if (!e.eventTime || typeof e.eventTime !== 'string') errors.push('eventTime is required (ISO-8601 string)');
  if (!e.vehicleNo || typeof e.vehicleNo !== 'string') errors.push('vehicleNo is required (string)');

  if (!e.location || typeof e.location !== 'object') {
    errors.push('location is required (object with lat, lon)');
  } else {
    const loc = e.location as Record<string, unknown>;
    if (typeof loc.lat !== 'number') errors.push('location.lat must be a number');
    if (typeof loc.lon !== 'number') errors.push('location.lon must be a number');
  }

  if (!e.consignmentId || typeof e.consignmentId !== 'string') errors.push('consignmentId is required (string)');
  if (!e.cargoStatus || typeof e.cargoStatus !== 'string') errors.push('cargoStatus is required (string)');

  if (!e.load || typeof e.load !== 'object') {
    errors.push('load is required (object with units, weightKg)');
  } else {
    const load = e.load as Record<string, unknown>;
    if (typeof load.units !== 'number') errors.push('load.units must be a number');
    if (typeof load.weightKg !== 'number') errors.push('load.weightKg must be a number');
  }

  if (!e.sourceVersion || typeof e.sourceVersion !== 'string') errors.push('sourceVersion is required (string)');

  return { valid: errors.length === 0, errors };
}

export const sampleAdapterEvent: AdapterEvent = {
  sourceSystem: 'NEXFLOW',
  eventType: 'VEHICLE_UPDATE',
  eventTime: '2026-09-08T10:30:00Z',
  vehicleNo: 'WB01XX0001',
  location: { lat: 22.5726, lon: 88.3639 },
  consignmentId: 'C-1042',
  cargoStatus: 'OUT_FOR_DELIVERY',
  load: { units: 12, weightKg: 84 },
  sourceVersion: '1.0',
};
