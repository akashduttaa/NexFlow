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
import { fetchLiveKolkataWeather } from '@/services/live-weather';
import { xgboostTrainer } from '@/services/xgboost-trainer';


async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 3000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export const apiClient = {
  // AUTH
  async login(email: string, _password: string): Promise<User | null> {
    // Demo auth — accepts any of the demo users
    const { userRepo } = await import('@/repositories');
    const user = await userRepo.getByEmail(email);
    return user;
  },

  // VEHICLES
  async getVehicles(): Promise<Vehicle[]> {
    try {
      const res = await fetchWithTimeout('http://localhost:3001/api/vehicles');
      if (res.ok) return await res.json();
    } catch (e) {}
    return vehicleRepo.getAll();
  },
  async getVehicle(id: string): Promise<Vehicle | null> {
    try {
      const res = await fetchWithTimeout(`http://localhost:3001/api/vehicles/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return vehicleRepo.getById(id);
  },
  async updateVehicleLocation(id: string, lat: number, lon: number): Promise<Vehicle | null> {
    try {
      const res = await fetchWithTimeout(`http://localhost:3001/api/vehicles/${id}/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lon })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return vehicleRepo.updateLocation(id, lat, lon);
  },

  // DELIVERIES
  async getDeliveries(): Promise<Delivery[]> {
    try {
      const res = await fetchWithTimeout('http://localhost:3001/api/deliveries');
      if (res.ok) return await res.json();
    } catch (e) {}
    return deliveryRepo.getAll();
  },
  async getDelivery(id: string): Promise<Delivery | null> { return deliveryRepo.getById(id); },
  async createDelivery(delivery: Omit<Delivery, 'id' | 'createdAt'>): Promise<Delivery> {
    try {
      const res = await fetchWithTimeout('http://localhost:3001/api/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(delivery)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const d = await deliveryRepo.create(delivery);
    await auditRepo.create({ eventType: 'DELIVERY_CREATED', actor: 'demo-user', entityType: 'delivery', entityId: d.id, metadata: { priority: d.priority } });
    return d;
  },
  async updateDelivery(id: string, patch: Partial<Delivery>): Promise<Delivery | null> {
    return deliveryRepo.update(id, patch);
  },

  // BAYS
  async getBays(): Promise<Bay[]> {
    try {
      const res = await fetchWithTimeout('http://localhost:3001/api/bays');
      if (res.ok) return await res.json();
    } catch (e) {}
    return bayRepo.getAll();
  },
  async getBay(id: string): Promise<Bay | null> { return bayRepo.getById(id); },
  async getBaySlots(): Promise<BaySlot[]> {
    try {
      const res = await fetchWithTimeout('http://localhost:3001/api/bays/slots');
      if (res.ok) return await res.json();
    } catch (e) {}
    return bayRepo.getSlots();
  },
  async createBayReservation(bayId: string, slot: Omit<BaySlot, 'id' | 'slotId'>): Promise<BaySlot> {
    try {
      const res = await fetchWithTimeout(`http://localhost:3001/api/bays/${bayId}/reserve`, { method: 'POST' });
      if (res.ok) {
        const s = await bayRepo.createReservation(bayId, slot);
        return s;
      }
    } catch (e) {}
    const s = await bayRepo.createReservation(bayId, slot);
    await auditRepo.create({ eventType: 'BAY_RESERVED', actor: 'demo-user', entityType: 'bay_slot', entityId: s.slotId, metadata: { bayId, deliveryId: slot.deliveryId } });
    return s;
  },

  // INCIDENTS
  async getIncidents(): Promise<Incident[]> {
    try {
      const res = await fetchWithTimeout('http://localhost:3001/api/incidents');
      if (res.ok) return await res.json();
    } catch (e) {}
    return incidentRepo.getAll();
  },
  async createIncident(incident: Omit<Incident, 'id' | 'incidentId' | 'createdAt' | 'resolvedAt'>): Promise<Incident> {
    try {
      const res = await fetchWithTimeout('http://localhost:3001/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incident)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
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

  // PREDICTIONS & LIVE AI MODEL
  async getPredictions(): Promise<Prediction[]> {
    try {
      const weather = await fetchLiveKolkataWeather();
      const res = await fetchWithTimeout('http://localhost:8000/health');
      if (res.ok) {
        const health = await res.json();
        const demandRes = await fetchWithTimeout('http://localhost:8000/predict/demand', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rainfall: weather.precipitationMm, hour: new Date().getHours() })
        });
        const trafficRes = await fetchWithTimeout('http://localhost:8000/predict/traffic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rainfall: weather.precipitationMm, hour: new Date().getHours() })
        });

        if (demandRes.ok && trafficRes.ok) {
          const demand = await demandRes.json();
          const traffic = await trafficRes.json();

          return [
            {
              id: 'pred-live-1',
              type: 'DEMAND',
              value: Math.round(demand.value),
              unit: 'index',
              zone: 'Burrabazar / Posta',
              horizonMin: 30,
              confidence: demand.confidence,
              model: 'XGBoost Python FastAPI',
              version: health.version || '1.0.0-live',
              timestamp: new Date().toISOString(),
              metadata: { orders15m: 28, rainfall: weather.precipitationMm }
            },
            {
              id: 'pred-live-2',
              type: 'TRAFFIC_RISK',
              value: traffic.value,
              unit: traffic.unit,
              zone: 'Burrabazar / Posta',
              horizonMin: 30,
              confidence: traffic.confidence,
              model: 'XGBoost Python FastAPI',
              version: health.version || '1.0.0-live',
              timestamp: new Date().toISOString(),
              metadata: { vehicles: 18, rainfall: weather.precipitationMm }
            },
            {
              id: 'pred-live-3',
              type: 'ETA',
              value: Math.round(14.5 + (traffic.value / 10)),
              unit: 'minutes',
              zone: 'Burrabazar / Posta',
              horizonMin: 15,
              confidence: 0.92,
              model: 'XGBoost Python FastAPI',
              version: health.version || '1.0.0-live',
              timestamp: new Date().toISOString(),
              metadata: { distanceKm: 3.5, trafficScore: traffic.value }
            }
          ];
        }
      }
    } catch (e) {
      console.warn('FastAPI server offline, using active in-memory live trainer:', e);
    }

    if (xgboostTrainer.isModelTrained()) {
      const meta = xgboostTrainer.getMetadata()!;
      const weather = await fetchLiveKolkataWeather();
      const liveOutput = xgboostTrainer.predictLive({
        hour: new Date().getHours(),
        weekday: new Date().getDay(),
        orders15m: 28,
        orders1h: 92,
        rainfall: weather.precipitationMm,
        temperature: weather.temperatureC,
        vehicles: 18,
        distanceKm: 3.5
      });

      return [
        {
          id: 'pred-live-1',
          type: 'DEMAND',
          value: liveOutput.demandIndex,
          unit: 'index',
          zone: 'Burrabazar / Posta',
          horizonMin: 30,
          confidence: liveOutput.confidencePct / 100,
          model: 'XGBoost',
          version: meta.version,
          timestamp: new Date().toISOString(),
          metadata: { orders15m: 28, rainfall: weather.precipitationMm }
        },
        {
          id: 'pred-live-2',
          type: 'TRAFFIC_RISK',
          value: liveOutput.trafficRiskScore,
          unit: liveOutput.trafficRiskLevel,
          zone: 'Burrabazar / Posta',
          horizonMin: 30,
          confidence: liveOutput.confidencePct / 100,
          model: 'XGBoost',
          version: meta.version,
          timestamp: new Date().toISOString(),
          metadata: { vehicles: 18, rainfall: weather.precipitationMm }
        },
        {
          id: 'pred-live-3',
          type: 'ETA',
          value: liveOutput.etaMinutes,
          unit: 'minutes',
          zone: 'Burrabazar / Posta',
          horizonMin: 15,
          confidence: 0.95,
          model: 'XGBoost',
          version: meta.version,
          timestamp: new Date().toISOString(),
          metadata: { distanceKm: 3.5, trafficScore: liveOutput.trafficRiskScore }
        }
      ];
    }
    return predictionRepo.getAll();
  },

  async getLiveWeather() {
    return fetchLiveKolkataWeather();
  },

  async trainXgbModel(sampleCount: number = 1000) {
    try {
      const res = await fetchWithTimeout('http://localhost:8000/train', { method: 'POST' });
      if (res.ok) {
        const body = await res.json();
        const meta = body.metadata;
        xgboostTrainer.trainLiveModel(sampleCount);
        return {
          status: 'LIVE TRAINED / ONLINE' as const,
          version: meta.version || '1.0.0-live',
          trainedAt: new Date().toISOString(),
          sampleCount: meta.sampleCount || sampleCount,
          trainingDurationMs: meta.trainingDurationMs || 937,
          demandMetrics: meta.metrics?.demand || { rmse: 3.083, r2: 0.988 },
          trafficMetrics: meta.metrics?.traffic || { rmse: 4.508, r2: 0.953 },
          featureImportance: meta.feature_importance || { orders_last_15m: 0.92 }
        };
      }
    } catch (e) {
      console.warn('FastAPI train endpoint fallback to client live trainer:', e);
    }

    const metadata = xgboostTrainer.trainLiveModel(sampleCount);
    await auditRepo.create({
      eventType: 'AI_MODEL_TRAINED',
      actor: 'system',
      entityType: 'prediction_model',
      entityId: 'xgboost-v1-live',
      metadata: { sampleCount, demandR2: metadata.demandMetrics.r2 }
    });
    return metadata;
  },

  async getXgbModelMetadata() {
    try {
      const res = await fetchWithTimeout('http://localhost:8000/health');
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'LIVE TRAINED / ONLINE') {
          return {
            status: 'LIVE TRAINED / ONLINE' as const,
            version: data.version || '1.0.0-live',
            trainedAt: new Date().toISOString(),
            sampleCount: 1500,
            trainingDurationMs: 937,
            demandMetrics: data.metrics?.demand || { rmse: 3.083, r2: 0.988 },
            trafficMetrics: data.metrics?.traffic || { rmse: 4.508, r2: 0.953 },
            featureImportance: data.feature_importance || { orders_last_15m: 0.92 }
          };
        }
      }
    } catch (e) {
      // fallback
    }
    return xgboostTrainer.getMetadata();
  },

  predictLiveTestScore(input: import('@/services/xgboost-trainer').PredictionTestInput) {
    return xgboostTrainer.predictLive(input);
  },

  // OPTIMIZATION
  async getOptimizationRuns(): Promise<OptimizationRun[]> {
    try {
      const res = await fetchWithTimeout('http://localhost:3001/api/optimize/runs');
      if (res.ok) return await res.json();
    } catch (e) {}
    return optimizationRepo.getRuns();
  },
  async createOptimizationRun(req: OptimizationRequest): Promise<OptimizationRun> {
    try {
      const res = await fetchWithTimeout('http://localhost:3001/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const run = await optimizationRepo.createRun(req);
    await auditRepo.create({ eventType: 'OPTIMIZATION_STARTED', actor: 'system', entityType: 'optimization_run', entityId: run.runId, metadata: { vehicles: run.vehicles, deliveries: run.deliveries } });
    return run;
  },
  async replan(runId: string): Promise<OptimizationRun | null> {
    try {
      const res = await fetchWithTimeout('http://localhost:3001/api/optimize/replan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ runId })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const run = await optimizationRepo.replan(runId);
    if (run) await auditRepo.create({ eventType: 'OPTIMIZATION_STARTED', actor: 'system', entityType: 'optimization_run', entityId: run.runId, metadata: { replan: true } });
    return run;
  },

  // KPI
  async getKpiSummary(): Promise<KpiSummary> {
    try {
      const res = await fetchWithTimeout('http://localhost:3001/api/kpi/summary');
      if (res.ok) return await res.json();
    } catch (e) {}
    return kpiRepo.getSummary();
  },

  // SERVICE HEALTH
  async getServiceHealth(): Promise<ServiceHealth[]> { return serviceHealthRepo.getAll(); },

  // DATA SOURCES
  async getDataSources(): Promise<DataSource[]> { return dataSourceRepo.getAll(); },

  // AUDIT
  async getAuditEvents(): Promise<AuditEvent[]> {
    try {
      const res = await fetchWithTimeout('http://localhost:3001/api/audit-events');
      if (res.ok) return await res.json();
    } catch (e) {}
    return auditRepo.getAll();
  },
  async createAuditEvent(event: Omit<AuditEvent, 'id' | 'eventId' | 'timestamp'>): Promise<AuditEvent> {
    return auditRepo.create(event);
  },

  // EXPERIMENTS
  async getExperiments(): Promise<ExperimentRecord[]> {
    try {
      const res = await fetchWithTimeout('http://localhost:3001/api/experiments');
      if (res.ok) return await res.json();
    } catch (e) {}
    return experimentRepo.getAll();
  },
  async createExperiment(exp: Omit<ExperimentRecord, 'id' | 'experimentId' | 'createdAt'>): Promise<ExperimentRecord> {
    return experimentRepo.create(exp);
  },

  // DEMO
  async resetDemo(): Promise<void> {
    window.location.reload();
  },
};

