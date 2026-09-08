// OSRM Service Interface
// Frontend → Node API → OSRM Adapter
// For Bolt preview, a deterministic route fixture is used.
// ROUTING SOURCE: SIMULATED

import type { LatLng, RouteCandidate } from '@/types';

export interface OsrmRoute {
  geometry: LatLng[];
  distanceKm: number;
  durationMin: number;
}

export interface IOsrmService {
  getRoute(origin: LatLng, destination: LatLng): Promise<OsrmRoute>;
  getRouteCandidates(origin: LatLng, destination: LatLng, count: number): Promise<OsrmRoute[]>;
  getTravelTimeMatrix(origins: LatLng[], destinations: LatLng[]): Promise<number[][]>;
  mapMatch(gpsTrace: LatLng[]): Promise<LatLng[]>;
}

class SimulatedOsrmService implements IOsrmService {
  getName() { return 'Simulated OSRM'; }
  isSimulated() { return true; }

  async getRoute(origin: LatLng, destination: LatLng): Promise<OsrmRoute> {
    // Deterministic fixture: interpolate between origin and destination
    const mid: LatLng = {
      lat: (origin.lat + destination.lat) / 2 + 0.002,
      lon: (origin.lon + destination.lon) / 2 - 0.002,
    };
    const distanceKm = this.haversine(origin, destination);
    return {
      geometry: [origin, mid, destination],
      distanceKm: Math.round(distanceKm * 10) / 10,
      durationMin: Math.round(distanceKm * 2.5),
    };
  }

  async getRouteCandidates(origin: LatLng, destination: LatLng, count: number): Promise<OsrmRoute[]> {
    const candidates: OsrmRoute[] = [];
    for (let i = 0; i < count; i++) {
      const offset = (i + 1) * 0.003;
      const mid: LatLng = {
        lat: (origin.lat + destination.lat) / 2 + offset,
        lon: (origin.lon + destination.lon) / 2 - offset,
      };
      const distanceKm = this.haversine(origin, destination) + i * 0.5;
      candidates.push({
        geometry: [origin, mid, destination],
        distanceKm: Math.round(distanceKm * 10) / 10,
        durationMin: Math.round(distanceKm * 2.5) + i * 3,
      });
    }
    return candidates;
  }

  async getTravelTimeMatrix(origins: LatLng[], destinations: LatLng[]): Promise<number[][]> {
    const matrix: number[][] = [];
    for (const o of origins) {
      const row: number[] = [];
      for (const d of destinations) {
        row.push(Math.round(this.haversine(o, d) * 2.5));
      }
      matrix.push(row);
    }
    return matrix;
  }

  async mapMatch(gpsTrace: LatLng[]): Promise<LatLng[]> {
    return gpsTrace;
  }

  private haversine(a: LatLng, b: LatLng): number {
    const R = 6371;
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLon = (b.lon - a.lon) * Math.PI / 180;
    const la1 = a.lat * Math.PI / 180;
    const la2 = b.lat * Math.PI / 180;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
}

export const osrmService: IOsrmService = new SimulatedOsrmService();
