import { Outlet, Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X, Truck, ShieldCheck, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/solution', label: 'Solution' },
  { to: '/technology', label: 'Technology' },
  { to: '/business', label: 'Business' },
  { to: '/documentation', label: 'Documentation' },
];

export function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-ink-950 relative">
      {headerHidden ? (
        <div className="fixed top-3 right-6 z-50">
          <button
            onClick={() => setHeaderHidden(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink-900/90 text-primary-400 hover:text-primary-300 border border-primary-500/40 shadow-xl backdrop-blur-md text-xs font-semibold cursor-pointer transition-all duration-300 hover:scale-105"
            title="Show Top Navigation Bar"
          >
            <ChevronDown className="w-4 h-4" />
            <span>Show Navbar</span>
          </button>
        </div>
      ) : (
        <header className="sticky top-0 z-50 bg-ink-950/80 backdrop-blur-xl border-b border-surface-border transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 bg-logo-gradient">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold gradient-text">NexFlow</span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {navItems.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      location.pathname === item.to
                        ? 'text-primary-400 bg-primary-500/10 border border-primary-500/20'
                        : 'text-ink-300 hover:text-ink-100 hover:bg-surface-hover'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex items-center gap-2 ml-3">
                  <Link to="/login?role=driver" className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent-500/10 text-accent-300 hover:bg-accent-500/20 border border-accent-500/30 transition-all duration-300 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-accent-400" />
                    <span>Driver App</span>
                  </Link>
                  <Link to="/login?role=admin" className="btn-primary py-1.5 px-3 text-xs font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin Sign In</span>
                  </Link>
                  <ThemeToggle />
                  <button
                    onClick={() => setHeaderHidden(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-ink-400 hover:text-primary-400 hover:bg-surface-hover border border-surface-border transition-all duration-300 cursor-pointer ml-1"
                    title="Hide Top Navigation Bar"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Hide Bar</span>
                  </button>
                </div>
              </nav>

              <div className="flex items-center gap-2 md:hidden">
                <button
                  onClick={() => setHeaderHidden(true)}
                  className="p-2 rounded-lg text-ink-400 hover:bg-surface-hover transition-colors"
                  title="Hide Bar"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <button
                  className="p-2 rounded-lg text-ink-300 hover:bg-surface-hover hover:text-ink-100 transition-colors"
                  onClick={() => setMobileOpen(!mobileOpen)}
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {mobileOpen && (
            <nav className="md:hidden border-t border-surface-border px-4 py-3 space-y-2 bg-ink-900/95 backdrop-blur-xl">
              {navItems.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.to
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-ink-300 hover:bg-surface-hover hover:text-ink-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-surface-border grid grid-cols-2 gap-2">
                <Link to="/login?role=driver" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-xs font-semibold bg-accent-500/10 text-accent-300 border border-accent-500/30 text-center flex items-center justify-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  Driver App
                </Link>
                <Link to="/login?role=admin" onClick={() => setMobileOpen(false)} className="btn-primary w-full py-2 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Portal
                </Link>
              </div>
            </nav>
          )}
        </header>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-ink-900/60 border-t border-surface-border backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }}>
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold gradient-text">NexFlow</span>
              </div>
              <p className="text-sm text-ink-400">Urban Freight Intelligence Layer</p>
              <p className="text-xs text-ink-500 mt-2">Team NexGen — SIH 2026 — Problem SIH26205</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ink-200 mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/solution" className="text-ink-400 hover:text-primary-400 transition-colors">Solution</Link></li>
                <li><Link to="/technology" className="text-ink-400 hover:text-primary-400 transition-colors">Technology</Link></li>
                <li><Link to="/business" className="text-ink-400 hover:text-primary-400 transition-colors">Business Model</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ink-200 mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/documentation" className="text-ink-400 hover:text-primary-400 transition-colors">Documentation</Link></li>
                <li><Link to="/about" className="text-ink-400 hover:text-primary-400 transition-colors">About</Link></li>
                <li><Link to="/login" className="text-ink-400 hover:text-primary-400 transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ink-200 mb-3">Pilot</h4>
              <p className="text-sm text-ink-400">Kolkata Burrabazar / Posta Trade District</p>
              <p className="text-xs text-ink-500 mt-2">Theme: Transportation & Logistics</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-surface-border text-xs text-ink-500">
            <p>NexFlow integrates with ICCC; it does not replace ICCC. All operational data shown in the demo is SIMULATED.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
