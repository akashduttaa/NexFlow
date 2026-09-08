import { Outlet, Link, useLocation } from 'react-router-dom';
import { Activity, Truck, Route, MapPin, WifiOff, RefreshCw, Bell, Menu, X } from 'lucide-react';
import { useState } from 'react';

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
  const location = useLocation();

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col">
      <header className="sticky top-0 z-50 bg-ink-900 text-white h-14 flex items-center px-4 gap-3">
        <button className="lg:hidden p-1.5 rounded-lg hover:bg-ink-800" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold">NexFlow Driver</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
            <span className="text-xs font-medium text-success-400">ONLINE</span>
          </div>
          <Bell className="w-5 h-5 text-ink-400" />
          <Link to="/dashboard" className="text-xs text-primary-400 hover:text-primary-300 hidden sm:inline">
            Fleet Console
          </Link>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-56 bg-ink-800 text-ink-300 flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.to
                      ? 'bg-primary-600 text-white'
                      : 'text-ink-400 hover:bg-ink-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {mobileOpen && <div className="fixed inset-0 top-14 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />}

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
