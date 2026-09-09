// Offline driver cache using IndexedDB
// Stores: current route, route version, delivery, loading bay, loading window, pending GPS events, last sync time
// Never allows an older route version to overwrite a newer route.

import type { LatLng, RoutePlan, Delivery, Bay, BaySlot } from '@/types';

const DB_NAME = 'nexflow-driver-cache';
const DB_VERSION = 1;
const STORES = ['routes', 'deliveries', 'bays', 'baySlots', 'gpsQueue', 'meta'] as const;
type StoreName = typeof STORES[number];

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    try {
      if (typeof indexedDB === 'undefined') {
        return reject(new Error('IndexedDB is not available in this environment'));
      }
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        STORES.forEach(s => {
          if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: 'id' });
        });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (err) {
      reject(err);
    }
  });
}

async function get<T>(store: StoreName, key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function put<T extends { id: string }>(store: StoreName, value: T): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).put(value);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // fail-safe
  }
}

async function getAll<T>(store: StoreName): Promise<T[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).getAll();
      req.onsuccess = () => resolve(req.result ?? []);
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

async function del(store: StoreName, key: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // fail-safe
  }
}

async function clearStore(store: StoreName): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // fail-safe
  }
}

// ─── Route cache with version guard ─────────────────────────────────────

export interface CachedRoute {
  id: string;
  routeVersion: number;
  routeId: string;
  bayId: string;
  windowStart: string;
  windowEnd: string;
  geometry: LatLng[];
  cachedAt: string;
}

export async function cacheRoute(route: RoutePlan): Promise<void> {
  const existing = await get<CachedRoute>('routes', 'current');
  // Never allow an older route version to overwrite a newer route
  if (existing && existing.routeVersion > route.routeVersion) {
    return;
  }
  const cached: CachedRoute = {
    id: 'current',
    routeVersion: route.routeVersion,
    routeId: route.routeId,
    bayId: route.bayId,
    windowStart: route.windowStart,
    windowEnd: route.windowEnd,
    geometry: route.geometry,
    cachedAt: new Date().toISOString(),
  };
  await put('routes', cached);
}

export async function getCachedRoute(): Promise<CachedRoute | null> {
  return get<CachedRoute>('routes', 'current');
}

// ─── Delivery & bay cache ────────────────────────────────────────────────

export async function cacheDelivery(delivery: Delivery): Promise<void> {
  await put('deliveries', { ...delivery, id: 'current' });
}

export async function getCachedDelivery(): Promise<Delivery | null> {
  return get<Delivery>('deliveries', 'current');
}

export async function cacheBay(bay: Bay): Promise<void> {
  await put('bays', { ...bay, id: 'current' });
}

export async function getCachedBay(): Promise<Bay | null> {
  return get<Bay>('bays', 'current');
}

export async function cacheBaySlot(slot: BaySlot): Promise<void> {
  await put('baySlots', { ...slot, id: 'current' });
}

export async function getCachedBaySlot(): Promise<BaySlot | null> {
  return get<BaySlot>('baySlots', 'current');
}

// ─── GPS event queue ─────────────────────────────────────────────────────

export interface PendingGpsEvent {
  id: string;
  vehicleId: string;
  location: LatLng;
  speedKph: number;
  heading: number;
  timestamp: string;
  synced: boolean;
}

export async function queueGpsEvent(event: Omit<PendingGpsEvent, 'id' | 'synced'>): Promise<void> {
  const id = `gps-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await put('gpsQueue', { ...event, id, synced: false });
}

export async function getPendingGpsEvents(): Promise<PendingGpsEvent[]> {
  const all = await getAll<PendingGpsEvent>('gpsQueue');
  return all.filter(e => !e.synced);
}

export async function markGpsSynced(id: string): Promise<void> {
  const event = await get<PendingGpsEvent>('gpsQueue', id);
  if (event) { event.synced = true; await put('gpsQueue', event); }
}

export async function clearSyncedGps(): Promise<void> {
  const all = await getAll<PendingGpsEvent>('gpsQueue');
  for (const e of all) { if (e.synced) await del('gpsQueue', e.id); }
}

// ─── Sync metadata ───────────────────────────────────────────────────────

export interface SyncMeta {
  id: string;
  lastSyncTime: string | null;
  pendingCount: number;
}

export async function setLastSyncTime(time: string): Promise<void> {
  const pending = await getPendingGpsEvents();
  await put('meta', { id: 'sync', lastSyncTime: time, pendingCount: pending.length });
}

export async function getSyncMeta(): Promise<SyncMeta | null> {
  return get<SyncMeta>('meta', 'sync');
}

export async function clearAllCache(): Promise<void> {
  for (const s of STORES) await clearStore(s);
}
