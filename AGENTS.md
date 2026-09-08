# NexFlow — Agent Rules

These rules are non-negotiable for all contributors and AI agents working on this project.

1. PostgreSQL + PostGIS is the primary operational database.
2. Redis is hot state, not canonical truth.
3. OSRM is the routing layer.
4. OR-Tools CP-SAT is the MVP optimization solver.
5. XGBoost is the MVP prediction model.
6. React does not directly access the database.
7. AI outputs must come from actual models once implemented.
8. No fabricated KPI results.
9. Simulation must be labelled.
10. No unauthorized government integration claims.
11. NexFlow integrates with ICCC; it does not replace ICCC.
12. Offline Driver Cache is first-class.
13. Route versions prevent stale-route overwrite.
14. Secrets must never be committed.
15. Preserve service boundaries.
16. Keep MVP and roadmap clearly separated.
17. Tests required for critical state transitions.
18. Documentation must match implementation.
19. Prefer deterministic demo scenarios.
20. Do not replace the architecture without explicit justification.
