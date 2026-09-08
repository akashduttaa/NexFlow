// Repository interfaces — Antigravity will replace DemoRepository with PostgresRepository
// without rewriting the frontend.

import type {
  Vehicle, Delivery, Bay, BaySlot, Incident, RoutePlan,
  Prediction, OptimizationRun, Driver, Fleet, AuditEvent,
  DataSource, User, Telemetry, Organization, KpiSummary,
  OptimizationRequest, OptimizationResult, ServiceHealth,
  ExperimentRecord,
} from '@/types';

import * as fixtures from '@/data/fixtures';

export interface IUserRepository {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
}

export interface IFleetRepository {
  getAll(): Promise<Fleet[]>;
  getById(id: string): Promise<Fleet | null>;
}

export interface IVehicleRepository {
  getAll(): Promise<Vehicle[]>;
  getById(id: string): Promise<Vehicle | null>;
  updateLocation(id: string, lat: number, lon: number): Promise<Vehicle | null>;
}

export interface IDeliveryRepository {
  getAll(): Promise<Delivery[]>;
  getById(id: string): Promise<Delivery | null>;
  create(delivery: Omit<Delivery, 'id' | 'createdAt'>): Promise<Delivery>;
  update(id: string, patch: Partial<Delivery>): Promise<Delivery | null>;
}

export interface IBayRepository {
  getAll(): Promise<Bay[]>;
  getById(id: string): Promise<Bay | null>;
  getSlots(): Promise<BaySlot[]>;
  createReservation(bayId: string, slot: Omit<BaySlot, 'id' | 'slotId'>): Promise<BaySlot>;
}

export interface IIncidentRepository {
  getAll(): Promise<Incident[]>;
  getById(id: string): Promise<Incident | null>;
  create(incident: Omit<Incident, 'id' | 'incidentId' | 'createdAt' | 'resolvedAt'>): Promise<Incident>;
  update(id: string, patch: Partial<Incident>): Promise<Incident | null>;
}

export interface IRouteRepository {
  getAll(): Promise<RoutePlan[]>;
  getById(id: string): Promise<RoutePlan | null>;
  getByVehicleId(vehicleId: string): Promise<RoutePlan | null>;
  invalidate(id: string): Promise<RoutePlan | null>;
}

export interface IPredictionRepository {
  getAll(): Promise<Prediction[]>;
  getByType(type: Prediction['type']): Promise<Prediction[]>;
}

export interface IOptimizationRepository {
  getRuns(): Promise<OptimizationRun[]>;
  getRunById(id: string): Promise<OptimizationRun | null>;
  createRun(req: OptimizationRequest): Promise<OptimizationRun>;
  replan(runId: string): Promise<OptimizationRun | null>;
}

export interface ITelemetryRepository {
  getAll(): Promise<Telemetry[]>;
  getByVehicleId(vehicleId: string): Promise<Telemetry | null>;
}

export interface IAuditRepository {
  getAll(): Promise<AuditEvent[]>;
  create(event: Omit<AuditEvent, 'id' | 'eventId' | 'timestamp'>): Promise<AuditEvent>;
}

export interface IDataSourceRepository {
  getAll(): Promise<DataSource[]>;
}

export interface IOrganizationRepository {
  getAll(): Promise<Organization[]>;
  getById(id: string): Promise<Organization | null>;
}

export interface IKpiRepository {
  getSummary(): Promise<KpiSummary>;
}

export interface IServiceHealthRepository {
  getAll(): Promise<ServiceHealth[]>;
}

export interface IExperimentRepository {
  getAll(): Promise<ExperimentRecord[]>;
  create(exp: Omit<ExperimentRecord, 'id' | 'experimentId' | 'createdAt'>): Promise<ExperimentRecord>;
}

// ─── Demo Repository Implementations (Bolt preview mode) ───────────────

class DemoUserRepository implements IUserRepository {
  async getAll() { return fixtures.users; }
  async getById(id: string) { return fixtures.users.find(u => u.id === id) ?? null; }
  async getByEmail(email: string) { return fixtures.users.find(u => u.email === email) ?? null; }
}

class DemoFleetRepository implements IFleetRepository {
  async getAll() { return fixtures.fleets; }
  async getById(id: string) { return fixtures.fleets.find(f => f.id === id) ?? null; }
}

class DemoVehicleRepository implements IVehicleRepository {
  async getAll() { return fixtures.vehicles; }
  async getById(id: string) { return fixtures.vehicles.find(v => v.id === id) ?? null; }
  async updateLocation(id: string, lat: number, lon: number) {
    const v = fixtures.vehicles.find(v => v.id === id);
    if (v) { v.location = { lat, lon }; v.lastHeartbeat = new Date().toISOString(); }
    return v ?? null;
  }
}

class DemoDeliveryRepository implements IDeliveryRepository {
  async getAll() { return fixtures.deliveries; }
  async getById(id: string) { return fixtures.deliveries.find(d => d.id === id) ?? null; }
  async create(delivery: Omit<Delivery, 'id' | 'createdAt'>) {
    const id = `dlv-${String(fixtures.deliveries.length + 1).padStart(3, '0')}`;
    const newDelivery: Delivery = { ...delivery, id, createdAt: new Date().toISOString() };
    fixtures.deliveries.push(newDelivery);
    return newDelivery;
  }
  async update(id: string, patch: Partial<Delivery>) {
    const d = fixtures.deliveries.find(d => d.id === id);
    if (d) Object.assign(d, patch);
    return d ?? null;
  }
}

class DemoBayRepository implements IBayRepository {
  async getAll() { return fixtures.bays; }
  async getById(id: string) { return fixtures.bays.find(b => b.id === id) ?? null; }
  async getSlots() { return fixtures.baySlots; }
  async createReservation(bayId: string, slot: Omit<BaySlot, 'id' | 'slotId'>) {
    const id = `slt-${String(fixtures.baySlots.length + 1).padStart(3, '0')}`;
    const slotId = `S-${String(fixtures.baySlots.length + 1).padStart(3, '0')}`;
    const newSlot: BaySlot = { ...slot, id, slotId };
    fixtures.baySlots.push(newSlot);
    return newSlot;
  }
}

class DemoIncidentRepository implements IIncidentRepository {
  async getAll() { return fixtures.incidents; }
  async getById(id: string) { return fixtures.incidents.find(i => i.id === id) ?? null; }
  async create(incident: Omit<Incident, 'id' | 'incidentId' | 'createdAt' | 'resolvedAt'>) {
    const id = `inc-${String(fixtures.incidents.length + 1).padStart(3, '0')}`;
    const incidentId = `INC-${String(fixtures.incidents.length + 1).padStart(4, '0')}`;
    const newIncident: Incident = {
      ...incident, id, incidentId,
      createdAt: new Date().toISOString(),
      resolvedAt: null,
    };
    fixtures.incidents.unshift(newIncident);
    return newIncident;
  }
  async update(id: string, patch: Partial<Incident>) {
    const i = fixtures.incidents.find(i => i.id === id);
    if (i) Object.assign(i, patch);
    return i ?? null;
  }
}

class DemoRouteRepository implements IRouteRepository {
  async getAll() { return fixtures.routePlans; }
  async getById(id: string) { return fixtures.routePlans.find(r => r.id === id) ?? null; }
  async getByVehicleId(vehicleId: string) {
    return fixtures.routePlans.find(r => r.vehicleId === vehicleId && r.status === 'ACTIVE') ?? null;
  }
  async invalidate(id: string) {
    const r = fixtures.routePlans.find(r => r.id === id);
    if (r) { r.status = 'INVALIDATED'; r.invalidatedAt = new Date().toISOString(); }
    return r ?? null;
  }
}

class DemoPredictionRepository implements IPredictionRepository {
  async getAll() { return fixtures.predictions; }
  async getByType(type: Prediction['type']) {
    return fixtures.predictions.filter(p => p.type === type);
  }
}

class DemoOptimizationRepository implements IOptimizationRepository {
  async getRuns() { return fixtures.optimizationRuns; }
  async getRunById(id: string) { return fixtures.optimizationRuns.find(r => r.id === id) ?? null; }
  async createRun(_req: OptimizationRequest) {
    const id = `opt-${String(fixtures.optimizationRuns.length + 1).padStart(3, '0')}`;
    const runId = `OPT-2026-${String(fixtures.optimizationRuns.length + 1).padStart(4, '0')}`;
    const newRun: OptimizationRun = {
      id, runId,
      status: 'CONNECTOR_READY',
      solverStatus: null,
      runtimeMs: null,
      objectiveValue: null,
      vehicles: _req.vehicles.length,
      deliveries: _req.deliveries.length,
      bays: _req.bayCandidates.length,
      lateDeliveries: null,
      warnings: ['OR-Tools CP-SAT connector ready. Awaiting solver service.'],
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    fixtures.optimizationRuns.unshift(newRun);
    return newRun;
  }
  async replan(runId: string) {
    const r = fixtures.optimizationRuns.find(r => r.runId === runId);
    if (r) { r.status = 'CONNECTOR_READY'; r.warnings = ['Replan requested. CP-SAT connector ready.']; }
    return r ?? null;
  }
}

class DemoTelemetryRepository implements ITelemetryRepository {
  async getAll() { return fixtures.telemetry; }
  async getByVehicleId(vehicleId: string) {
    return fixtures.telemetry.find(t => t.vehicleId === vehicleId) ?? null;
  }
}

class DemoAuditRepository implements IAuditRepository {
  async getAll() { return fixtures.auditEvents; }
  async create(event: Omit<AuditEvent, 'id' | 'eventId' | 'timestamp'>) {
    const id = `aud-${String(fixtures.auditEvents.length + 1).padStart(3, '0')}`;
    const eventId = `EVT-${String(fixtures.auditEvents.length + 1).padStart(3, '0')}`;
    const newEvent: AuditEvent = { ...event, id, eventId, timestamp: new Date().toISOString() };
    fixtures.auditEvents.unshift(newEvent);
    return newEvent;
  }
}

class DemoDataSourceRepository implements IDataSourceRepository {
  async getAll() { return fixtures.dataSources; }
}

class DemoOrganizationRepository implements IOrganizationRepository {
  async getAll() { return fixtures.organizations; }
  async getById(id: string) { return fixtures.organizations.find(o => o.id === id) ?? null; }
}

class DemoKpiRepository implements IKpiRepository {
  async getSummary(): Promise<KpiSummary> {
    const activeVehicles = fixtures.vehicles.filter(v => v.status !== 'IDLE' && v.status !== 'OFFLINE').length;
    const openDeliveries = fixtures.deliveries.filter(d => !['DELIVERED', 'CANCELLED'].includes(d.status)).length;
    const availableBays = fixtures.bays.filter(b => b.state === 'AVAILABLE').length;
    const reservedBays = fixtures.bays.filter(b => b.state === 'RESERVED' || b.state === 'OCCUPIED').length;
    const activeIncidents = fixtures.incidents.filter(i => i.status === 'ACTIVE').length;
    const onlineDrivers = fixtures.drivers.filter(d => d.connectionStatus === 'ONLINE').length;
    return {
      activeVehicles,
      openDeliveries,
      availableBays,
      reservedBays,
      averageEta: '14 min',
      predictedFreightPressure: 'HIGH',
      activeIncidents,
      driverConnectivityPct: Math.round((onlineDrivers / fixtures.drivers.length) * 100),
    };
  }
}

class DemoServiceHealthRepository implements IServiceHealthRepository {
  async getAll(): Promise<ServiceHealth[]> {
    return [
      { name: 'Node API', status: 'HEALTHY', latencyMs: 12, detail: 'Operational', lastChecked: new Date().toISOString() },
      { name: 'PostgreSQL + PostGIS', status: 'CONNECTOR_READY', latencyMs: null, detail: 'Schema defined. Awaiting connection.', lastChecked: new Date().toISOString() },
      { name: 'Redis', status: 'CONNECTOR_READY', latencyMs: null, detail: 'Hot-state store. Awaiting connection.', lastChecked: new Date().toISOString() },
      { name: 'OSRM', status: 'CONNECTOR_READY', latencyMs: null, detail: 'Routing service. Awaiting Docker setup.', lastChecked: new Date().toISOString() },
      { name: 'AI Service (FastAPI)', status: 'CONNECTOR_READY', latencyMs: null, detail: 'XGBoost inference. Awaiting model deployment.', lastChecked: new Date().toISOString() },
      { name: 'Optimizer (CP-SAT)', status: 'CONNECTOR_READY', latencyMs: null, detail: 'OR-Tools CP-SAT. Awaiting solver service.', lastChecked: new Date().toISOString() },
      { name: 'Socket.IO', status: 'HEALTHY', latencyMs: 8, detail: 'Simulated realtime events', lastChecked: new Date().toISOString() },
      { name: 'ICCC Adapter', status: 'CONNECTOR_READY', latencyMs: null, detail: 'Adapter contract ready. Awaiting authorization.', lastChecked: new Date().toISOString() },
    ];
  }
}

class DemoExperimentRepository implements IExperimentRepository {
  private experiments: ExperimentRecord[] = [
    {
      id: 'exp-001', experimentId: 'EXP-001', seed: 'burrabazar-001',
      policy: 'BASELINE', vehicles: 20, deliveries: 50, bays: 10, incidents: 5,
      status: 'COMPLETED',
      results: { avgIdleTimeMin: 42, bayTurnoverPerHr: 1.8, distancePerOrderKm: 6.2, lateOrdersPct: 22, avgEtaMin: 28, bayUtilizationPct: 55, vehicleUtilizationPct: 68, solverRuntimeMs: 0 },
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'exp-002', experimentId: 'EXP-002', seed: 'burrabazar-001',
      policy: 'NEXFLOW', vehicles: 20, deliveries: 50, bays: 10, incidents: 5,
      status: 'CONNECTOR_READY',
      results: null,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ];
  async getAll() { return this.experiments; }
  async create(exp: Omit<ExperimentRecord, 'id' | 'experimentId' | 'createdAt'>) {
    const id = `exp-${String(this.experiments.length + 1).padStart(3, '0')}`;
    const experimentId = `EXP-${String(this.experiments.length + 1).padStart(3, '0')}`;
    const newExp: ExperimentRecord = { ...exp, id, experimentId, createdAt: new Date().toISOString() };
    this.experiments.push(newExp);
    return newExp;
  }
}

// Singleton instances
export const userRepo: IUserRepository = new DemoUserRepository();
export const fleetRepo: IFleetRepository = new DemoFleetRepository();
export const vehicleRepo: IVehicleRepository = new DemoVehicleRepository();
export const deliveryRepo: IDeliveryRepository = new DemoDeliveryRepository();
export const bayRepo: IBayRepository = new DemoBayRepository();
export const incidentRepo: IIncidentRepository = new DemoIncidentRepository();
export const routeRepo: IRouteRepository = new DemoRouteRepository();
export const predictionRepo: IPredictionRepository = new DemoPredictionRepository();
export const optimizationRepo: IOptimizationRepository = new DemoOptimizationRepository();
export const telemetryRepo: ITelemetryRepository = new DemoTelemetryRepository();
export const auditRepo: IAuditRepository = new DemoAuditRepository();
export const dataSourceRepo: IDataSourceRepository = new DemoDataSourceRepository();
export const organizationRepo: IOrganizationRepository = new DemoOrganizationRepository();
export const kpiRepo: IKpiRepository = new DemoKpiRepository();
export const serviceHealthRepo: IServiceHealthRepository = new DemoServiceHealthRepository();
export const experimentRepo: IExperimentRepository = new DemoExperimentRepository();

// Export drivers for convenience
export const drivers: Driver[] = fixtures.drivers;
