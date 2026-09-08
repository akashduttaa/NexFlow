# System Overview

## Architecture

NexFlow is an Urban Freight Intelligence Layer that sits on top of existing municipal ICCC infrastructure.

```
MUNICIPAL ICCC / TMC
      ↓
ICCC ADAPTER
      ↓
NEXFLOW
  1. DATA INGESTION (OSM | GTFS | Weather | GPS | Orders | Incidents)
  2. DATA & STATE (PostgreSQL | PostGIS | Redis)
  3. AI + OPTIMIZATION (XGBoost | OSRM | OR-Tools CP-SAT)
  4. API + DISPATCH (FastAPI | Node.js | Socket.IO)
      ↓
City Console | Fleet Ops | Driver PWA | Offline Cache | SMS Adapter
```

## Service Boundaries

- **Frontend (apps/web):** React + Vite + TypeScript + Tailwind + Leaflet + Recharts
- **Driver PWA (apps/driver):** Responsive PWA with offline cache
- **API (services/api):** Node.js + Express + JWT + RBAC + Socket.IO
- **AI (services/ai):** Python + FastAPI + XGBoost
- **Optimizer (services/optimizer):** OR-Tools CP-SAT
- **Adapters (services/adapters):** ICCC + ULIP + SMS

## Current State

This Bolt build implements the full application shell with deterministic demo data. External services are scaffolded with CONNECTOR READY status.
