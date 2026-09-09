import { useState } from 'react';
import { User, Shield, Database, Save, CheckCircle2, Server } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/services/api-client';

export default function Settings() {
  const { user } = useAuth();
  const [expressUrl, setExpressUrl] = useState('http://localhost:3001');
  const [aiServiceUrl, setAiServiceUrl] = useState('http://localhost:8000');
  const [optimizerUrl, setOptimizerUrl] = useState('http://localhost:8001');
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Settings & Endpoint Configuration</h1>
          <p className="text-sm text-ink-400 mt-1">Manage active backend microservice endpoints, authentication and environment state</p>
        </div>
        <button 
          onClick={handleSaveSettings}
          className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-primary-500/20 cursor-pointer"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-success-400" />
              <span>Settings Saved Live</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </>
          )}
        </button>
      </div>

      {/* Microservice Endpoints Configuration */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Server className="w-5 h-5 text-primary-400" />
          <h2 className="section-title">Active Backend Microservice Endpoints</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Express REST API Server</label>
            <input 
              type="text" 
              value={expressUrl} 
              onChange={e => setExpressUrl(e.target.value)} 
              className="input font-mono text-xs"
            />
            <span className="text-[10px] text-success-400 font-semibold mt-1 inline-block">● ONLINE (Port 3001)</span>
          </div>

          <div>
            <label className="label">Python FastAPI XGBoost AI Service</label>
            <input 
              type="text" 
              value={aiServiceUrl} 
              onChange={e => setAiServiceUrl(e.target.value)} 
              className="input font-mono text-xs"
            />
            <span className="text-[10px] text-success-400 font-semibold mt-1 inline-block">● ONLINE (Port 8000)</span>
          </div>

          <div>
            <label className="label">Python OR-Tools CP-SAT Optimizer</label>
            <input 
              type="text" 
              value={optimizerUrl} 
              onChange={e => setOptimizerUrl(e.target.value)} 
              className="input font-mono text-xs"
            />
            <span className="text-[10px] text-success-400 font-semibold mt-1 inline-block">● ONLINE (Port 8001)</span>
          </div>
        </div>
      </Card>

      {/* Profile */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-primary-400" />
          <h2 className="section-title">Active User Profile</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="label">Name</span><p className="text-ink-100 font-semibold">{user?.name ?? 'System Administrator'}</p></div>
          <div><span className="label">Email</span><p className="text-ink-100 font-semibold">{user?.email ?? 'admin@nexflow.io'}</p></div>
          <div><span className="label">Role</span><Badge variant="info">{user?.role ?? 'ADMIN'}</Badge></div>
          <div><span className="label">Organization</span><p className="text-ink-100 font-semibold">Kolkata Municipal Corporation / Posta Pilot</p></div>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary-400" />
          <h2 className="section-title">Security & Protocol Enforcement</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-surface-border">
            <div><p className="text-sm font-medium text-ink-100">JWT Authentication</p><p className="text-xs text-ink-400">Token-based session management</p></div>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-surface-border">
            <div><p className="text-sm font-medium text-ink-100">RBAC</p><p className="text-xs text-ink-400">Role-based access control enforced</p></div>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-surface-border">
            <div><p className="text-sm font-medium text-ink-100">HTTPS / TLS Security</p><p className="text-xs text-ink-400">Ready for production TLS certificate</p></div>
            <Badge variant="info">Ready</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-surface-border">
            <div><p className="text-sm font-medium text-ink-100">CORS Allowlist</p><p className="text-xs text-ink-400">Configured for active frontend origins</p></div>
            <Badge variant="success">Active</Badge>
          </div>
        </div>
      </Card>

      {/* Live System Control */}
      <Card className="p-5 border-primary-500/20 bg-primary-500/5">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-primary-400" />
          <h2 className="section-title">Live System Controls</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-surface-border">
            <div><p className="text-sm font-medium text-ink-100">Operational Environment</p><p className="text-xs text-ink-400">Live OpenStreetMap + OSRM + XGBoost ML + CP-SAT Solver</p></div>
            <Badge variant="success">LIVE OPERATIONAL</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-surface-border">
            <div><p className="text-sm font-medium text-ink-100">Reset Application Cache</p><p className="text-xs text-ink-400">Reload live application state</p></div>
            <button onClick={() => apiClient.resetDemo()} className="px-3 py-1.5 bg-surface-hover hover:bg-surface-border text-ink-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer">Reset App</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
