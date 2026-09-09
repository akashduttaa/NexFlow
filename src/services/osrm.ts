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

class LiveOsrmService implements IOsrmService {
  private simulated = new SimulatedOsrmService();

  getName() { return 'Live OpenStreetMap OSRM'; }
  isSimulated() { return false; }

  async getRoute(origin: LatLng, destination: LatLng): Promise<OsrmRoute> {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=full&geometries=geojson`;
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 1500);
      let res: Response;
      try {
        res = await fetch(url, { signal: controller.signal });
      } finally {
        clearTimeout(id);
      }
      if (!res.ok) throw new Error('OSRM API request failed');
      const data = await res.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coords: [number, number][] = route.geometry.coordinates;
        const geometry: LatLng[] = coords.map(([lon, lat]) => ({ lat, lon }));
        return {
          geometry,
          distanceKm: Math.round((route.distance / 1000) * 10) / 10,
          durationMin: Math.round(route.duration / 60)
        };
      }
      return this.simulated.getRoute(origin, destination);
    } catch (e) {
      console.warn('Live OSRM offline or rate limited, falling back to local routing geometry:', e);
      return this.simulated.getRoute(origin, destination);
    }
  }

  async getRouteCandidates(origin: LatLng, destination: LatLng, count: number): Promise<OsrmRoute[]> {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?alternatives=true&overview=full&geometries=geojson`;
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 1500);
      let res: Response;
      try {
        res = await fetch(url, { signal: controller.signal });
      } finally {
        clearTimeout(id);
      }
      if (!res.ok) throw new Error('OSRM Candidates request failed');
      const data = await res.json();
      
      if (data.routes && data.routes.length > 0) {
        return data.routes.slice(0, count).map((route: any) => {
          const coords: [number, number][] = route.geometry.coordinates;
          return {
            geometry: coords.map(([lon, lat]) => ({ lat, lon })),
            distanceKm: Math.round((route.distance / 1000) * 10) / 10,
            durationMin: Math.round(route.duration / 60)
          };
        });
      }
      return this.simulated.getRouteCandidates(origin, destination, count);
    } catch (e) {
      return this.simulated.getRouteCandidates(origin, destination, count);
    }
  }

  async getTravelTimeMatrix(origins: LatLng[], destinations: LatLng[]): Promise<number[][]> {
    return this.simulated.getTravelTimeMatrix(origins, destinations);
  }

  async mapMatch(gpsTrace: LatLng[]): Promise<LatLng[]> {
    return this.simulated.mapMatch(gpsTrace);
  }
}

export const simulatedOsrmService: IOsrmService = new SimulatedOsrmService();
export const liveOsrmService: IOsrmService = new LiveOsrmService();
export const osrmService: IOsrmService = liveOsrmService;

