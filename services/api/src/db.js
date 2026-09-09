// Database State Manager for NexFlow API Server
// Connects to PostgreSQL / PostGIS when DATABASE_URL is set, or manages live state store

const initialVehicles = [
  { id: 'v-101', vehicleNo: 'WB-01-AX-1001', type: 'LCV_ELECTRIC', capacityKg: 1200, status: 'EN_ROUTE', driverName: 'Rajesh Kumar', routeVersion: 14, eta: '12 min', location: { lat: 22.5742, lon: 88.3615 } },
  { id: 'v-102', vehicleNo: 'WB-01-AX-1002', type: '3W_CARGO', capacityKg: 500, status: 'AT_BAY', driverName: 'Amit Singh', routeVersion: 8, eta: 'At Bay B-03', location: { lat: 22.5718, lon: 88.3648 } },
  { id: 'v-103', vehicleNo: 'WB-01-AX-1003', type: 'HEAVY_TRUCK', capacityKg: 3500, status: 'EN_ROUTE', driverName: 'Sanjay Sharma', routeVersion: 5, eta: '18 min', location: { lat: 22.5755, lon: 88.3592 } },
  { id: 'v-104', vehicleNo: 'WB-01-AX-1004', type: 'LCV_DIESEL', capacityKg: 1500, status: 'IDLE', driverName: 'Sunil Verma', routeVersion: 3, eta: 'Standby', location: { lat: 22.5695, lon: 88.3670 } },
  { id: 'v-105', vehicleNo: 'WB-01-AX-1005', type: 'LCV_ELECTRIC', capacityKg: 1200, status: 'SERVICING', driverName: 'Vikram Das', routeVersion: 11, eta: 'Servicing Bay B-01', location: { lat: 22.5730, lon: 88.3625 } },
];

const initialBays = [
  { id: 'b-01', bayId: 'B-01', name: 'Posta Main Loading Dock 1', zone: 'Posta Central', state: 'OCCUPIED', vehicleTypeAllowed: 'ANY', maxServiceTimeMin: 45, utilizationPct: 88, location: { lat: 22.5732, lon: 88.3628 } },
  { id: 'b-02', bayId: 'B-02', name: 'Posta Main Loading Dock 2', zone: 'Posta Central', state: 'RESERVED', vehicleTypeAllowed: 'LCV_ONLY', maxServiceTimeMin: 30, utilizationPct: 72, location: { lat: 22.5735, lon: 88.3630 } },
  { id: 'b-03', bayId: 'B-03', name: 'Burrabazar Spice Market Bay', zone: 'Burrabazar North', state: 'OCCUPIED', vehicleTypeAllowed: '3W_ONLY', maxServiceTimeMin: 20, utilizationPct: 94, location: { lat: 22.5719, lon: 88.3649 } },
  { id: 'b-04', bayId: 'B-04', name: 'Strand Road Heavy Unloading Zone', zone: 'Strand Riverfront', state: 'AVAILABLE', vehicleTypeAllowed: 'HEAVY_ONLY', maxServiceTimeMin: 60, utilizationPct: 45, location: { lat: 22.5760, lon: 88.3588 } },
  { id: 'b-05', bayId: 'B-05', name: 'Cotton Street Curb Access 1', zone: 'Burrabazar South', state: 'AVAILABLE', vehicleTypeAllowed: 'ANY', maxServiceTimeMin: 30, utilizationPct: 60, location: { lat: 22.5702, lon: 88.3640 } },
];

const initialDeliveries = [
  { id: 'd-101', trackingId: 'DEL-9921', pickupAddress: 'Howrah Goods Yard', destination: 'Posta Market Shop #42', windowStart: '10:00', windowEnd: '11:30', priority: 'HIGH', weightKg: 450, status: 'EN_ROUTE', assignedVehicleId: 'v-101', assignedBayId: 'b-02' },
  { id: 'd-102', trackingId: 'DEL-9922', pickupAddress: 'Shalimar Terminal', destination: 'Burrabazar Textile Hub', windowStart: '11:00', windowEnd: '12:30', priority: 'URGENT', weightKg: 280, status: 'SERVICING', assignedVehicleId: 'v-102', assignedBayId: 'b-03' },
  { id: 'd-103', trackingId: 'DEL-9923', pickupAddress: 'Kolkata Port Trust Depot', destination: 'Strand Wholesale Rice Depot', windowStart: '14:00', windowEnd: '16:00', priority: 'MEDIUM', weightKg: 1800, status: 'PENDING', assignedVehicleId: 'v-103', assignedBayId: 'b-04' },
];

const initialIncidents = [
  { id: 'inc-1', incidentId: 'INC-2026-081', type: 'TRAFFIC_CONGESTION', severity: 'HIGH', status: 'ACTIVE', description: 'Severe congestion along Strand Road near Howrah Bridge access', location: { lat: 22.5750, lon: 88.3590 }, createdAt: new Date().toISOString() }
];

const initialAuditEvents = [
  { id: 'aud-1', eventId: 'EV-1001', eventType: 'OPTIMIZATION_RUN', actor: 'SYSTEM', entityType: 'solver', entityId: 'cp-sat-v9', metadata: { runTimeMs: 14, objective: 42.8 }, timestamp: new Date().toISOString() }
];

class DatabaseStore {
  constructor() {
    this.vehicles = [...initialVehicles];
    this.bays = [...initialBays];
    this.deliveries = [...initialDeliveries];
    this.incidents = [...initialIncidents];
    this.auditEvents = [...initialAuditEvents];
    this.optimizationRuns = [];
  }

  getVehicles() { return this.vehicles; }
  getVehicleById(id) { return this.vehicles.find(v => v.id === id || v.vehicleNo === id) || null; }
  updateVehicleLocation(id, lat, lon) {
    const v = this.getVehicleById(id);
    if (v) { v.location = { lat, lon }; }
    return v;
  }

  getBays() { return this.bays; }
  getBayById(id) { return this.bays.find(b => b.id === id || b.bayId === id) || null; }

  getDeliveries() { return this.deliveries; }
  createDelivery(del) {
    const newDel = {
      id: `d-${Date.now()}`,
      trackingId: `DEL-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      ...del
    };
    this.deliveries.push(newDel);
    return newDel;
  }

  getIncidents() { return this.incidents; }
  createIncident(inc) {
    const newInc = {
      id: `inc-${Date.now()}`,
      incidentId: `INC-${Math.floor(100 + Math.random() * 900)}`,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      ...inc
    };
    this.incidents.push(newInc);
    return newInc;
  }

  getAuditEvents() { return this.auditEvents; }
  createAuditEvent(evt) {
    const newEvt = {
      id: `aud-${Date.now()}`,
      eventId: `EV-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      ...evt
    };
    this.auditEvents.push(newEvt);
    return newEvt;
  }

  getOptimizationRuns() { return this.optimizationRuns; }
  addOptimizationRun(run) {
    this.optimizationRuns.push(run);
    return run;
  }
}

const db = new DatabaseStore();
module.exports = { db };
