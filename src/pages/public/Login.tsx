import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const demoUsers = [
  { email: 'admin@nexflow.demo', role: 'Administrator' },
  { email: 'operator@nexflow.demo', role: 'Operator' },
  { email: 'fleet@nexflow.demo', role: 'Fleet Manager' },
  { email: 'analyst@nexflow.demo', role: 'Analyst' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@nexflow.demo');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      navigate('/dashboard');
    } else {
      setError('Login failed. Please check your credentials.');
    }
  };

  const selectDemoUser = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink-900 via-ink-900 to-primary-950 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(37,99,235,0.3) 0%, transparent 50%)' }} />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-11 h-11 rounded-lg bg-primary-600 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">NexFlow</span>
          </Link>
          <p className="mt-2 text-sm text-ink-400">Urban Freight Intelligence Layer</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-ink-900 mb-1">Sign in</h1>
          <p className="text-sm text-ink-500 mb-6">Enter the command center</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-error-50 border border-error-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-error-600 flex-shrink-0" />
              <span className="text-sm text-error-700">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="you@nexflow.demo"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="Any password works in demo"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Users */}
          <div className="mt-6 pt-6 border-t border-ink-100">
            <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-3">
              Quick select demo users
            </p>
            <div className="grid grid-cols-2 gap-2">
              {demoUsers.map((u) => (
                <button
                  key={u.email}
                  onClick={() => selectDemoUser(u.email)}
                  className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                    email === u.email
                      ? 'border-primary-300 bg-primary-50 ring-1 ring-primary-200'
                      : 'border-ink-200 hover:border-ink-300 hover:bg-ink-50'
                  }`}
                >
                  <p className="font-semibold text-ink-800">{u.role}</p>
                  <p className="text-ink-500 truncate">{u.email}</p>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-400 text-center">
              Any password works in demo mode
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-ink-400 hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
