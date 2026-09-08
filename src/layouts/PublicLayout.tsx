import { Outlet, Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/solution', label: 'Solution' },
  { to: '/technology', label: 'Technology' },
  { to: '/business', label: 'Business' },
  { to: '/documentation', label: 'Documentation' },
];

export function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-ink-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-ink-900">NexFlow</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.to
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-ink-600 hover:text-ink-900 hover:bg-ink-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/login" className="btn-primary ml-2">Login</Link>
            </nav>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-ink-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden border-t border-ink-200 px-4 py-3 space-y-1">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  location.pathname === item.to
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-ink-600 hover:bg-ink-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-primary w-full mt-2">Login</Link>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-ink-900 text-ink-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">NexFlow</span>
              </div>
              <p className="text-sm text-ink-400">Urban Freight Intelligence Layer</p>
              <p className="text-xs text-ink-500 mt-2">Team NexGen — SIH 2026 — Problem SIH26205</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/solution" className="hover:text-white">Solution</Link></li>
                <li><Link to="/technology" className="hover:text-white">Technology</Link></li>
                <li><Link to="/business" className="hover:text-white">Business Model</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/documentation" className="hover:text-white">Documentation</Link></li>
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Pilot</h4>
              <p className="text-sm text-ink-400">Kolkata Burrabazar / Posta Trade District</p>
              <p className="text-xs text-ink-500 mt-2">Theme: Transportation & Logistics</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-ink-800 text-xs text-ink-500">
            <p>NexFlow integrates with ICCC; it does not replace ICCC. All operational data shown in the demo is SIMULATED.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
