import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Ticket,
  CreditCard,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import api from '../shared/api/client.js';
import { useAuthStore } from '../shared/store/auth.js';
import Reveal from '../shared/components/Reveal.jsx';

const NAV = [
  { to: '/platform/dashboard', label: 'Platform Overview', icon: LayoutDashboard },
  { to: '/platform/tenants', label: 'College Tenants', icon: Building2 },
  { to: '/platform/bookings', label: 'Cross-Tenant Orders', icon: Ticket },
  { to: '/platform/payments', label: 'Gateway Transactions', icon: CreditCard },
];

export default function PlatformLayout() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Local clean-up
    }
    clearAuth();
    navigate('/tenant/login');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 lg:flex">
      {/* Platform Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-800 bg-slate-950 text-slate-300 transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-850 px-5">
          <Link to="/platform/dashboard" className="flex items-center gap-2.5 font-black text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-lg shadow-sm shadow-purple-600/30">
              🐼
            </span>
            <div>
              <span className="text-base tracking-tight font-black text-white">Ticket Panda</span>
              <span className="block text-[9px] font-black uppercase tracking-widest text-purple-400">
                Platform Console
              </span>
            </div>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden text-slate-400" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Security / Role Strip */}
        <div className="border-b border-slate-850 bg-slate-900/50 px-4 py-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 text-[10px] font-bold text-purple-300">
            <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
            <span>Super Administrator</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 p-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer User / Logout */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-850 bg-slate-950 p-3">
          <div className="mb-2 rounded-xl bg-slate-900 p-2.5">
            <p className="truncate text-xs font-bold text-white">{user?.name || 'Platform Admin'}</p>
            <p className="truncate font-mono text-[10px] text-slate-400">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 px-3 py-2 text-xs font-bold text-slate-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main View Area */}
      <div className="flex min-h-screen flex-1 flex-col lg:min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <p className="text-xs font-bold text-slate-500">Platform Control Plane</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/tenant/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
            >
              <span>Tenant Studio</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Reveal key={location.pathname} y={14}>
            <Outlet />
          </Reveal>
        </main>
      </div>
    </div>
  );
}
