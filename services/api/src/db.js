// Database State Manager & PostgreSQL PostGIS Connector for NexFlow REST API Backend
// Supports PostgreSQL + PostGIS canonical database storage with active state fallback

const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://nexflow:changeme@localhost:5432/nexflow';

// Seed Datasets
const initialVehicles = [
  { id: 'v-101', vehicleNo: 'WB-01-AX-1001', type: 'LCV_ELECTRIC', capacityKg: 1200, status: 'EN_ROUTE', driverName: 'Rajesh Kumar', routeVersion: 14, eta: '12 min', assignedDeliveryId: 'd-101', assignedBayId: 'b-02', location: { lat: 22.5742, lon: 88.3615 } },
  { id: 'v-102', vehicleNo: 'WB-01-AX-1002', type: '3W_CARGO', capacityKg: 500, status: 'AT_BAY', driverName: 'Amit Singh', routeVersion: 8, eta: 'At Bay B-03', assignedDeliveryId: 'd-102', assignedBayId: 'b-03', location: { lat: 22.5718, lon: 88.3648 } },
  { id: 'v-103', vehicleNo: 'WB-01-AX-1003', type: 'HEAVY_TRUCK', capacityKg: 3500, status: 'EN_ROUTE', driverName: 'Sanjay Sharma', routeVersion: 5, eta: '18 min', assignedDeliveryId: 'd-103', assignedBayId: 'b-04', location: { lat: 22.5755, lon: 88.3592 } },
  { id: 'v-104', vehicleNo: 'WB-01-AX-1004', type: 'LCV_DIESEL', capacityKg: 1500, status: 'IDLE', driverName: 'Sunil Verma', routeVersion: 3, eta: 'Standby', location: { lat: 22.5695, lon: 88.3670 } },
  { id: 'v-105', vehicleNo: 'WB-01-AX-1005', type: 'LCV_ELECTRIC', capacityKg: 1200, status: 'SERVICING', driverName: 'Vikram Das', routeVersion: 11, eta: 'Servicing Bay B-01', location: { lat: 22.5730, lon: 88.3625 } },
];

const initialBays = [
  { id: 'b-01', bayId: 'B-01', name: 'Posta Main Loading Dock 1', zone: 'Posta Central', state: 'OCCUPIED', vehicleTypeAllowed: 'ANY', compatibility: ['LCV_ELECTRIC', '3W_CARGO', 'HEAVY_TRUCK'], maxServiceTimeMin: 45, serviceDurationMin: 45, utilizationPct: 88, location: { lat: 22.5732, lon: 88.3628 } },
  { id: 'b-02', bayId: 'B-02', name: 'Posta Main Loading Dock 2', zone: 'Posta Central', state: 'RESERVED', vehicleTypeAllowed: 'LCV_ONLY', compatibility: ['LCV_ELECTRIC', 'LCV_DIESEL'], maxServiceTimeMin: 30, serviceDurationMin: 30, utilizationPct: 72, location: { lat: 22.5735, lon: 88.3630 } },
  { id: 'b-03', bayId: 'B-03', name: 'Burrabazar Spice Market Bay', zone: 'Burrabazar North', state: 'OCCUPIED', vehicleTypeAllowed: '3W_ONLY', compatibility: ['3W_CARGO'], maxServiceTimeMin: 20, serviceDurationMin: 20, utilizationPct: 94, location: { lat: 22.5719, lon: 88.3649 } },
  { id: 'b-04', bayId: 'B-04', name: 'Strand Road Heavy Unloading Zone', zone: 'Strand Riverfront', state: 'AVAILABLE', vehicleTypeAllowed: 'HEAVY_ONLY', compatibility: ['HEAVY_TRUCK'], maxServiceTimeMin: 60, serviceDurationMin: 60, utilizationPct: 45, location: { lat: 22.5760, lon: 88.3588 } },
  { id: 'b-05', bayId: 'B-05', name: 'Cotton Street Curb Access 1', zone: 'Burrabazar South', state: 'AVAILABLE', vehicleTypeAllowed: 'ANY', compatibility: ['LCV_ELECTRIC', '3W_CARGO'], maxServiceTimeMin: 30, serviceDurationMin: 30, utilizationPct: 60, location: { lat: 22.5702, lon: 88.3640 } },
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

const initialBaySlots = [
  { id: 'slot-1', slotId: 'SLOT-01', bayId: 'b-01', deliveryId: 'd-101', startTime: '10:00', endTime: '10:45', status: 'OCCUPIED' },
  { id: 'slot-2', slotId: 'SLOT-02', bayId: 'b-02', deliveryId: 'd-102', startTime: '11:00', endTime: '11:30', status: 'RESERVED' },
  { id: 'slot-3', slotId: 'SLOT-03', bayId: 'b-03', deliveryId: 'd-103', startTime: '14:00', endTime: '15:00', status: 'AVAILABLE' }
];

class DatabaseManager {
  constructor() {
    this.pool = new Pool({
      connectionString: DATABASE_URL,
      connectionTimeoutMillis: 2000,
      idleTimeoutMillis: 10000,
    });
    this.isPostgresConnected = false;

    // Active memory state buffer
    this.vehicles = [...initialVehicles];
    this.bays = [...initialBays];
    this.deliveries = [...initialDeliveries];
    this.incidents = [...initialIncidents];
    this.auditEvents = [...initialAuditEvents];
    this.baySlots = [...initialBaySlots];
    this.optimizationRuns = [];
  }

  async init() {
    try {
      const client = await this.pool.connect();
      this.isPostgresConnected = true;
      console.log('✅ PostgreSQL + PostGIS database connected successfully.');

      await client.query(`
        CREATE TABLE IF NOT EXISTS vehicles (
          id VARCHAR(100) PRIMARY KEY,
          vehicle_no VARCHAR(50) UNIQUE NOT NULL,
          type VARCHAR(50) NOT NULL,
          capacity_kg INTEGER NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'IDLE',
          driver_name VARCHAR(255),
          route_version INTEGER DEFAULT 1,
          eta VARCHAR(50),
          lat DOUBLE PRECISION NOT NULL,
          lon DOUBLE PRECISION NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS bays (
          id VARCHAR(100) PRIMARY KEY,
          bay_id VARCHAR(50) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          zone VARCHAR(100) NOT NULL,
          state VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
          vehicle_type_allowed VARCHAR(50) DEFAULT 'ANY',
          max_service_time_min INTEGER DEFAULT 30,
          utilization_pct INTEGER DEFAULT 0,
          lat DOUBLE PRECISION NOT NULL,
          lon DOUBLE PRECISION NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS deliveries (
          id VARCHAR(100) PRIMARY KEY,
          tracking_id VARCHAR(100) UNIQUE NOT NULL,
          pickup_address VARCHAR(255) NOT NULL,
          destination VARCHAR(255) NOT NULL,
          window_start VARCHAR(50) NOT NULL,
          window_end VARCHAR(50) NOT NULL,
          priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
          weight_kg INTEGER NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
          assigned_vehicle_id VARCHAR(100),
          assigned_bay_id VARCHAR(100),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS incidents (
          id VARCHAR(100) PRIMARY KEY,
          incident_id VARCHAR(100) UNIQUE NOT NULL,
          type VARCHAR(50) NOT NULL,
          severity VARCHAR(50) NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
          description TEXT,
          lat DOUBLE PRECISION NOT NULL,
          lon DOUBLE PRECISION NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS audit_events (
          id VARCHAR(100) PRIMARY KEY,
          event_id VARCHAR(100) UNIQUE NOT NULL,
          event_type VARCHAR(100) NOT NULL,
          actor VARCHAR(100) NOT NULL,
          entity_type VARCHAR(100) NOT NULL,
          entity_id VARCHAR(100) NOT NULL,
          metadata JSONB,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Seed initial data if tables are empty
      const vehicleCheck = await client.query('SELECT COUNT(*) FROM vehicles');
      if (parseInt(vehicleCheck.rows[0].count, 10) === 0) {
        console.log('🌱 Seeding initial records into PostgreSQL database...');
        for (const v of initialVehicles) {
          await client.query(
            `INSERT INTO vehicles (id, vehicle_no, type, capacity_kg, status, driver_name, route_version, eta, lat, lon)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT DO NOTHING`,
            [v.id, v.vehicleNo, v.type, v.capacityKg, v.status, v.driverName, v.routeVersion, v.eta, v.location.lat, v.location.lon]
          );
        }
        for (const b of initialBays) {
          await client.query(
            `INSERT INTO bays (id, bay_id, name, zone, state, vehicle_type_allowed, max_service_time_min, utilization_pct, lat, lon)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT DO NOTHING`,
            [b.id, b.bayId, b.name, b.zone, b.state, b.vehicleTypeAllowed, b.maxServiceTimeMin, b.utilizationPct, b.location.lat, b.location.lon]
          );
        }
        for (const d of initialDeliveries) {
          await client.query(
            `INSERT INTO deliveries (id, tracking_id, pickup_address, destination, window_start, window_end, priority, weight_kg, status, assigned_vehicle_id, assigned_bay_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT DO NOTHING`,
            [d.id, d.trackingId, d.pickupAddress, d.destination, d.windowStart, d.windowEnd, d.priority, d.weightKg, d.status, d.assignedVehicleId, d.assignedBayId]
          );
        }
      }

      client.release();
    } catch (err) {
      this.isPostgresConnected = false;
      console.warn(`⚡ PostgreSQL server offline (${err.message}). Using active NexFlow memory state store.`);
    }
  }

  // VEHICLES
  async getVehicles() {
    if (this.isPostgresConnected) {
      try {
        const res = await this.pool.query('SELECT * FROM vehicles ORDER BY id ASC');
        return res.rows.map(row => ({
          id: row.id,
          vehicleNo: row.vehicle_no,
          type: row.type,
          capacityKg: row.capacity_kg,
          status: row.status,
          driverName: row.driver_name,
          routeVersion: row.route_version,
          eta: row.eta,
          location: { lat: parseFloat(row.lat), lon: parseFloat(row.lon) }
        }));
      } catch (e) {
        console.error('PostgreSQL getVehicles error:', e.message);
      }
    }
    return this.vehicles;
  }

  async getVehicleById(id) {
    if (this.isPostgresConnected) {
      try {
        const res = await this.pool.query('SELECT * FROM vehicles WHERE id = $1 OR vehicle_no = $1', [id]);
        if (res.rows.length > 0) {
          const row = res.rows[0];
          return {
            id: row.id,
            vehicleNo: row.vehicle_no,
            type: row.type,
            capacityKg: row.capacity_kg,
            status: row.status,
            driverName: row.driver_name,
            routeVersion: row.route_version,
            eta: row.eta,
            location: { lat: parseFloat(row.lat), lon: parseFloat(row.lon) }
          };
        }
      } catch (e) {}
    }
    return this.vehicles.find(v => v.id === id || v.vehicleNo === id) || null;
  }

  async updateVehicleLocation(id, lat, lon) {
    if (this.isPostgresConnected) {
      try {
        await this.pool.query(
          'UPDATE vehicles SET lat = $1, lon = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 OR vehicle_no = $3',
          [lat, lon, id]
        );
        return this.getVehicleById(id);
      } catch (e) {}
    }
    const v = this.vehicles.find(v => v.id === id || v.vehicleNo === id);
    if (v) { v.location = { lat, lon }; }
    return v || null;
  }

  // BAYS
  async getBays() {
    if (this.isPostgresConnected) {
      try {
        const res = await this.pool.query('SELECT * FROM bays ORDER BY id ASC');
        return res.rows.map(row => ({
          id: row.id,
          bayId: row.bay_id,
          name: row.name,
          zone: row.zone,
          state: row.state,
          vehicleTypeAllowed: row.vehicle_type_allowed,
          compatibility: [row.vehicle_type_allowed || 'ANY'],
          maxServiceTimeMin: row.max_service_time_min,
          serviceDurationMin: row.max_service_time_min || 30,
          utilizationPct: row.utilization_pct,
          location: { lat: parseFloat(row.lat), lon: parseFloat(row.lon) }
        }));
      } catch (e) {}
    }
    return this.bays;
  }

  async getBayById(id) {
    if (this.isPostgresConnected) {
      try {
        const res = await this.pool.query('SELECT * FROM bays WHERE id = $1 OR bay_id = $1', [id]);
        if (res.rows.length > 0) {
          const row = res.rows[0];
          return {
            id: row.id,
            bayId: row.bay_id,
            name: row.name,
            zone: row.zone,
            state: row.state,
            vehicleTypeAllowed: row.vehicle_type_allowed,
            compatibility: [row.vehicle_type_allowed || 'ANY'],
            maxServiceTimeMin: row.max_service_time_min,
            serviceDurationMin: row.max_service_time_min || 30,
            utilizationPct: row.utilization_pct,
            location: { lat: parseFloat(row.lat), lon: parseFloat(row.lon) }
          };
        }
      } catch (e) {}
    }
    return this.bays.find(b => b.id === id || b.bayId === id) || null;
  }

  async getBaySlots() {
    return this.baySlots;
  }

  // DELIVERIES
  async getDeliveries() {
    if (this.isPostgresConnected) {
      try {
        const res = await this.pool.query('SELECT * FROM deliveries ORDER BY created_at DESC');
        return res.rows.map(row => ({
          id: row.id,
          trackingId: row.tracking_id,
          pickupAddress: row.pickup_address,
          destination: row.destination,
          windowStart: row.window_start,
          windowEnd: row.window_end,
          priority: row.priority,
          weightKg: row.weight_kg,
          status: row.status,
          assignedVehicleId: row.assigned_vehicle_id,
          assignedBayId: row.assigned_bay_id,
          createdAt: row.created_at
        }));
      } catch (e) {}
    }
    return this.deliveries;
  }

  async createDelivery(del) {
    const newDel = {
      id: `d-${Date.now()}`,
      trackingId: `DEL-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      ...del
    };

    if (this.isPostgresConnected) {
      try {
        await this.pool.query(
          `INSERT INTO deliveries (id, tracking_id, pickup_address, destination, window_start, window_end, priority, weight_kg, status, assigned_vehicle_id, assigned_bay_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [newDel.id, newDel.trackingId, newDel.pickupAddress, newDel.destination, newDel.windowStart || '10:00', newDel.windowEnd || '12:00', newDel.priority || 'MEDIUM', newDel.weightKg || 100, newDel.status, newDel.assignedVehicleId || null, newDel.assignedBayId || null]
        );
      } catch (e) {
        console.error('PostgreSQL createDelivery error:', e.message);
      }
    }
    this.deliveries.unshift(newDel);
    return newDel;
  }

  // INCIDENTS
  async getIncidents() {
    if (this.isPostgresConnected) {
      try {
        const res = await this.pool.query('SELECT * FROM incidents ORDER BY created_at DESC');
        return res.rows.map(row => ({
          id: row.id,
          incidentId: row.incident_id,
          type: row.type,
          severity: row.severity,
          status: row.status,
          description: row.description,
          location: { lat: parseFloat(row.lat), lon: parseFloat(row.lon) },
          createdAt: row.created_at
        }));
      } catch (e) {}
    }
    return this.incidents;
  }

  async createIncident(inc) {
    const newInc = {
      id: `inc-${Date.now()}`,
      incidentId: `INC-${Math.floor(100 + Math.random() * 900)}`,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      location: inc.location || { lat: 22.5735, lon: 88.3620 },
      ...inc
    };

    if (this.isPostgresConnected) {
      try {
        await this.pool.query(
          `INSERT INTO incidents (id, incident_id, type, severity, status, description, lat, lon)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [newInc.id, newInc.incidentId, newInc.type, newInc.severity, newInc.status, newInc.description || '', newInc.location.lat, newInc.location.lon]
        );
      } catch (e) {}
    }
    this.incidents.unshift(newInc);
    return newInc;
  }

  // AUDIT EVENTS
  async getAuditEvents() {
    if (this.isPostgresConnected) {
      try {
        const res = await this.pool.query('SELECT * FROM audit_events ORDER BY timestamp DESC LIMIT 100');
        return res.rows.map(row => ({
          id: row.id,
          eventId: row.event_id,
          eventType: row.event_type,
          actor: row.actor,
          entityType: row.entity_type,
          entityId: row.entity_id,
          metadata: row.metadata,
          timestamp: row.timestamp
        }));
      } catch (e) {}
    }
    return this.auditEvents;
  }

  async createAuditEvent(evt) {
    const newEvt = {
      id: `aud-${Date.now()}`,
      eventId: `EV-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      ...evt
    };

    if (this.isPostgresConnected) {
      try {
        await this.pool.query(
          `INSERT INTO audit_events (id, event_id, event_type, actor, entity_type, entity_id, metadata)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [newEvt.id, newEvt.eventId, newEvt.eventType, newEvt.actor, newEvt.entityType, newEvt.entityId, JSON.stringify(newEvt.metadata || {})]
        );
      } catch (e) {}
    }
    this.auditEvents.unshift(newEvt);
    return newEvt;
  }

  // OPTIMIZATION RUNS
  getOptimizationRuns() { return this.optimizationRuns; }
  addOptimizationRun(run) {
    this.optimizationRuns.unshift(run);
    return run;
  }
}

const db = new DatabaseManager();
db.init();

module.exports = { db };
