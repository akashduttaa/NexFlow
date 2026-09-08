// Realtime Socket.IO event contracts
// In Bolt preview mode, events are simulated locally.
// Antigravity will connect to actual Socket.IO server.

import type { Vehicle, RoutePlan, Bay, Incident, AuditEvent } from '@/types';

export type SocketEvent =
  | 'vehicle:update'
  | 'route:update'
  | 'bay:update'
  | 'incident:new'
  | 'eta:update'
  | 'optimization:complete'
  | 'driver:offline'
  | 'driver:online'
  | 'sync:complete';

export type SocketRoom = string; // city-admin | fleet-{fleetId} | driver-{driverId}

export interface SocketEventPayload {
  'vehicle:update': { vehicleId: string; vehicle: Partial<Vehicle> };
  'route:update': { routeId: string; route: Partial<RoutePlan> };
  'bay:update': { bayId: string; bay: Partial<Bay> };
  'incident:new': { incident: Incident };
  'eta:update': { vehicleId: string; eta: string };
  'optimization:complete': { runId: string; status: string };
  'driver:offline': { driverId: string; vehicleId: string };
  'driver:online': { driverId: string; vehicleId: string };
  'sync:complete': { driverId: string; pendingEvents: number };
}

export type SocketEventHandler<K extends SocketEvent> = (payload: SocketEventPayload[K]) => void;

type ListenerMap = {
  [K in SocketEvent]?: Set<(payload: SocketEventPayload[K]) => void>;
};

class SimulatedSocket {
  private listeners: ListenerMap = {};
  private connected = false;
  private room: SocketRoom | null = null;

  connect(room: SocketRoom) {
    this.room = room;
    this.connected = true;
  }

  disconnect() {
    this.connected = false;
    this.room = null;
  }

  isConnected() { return this.connected; }
  getRoom() { return this.room; }

  on<K extends SocketEvent>(event: K, handler: SocketEventHandler<K>) {
    if (!this.listeners[event]) this.listeners[event] = new Set() as ListenerMap[K];
    (this.listeners[event] as Set<(payload: SocketEventPayload[K]) => void>).add(handler);
  }

  off<K extends SocketEvent>(event: K, handler: SocketEventHandler<K>) {
    (this.listeners[event] as Set<(payload: SocketEventPayload[K]) => void>)?.delete(handler);
  }

  emit<K extends SocketEvent>(event: K, payload: SocketEventPayload[K]) {
    const set = this.listeners[event] as Set<(payload: SocketEventPayload[K]) => void> | undefined;
    set?.forEach(h => h(payload));
  }
}

export const socket = new SimulatedSocket();
