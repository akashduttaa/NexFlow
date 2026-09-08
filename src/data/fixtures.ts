// Deterministic demo data for NexFlow — SIMULATED PILOT DATA
// Pilot: Kolkata Burrabazar / Posta Trade District
// All data is deterministic and replayable.

import type {
  Vehicle, Delivery, Bay, BaySlot, RoadSegment, Incident,
  RoutePlan, Prediction, OptimizationRun, Driver, Fleet,
  AuditEvent, DataSource, Organization, User, Telemetry,
} from '@/types';

// Burrabazar/Posta approximate center
export const PILOT_CENTER: [number, number] = [22.5957, 88.3716];
export const PILOT_ZONE = 'Burrabazar / Posta';

// Deterministic pseudo-random based on seed
function seeded(seed: number): number {
  const x = Math.sin(seed * 9999.137) * 10000;
  return x - Math.floor(x);
}

function jitter(seed: number, base: number, spread: number): number {
  return base + (seeded(seed) - 0.5) * spread;
}

export const organizations: Organization[] = [
  {
    id: 'org-kmc',
    name: 'Kolkata Municipal Corporation (Demo)',
    type: 'municipality',
    plan: 'B2G_CITY_ZONE_PRO',
    billingStatus: 'trial',
    featureFlags: ['multi_zone', 'iccc_connector', 'analytics', 'audit'],
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'org-nexgen',
    name: 'NexGen Fleet Operations (Demo)',
    type: 'fleet_operator',
    plan: 'B2B_FLEET_PRO',
    billingStatus: 'trial',
    featureFlags: ['dynamic_routing', 'eta_protection', 'fleet_analytics', 'curb_allocation'],
    createdAt: '2026-01-15T08:00:00Z',
  },
];

export const users: User[] = [
  {
    id: 'usr-admin',
    email: 'admin@nexflow.demo',
    name: 'System Administrator',
    role: 'ADMIN',
    organizationId: 'org-kmc',
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'usr-operator',
    email: 'operator@nexflow.demo',
    name: 'Municipal Operator',
    role: 'MUNICIPAL_OPERATOR',
    organizationId: 'org-kmc',
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'usr-fleet',
    email: 'fleet@nexflow.demo',
    name: 'Fleet Operator',
    role: 'FLEET_OPERATOR',
    organizationId: 'org-nexgen',
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'usr-analyst',
    email: 'analyst@nexflow.demo',
    name: 'Data Analyst',
    role: 'ANALYST',
    organizationId: 'org-kmc',
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
];

export const fleets: Fleet[] = [
  {
    id: 'flt-nexgen',
    name: 'NexGen Primary Fleet',
    organizationId: 'org-nexgen',
    vehicleCount: 20,
    driverCount: 20,
    activeRoutes: 12,
    createdAt: '2026-01-15T08:00:00Z',
  },
];

const driverNames = [
  'Arjun Das', 'Rohit Sharma', 'Sukumar Banerjee', 'Imran Khan', 'Pradip Roy',
  'Soumen Ghosh', 'Mohan Lal', 'Wasim Akram', 'Dipak Sen', 'Raju Verma',
  'Kamal Singh', 'Niraj Pandey', 'Suman Dutta', 'Faisal Ahmed', 'Tapan Dey',
  'Sujit Paul', 'Manoj Mishra', 'Rakib Hossain', 'Sourav Chakraborty', 'Bikash Nandi',
];

export const drivers: Driver[] = driverNames.map((name, i) => ({
  id: `drv-${String(i + 1).padStart(3, '0')}`,
  name,
  phone: `+91 98${String(30000000 + i * 137).slice(0, 8)}`,
  vehicleId: `veh-${String(i + 1).padStart(3, '0')}`,
  fleetId: 'flt-nexgen',
  licenseNo: `WB/D/${String(100000 + i * 7)}`,
  connectionStatus: i % 7 === 6 ? 'OFFLINE' : 'ONLINE',
  lastHeartbeat: new Date(Date.now() - i * 60000).toISOString(),
  active: true,
}));

const vehicleTypes = ['LCV', 'HCV', 'MINI_TRUCK', 'CARRIER'];
const vehicleStatuses: Vehicle['status'][] = ['IDLE', 'ASSIGNED', 'EN_ROUTE', 'AT_BAY', 'SERVICING', 'RETURNING'];

export const vehicles: Vehicle[] = Array.from({ length: 20 }, (_, i) => {
  const status = vehicleStatuses[i % vehicleStatuses.length];
  const hasRoute = ['ASSIGNED', 'EN_ROUTE', 'AT_BAY', 'SERVICING'].includes(status);
  return {
    id: `veh-${String(i + 1).padStart(3, '0')}`,
    fleetId: 'flt-nexgen',
    vehicleNo: `WB 01 XX ${String(1001 + i)}`,
    type: vehicleTypes[i % vehicleTypes.length],
    capacityKg: [1500, 8000, 800, 12000][i % 4],
    currentLoadKg: hasRoute ? Math.floor(seeded(i + 10) * 800) : 0,
    status,
    location: {
      lat: jitter(i + 1, PILOT_CENTER[0], 0.015),
      lon: jitter(i + 100, PILOT_CENTER[1], 0.015),
    },
    driverId: drivers[i].id,
    driverName: drivers[i].name,
    activeRouteId: hasRoute ? `rte-${String(i + 1).padStart(3, '0')}` : null,
    assignedDeliveryId: hasRoute ? `dlv-${String(i + 1).padStart(3, '0')}` : null,
    assignedBayId: ['AT_BAY', 'SERVICING'].includes(status) ? `bay-${String((i % 10) + 1).padStart(2, '0')}` : null,
    eta: hasRoute ? `${10 + (i % 30)} min` : null,
    routeVersion: 1 + (i % 5),
    lastHeartbeat: new Date(Date.now() - i * 30000).toISOString(),
    connectionStatus: i % 7 === 6 ? 'OFFLINE' : 'ONLINE',
  };
});

const deliveryDestinations = [
  'Burrabazar Wholesale Market', 'Posta Sona Market', 'Cotton Street Depot',
  'Mahatma Gandhi Road', 'Nimtolla Ghat Street', 'Brabourne Road Warehouse',
  'Strand Road Loading Zone', 'B.K. Pal Avenue', 'Rabindra Sarani Shop',
  'Kalakar Street Hub', 'Kumartuli Goods Yard', 'Bagbazar Distribution Center',
  'Shyambazar Crossing', 'Chitpur Cargo Terminal', 'Beadon Street Market',
  'Hatibagan Supply Hub', 'Bidhan Sarani Depot', 'College Street Wholesale',
  'Galiff Road Transfer Point', 'Bagbazar Street Warehouse',
  'Armenian Street Trading', 'Dalhousie Square Goods', 'BBD Bagh Loading Bay',
  'Lalbazaar Cargo Point', 'Esplanade Distribution', 'Park Street Supply Hub',
  'Moulali Transfer Yard', 'Sealdah Goods Terminal', 'Bowbazar Market Complex',
  'Taltala Loading Point', 'Mirzapur Street Depot', 'Naya Bazar Trading',
  'Jorasanko Goods Hub', 'Pathuriaghata Street', 'Sovabazar Loading Zone',
  'Ahiritola Cargo Point', 'Shovabazar Ghat', 'Stuart Gupta Road Hub',
  'Girish Park Market', 'Jawharlal Nehru Road', 'Canning Street Wholesale',
  'Indian Exchange Place', 'Clive Street Goods', 'Netaji Subhas Road Hub',
  'Koilaghat Street Depot', 'Mangoe Lane Trading', 'Zakaria Street Market',
  'Praggunje Lane Hub', 'Raja Ram Mohan Roy Road', 'Camac Street Distribution',
  'Chowringhee Cargo Point',
];

const priorities: Delivery['priority'][] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const deliveryStatuses: Delivery['status'][] = ['PENDING', 'ASSIGNED', 'EN_ROUTE', 'AT_BAY', 'SERVICING', 'DELIVERED', 'DELAYED'];

export const deliveries: Delivery[] = Array.from({ length: 50 }, (_, i) => {
  const status = i < 20 ? deliveryStatuses[i % deliveryStatuses.length] : 'PENDING';
  const assigned = status !== 'PENDING' && status !== 'CANCELLED';
  const hour = 9 + Math.floor(i / 6);
  const minute = (i * 7) % 60;
  return {
    id: `dlv-${String(i + 1).padStart(3, '0')}`,
    pickup: 'NexGen Distribution Hub, Howrah',
    pickupLocation: { lat: 22.5958, lon: 88.2636 },
    destination: deliveryDestinations[i % deliveryDestinations.length],
    destinationLocation: {
      lat: jitter(i + 200, PILOT_CENTER[0], 0.02),
      lon: jitter(i + 300, PILOT_CENTER[1], 0.02),
    },
    zone: PILOT_ZONE,
    priority: priorities[i % 4],
    weightKg: Math.floor(seeded(i + 50) * 1000) + 50,
    windowStart: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    windowEnd: `${String(hour).padStart(2, '0')}:${String((minute + 15) % 60).padStart(2, '0')}`,
    serviceDurationMin: [10, 15, 20, 30][i % 4],
    assignedVehicleId: assigned ? `veh-${String((i % 20) + 1).padStart(3, '0')}` : null,
    assignedBayId: ['AT_BAY', 'SERVICING'].includes(status) ? `bay-${String((i % 10) + 1).padStart(2, '0')}` : null,
    eta: assigned ? `${5 + (i % 25)} min` : null,
    status,
    createdAt: new Date(Date.now() - i * 120000).toISOString(),
  };
});

const bayNames = [
  'Brabourne Road Bay A', 'Strand Road Bay B', 'Cotton Street Bay C',
  'MG Road Bay D', 'Nimtolla Bay E', 'Posta Bay F',
  'Kalakar Street Bay G', 'Chitpur Bay H', 'Rabindra Sarani Bay I',
  'Shyambazar Bay J',
];

const bayStates: Bay['state'][] = ['AVAILABLE', 'RESERVED', 'OCCUPIED', 'BLOCKED', 'MAINTENANCE'];

export const bays: Bay[] = Array.from({ length: 10 }, (_, i) => {
  const state = bayStates[i % bayStates.length];
  return {
    id: `bay-${String(i + 1).padStart(2, '0')}`,
    bayId: `B-${String(i + 1).padStart(2, '0')}`,
    name: bayNames[i],
    location: {
      lat: jitter(i + 400, PILOT_CENTER[0], 0.01),
      lon: jitter(i + 500, PILOT_CENTER[1], 0.01),
    },
    zone: PILOT_ZONE,
    compatibility: ['LCV', 'HCV', 'MINI_TRUCK', 'CARRIER'].slice(0, (i % 3) + 2),
    serviceDurationMin: [10, 15, 20][i % 3],
    state,
    currentSlotId: ['RESERVED', 'OCCUPIED'].includes(state) ? `slt-${String(i + 1).padStart(3, '0')}` : null,
    utilizationPct: Math.floor(seeded(i + 600) * 60) + 30,
  };
});

export const baySlots: BaySlot[] = Array.from({ length: 15 }, (_, i) => {
  const hour = 10 + Math.floor(i / 4);
  const minute = (i * 12) % 60;
  return {
    id: `slt-${String(i + 1).padStart(3, '0')}`,
    slotId: `S-${String(i + 1).padStart(3, '0')}`,
    bayId: `bay-${String((i % 10) + 1).padStart(2, '0')}`,
    deliveryId: i < 12 ? `dlv-${String(i + 1).padStart(3, '0')}` : null,
    vehicleId: i < 12 ? `veh-${String((i % 20) + 1).padStart(3, '0')}` : null,
    startTime: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    endTime: `${String(hour).padStart(2, '0')}:${String((minute + 15) % 60).padStart(2, '0')}`,
    expectedArrival: `${String(hour).padStart(2, '0')}:${String((minute + 5) % 60).padStart(2, '0')}`,
    status: i % 5 === 4 ? 'CONFLICT' : i < 8 ? 'CONFIRMED' : 'PENDING',
  };
});

const roadNames = [
  'Brabourne Road', 'Strand Road', 'Cotton Street', 'MG Road',
  'Nimtolla Ghat Street', 'Rabindra Sarani', 'Chitpur Road', 'Shyambazar Street',
  'B.K. Pal Avenue', 'Kalakar Street', 'Bidhan Sarani', 'College Street',
];

export const roadSegments: RoadSegment[] = roadNames.map((name, i) => ({
  id: `seg-${String(i + 1).padStart(3, '0')}`,
  segmentId: `RS-${String(i + 1).padStart(3, '0')}`,
  name,
  geometry: [
    { lat: jitter(i + 700, PILOT_CENTER[0], 0.015), lon: jitter(i + 800, PILOT_CENTER[1], 0.015) },
    { lat: jitter(i + 900, PILOT_CENTER[0], 0.015), lon: jitter(i + 1000, PILOT_CENTER[1], 0.015) },
  ],
  zone: PILOT_ZONE,
  blocked: i === 2,
  avgSpeedKph: Math.floor(seeded(i + 1100) * 20) + 10,
}));

const incidentTypes: Incident['type'][] = ['ROAD_CLOSURE', 'QUEUE', 'BAY_CONFLICT', 'VEHICLE_BREAKDOWN', 'DEMAND_SURGE'];
const severities: Incident['severity'][] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const incidents: Incident[] = Array.from({ length: 5 }, (_, i) => ({
  id: `inc-${String(i + 1).padStart(3, '0')}`,
  incidentId: `INC-${String(i + 1).padStart(4, '0')}`,
  type: incidentTypes[i],
  severity: severities[i % 4],
  status: i < 3 ? 'ACTIVE' : 'RESOLVED',
  location: {
    lat: jitter(i + 1200, PILOT_CENTER[0], 0.01),
    lon: jitter(i + 1300, PILOT_CENTER[1], 0.01),
  },
  segment: roadSegments[i % roadSegments.length].name,
  description: [
    'Road closure due to construction on Cotton Street',
    'Heavy queue at Posta Sona Market entrance',
    'Bay B-03 double-booked for slot S-003 and S-007',
    'Vehicle WB 01 XX 1007 engine breakdown on Strand Road',
    'Unexpected demand surge at Burrabazar Wholesale Market',
  ][i],
  createdAt: new Date(Date.now() - i * 900000).toISOString(),
  resolvedAt: i >= 3 ? new Date(Date.now() - (i - 3) * 600000).toISOString() : null,
}));

export const routePlans: RoutePlan[] = Array.from({ length: 12 }, (_, i) => ({
  id: `rte-${String(i + 1).padStart(3, '0')}`,
  routeId: `R-${String(200 + i)}`,
  vehicleId: `veh-${String(i + 1).padStart(3, '0')}`,
  deliveryId: `dlv-${String(i + 1).padStart(3, '0')}`,
  bayId: `bay-${String((i % 10) + 1).padStart(2, '0')}`,
  routeVersion: 1 + (i % 5),
  geometry: [
    vehicles[i].location,
    { lat: jitter(i + 1400, PILOT_CENTER[0], 0.012), lon: jitter(i + 1500, PILOT_CENTER[1], 0.012) },
    deliveries[i].destinationLocation,
  ],
  status: i === 2 ? 'INVALIDATED' : 'ACTIVE',
  estimatedDurationMin: 15 + (i % 20),
  windowStart: deliveries[i].windowStart,
  windowEnd: deliveries[i].windowEnd,
  createdAt: new Date(Date.now() - i * 300000).toISOString(),
  invalidatedAt: i === 2 ? new Date(Date.now() - 60000).toISOString() : null,
}));

export const predictions: Prediction[] = [
  {
    id: 'prd-001',
    type: 'DEMAND',
    zone: PILOT_ZONE,
    horizonMin: 60,
    value: 78,
    unit: 'index',
    confidence: 0.87,
    model: 'XGBoost',
    version: '0.1.0-dev',
    timestamp: new Date().toISOString(),
    metadata: { features: ['hour', 'day_of_week', 'weather', 'historical_demand'] },
  },
  {
    id: 'prd-002',
    type: 'TRAFFIC_RISK',
    zone: PILOT_ZONE,
    horizonMin: 30,
    value: 62,
    unit: 'risk_score',
    confidence: 0.81,
    model: 'XGBoost',
    version: '0.1.0-dev',
    timestamp: new Date().toISOString(),
    metadata: { segments_at_risk: ['Cotton Street', 'Brabourne Road'] },
  },
  {
    id: 'prd-003',
    type: 'ETA',
    zone: PILOT_ZONE,
    horizonMin: 15,
    value: 18,
    unit: 'minutes',
    confidence: 0.92,
    model: 'XGBoost',
    version: '0.1.0-dev',
    timestamp: new Date().toISOString(),
    metadata: { routes_analyzed: 12 },
  },
];

export const optimizationRuns: OptimizationRun[] = [
  {
    id: 'opt-001',
    runId: 'OPT-2026-0001',
    status: 'COMPLETED',
    solverStatus: 'OPTIMAL',
    runtimeMs: 3400,
    objectiveValue: null,
    vehicles: 12,
    deliveries: 20,
    bays: 10,
    lateDeliveries: null,
    warnings: [],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date(Date.now() - 3596000).toISOString(),
  },
  {
    id: 'opt-002',
    runId: 'OPT-2026-0002',
    status: 'CONNECTOR_READY',
    solverStatus: null,
    runtimeMs: null,
    objectiveValue: null,
    vehicles: 0,
    deliveries: 0,
    bays: 0,
    lateDeliveries: null,
    warnings: ['OR-Tools CP-SAT connector ready. Awaiting solver service.'],
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    completedAt: null,
  },
];

export const auditEvents: AuditEvent[] = [
  { id: 'aud-001', eventId: 'EVT-001', timestamp: new Date(Date.now() - 3600000).toISOString(), eventType: 'OPTIMIZATION_STARTED', actor: 'system', entityType: 'optimization_run', entityId: 'OPT-2026-0001', metadata: {} },
  { id: 'aud-002', eventId: 'EVT-002', timestamp: new Date(Date.now() - 3596000).toISOString(), eventType: 'OPTIMIZATION_COMPLETED', actor: 'system', entityType: 'optimization_run', entityId: 'OPT-2026-0001', metadata: { runtimeMs: 3400 } },
  { id: 'aud-003', eventId: 'EVT-003', timestamp: new Date(Date.now() - 2700000).toISOString(), eventType: 'ROUTE_ASSIGNED', actor: 'operator@nexflow.demo', entityType: 'route_plan', entityId: 'R-200', metadata: { vehicleId: 'veh-001', deliveryId: 'dlv-001' } },
  { id: 'aud-004', eventId: 'EVT-004', timestamp: new Date(Date.now() - 1800000).toISOString(), eventType: 'INCIDENT_CREATED', actor: 'system', entityType: 'incident', entityId: 'INC-0001', metadata: { type: 'ROAD_CLOSURE', severity: 'HIGH' } },
  { id: 'aud-005', eventId: 'EVT-005', timestamp: new Date(Date.now() - 1200000).toISOString(), eventType: 'ROUTE_INVALIDATED', actor: 'system', entityType: 'route_plan', entityId: 'R-202', metadata: { reason: 'ROAD_CLOSURE', segment: 'Cotton Street' } },
  { id: 'aud-006', eventId: 'EVT-006', timestamp: new Date(Date.now() - 600000).toISOString(), eventType: 'BAY_RESERVED', actor: 'operator@nexflow.demo', entityType: 'bay_slot', entityId: 'S-003', metadata: { bayId: 'B-03', deliveryId: 'dlv-003' } },
  { id: 'aud-007', eventId: 'EVT-007', timestamp: new Date(Date.now() - 300000).toISOString(), eventType: 'DRIVER_OFFLINE', actor: 'system', entityType: 'driver', entityId: 'drv-007', metadata: { vehicleId: 'veh-007' } },
  { id: 'aud-008', eventId: 'EVT-008', timestamp: new Date(Date.now() - 120000).toISOString(), eventType: 'DELIVERY_CREATED', actor: 'fleet@nexflow.demo', entityType: 'delivery', entityId: 'dlv-050', metadata: { priority: 'MEDIUM' } },
  { id: 'aud-009', eventId: 'EVT-009', timestamp: new Date(Date.now() - 60000).toISOString(), eventType: 'SYNC_COMPLETED', actor: 'system', entityType: 'driver', entityId: 'drv-003', metadata: { pendingEvents: 4 } },
  { id: 'aud-010', eventId: 'EVT-010', timestamp: new Date().toISOString(), eventType: 'ROUTE_REASSIGNED', actor: 'system', entityType: 'route_plan', entityId: 'R-202', metadata: { newVersion: 3, newBay: 'B-07' } },
];

export const dataSources: DataSource[] = [
  { id: 'ds-001', name: 'OpenStreetMap', type: 'OPEN_STATIC', status: 'HEALTHY', lastRefresh: '2026-09-07T00:00:00Z', freshness: '24h', description: 'Road network, geometry, turn restrictions for Kolkata' },
  { id: 'ds-002', name: 'Delhi GTFS / Open Transit Data', type: 'OPEN_STATIC', status: 'HEALTHY', lastRefresh: '2026-09-01T00:00:00Z', freshness: '7d', description: 'Public transit schedule and route data (reference architecture)' },
  { id: 'ds-003', name: 'Kochi Metro GTFS', type: 'OPEN_STATIC', status: 'HEALTHY', lastRefresh: '2026-09-01T00:00:00Z', freshness: '7d', description: 'Metro transit feed (reference architecture)' },
  { id: 'ds-004', name: 'Open-Meteo Weather', type: 'LIVE_EXTERNAL', status: 'HEALTHY', lastRefresh: new Date().toISOString(), freshness: '15min', description: 'Real-time weather conditions and forecast for Kolkata' },
  { id: 'ds-005', name: 'Operator Feed (NexGen)', type: 'OPERATOR_FEED', status: 'HEALTHY', lastRefresh: new Date().toISOString(), freshness: '30s', description: 'Vehicle GPS telemetry, driver status, delivery manifest from NexGen fleet' },
  { id: 'ds-006', name: 'TomTom Connector', type: 'LIVE_EXTERNAL', status: 'CONNECTOR_READY', lastRefresh: '—', freshness: '—', description: 'Traffic flow and incident data. Connector ready, awaiting API key.' },
  { id: 'ds-007', name: 'Simulated GPS Telemetry', type: 'SIMULATED', status: 'HEALTHY', lastRefresh: new Date().toISOString(), freshness: '5s', description: 'Deterministic simulated vehicle positions for demo mode' },
];

export const telemetry: Telemetry[] = vehicles.map((v, i) => ({
  id: `tlm-${i + 1}`,
  vehicleId: v.id,
  location: v.location,
  speedKph: Math.floor(seeded(i + 2000) * 40),
  heading: Math.floor(seeded(i + 2100) * 360),
  timestamp: new Date().toISOString(),
}));
