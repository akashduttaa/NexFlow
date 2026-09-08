import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, LayoutDashboard, Truck, Package, MapPin, AlertTriangle, Cpu, Brain, BarChart3, FlaskConical, Network, Building2, Radio, Database, HeartPulse, ScrollText, Settings, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const navGroups = [
  {
    label: 'Operations',
    items: [
      { to: '/dashboard', label: 'Command Center', icon: LayoutDashboard },
      { to: '/dashboard/fleet', label: 'Fleet', icon: Truck },
      { to: '/dashboard/deliveries', label: 'Deliveries', icon: Package },
      { to: '/dashboard/bays', label: 'Loading Bays', icon: MapPin },
      { to: '/dashboard/incidents', label: 'Incidents', icon: AlertTriangle },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { to: '/dashboard/optimization', label: 'Optimization', icon: Cpu },
      { to: '/dashboard/predictions', label: 'Predictions', icon: Brain },
      { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
      { to: '/dashboard/experiments', label: 'Experiments', icon: FlaskConical },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/dashboard/architecture', label: 'Architecture', icon: Network },
      { to: '/dashboard/iccc-integration', label: 'ICCC Integration', icon: Building2 },
      { to: '/dashboard/ulip-adapter', label: 'ULIP Adapter', icon: Radio },
      { to: '/dashboard/data-sources', label: 'Data Sources', icon: Database },
      { to: '/dashboard/system-health', label: 'System Health', icon: HeartPulse },
      { to: '/dashboard/audit', label: 'Audit Logs', icon: ScrollText },
      { to: '/dashboard/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (to: string) => {
    if (to === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(to);
  };

  return (
    <div className="min-h-screen bg-ink-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-ink-900 text-ink-300 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center gap-2 px-4 border-b border-ink-800 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">NexFlow</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navGroups.map(group => (
            <div key={group.label}>
              <p className="px-3 mb-2 text-xs font-semibold text-ink-500 uppercase tracking-wider">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.to)
                          ? 'bg-primary-600 text-white'
                          : 'text-ink-400 hover:bg-ink-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-ink-800 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.charAt(0) ?? 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name ?? 'User'}</p>
              <p className="text-xs text-ink-500 truncate">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-ink-400 hover:bg-ink-800 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-ink-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-ink-100" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 text-sm text-ink-500">
              <span className="badge-demo">DEMO ENVIRONMENT</span>
              <span className="hidden sm:inline">Pilot: Burrabazar / Posta</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-ink-500">
            <Link to="/driver" className="hidden sm:flex items-center gap-1 text-primary-600 hover:text-primary-700">
              <Truck className="w-4 h-4" />
              <span>Driver App</span>
            </Link>
            <span className="hidden md:inline">{new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
              <span className="text-xs text-success-600 font-medium">Connected</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
