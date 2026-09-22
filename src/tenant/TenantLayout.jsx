import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  Users,
  ScanLine,
  UserCircle,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Layers,
  BarChart3,
} from 'lucide-react';
import api from '../shared/api/client.js';
import { useAuthStore } from '../shared/store/auth.js';
import Reveal from '../shared/components/Reveal.jsx';

const NAV = [
  { to: '/organizer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/organizer/events', label: 'Events & Festivals', icon: CalendarDays },
  { to: '/organizer/bookings', label: 'Bookings & Orders', icon: Ticket },
  { to: '/organizer/analytics', label: 'Event Analytics', icon: BarChart3 },
  { to: '/organizer/scanner', label: 'Gate Scanner', icon: ScanLine, highlight: true },
  { to: '/organizer/staff', label: 'Staff & Team', icon: Users },
  { to: '/organizer/profile', label: 'College Profile', icon: UserCircle },
];

export default function TenantLayout() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [location.pathname]);

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Local clean-up even if network fails
    }
    clearAuth();
    navigate('/organizer/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white shadow-lg transition-transform lg:static lg:translate-x-0 lg:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <Link to="/organizer/dashboard" className="flex items-center gap-2.5 font-black text-slate-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-lg shadow-sm">
              🐼
            </span>
            <div>
              <span className="text-base tracking-tight font-black text-slate-950">Ticket Panda</span>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-brand-600">
                Organizer Portal
              </span>
            </div>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tenant Organization Profile Strip */}
        <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-xs font-black text-brand-600 shadow-sm">
              {user?.tenantName?.charAt(0) || 'C'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-900">{user?.tenantName || 'My College'}</p>
              {user?.tenantSlug && (
                <Link
                  to={`/t/${user.tenantSlug}`}
                  target="_blank"
                  className="flex items-center gap-1 font-mono text-[11px] text-brand-600 hover:underline"
                >
                  <span className="truncate">/{user.tenantSlug}</span>
                  <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Main Navigation Links */}
        <nav className="space-y-1 p-3">
          {NAV.map(({ to, label, icon: Icon, highlight }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/25'
                    : highlight
                    ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? 'text-white' : highlight ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span>{label}</span>
                  </div>
                  {highlight && !isActive && (
                    <span className="rounded-full bg-emerald-200/70 px-1.5 py-0.5 text-[9px] font-black text-emerald-800">
                      GATE
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom User Profile & Sign Out */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white p-3">
          <div className="mb-2 flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-xs font-bold text-slate-700">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-800">{user?.name}</p>
              <p className="truncate text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                {user?.role?.replace(/_/g, ' ')}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Content Area */}
      <div className="flex min-h-screen flex-1 flex-col lg:min-w-0">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Organizer</span>
              <ChevronRight className="h-3 w-3 text-slate-400" />
              <span className="font-bold text-slate-800 capitalize">
                {location.pathname.split('/')[2] || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user?.tenantSlug && (
              <Link
                to={`/t/${user.tenantSlug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all"
              >
                <span>College Portal</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            )}
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Reveal key={location.pathname} y={14}>
            <Outlet />
          </Reveal>
        </main>
      </div>
    </div>
  );
}
