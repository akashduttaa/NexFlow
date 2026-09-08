# API Reference

Base path: `/api/v1`

## Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | /auth/login | Login with email/password |
| POST | /auth/register | Register new user |
| POST | /auth/refresh | Refresh JWT token |

## Vehicles
| Method | Path | Description |
|--------|------|-------------|
| GET | /vehicles | List all vehicles |
| GET | /vehicles/:id | Get vehicle by ID |
| POST | /vehicles | Create vehicle |
| PATCH | /vehicles/:id | Update vehicle |
| POST | /vehicles/:id/location | Update vehicle location |

## Deliveries
| Method | Path | Description |
|--------|------|-------------|
| GET | /deliveries | List all deliveries |
| GET | /deliveries/:id | Get delivery by ID |
| POST | /deliveries | Create delivery |
| PATCH | /deliveries/:id | Update delivery |

## Bays
| Method | Path | Description |
|--------|------|-------------|
| GET | /bays | List all bays |
| GET | /bays/nearby | Find nearby bays |
| POST | /bays | Create bay |
| POST | /bays/:id/reservations | Create bay reservation |

## Incidents
| Method | Path | Description |
|--------|------|-------------|
| GET | /incidents | List all incidents |
| POST | /incidents | Create incident |
| PATCH | /incidents/:id | Update incident |

## Optimization
| Method | Path | Description |
|--------|------|-------------|
| GET | /optimization/runs | List optimization runs |
| POST | /optimization/runs | Create optimization run |
| GET | /optimization/runs/:id | Get run by ID |
| POST | /optimization/runs/:id/replan | Trigger replan |

## Predictions
| Method | Path | Description |
|--------|------|-------------|
| GET | /predictions/demand | Get demand predictions |
| GET | /predictions/traffic | Get traffic risk predictions |
| GET | /predictions/eta | Get ETA predictions |

## Adapter
| Method | Path | Description |
|--------|------|-------------|
| POST | /adapter/events | Submit ULIP-aligned event |

## Demo
| Method | Path | Description |
|--------|------|-------------|
| POST | /demo/reset | Reset demo data |
| POST | /demo/scenarios/road-closure | Simulate road closure |
| POST | /demo/scenarios/bay-conflict | Simulate bay conflict |
| POST | /demo/scenarios/demand-surge | Simulate demand surge |
| POST | /demo/scenarios/network-failure | Simulate network failure |
| POST | /demo/scenarios/stale-gps | Simulate stale GPS |

## Health
| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Service health check |

## Error Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "requestId": "..."
  }
}
```
