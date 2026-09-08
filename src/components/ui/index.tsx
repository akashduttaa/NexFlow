import { type ReactNode } from 'react';

export function Badge({ children, variant = 'neutral' }: { children: ReactNode; variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'demo' | 'open' }) {
  const classes: Record<string, string> = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
    neutral: 'badge-neutral',
    demo: 'badge-demo',
    open: 'badge-open',
  };
  return <span className={classes[variant]}>{children}</span>;
}

export function Card({ children, className = '', hover = false }: { children: ReactNode; className?: string; hover?: boolean }) {
  return <div className={`${hover ? 'card-hover' : 'card'} ${className}`}>{children}</div>;
}

export function KpiCard({ label, value, icon, accent = 'primary' }: { label: string; value: string | number; icon?: ReactNode; accent?: string }) {
  const colorMap: Record<string, string> = {
    primary: 'text-primary-600',
    accent: 'text-accent-600',
    warning: 'text-warning-600',
    error: 'text-error-600',
    neutral: 'text-ink-600',
  };
  return (
    <div className="kpi-card">
      <div className="flex items-center justify-between">
        <span className="kpi-label">{label}</span>
        {icon && <span className={colorMap[accent]}>{icon}</span>}
      </div>
      <span className="kpi-value">{value}</span>
    </div>
  );
}

export function EmptyState({ title, message, icon }: { title: string; message: string; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-ink-300">{icon}</div>}
      <h3 className="text-lg font-semibold text-ink-700">{title}</h3>
      <p className="mt-1 text-sm text-ink-500">{message}</p>
    </div>
  );
}

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-sm text-ink-500">{message}</p>
      </div>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="mb-2 text-error-500">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-sm text-error-600">{message}</p>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'demo' | 'open'; label: string }> = {
    ONLINE: { variant: 'success', label: 'Online' },
    OFFLINE: { variant: 'error', label: 'Offline' },
    SYNCING: { variant: 'warning', label: 'Syncing' },
    STALE: { variant: 'warning', label: 'Stale' },
    HEALTHY: { variant: 'success', label: 'Healthy' },
    DEGRADED: { variant: 'warning', label: 'Degraded' },
    CONNECTOR_READY: { variant: 'info', label: 'Connector Ready' },
    AVAILABLE: { variant: 'success', label: 'Available' },
    RESERVED: { variant: 'info', label: 'Reserved' },
    OCCUPIED: { variant: 'warning', label: 'Occupied' },
    BLOCKED: { variant: 'error', label: 'Blocked' },
    MAINTENANCE: { variant: 'neutral', label: 'Maintenance' },
    PENDING: { variant: 'neutral', label: 'Pending' },
    ASSIGNED: { variant: 'info', label: 'Assigned' },
    EN_ROUTE: { variant: 'info', label: 'En Route' },
    AT_BAY: { variant: 'warning', label: 'At Bay' },
    SERVICING: { variant: 'warning', label: 'Servicing' },
    DELIVERED: { variant: 'success', label: 'Delivered' },
    DELAYED: { variant: 'error', label: 'Delayed' },
    CANCELLED: { variant: 'neutral', label: 'Cancelled' },
    ACTIVE: { variant: 'success', label: 'Active' },
    INVALIDATED: { variant: 'error', label: 'Invalidated' },
    COMPLETED: { variant: 'success', label: 'Completed' },
    REPLACED: { variant: 'neutral', label: 'Replaced' },
    RUNNING: { variant: 'warning', label: 'Running' },
    FAILED: { variant: 'error', label: 'Failed' },
    ACKNOWLEDGED: { variant: 'info', label: 'Acknowledged' },
    IGNORED: { variant: 'neutral', label: 'Ignored' },
    RESOLVED: { variant: 'success', label: 'Resolved' },
    CONFIRMED: { variant: 'success', label: 'Confirmed' },
    CONFLICT: { variant: 'error', label: 'Conflict' },
    DRAFT: { variant: 'neutral', label: 'Draft' },
    IDLE: { variant: 'neutral', label: 'Idle' },
    RETURNING: { variant: 'info', label: 'Returning' },
  };
  const cfg = map[status] ?? { variant: 'neutral' as const, label: status };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

export function ProvenanceBadge({ type }: { type: 'SIMULATED' | 'OPEN_STATIC' | 'LIVE_EXTERNAL' | 'OPERATOR_FEED' }) {
  const map = {
    SIMULATED: { variant: 'demo' as const, label: 'DEMO DATA' },
    OPEN_STATIC: { variant: 'open' as const, label: 'OPEN DATA' },
    LIVE_EXTERNAL: { variant: 'info' as const, label: 'LIVE EXTERNAL' },
    OPERATOR_FEED: { variant: 'success' as const, label: 'OPERATOR FEED' },
  };
  const cfg = map[type];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
