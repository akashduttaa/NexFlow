import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Activity,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Truck,
  Wifi,
  Smartphone,
  CheckCircle2,
  KeyRound,
  Sparkles,
  Radio,
  Cpu,
  MapPin,
  Building2,
  Leaf,
  Zap,
  ShieldAlert,
  FileCheck,
  FileX,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import urbanTruckImg from '@/assets/images/urban_truck.jpg';
import controlCenterImg from '@/assets/images/control_center.jpg';
import indianFreightBg from '@/assets/images/indian_freight_bg.jpg';

const demoAdminUsers = [
  { email: 'admin@nexflow.demo', role: 'Administrator', title: 'System Admin' },
  { email: 'operator@nexflow.demo', role: 'Operator', title: 'Municipal Operator' },
  { email: 'fleet@nexflow.demo', role: 'Fleet Manager', title: 'Fleet Logistics' },
  { email: 'analyst@nexflow.demo', role: 'Analyst', title: 'Data Analyst' },
];

const demoDrivers = [
  {
    id: 'usr-driver-1',
    email: 'driver@nexflow.demo',
    name: 'Arjun Das',
    vehicle: 'WB-04-E-8821',
    type: 'LCV (Electric)',
    fuelType: 'EV' as const,
    pucCertNo: 'EXEMPT (EV Zero Emission)',
    pucValid: true,
    ecoDiscountPct: 5,
  },
  {
    id: 'usr-driver-2',
    email: 'rohit@nexflow.demo',
    name: 'Rohit Sharma',
    vehicle: 'WB-04-E-8822',
    type: 'HCV (Electric)',
    fuelType: 'EV' as const,
    pucCertNo: 'EXEMPT (EV Zero Emission)',
    pucValid: true,
    ecoDiscountPct: 5,
  },
  {
    id: 'usr-driver-3',
    email: 'sukumar@nexflow.demo',
    name: 'Sukumar Banerjee',
    vehicle: 'WB-04-D-8823',
    type: 'Mini Truck (Diesel)',
    fuelType: 'DIESEL' as const,
    pucCertNo: 'WB-PUC-2026-9823',
    pucValid: true,
    ecoDiscountPct: 0,
  },
  {
    id: 'usr-driver-4',
    email: 'imran@nexflow.demo',
    name: 'Imran Khan',
    vehicle: 'WB-04-D-8824',
    type: 'Carrier (Diesel)',
    fuelType: 'DIESEL' as const,
    pucCertNo: 'EXPIRED-PUC-2025-001',
    pucValid: false,
    ecoDiscountPct: 0,
  },
];

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const roleParam = searchParams.get('role');
  const [activeTab, setActiveTab] = useState<'admin' | 'driver'>(
    roleParam === 'driver' ? 'driver' : 'admin'
  );

  // Admin Form State
  const [email, setEmail] = useState('admin@nexflow.demo');
  const [password, setPassword] = useState('demo123');

  // Driver Form State
  const [driverMode, setDriverMode] = useState<'signin' | 'register'>('signin');
  const [driverNameInput, setDriverNameInput] = useState('Arjun Das');
  const [vehicleReg, setVehicleReg] = useState('WB-04-E-8821');
  const [driverPin, setDriverPin] = useState('1234');
  const [selectedDriverEmail, setSelectedDriverEmail] = useState('driver@nexflow.demo');

  // Eco & PUC Certificate State
  const [fuelType, setFuelType] = useState<'EV' | 'DIESEL'>('EV');
  const [pucCertNo, setPucCertNo] = useState('EXEMPT (EV Zero Emission)');
  const [pucConfirmed, setPucConfirmed] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (roleParam === 'driver') {
      setActiveTab('driver');
    } else if (roleParam === 'admin') {
      setActiveTab('admin');
    }
  }, [roleParam]);

  const handleFuelTypeChange = (newFuel: 'EV' | 'DIESEL') => {
    setFuelType(newFuel);
    setError(null);
    if (newFuel === 'EV') {
      setPucCertNo('EXEMPT (EV Zero Emission)');
      setPucConfirmed(true);
    } else {
      setPucCertNo('WB-PUC-2026-9823');
      setPucConfirmed(true);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      navigate('/dashboard');
    } else {
      setError('Admin sign in failed. Please check credentials.');
    }
  };

  const handleDriverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // ENFORCE MANDATORY PUC CERTIFICATE FOR NON-EV VEHICLES
    if (fuelType !== 'EV') {
      if (!pucCertNo || pucCertNo.trim().length < 5 || pucCertNo.toUpperCase().includes('EXPIRED')) {
        setError(
          '⛔ Registration / Login Rejected: Non-EV vehicles MUST register with a valid Pollution Under Control (PUC) Certificate to enter the Burrabazar Freight District.'
        );
        return;
      }
      if (!pucConfirmed) {
        setError('⛔ Registration Rejected: You must confirm your PUC certificate validity under Eco Compliance Rules.');
        return;
      }
    }

    setLoading(true);
    let ok = await login(selectedDriverEmail, driverPin);
    if (!ok) {
      // Fallback for demo driver login
      ok = await login('driver@nexflow.demo', driverPin);
    }
    setLoading(false);

    if (ok) {
      localStorage.setItem('nexflow-driver-vehicle', vehicleReg);
      localStorage.setItem('nexflow-driver-fuel-type', fuelType);
      localStorage.setItem('nexflow-driver-puc-cert', pucCertNo);
      localStorage.setItem('nexflow-driver-eco-discount', fuelType === 'EV' ? '5' : '0');

      if (fuelType === 'EV') {
        setSuccessMsg('🌱 Green Fleet Verified! 5% Eco Discount applied to all Loading Bay Reservations.');
      } else {
        setSuccessMsg('✅ PUC Certificate Verified & Validated. Vehicle Registered Successfully.');
      }

      setTimeout(() => {
        navigate('/driver');
      }, 800);
    } else {
      setError('Driver authentication failed. Verify vehicle registration and PIN.');
    }
  };

  const selectAdminUser = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
    setError(null);
    setSuccessMsg(null);
  };

  const selectDriver = (driver: (typeof demoDrivers)[0]) => {
    setVehicleReg(driver.vehicle);
    setSelectedDriverEmail(driver.email);
    setDriverNameInput(driver.name);
    setFuelType(driver.fuelType);
    setPucCertNo(driver.pucCertNo);
    setPucConfirmed(driver.pucValid);
    setDriverPin('1234');
    setError(null);
    setSuccessMsg(null);

    if (!driver.pucValid) {
      setError(`⚠️ Note: Driver ${driver.name}'s PUC Certificate (${driver.pucCertNo}) is EXPIRED. Registration will be rejected until renewed.`);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4 py-8 lg:py-12 relative overflow-hidden">
      
      {/* Full-Screen Indian Commercial Freight Context Background with Glassmorphism Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={indianFreightBg || '/images/indian_freight_bg.jpg'}
          alt="Kolkata Burrabazar Posta Indian Freight Trade District"
          className="w-full h-full object-cover object-center filter brightness-50 contrast-110 scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/indian_freight_bg.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/85 via-ink-950/75 to-ink-950/90 backdrop-blur-lg" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-25" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto animate-fade-in my-auto">
        
        {/* Top Pilot Banner Badge */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ink-950/85 backdrop-blur-xl border border-accent-500/40 text-xs font-semibold text-accent-300 shadow-xl">
            <MapPin className="w-3.5 h-3.5 text-accent-400 animate-bounce" />
            <span>Pilot Zone: Kolkata Burrabazar / Posta Trade District</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" />
            <span className="text-[10px] text-emerald-400 uppercase font-mono">PM Gati Shakti Aligned</span>
          </div>
        </div>

        {/* Logo Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
                boxShadow: '0 0 20px rgba(6,182,212,0.4)',
              }}
            >
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">NexFlow</span>
          </Link>
          <p className="mt-1 text-sm text-ink-300 font-medium">
            Urban Freight Intelligence Layer • Kolkata Municipal Hub
          </p>
        </div>

        {/* 2-Column Glassmorphism Grid */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* LEFT COLUMN: Login Form & Role Tabs */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Role Selector Tabs */}
            <div className="flex p-1.5 rounded-xl bg-ink-950/90 backdrop-blur-2xl border border-white/20 mb-5 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('admin');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'admin'
                    ? 'bg-primary-500/30 text-primary-200 border border-primary-500/50 shadow-glow-cyan'
                    : 'text-ink-300 hover:text-ink-100 hover:bg-white/5'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin & Ops</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('driver');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'driver'
                    ? 'bg-accent-500/30 text-accent-200 border border-accent-500/50 shadow-glow-amber'
                    : 'text-ink-300 hover:text-ink-100 hover:bg-white/5'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Truck Driver App</span>
              </button>
            </div>

            {/* Glass Card Body */}
            <div className="p-6 lg:p-8 rounded-2xl relative backdrop-blur-2xl bg-ink-950/85 border border-white/20 shadow-2xl">
              
              {/* Alert Messages */}
              {error && (
                <div className="mb-5 p-3.5 rounded-lg bg-error-500/20 border border-error-500/40 flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-error-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-error-200 font-medium leading-relaxed">{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-5 p-3.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-xs text-emerald-200 font-medium">{successMsg}</span>
                </div>
              )}

              {/* ADMIN LOGIN TAB */}
              {activeTab === 'admin' && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h1 className="text-xl font-bold text-white">Admin & Operations</h1>
                      <p className="text-xs text-ink-300">Command center, optimizer & fleet portal</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-300 border border-primary-500/40 flex items-center gap-1.5 backdrop-blur-md">
                      <Radio className="w-3 h-3 animate-pulse text-primary-400" />
                      Command Center
                    </span>
                  </div>

                  <form onSubmit={handleAdminSubmit} className="space-y-4">
                    <div>
                      <label className="label text-ink-200">Work Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input pl-10 bg-surface/90 border-surface-border text-white placeholder-ink-500 focus:border-primary-500/60"
                          placeholder="admin@nexflow.demo"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label text-ink-200">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="input pl-10 bg-surface/90 border-surface-border text-white placeholder-ink-500 focus:border-primary-500/60"
                          placeholder="Any password works in demo"
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm font-semibold shadow-glow-cyan">
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Authenticating...
                        </>
                      ) : (
                        <>
                          Enter Command Center
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Demo Admin Roles */}
                  <div className="mt-5 pt-5 border-t border-white/10">
                    <p className="text-xs font-bold text-ink-400 uppercase tracking-[0.15em] mb-2.5">
                      Quick Select Demo Admin Accounts
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {demoAdminUsers.map((u) => (
                        <button
                          key={u.email}
                          type="button"
                          onClick={() => selectAdminUser(u.email)}
                          className={`text-left p-2 rounded-lg border text-xs transition-all duration-300 ${
                            email === u.email
                              ? 'border-primary-500/50 bg-primary-500/20 text-white'
                              : 'border-white/10 bg-surface/40 hover:border-primary-500/30 hover:bg-surface/80 text-ink-200'
                          }`}
                        >
                          <p className="font-semibold text-white">{u.title}</p>
                          <p className="text-ink-400 truncate text-[11px]">{u.email}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TRUCK DRIVER LOGIN & REGISTRATION TAB */}
              {activeTab === 'driver' && (
                <div className="animate-fade-in">
                  
                  {/* ECO-FRIENDLY MOTTO BANNER */}
                  <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-emerald-950/80 via-ink-950/80 to-emerald-950/80 border border-emerald-500/40 shadow-lg text-left">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                          Protect Environment • Eco Freight Protocol
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        ⚡ 5% EV Eco Discount
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-300 leading-snug">
                      Mandatory Pollution Under Control (PUC) certificate required for ICE trucks. EV drivers enjoy an automatic <strong className="text-emerald-300 font-semibold">5% Discount</strong> on loading bay access fees!
                    </p>
                  </div>

                  {/* Header & Mode Switcher */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-lg font-bold text-white">
                        {driverMode === 'signin' ? 'Driver Sign In & Registration' : 'Register New Eco Driver'}
                      </h1>
                      <p className="text-xs text-ink-300">Offline-first driver app with emission compliance</p>
                    </div>
                    <div className="flex items-center p-1 rounded-lg bg-surface/60 border border-white/10 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setDriverMode('signin');
                          setError(null);
                        }}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                          driverMode === 'signin'
                            ? 'bg-accent-500/30 text-accent-300 border border-accent-500/40'
                            : 'text-ink-400 hover:text-white'
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDriverMode('register');
                          setError(null);
                        }}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                          driverMode === 'register'
                            ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                            : 'text-ink-400 hover:text-white'
                        }`}
                      >
                        New Eco-Register
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleDriverSubmit} className="space-y-3.5">
                    
                    {/* Fuel Type Selector (EV vs Diesel/CNG) */}
                    <div>
                      <label className="label text-ink-200 text-xs font-semibold flex items-center justify-between mb-1.5">
                        <span>Select Vehicle Powertrain / Fuel Type</span>
                        <span className="text-[10px] text-emerald-400 font-normal">EVs get 5% Fee Discount</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleFuelTypeChange('EV')}
                          className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                            fuelType === 'EV'
                              ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 shadow-glow-amber'
                              : 'bg-surface/40 border-white/10 text-ink-300 hover:border-emerald-500/30'
                          }`}
                        >
                          <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <div className="text-left">
                            <p className="font-bold text-white">Electric Vehicle (EV)</p>
                            <p className="text-[10px] text-emerald-400 font-mono">5% Eco Discount • PUC Exempt</p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleFuelTypeChange('DIESEL')}
                          className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                            fuelType === 'DIESEL'
                              ? 'bg-amber-500/20 border-amber-500/60 text-amber-200 shadow-glow-amber'
                              : 'bg-surface/40 border-white/10 text-ink-300 hover:border-amber-500/30'
                          }`}
                        >
                          <Truck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <div className="text-left">
                            <p className="font-bold text-white">Diesel / Petrol / CNG</p>
                            <p className="text-[10px] text-amber-400 font-mono">Mandatory PUC Cert</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Driver Name (If registering) */}
                    {driverMode === 'register' && (
                      <div>
                        <label className="label text-ink-200">Driver Full Name</label>
                        <input
                          type="text"
                          value={driverNameInput}
                          onChange={(e) => setDriverNameInput(e.target.value)}
                          className="input bg-surface/90 border-surface-border text-white text-sm"
                          placeholder="e.g. Arjun Das"
                          required
                        />
                      </div>
                    )}

                    {/* Vehicle Registration Number */}
                    <div>
                      <label className="label text-ink-200">Vehicle Registration Number</label>
                      <div className="relative">
                        <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                        <input
                          type="text"
                          value={vehicleReg}
                          onChange={(e) => setVehicleReg(e.target.value.toUpperCase())}
                          className="input pl-10 bg-surface/90 border-surface-border text-white font-mono text-sm uppercase tracking-wider placeholder-ink-500 focus:border-accent-500/60"
                          placeholder="WB-04-E-8821"
                          required
                        />
                      </div>
                    </div>

                    {/* PUC CERTIFICATE SECTION */}
                    <div className="p-3 rounded-xl bg-ink-950/70 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-ink-100 flex items-center gap-1.5">
                          {fuelType === 'EV' ? (
                            <>
                              <FileCheck className="w-4 h-4 text-emerald-400" />
                              <span>PUC Status: <strong className="text-emerald-400">Zero Emission Exempt</strong></span>
                            </>
                          ) : (
                            <>
                              <FileX className="w-4 h-4 text-amber-400" />
                              <span>Mandatory PUC Certificate No.</span>
                            </>
                          )}
                        </label>
                        {fuelType === 'EV' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            🌿 5% Eco Discount Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Required for Registration
                          </span>
                        )}
                      </div>

                      {fuelType === 'EV' ? (
                        <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                          <span className="text-emerald-300 font-mono">EXEMPT (Zero Tailpipe Emissions)</span>
                          <span className="text-[11px] text-emerald-400 font-semibold">100% Compliant</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={pucCertNo}
                            onChange={(e) => {
                              setPucCertNo(e.target.value.toUpperCase());
                              setError(null);
                            }}
                            className="input bg-surface/90 border-surface-border text-white font-mono text-xs uppercase"
                            placeholder="e.g. WB-PUC-2026-9823"
                            required={fuelType !== 'EV'}
                          />
                          <label className="flex items-center gap-2 cursor-pointer pt-1">
                            <input
                              type="checkbox"
                              checked={pucConfirmed}
                              onChange={(e) => setPucConfirmed(e.target.checked)}
                              className="rounded border-ink-600 bg-ink-900 text-amber-500 focus:ring-amber-500/40"
                            />
                            <span className="text-[11px] text-ink-300">
                              I confirm this PUC certificate is valid and active.
                            </span>
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Passcode / PIN */}
                    <div>
                      <label className="label text-ink-200">Driver Passcode / PIN</label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                        <input
                          type="password"
                          value={driverPin}
                          onChange={(e) => setDriverPin(e.target.value)}
                          className="input pl-10 bg-surface/90 border-surface-border text-white placeholder-ink-500 focus:border-accent-500/60"
                          placeholder="4-digit PIN (e.g. 1234)"
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-secondary w-full py-3 text-sm font-semibold bg-accent-500/25 text-accent-200 hover:bg-accent-500/35 border-accent-500/50 shadow-glow-amber">
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Validating Emission & Registering...
                        </>
                      ) : (
                        <>
                          {driverMode === 'signin' ? 'Launch Driver App' : 'Register Eco-Driver Profile'}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Demo Drivers Selector */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs font-bold text-ink-400 uppercase tracking-[0.15em] mb-2">
                      Quick Select Demo Driver Profiles
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {demoDrivers.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => selectDriver(d)}
                          className={`text-left p-2 rounded-lg border text-xs transition-all duration-300 ${
                            vehicleReg === d.vehicle
                              ? 'border-accent-500/50 bg-accent-500/20 text-white'
                              : 'border-white/10 bg-surface/40 hover:border-accent-500/30 hover:bg-surface/80 text-ink-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-white truncate max-w-[90px]">{d.name}</p>
                            {d.fuelType === 'EV' ? (
                              <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/20 px-1 rounded">
                                EV 5% OFF
                              </span>
                            ) : d.pucValid ? (
                              <span className="text-[10px] text-amber-300 font-mono bg-amber-500/20 px-1 rounded">
                                PUC Valid
                              </span>
                            ) : (
                              <span className="text-[10px] text-error-400 font-mono font-bold bg-error-500/20 px-1 rounded">
                                PUC EXPIRED
                              </span>
                            )}
                          </div>
                          <p className="text-ink-400 font-mono text-[11px] mt-0.5">{d.vehicle}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Glassmorphism Photo Showcase (Visible on all screens) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="relative group rounded-3xl p-3 transition-all duration-500 overflow-hidden bg-gradient-to-br from-white/15 via-white/5 to-transparent backdrop-blur-2xl border border-white/20 shadow-2xl">
              
              {/* Dynamic Glow background */}
              <div
                className={`absolute -inset-4 blur-3xl opacity-40 transition-all duration-700 pointer-events-none ${
                  activeTab === 'admin'
                    ? 'bg-gradient-to-br from-primary-500/50 via-cyan-500/30 to-blue-600/50'
                    : 'bg-gradient-to-br from-accent-500/50 via-amber-500/30 to-orange-600/50'
                }`}
              />

              {/* Main Photo Container */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-ink-900 border border-white/20 shadow-inner group-hover:scale-[1.01] transition-transform duration-500">
                <img
                  src={activeTab === 'admin' ? controlCenterImg : urbanTruckImg}
                  alt={activeTab === 'admin' ? 'NexFlow Freight Command Center' : 'NexFlow Electric Freight Fleet'}
                  className="w-full h-full object-cover object-center transition-all duration-700 filter brightness-95 contrast-105 group-hover:scale-105"
                  onError={(e) => {
                    const fallback = activeTab === 'admin' ? '/images/control_center.jpg' : '/images/urban_truck.jpg';
                    (e.target as HTMLImageElement).src = fallback;
                  }}
                />

                {/* Dark Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent" />

                {/* Glass Badge Overlay - Top Right */}
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink-950/85 backdrop-blur-xl border border-white/25 shadow-lg text-xs font-semibold text-white">
                  <span className={`w-2 h-2 rounded-full animate-ping ${activeTab === 'admin' ? 'bg-cyan-400' : 'bg-amber-400'}`} />
                  <span className="tracking-wide">
                    {activeTab === 'admin' ? 'LIVE ICCC DIGITAL TWIN' : 'OFFLINE DRIVER CACHE ACTIVE'}
                  </span>
                </div>

                {/* Glass Badge Overlay - Top Left */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-ink-950/85 backdrop-blur-xl border border-white/25 shadow-lg text-xs font-medium text-ink-200">
                  <Building2 className="w-3.5 h-3.5 text-accent-400" />
                  <span>Kolkata Burrabazar Hub</span>
                </div>

                {/* Bottom Overlay Info Box in Glassmorphism */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-ink-950/90 backdrop-blur-2xl border border-white/20 shadow-xl text-left">
                  {activeTab === 'admin' ? (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-cyan-400" />
                          <h3 className="text-sm font-bold text-white tracking-tight">NexFlow AI Command Center</h3>
                        </div>
                        <span className="text-[11px] font-mono text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/30">
                          OR-Tools + XGBoost
                        </span>
                      </div>
                      <p className="text-xs text-ink-300 leading-relaxed">
                        Real-time freight pressure predictions, joint road-curb optimization, and dynamic incident rerouting.
                      </p>
                      <div className="mt-3 flex items-center justify-between text-[11px] text-ink-400 pt-2 border-t border-white/10 font-mono">
                        <span>Active Nodes: <strong className="text-cyan-300 font-semibold">142 Bays</strong></span>
                        <span>Curb Occupancy: <strong className="text-accent-300 font-semibold">84% Peak</strong></span>
                        <span>Sync: <strong className="text-emerald-400 font-semibold">Live (0.4s)</strong></span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-amber-400" />
                          <h3 className="text-sm font-bold text-white tracking-tight">Smart Electric Freight Delivery</h3>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                          5% EV Discount
                        </span>
                      </div>
                      <p className="text-xs text-ink-300 leading-relaxed">
                        Guaranteed reserved loading bay slot, real-time optimal turn-by-turn route, and offline lock confirmation.
                      </p>
                      <div className="mt-3 flex items-center justify-between text-[11px] text-ink-400 pt-2 border-t border-white/10 font-mono">
                        <span>Vehicle: <strong className="text-amber-300 font-semibold">EV Commercial LCV</strong></span>
                        <span>PUC Status: <strong className="text-emerald-400 font-semibold">Exempt (Zero Emission)</strong></span>
                        <span>Eco Savings: <strong className="text-emerald-400 font-semibold">5% Fee Credit</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-ink-200 hover:text-primary-400 transition-colors inline-flex items-center gap-1.5 font-medium bg-ink-950/80 px-4 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
            ← Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
