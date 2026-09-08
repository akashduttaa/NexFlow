import { MapContainer, TileLayer, Marker, Polyline, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { LatLng, Vehicle, Bay, Incident, RoutePlan } from '@/types';
import { PILOT_CENTER } from '@/data/fixtures';

// Fix default marker icons
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function vehicleIcon(status: string) {
  const colors: Record<string, string> = {
    EN_ROUTE: '#3b82f6',
    AT_BAY: '#f59e0b',
    SERVICING: '#f59e0b',
    IDLE: '#94a3b8',
    OFFLINE: '#ef4444',
    RETURNING: '#10b981',
    ASSIGNED: '#6366f1',
  };
  const color = colors[status] ?? '#64748b';
  return L.divIcon({
    html: `<div style="width:20px;height:20px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
    className: 'custom-vehicle-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

function bayIcon(state: string) {
  const colors: Record<string, string> = {
    AVAILABLE: '#10b981',
    RESERVED: '#3b82f6',
    OCCUPIED: '#f59e0b',
    BLOCKED: '#ef4444',
    MAINTENANCE: '#94a3b8',
  };
  const color = colors[state] ?? '#64748b';
  return L.divIcon({
    html: `<div style="width:16px;height:16px;background:${color};border:2px solid white;border-radius:3px;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
    className: 'custom-bay-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

interface MapProps {
  vehicles?: Vehicle[];
  bays?: Bay[];
  incidents?: Incident[];
  routes?: RoutePlan[];
  highlightedRouteId?: string | null;
  height?: string;
  showRoads?: boolean;
}

export function FreightMap({
  vehicles = [],
  bays = [],
  incidents = [],
  routes = [],
  highlightedRouteId = null,
  height = '500px',
  showRoads = true,
}: MapProps) {
  return (
    <div style={{ height }} className="rounded-lg overflow-hidden border border-ink-200">
      <MapContainer center={PILOT_CENTER} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Routes */}
        {routes.map(route => {
          const positions: [number, number][] = route.geometry.map(p => [p.lat, p.lon]);
          const isHighlighted = highlightedRouteId === route.id;
          const isInvalidated = route.status === 'INVALIDATED';
          return (
            <Polyline
              key={route.id}
              positions={positions}
              pathOptions={{
                color: isInvalidated ? '#ef4444' : isHighlighted ? '#3b82f6' : '#64748b',
                weight: isHighlighted ? 5 : 3,
                opacity: isInvalidated ? 0.4 : isHighlighted ? 1 : 0.5,
                dashArray: isInvalidated ? '10,10' : undefined,
              }}
            />
          );
        })}

        {/* Vehicles */}
        {vehicles.map(v => (
          <Marker key={v.id} position={[v.location.lat, v.location.lon]} icon={vehicleIcon(v.status)}>
            <Popup>
              <div className="text-sm">
                <strong>{v.vehicleNo}</strong><br />
                {v.type} — {v.status}<br />
                Driver: {v.driverName ?? 'Unassigned'}<br />
                ETA: {v.eta ?? '—'}<br />
                Route v{v.routeVersion}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Bays */}
        {bays.map(b => (
          <Marker key={b.id} position={[b.location.lat, b.location.lon]} icon={bayIcon(b.state)}>
            <Popup>
              <div className="text-sm">
                <strong>{b.bayId}</strong> — {b.name}<br />
                State: {b.state}<br />
                Zone: {b.zone}<br />
                Utilization: {b.utilizationPct}%
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Incidents */}
        {incidents.map(inc => (
          <CircleMarker
            key={inc.id}
            center={[inc.location.lat, inc.location.lon]}
            radius={12}
            pathOptions={{
              color: inc.severity === 'CRITICAL' ? '#ef4444' : inc.severity === 'HIGH' ? '#f59e0b' : '#fbbf24',
              fillColor: inc.severity === 'CRITICAL' ? '#ef4444' : inc.severity === 'HIGH' ? '#f59e0b' : '#fbbf24',
              fillOpacity: 0.3,
            }}
          >
            <Popup>
              <div className="text-sm">
                <strong>{inc.incidentId}</strong><br />
                {inc.type} — {inc.severity}<br />
                {inc.description}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

export { PILOT_CENTER };
