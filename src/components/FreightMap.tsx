import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { LatLng, Vehicle, Bay, Incident, RoutePlan } from '@/types';
import { PILOT_CENTER } from '@/data/fixtures';
import { liveOsrmService } from '@/services/osrm';

import { useTheme } from '@/contexts/ThemeContext';

// Fix default marker icons
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function vehicleIcon(status: string) {
  const colors: Record<string, string> = {
    EN_ROUTE: '#06b6d4',
    AT_BAY: '#f59e0b',
    SERVICING: '#f59e0b',
    IDLE: '#6b84a3',
    OFFLINE: '#f43f5e',
    RETURNING: '#10b981',
    ASSIGNED: '#8b5cf6',
  };
  const color = colors[status] ?? '#4a6382';
  return L.divIcon({
    html: `<div style="width:22px;height:22px;background:${color};border:2px solid rgba(255,255,255,0.4);border-radius:50%;box-shadow:0 0 10px ${color}A0;display:flex;align-items:center;justify-content:center"><div style="width:6px;height:6px;background:#fff;border-radius:50%"></div></div>`,
    className: 'custom-vehicle-marker',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
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
    html: `<div style="width:18px;height:18px;background:${color};border:2px solid rgba(255,255,255,0.4);border-radius:4px;box-shadow:0 0 10px ${color}A0"></div>`,
    className: 'custom-bay-marker',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
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
  const [liveRouteGeometries, setLiveRouteGeometries] = useState<Record<string, LatLng[]>>({});
  const [liveVehicles, setLiveVehicles] = useState<Vehicle[]>(vehicles);

  useEffect(() => {
    setLiveVehicles(vehicles);
  }, [vehicles]);

  // Fetch live OSRM routes on mount or route changes
  useEffect(() => {
    let isMounted = true;
    async function loadLiveOsrmRoutes() {
      const geoMap: Record<string, LatLng[]> = {};
      for (const route of routes) {
        if (route.geometry && route.geometry.length >= 2) {
          const origin = route.geometry[0];
          const destination = route.geometry[route.geometry.length - 1];
          const osrmRes = await liveOsrmService.getRoute(origin, destination);
          if (osrmRes && osrmRes.geometry.length > 0) {
            geoMap[route.id] = osrmRes.geometry;
          } else {
            geoMap[route.id] = route.geometry;
          }
        }
      }
      if (isMounted) {
        setLiveRouteGeometries(geoMap);
      }
    }
    loadLiveOsrmRoutes();
    return () => { isMounted = false; };
  }, [routes]);

  // Live GPS simulation tick for moving vehicles along paths
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVehicles(prev => prev.map(v => {
        if (v.status === 'EN_ROUTE') {
          const jitterLat = (Math.random() - 0.5) * 0.0003;
          const jitterLon = (Math.random() - 0.5) * 0.0003;
          return {
            ...v,
            location: {
              lat: v.location.lat + jitterLat,
              lon: v.location.lon + jitterLon
            }
          };
        }
        return v;
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  let currentTheme = 'dark';
  try {
    const themeCtx = useTheme();
    if (themeCtx?.theme) currentTheme = themeCtx.theme;
  } catch (e) {}

  const tileUrl = currentTheme === 'light'
    ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';

  return (
    <div style={{ height }} className="relative rounded-lg overflow-hidden border border-surface-border shadow-xl">
      {/* Floating Live Badge */}
      <div className="absolute top-3 right-3 z-[1000] bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-primary-500/30 flex items-center gap-2 text-xs font-semibold text-white shadow-lg">
        <span className="w-2 h-2 rounded-full bg-success-400 animate-pulse"></span>
        <span>LIVE OPENSTREETMAP (OSM) & OSRM ROAD NETWORK</span>
      </div>

      <MapContainer center={PILOT_CENTER} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
        <TileLayer
          key={tileUrl}
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; Esri'
        />

        {/* Live OSRM Routes */}
        {routes.map(route => {
          const geom = liveRouteGeometries[route.id] || route.geometry;
          const positions: [number, number][] = geom.map(p => [p.lat, p.lon]);
          const isHighlighted = highlightedRouteId === route.id;
          const isInvalidated = route.status === 'INVALIDATED';
          return (
            <Polyline
              key={route.id}
              positions={positions}
              pathOptions={{
                color: isInvalidated ? '#f43f5e' : isHighlighted ? '#06b6d4' : '#10b981',
                weight: isHighlighted ? 6 : 4,
                opacity: isInvalidated ? 0.4 : isHighlighted ? 1 : 0.75,
                dashArray: isInvalidated ? '10,10' : undefined,
              }}
            />
          );
        })}

        {/* Live Moving Vehicles */}
        {liveVehicles.map(v => (
          <Marker key={v.id} position={[v.location.lat, v.location.lon]} icon={vehicleIcon(v.status)}>
            <Popup>
              <div className="text-sm font-sans p-1">
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-primary-400">{v.vehicleNo}</strong>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-success-500/20 text-success-400 font-bold">LIVE GPS</span>
                </div>
                {v.type} — <span className="font-semibold text-white">{v.status}</span><br />
                Driver: <strong>{v.driverName ?? 'Unassigned'}</strong><br />
                Location: {v.location.lat.toFixed(4)}, {v.location.lon.toFixed(4)}<br />
                ETA: <strong>{v.eta ?? '12 min'}</strong><br />
                Active Route Version: <strong>v{v.routeVersion}</strong>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Bays */}
        {bays.map(b => (
          <Marker key={b.id} position={[b.location.lat, b.location.lon]} icon={bayIcon(b.state)}>
            <Popup>
              <div className="text-sm font-sans p-1">
                <strong className="text-primary-400">{b.bayId}</strong> — {b.name}<br />
                State: <span className="font-semibold">{b.state}</span><br />
                Zone: {b.zone}<br />
                Utilization: <strong>{b.utilizationPct}%</strong>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Incidents */}
        {incidents.map(inc => (
          <CircleMarker
            key={inc.id}
            center={[inc.location.lat, inc.location.lon]}
            radius={14}
            pathOptions={{
              color: inc.severity === 'CRITICAL' ? '#ef4444' : inc.severity === 'HIGH' ? '#f59e0b' : '#fbbf24',
              fillColor: inc.severity === 'CRITICAL' ? '#ef4444' : inc.severity === 'HIGH' ? '#f59e0b' : '#fbbf24',
              fillOpacity: 0.45,
            }}
          >
            <Popup>
              <div className="text-sm font-sans p-1">
                <strong className="text-error-400">{inc.incidentId}</strong><br />
                Type: {inc.type} — Severity: {inc.severity}<br />
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
