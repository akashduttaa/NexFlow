<<<<<<< HEAD
# NexFlow — Urban Freight Intelligence Layer

**Team NexGen** | Smart India Hackathon 2026 | Problem SIH26205 | Transportation & Logistics

**Pilot:** Kolkata Burrabazar / Posta Trade District

## What is NexFlow?

NexFlow predicts urban freight bottlenecks and jointly optimizes vehicle routes and loading-bay access so fleets can reduce avoidable waiting, distance and delivery delays while integrating with existing municipal ICCC infrastructure.

**Tagline:** Predict Freight Pressure → Allocate Curb Access → Reroute Fleets → Measure Outcomes

## Core Concept

A freight vehicle can take the fastest road route and still lose time because the loading bay is occupied. NexFlow optimizes the road + the curb together.

**Standard Navigation:** Origin → Destination → Fastest Route

**NexFlow:** Freight Demand → Prediction → Vehicle Selection → Route Candidate Generation → Loading-Bay Candidate Generation → Joint Optimization → Vehicle + Route + Bay + Time Window → Live Dispatch → Re-optimization

## Technology Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, TypeScript, Tailwind CSS, React Router, Leaflet, Recharts |
| Backend | Node.js, Express, TypeScript, JWT, RBAC, Socket.IO, Zod |
| Database | PostgreSQL, PostGIS, Redis |
| AI | Python, FastAPI, Pandas, NumPy, scikit-learn, XGBoost |
| Routing | OSRM |
| Optimization | OR-Tools CP-SAT |
| Infrastructure | Docker, Docker Compose |

## Getting Started

```bash
npm install
npm run dev
```

## Demo Mode

This build uses deterministic simulated data. All operational data is clearly labelled as SIMULATED. External services (PostgreSQL, Redis, OSRM, CP-SAT, XGBoost) are scaffolded with CONNECTOR READY status.

## Architecture

See `/dashboard/architecture` for system architecture, DFD, ER diagram, and deployment diagrams.

## Documentation

- [Architecture](docs/architecture/system-overview.md)
- [Optimization Algorithm](docs/algorithm/optimization.md)
- [API Reference](docs/api/openapi.md)
- [ICCC Integration](docs/government/iccc-integration.md)
- [ULIP Adapter](docs/government/ulip-adapter.md)
- [Offline Driver](docs/operations/offline-driver.md)
- [Live Demo](docs/demo/live-demo.md)

## Important

NexFlow integrates with ICCC; it does not replace ICCC. All demo data is simulated. No fabricated KPI results.
=======
SIH2026
>>>>>>> 8114328d618e129e5c4e55c0117c848ff2d0b035
