// Typed API client — Frontend → api-client → Node API → service layer → repository/adapter
// In Bolt preview mode, the API client calls the demo repositories directly.
// Antigravity will replace with actual fetch() calls to Node/Express.

import type {
  Vehicle, Delivery, Bay, BaySlot, Incident, RoutePlan,
  Prediction, OptimizationRun, KpiSummary, ServiceHealth,
  DataSource, AuditEvent, User, ExperimentRecord,
  OptimizationRequest, OptimizationResult,
} from '@/types';

import {
  vehicleRepo, deliveryRepo, bayRepo, incidentRepo,
  routeRepo, predictionRepo, optimizationRepo,
  auditRepo, dataSourceRepo, kpiRepo, serviceHealthRepo,
  experimentRepo,
} from '@/repositories';

export const apiClient = {
  // AUTH
  async login(email: string, _password: string): Promise<User | null> {
    // Demo auth — accepts any of the demo users
    const { userRepo } = await import('@/repositories');
    const user = await userRepo.getByEmail(email);
    return user;
  },

  // VEHICLES
  async getVehicles(): Promise<Vehicle[]> { return vehicleRepo.getAll(); },
  async getVehicle(id: string): Promise<Vehicle | null> { return vehicleRepo.getById(id); },
  async updateVehicleLocation(id: string, lat: number, lon: number): Promise<Vehicle | null> {
    return vehicleRepo.updateLocation(id, lat, lon);
  },

  // DELIVERIES
  async getDeliveries(): Promise<Delivery[]> { return deliveryRepo.getAll(); },
  async getDelivery(id: string): Promise<Delivery | null> { return deliveryRepo.getById(id); },
  async createDelivery(delivery: Omit<Delivery, 'id' | 'createdAt'>): Promise<Delivery> {
    const d = await deliveryRepo.create(delivery);
    await auditRepo.create({ eventType: 'DELIVERY_CREATED', actor: 'demo-user', entityType: 'delivery', entityId: d.id, metadata: { priority: d.priority } });
    return d;
  },
  async updateDelivery(id: string, patch: Partial<Delivery>): Promise<Delivery | null> {
    return deliveryRepo.update(id, patch);
  },

  // BAYS
  async getBays(): Promise<Bay[]> { return bayRepo.getAll(); },
  async getBay(id: string): Promise<Bay | null> { return bayRepo.getById(id); },
  async getBaySlots(): Promise<BaySlot[]> { return bayRepo.getSlots(); },
  async createBayReservation(bayId: string, slot: Omit<BaySlot, 'id' | 'slotId'>): Promise<BaySlot> {
    const s = await bayRepo.createReservation(bayId, slot);
    await auditRepo.create({ eventType: 'BAY_RESERVED', actor: 'demo-user', entityType: 'bay_slot', entityId: s.slotId, metadata: { bayId, deliveryId: slot.deliveryId } });
    return s;
  },

  // INCIDENTS
  async getIncidents(): Promise<Incident[]> { return incidentRepo.getAll(); },
  async createIncident(incident: Omit<Incident, 'id' | 'incidentId' | 'createdAt' | 'resolvedAt'>): Promise<Incident> {
    const i = await incidentRepo.create(incident);
    await auditRepo.create({ eventType: 'INCIDENT_CREATED', actor: 'system', entityType: 'incident', entityId: i.incidentId, metadata: { type: i.type, severity: i.severity } });
    return i;
  },
  async updateIncident(id: string, patch: Partial<Incident>): Promise<Incident | null> {
    return incidentRepo.update(id, patch);
  },

  // ROUTES
  async getRoutes(): Promise<RoutePlan[]> { return routeRepo.getAll(); },
  async getRoute(id: string): Promise<RoutePlan | null> { return routeRepo.getById(id); },
  async invalidateRoute(id: string): Promise<RoutePlan | null> {
    const r = await routeRepo.invalidate(id);
    if (r) await auditRepo.create({ eventType: 'ROUTE_INVALIDATED', actor: 'system', entityType: 'route_plan', entityId: r.routeId, metadata: { reason: 'INCIDENT' } });
    return r;
  },

  // PREDICTIONS
  async getPredictions(): Promise<Prediction[]> { return predictionRepo.getAll(); },

  // OPTIMIZATION
  async getOptimizationRuns(): Promise<OptimizationRun[]> { return optimizationRepo.getRuns(); },
  async createOptimizationRun(req: OptimizationRequest): Promise<OptimizationRun> {
    const run = await optimizationRepo.createRun(req);
    await auditRepo.create({ eventType: 'OPTIMIZATION_STARTED', actor: 'system', entityType: 'optimization_run', entityId: run.runId, metadata: { vehicles: run.vehicles, deliveries: run.deliveries } });
    return run;
  },
  async replan(runId: string): Promise<OptimizationRun | null> {
    const run = await optimizationRepo.replan(runId);
    if (run) await auditRepo.create({ eventType: 'OPTIMIZATION_STARTED', actor: 'system', entityType: 'optimization_run', entityId: run.runId, metadata: { replan: true } });
    return run;
  },

  // KPI
  async getKpiSummary(): Promise<KpiSummary> { return kpiRepo.getSummary(); },

  // SERVICE HEALTH
  async getServiceHealth(): Promise<ServiceHealth[]> { return serviceHealthRepo.getAll(); },

  // DATA SOURCES
  async getDataSources(): Promise<DataSource[]> { return dataSourceRepo.getAll(); },

  // AUDIT
  async getAuditEvents(): Promise<AuditEvent[]> { return auditRepo.getAll(); },
  async createAuditEvent(event: Omit<AuditEvent, 'id' | 'eventId' | 'timestamp'>): Promise<AuditEvent> {
    return auditRepo.create(event);
  },

  // EXPERIMENTS
  async getExperiments(): Promise<ExperimentRecord[]> { return experimentRepo.getAll(); },
  async createExperiment(exp: Omit<ExperimentRecord, 'id' | 'experimentId' | 'createdAt'>): Promise<ExperimentRecord> {
    return experimentRepo.create(exp);
  },

  // DEMO
  async resetDemo(): Promise<void> {
    window.location.reload();
  },
};
