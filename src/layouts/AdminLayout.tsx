import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, LayoutDashboard, Truck, Package, MapPin, AlertTriangle, Cpu, Brain, BarChart3, FlaskConical, Network, Building2, Radio, Database, HeartPulse, ScrollText, Settings, LogOut, Menu, X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';

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
      { to: '/dashboard/mqtt', label: 'MQTT Telemetry', icon: Radio },
      { to: '/dashboard/data-sources', label: 'Data Sources', icon: Database },
      { to: '/dashboard/system-health', label: 'System Health', icon: HeartPulse },
      { to: '/dashboard/audit', label: 'Audit Logs', icon: ScrollText },
      { to: '/dashboard/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
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
    <div className="min-h-screen bg-ink-950 flex relative">
      {/* Sidebar */}
      {!sidebarHidden && (
        <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen flex flex-col transition-all duration-300 bg-sidebar-gradient border-r border-surface-border ${sidebarCollapsed ? 'w-16' : 'w-64'} ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="h-16 flex items-center justify-between px-3.5 border-b border-surface-border shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-logo-gradient">
                <Activity className="w-4 h-4 text-white" />
              </div>
              {!sidebarCollapsed && <span className="text-lg font-bold gradient-text truncate">NexFlow</span>}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-1 rounded-lg text-ink-400 hover:bg-surface-hover hover:text-ink-100 transition-colors cursor-pointer"
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
            {navGroups.map(group => (
              <div key={group.label}>
                {!sidebarCollapsed && <p className="px-3 mb-2 text-[10px] font-bold text-ink-500 uppercase tracking-[0.15em]">{group.label}</p>}
                <div className="space-y-0.5">
                  {group.items.map(item => {
                    const Icon = item.icon;
                    const active = isActive(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setSidebarOpen(false)}
                        title={sidebarCollapsed ? item.label : undefined}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          active
                            ? 'bg-primary-500/15 text-primary-400 border-l-2 border-primary-400'
                            : 'text-ink-400 hover:bg-surface-hover hover:text-ink-100 border-l-2 border-transparent'
                        } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                        style={active ? { boxShadow: '0 0 12px rgba(6,182,212,0.08)' } : undefined}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-2.5 border-t border-surface-border shrink-0">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3 px-2 py-1.5 mb-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0 bg-logo-gradient">
                  {user?.name?.charAt(0) ?? 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink-100 truncate">{user?.name ?? 'User'}</p>
                  <p className="text-xs text-ink-500 truncate">{user?.role}</p>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between gap-1">
              <button onClick={handleLogout} className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-ink-400 hover:bg-surface-hover hover:text-ink-100 transition-all duration-300 cursor-pointer ${sidebarCollapsed ? 'w-full justify-center' : 'flex-1'}`} title="Logout">
                <LogOut className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>Logout</span>}
              </button>
              {!sidebarCollapsed && (
                <button
                  onClick={() => setSidebarHidden(true)}
                  className="p-2 rounded-lg text-ink-500 hover:text-ink-300 hover:bg-surface-hover transition-colors cursor-pointer"
                  title="Hide Left Sidebar"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </aside>
      )}

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {headerHidden ? (
          <div className="fixed top-3 right-6 z-50 flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setHeaderHidden(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink-900/90 text-primary-400 hover:text-primary-300 border border-primary-500/40 shadow-xl backdrop-blur-md text-xs font-semibold cursor-pointer transition-all duration-300 hover:scale-105"
              title="Show Top Navigation Bar"
            >
              <ChevronDown className="w-4 h-4" />
              <span>Show Topbar</span>
            </button>
          </div>
        ) : (
          <header className="h-16 bg-ink-900/60 backdrop-blur-xl border-b border-surface-border flex items-center justify-between px-4 lg:px-6 shrink-0 transition-all duration-300">
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-2 rounded-lg text-ink-300 hover:bg-surface-hover hover:text-ink-100 transition-colors" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              {sidebarHidden && (
                <button
                  onClick={() => setSidebarHidden(false)}
                  className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-primary-400 hover:bg-primary-500/10 border border-primary-500/30 transition-all cursor-pointer"
                  title="Show Left Sidebar"
                >
                  <PanelLeftOpen className="w-4 h-4" />
                  <span>Show Sidebar</span>
                </button>
              )}
              <div className="flex items-center gap-2 text-sm">
                <span className="badge-success">LIVE ENVIRONMENT</span>
                <span className="hidden sm:inline text-ink-400">Pilot: Burrabazar / Posta</span>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-sm text-ink-400">
              <ThemeToggle />
              <Link to="/driver" className="hidden sm:flex items-center gap-1.5 text-primary-400 hover:text-primary-300 transition-colors">
                <Truck className="w-4 h-4" />
                <span>Driver App</span>
              </Link>
              <span className="hidden md:inline">{new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
              <div className="flex items-center gap-1.5">
                <div className="status-dot-online animate-pulse" />
                <span className="text-xs text-success-400 font-medium">Connected</span>
              </div>
              <button
                onClick={() => setHeaderHidden(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-ink-400 hover:text-primary-400 hover:bg-surface-hover border border-surface-border transition-all duration-300 cursor-pointer ml-1"
                title="Hide Top Navigation Bar"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Hide Topbar</span>
              </button>
            </div>
          </header>
        )}

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
