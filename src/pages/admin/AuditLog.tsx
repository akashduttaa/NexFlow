import { useEffect, useState } from 'react';
import { ScrollText, Search } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { apiClient } from '@/services/api-client';
import type { AuditEvent } from '@/types';

const eventColors: Record<string, string> = {
  DELIVERY_CREATED: 'badge-info',
  BAY_RESERVED: 'badge-info',
  ROUTE_ASSIGNED: 'badge-info',
  INCIDENT_CREATED: 'badge-error',
  ROUTE_INVALIDATED: 'badge-error',
  OPTIMIZATION_STARTED: 'badge-neutral',
  OPTIMIZATION_COMPLETED: 'badge-success',
  ROUTE_REASSIGNED: 'badge-warning',
  DRIVER_OFFLINE: 'badge-error',
  DRIVER_ONLINE: 'badge-success',
  SYNC_COMPLETED: 'badge-success',
};

export default function AuditLog() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiClient.getAuditEvents().then(setEvents);
  }, []);

  const filtered = events.filter(e =>
    e.eventType.toLowerCase().includes(search.toLowerCase()) ||
    e.actor.toLowerCase().includes(search.toLowerCase()) ||
    e.entityId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Audit Log</h1>
          <p className="text-sm text-ink-400 mt-1">Every major operational decision is auditable</p>
        </div>
        <Badge variant="info">LIVE AUDIT TRAIL</Badge>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input type="text" placeholder="Search by event type, actor, or entity..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-9" />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border bg-surface">
                <th className="table-header">Event ID</th>
                <th className="table-header">Timestamp</th>
                <th className="table-header">Event Type</th>
                <th className="table-header">Actor</th>
                <th className="table-header">Entity Type</th>
                <th className="table-header">Entity ID</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} className="border-b border-surface-border hover:bg-surface">
                  <td className="table-cell font-medium text-xs">{e.eventId}</td>
                  <td className="table-cell text-xs">{new Date(e.timestamp).toLocaleString('en-IN')}</td>
                  <td className="table-cell"><span className={eventColors[e.eventType] ?? 'badge-neutral'}>{e.eventType}</span></td>
                  <td className="table-cell text-xs">{e.actor}</td>
                  <td className="table-cell text-xs">{e.entityType}</td>
                  <td className="table-cell text-xs font-mono">{e.entityId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filtered.length === 0 && (
        <Card className="p-8 text-center">
          <ScrollText className="w-12 h-12 text-ink-300 mx-auto mb-2" />
          <p className="text-sm text-ink-400">No audit events match your search.</p>
        </Card>
      )}
    </div>
  );
}
