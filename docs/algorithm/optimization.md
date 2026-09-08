# Optimization Algorithm

## Rolling-Horizon Joint Route + Curb Optimization

### MVP Solver: OR-Tools CP-SAT

### Decisions
- Vehicle assignment
- Route candidate selection
- Loading-bay slot allocation
- Delivery sequence
- Re-routing decision

### Objective: MINIMIZE
- Delivery Delay
- Curb Waiting
- Late Penalties
- Unnecessary Distance
- Rerouting Cost

### Constraints
- Vehicle Capacity
- Delivery Windows
- Bay Exclusivity (one vehicle per bay per slot)
- Fleet Availability
- Road Closures
- Service Duration

### Pipeline
```
CURRENT STATE → PREDICT → ROUTE CANDIDATES → BAY CANDIDATES → CP-SAT → PLAN → DISPATCH
```

### Status
OPTIMIZER STATUS: CONNECTOR READY — awaiting CP-SAT solver service deployment.

### OptimizationRequest
```typescript
{
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
```

### OptimizationResult
```typescript
{
  runId: string;
  status: OptimizationStatus;
  solverStatus: string | null;
  runtimeMs: number | null;
  objectiveValue: number | null;
  assignments: Assignment[];
  routes: Route[];
  baySlots: BaySlot[];
  lateDeliveries: string[];
  warnings: string[];
}
```
