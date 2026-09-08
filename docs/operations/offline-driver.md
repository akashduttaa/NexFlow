# Offline Driver Operations

## Offline Cache Architecture

The driver PWA uses IndexedDB for persistent browser storage. When network is lost, the driver app switches to OFFLINE MODE and operates on cached data.

## Cached Data
- Current route (with version)
- Delivery details
- Loading bay information
- Loading window
- Pending GPS events
- Last sync time

## Route Object
```json
{
  "routeVersion": 14,
  "routeId": "R-214",
  "bayId": "B-15",
  "windowStart": "17:35",
  "windowEnd": "17:45"
}
```

## Offline Flow
```
Network lost → OFFLINE MODE → use cached route → queue GPS → continue operation → retry → synchronize → reconcile latest route
```

## Route Version Guard
Never allow an older route version to overwrite a newer route. The cache checks `routeVersion` before storing.

## SMS Fallback
SMS PROVIDER: SIMULATED — MockSmsProvider sends demo SMS alerts. Production provider integration is a future connector.
