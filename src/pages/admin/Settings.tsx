import { User, Shield, Database } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/services/api-client';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="text-sm text-ink-500 mt-1">Account and system configuration</p>
      </div>

      {/* Profile */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-primary-600" />
          <h2 className="section-title">Profile</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="label">Name</span><p className="text-ink-800">{user?.name ?? '—'}</p></div>
          <div><span className="label">Email</span><p className="text-ink-800">{user?.email ?? '—'}</p></div>
          <div><span className="label">Role</span><Badge variant="info">{user?.role ?? '—'}</Badge></div>
          <div><span className="label">Organization</span><p className="text-ink-800">{user?.organizationId ?? '—'}</p></div>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary-600" />
          <h2 className="section-title">Security</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-ink-50 border border-ink-200">
            <div><p className="text-sm font-medium text-ink-800">JWT Authentication</p><p className="text-xs text-ink-500">Token-based session management</p></div>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-ink-50 border border-ink-200">
            <div><p className="text-sm font-medium text-ink-800">RBAC</p><p className="text-xs text-ink-500">Role-based access control enforced</p></div>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-ink-50 border border-ink-200">
            <div><p className="text-sm font-medium text-ink-800">HTTPS</p><p className="text-xs text-ink-500">Ready for production TLS</p></div>
            <Badge variant="info">Ready</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-ink-50 border border-ink-200">
            <div><p className="text-sm font-medium text-ink-800">CORS Allowlist</p><p className="text-xs text-ink-500">Configured for production origins</p></div>
            <Badge variant="info">Ready</Badge>
          </div>
        </div>
      </Card>

      {/* Demo */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-warning-600" />
          <h2 className="section-title">Demo Environment</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-warning-50 border border-warning-200">
            <div><p className="text-sm font-medium text-ink-800">Demo Mode</p><p className="text-xs text-ink-500">Using deterministic simulated data</p></div>
            <Badge variant="demo">ACTIVE</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-ink-50 border border-ink-200">
            <div><p className="text-sm font-medium text-ink-800">Reset Demo</p><p className="text-xs text-ink-500">Reset all demo data to initial state</p></div>
            <button onClick={() => apiClient.resetDemo()} className="btn-secondary text-xs">Reset</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
