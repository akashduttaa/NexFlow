import { Outlet, Link, useLocation } from 'react-router-dom';
import { Activity, Truck, Route, MapPin, WifiOff, RefreshCw, Bell, Menu, X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { to: '/driver', label: 'Current Trip', icon: Truck },
  { to: '/driver/trip', label: 'Trip Details', icon: Route },
  { to: '/driver/route', label: 'Route', icon: Route },
  { to: '/driver/bay', label: 'Loading Bay', icon: MapPin },
  { to: '/driver/offline', label: 'Offline', icon: WifiOff },
  { to: '/driver/sync', label: 'Sync', icon: RefreshCw },
];

export function DriverLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const location = useLocation();
  const activeVehicle = localStorage.getItem('nexflow-driver-vehicle') || 'WB-04-E-8821';

  return (
    <div className="min-h-screen bg-ink-950 flex flex-col relative">
      {headerHidden ? (
        <div className="fixed top-2 right-4 z-50 flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setHeaderHidden(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink-900/90 text-primary-400 hover:text-primary-300 border border-primary-500/40 shadow-xl backdrop-blur-md text-xs font-semibold cursor-pointer transition-all duration-300 hover:scale-105"
            title="Show Top Navigation Bar"
          >
            <ChevronDown className="w-4 h-4" />
            <span>Show Bar</span>
          </button>
        </div>
      ) : (
        <header className="sticky top-0 z-50 h-14 flex items-center px-4 gap-3 border-b border-surface-border backdrop-blur-xl bg-header-gradient transition-all duration-300">
          <button className="lg:hidden p-1.5 rounded-lg text-ink-300 hover:bg-surface-hover hover:text-ink-100 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          {sidebarHidden && (
            <button
              onClick={() => setSidebarHidden(false)}
              className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold text-primary-400 hover:bg-primary-500/10 border border-primary-500/30 transition-all cursor-pointer"
              title="Show Left Sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
              <span>Show Sidebar</span>
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-logo-gradient">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold gradient-text">NexFlow Driver</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-accent-500/10 text-accent-300 border border-accent-500/20">
              {activeVehicle}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-1.5">
              <div className="status-dot-online animate-pulse" />
              <span className="text-xs font-medium text-success-400">ONLINE</span>
            </div>
            <Bell className="w-5 h-5 text-ink-500 hover:text-ink-300 cursor-pointer transition-colors" />
            <Link to="/login?role=driver" className="text-xs text-accent-400 hover:text-accent-300 transition-colors">
              Switch Driver
            </Link>
            <Link to="/dashboard" className="text-xs text-ink-400 hover:text-ink-200 hidden md:inline transition-colors border-l border-surface-border pl-3">
              Fleet Console
            </Link>
            <button
              onClick={() => setHeaderHidden(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-ink-400 hover:text-primary-400 hover:bg-surface-hover border border-surface-border transition-all duration-300 cursor-pointer"
              title="Hide Top Navigation Bar"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hide Bar</span>
            </button>
          </div>
        </header>
      )}

      <div className="flex flex-1">
        {/* Sidebar */}
        {!sidebarHidden && (
          <aside className={`fixed lg:sticky top-14 left-0 z-40 h-[calc(100vh-3.5rem)] flex flex-col transition-all duration-300 bg-sidebar-gradient border-r border-surface-border ${sidebarCollapsed ? 'w-16' : 'w-56'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="flex items-center justify-between px-3 py-2 border-b border-surface-border hidden lg:flex">
              {!sidebarCollapsed && <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">Driver Menu</span>}
              <div className="flex items-center gap-1 ml-auto">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-1 rounded text-ink-400 hover:bg-surface-hover hover:text-ink-100 transition-colors cursor-pointer"
                  title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                  {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
                {!sidebarCollapsed && (
                  <button
                    onClick={() => setSidebarHidden(true)}
                    className="p-1 rounded text-ink-500 hover:text-ink-300 hover:bg-surface-hover transition-colors cursor-pointer"
                    title="Hide Sidebar"
                  >
                    <PanelLeftClose className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
              {navItems.map(item => {
                const Icon = item.icon;
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      active
                        ? 'bg-primary-500/15 text-primary-400 border-l-2 border-primary-400'
                        : 'text-ink-400 hover:bg-surface-hover hover:text-ink-100 border-l-2 border-transparent'
                    } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                    style={active ? { boxShadow: '0 0 12px rgba(6,182,212,0.08)' } : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </nav>
          </aside>
        )}

        {mobileOpen && <div className="fixed inset-0 top-14 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />}

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
