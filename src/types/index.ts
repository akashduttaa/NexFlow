// NexFlow Domain Types — Urban Freight Intelligence Layer

export type UserRole = 'ADMIN' | 'MUNICIPAL_OPERATOR' | 'FLEET_OPERATOR' | 'DRIVER' | 'ANALYST';

export type OrganizationType = 'municipality' | 'fleet_operator' | 'enterprise';

export type PlanType = 'B2G_CITY_ZONE_PRO' | 'B2B_FLEET_PRO' | 'CURB_ACCESS' | 'TRIAL';

export type ConnectionStatus = 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'STALE';

export type VehicleStatus = 'IDLE' | 'ASSIGNED' | 'EN_ROUTE' | 'AT_BAY' | 'SERVICING' | 'RETURNING' | 'OFFLINE';

export type DeliveryStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'EN_ROUTE'
  | 'AT_BAY'
  | 'SERVICING'
  | 'DELIVERED'
  | 'DELAYED'
  | 'CANCELLED';

export type DeliveryPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type BayState = 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'BLOCKED' | 'MAINTENANCE';

export type IncidentType =
  | 'ROAD_CLOSURE'
  | 'ACCIDENT'
  | 'QUEUE'
  | 'BAY_CONFLICT'
  | 'VEHICLE_BREAKDOWN'
  | 'DEMAND_SURGE';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus = 'ACTIVE' | 'RESOLVED' | 'ACKNOWLEDGED' | 'IGNORED';

export type OptimizationStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CONNECTOR_READY';

export type PredictionType = 'DEMAND' | 'TRAFFIC_RISK' | 'ETA';

export type DataSourceType = 'LIVE_EXTERNAL' | 'OPEN_STATIC' | 'OPERATOR_FEED' | 'SIMULATED';

export type ServiceHealthStatus = 'HEALTHY' | 'DEGRADED' | 'OFFLINE' | 'CONNECTOR_READY';

export interface LatLng {
  lat: number;
  lon: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  active: boolean;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  plan: PlanType;
  billingStatus: string;
  featureFlags: string[];
  createdAt: string;
}

export interface Fleet {
  id: string;
  name: string;
  organizationId: string;
  vehicleCount: number;
  driverCount: number;
  activeRoutes: number;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  fleetId: string;
  vehicleNo: string;
  type: string;
  capacityKg: number;
  currentLoadKg: number;
  status: VehicleStatus;
  location: LatLng;
  driverId: string | null;
  driverName: string | null;
  activeRouteId: string | null;
  assignedDeliveryId: string | null;
  assignedBayId: string | null;
  eta: string | null;
  routeVersion: number;
  lastHeartbeat: string;
  connectionStatus: ConnectionStatus;
}

export type FuelType = 'EV' | 'DIESEL' | 'PETROL' | 'CNG';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleId: string | null;
  fleetId: string;
  licenseNo: string;
  fuelType?: FuelType;
  pucCertificateNo?: string;
  isPucValid?: boolean;
  ecoDiscountPct?: number;
  connectionStatus: ConnectionStatus;
  lastHeartbeat: string;
  active: boolean;
}

export interface Delivery {
  id: string;
  pickup: string;
  pickupLocation: LatLng;
  destination: string;
  destinationLocation: LatLng;
  zone: string;
  priority: DeliveryPriority;
  weightKg: number;
  windowStart: string;
  windowEnd: string;
  serviceDurationMin: number;
  assignedVehicleId: string | null;
  assignedBayId: string | null;
  eta: string | null;
  status: DeliveryStatus;
  createdAt: string;
}

export interface Bay {
  id: string;
  bayId: string;
  name: string;
  location: LatLng;
  zone: string;
  compatibility: string[];
  serviceDurationMin: number;
  state: BayState;
  currentSlotId: string | null;
  utilizationPct: number;
}

export interface BaySlot {
  id: string;
  slotId: string;
  bayId: string;
  deliveryId: string | null;
  vehicleId: string | null;
  startTime: string;
  endTime: string;
  expectedArrival: string;
  status: 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CONFLICT';
}

export interface RoadSegment {
  id: string;
  segmentId: string;
  name: string;
  geometry: LatLng[];
  zone: string;
  blocked: boolean;
  avgSpeedKph: number;
}

export interface Incident {
  id: string;
  incidentId: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  location: LatLng;
  segment: string;
  description: string;
  createdAt: string;
  resolvedAt: string | null;
}

export interface RoutePlan {
  id: string;
  routeId: string;
  vehicleId: string;
  deliveryId: string;
  bayId: string;
  routeVersion: number;
  geometry: LatLng[];
  status: 'ACTIVE' | 'INVALIDATED' | 'COMPLETED' | 'REPLACED';
  estimatedDurationMin: number;
  windowStart: string;
  windowEnd: string;
  createdAt: string;
  invalidatedAt: string | null;
}

export interface RouteCandidate {
  id: string;
  candidateId: string;
  vehicleId: string;
  deliveryId: string;
  geometry: LatLng[];
  distanceKm: number;
  durationMin: number;
  score: number;
  selected: boolean;
}

export interface Prediction {
  id: string;
  type: PredictionType;
  zone: string;
  horizonMin: number;
  value: number;
  unit: string;
  confidence: number;
  model: string;
  version: string;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export interface OptimizationRun {
  id: string;
  runId: string;
  status: OptimizationStatus;
  solverStatus: string | null;
  runtimeMs: number | null;
  objectiveValue: number | null;
  vehicles: number;
  deliveries: number;
  bays: number;
  lateDeliveries: number | null;
  warnings: string[];
  createdAt: string;
  completedAt: string | null;
}

export interface Telemetry {
  id: string;
  vehicleId: string;
  location: LatLng;
  speedKph: number;
  heading: number;
  timestamp: string;
}

export interface AuditEvent {
  id: string;
  eventId: string;
  timestamp: string;
  eventType: string;
  actor: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
}

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  status: ServiceHealthStatus;
  lastRefresh: string;
  freshness: string;
  description: string;
}

export interface ServiceHealth {
  name: string;
  status: ServiceHealthStatus;
  latencyMs: number | null;
  detail: string;
  lastChecked: string;
}

export interface OptimizationRequest {
  deliveries: Delivery[];
  vehicles: Vehicle[];
  routeCandidates: RouteCandidate[];
  bayCandidates: Bay[];
  predictions: Prediction[];
  incidents: Incident[];
  objectiveWeights: {
    deliveryDelay: number;
    curbWaiting: number;
    latePenalty: number;
    distance: number;
    reroutingCost: number;
  };
  horizonMinutes: number;
}

export interface OptimizationResult {
  runId: string;
  status: OptimizationStatus;
  solverStatus: string | null;
  runtimeMs: number | null;
  objectiveValue: number | null;
  assignments: Array<{
    vehicleId: string;
    deliveryId: string;
    bayId: string;
    routeCandidateId: string;
    sequence: number;
  }>;
  routes: Array<{
    vehicleId: string;
    geometry: LatLng[];
  }>;
  baySlots: BaySlot[];
  lateDeliveries: string[];
  warnings: string[];
}

export interface KpiSummary {
  activeVehicles: number;
  openDeliveries: number;
  availableBays: number;
  reservedBays: number;
  averageEta: string;
  predictedFreightPressure: string;
  activeIncidents: number;
  driverConnectivityPct: number;
}

export interface ExperimentRecord {
  id: string;
  experimentId: string;
  seed: string;
  policy: 'BASELINE' | 'NEXFLOW';
  vehicles: number;
  deliveries: number;
  bays: number;
  incidents: number;
  status: 'DRAFT' | 'RUNNING' | 'COMPLETED' | 'CONNECTOR_READY';
  results: ExperimentResults | null;
  createdAt: string;
}

export interface ExperimentResults {
  avgIdleTimeMin: number;
  bayTurnoverPerHr: number;
  distancePerOrderKm: number;
  lateOrdersPct: number;
  avgEtaMin: number;
  bayUtilizationPct: number;
  vehicleUtilizationPct: number;
  solverRuntimeMs: number;
}

export interface AdapterEvent {
  sourceSystem: string;
  eventType: string;
  eventTime: string;
  vehicleNo: string;
  location: LatLng;
  consignmentId: string;
  cargoStatus: string;
  load: {
    units: number;
    weightKg: number;
  };
  sourceVersion: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    requestId: string;
    page?: number;
    pageSize?: number;
    total?: number;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    requestId: string;
  };
}
