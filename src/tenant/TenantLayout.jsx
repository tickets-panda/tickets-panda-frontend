import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import api from '../shared/api/client.js';
import { useAuthStore } from '../shared/store/auth.js';

const NAV = [
  { to: '/tenant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tenant/events', label: 'Events', icon: CalendarDays },
  { to: '/tenant/bookings', label: 'Bookings', icon: Ticket },
  { to: '/tenant/scanner', label: 'Check-in scanner', icon: ScanLine },
  { to: '/tenant/staff', label: 'Staff & team', icon: Users },
  { to: '/tenant/profile', label: 'Organization', icon: UserCircle },
];

export default function TenantLayout() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [navigate]);

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Logging out locally is fine even if the API call fails.
    }
    clearAuth();
    navigate('/tenant/login');
  };

  return (
    <div className="min-h-screen bg-zinc-50 lg:flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-zinc-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-4">
          <Link to="/tenant/dashboard" className="flex items-center gap-2 font-extrabold text-zinc-900">
            <span className="text-xl">🐼</span> Ticket Panda
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden" aria-label="Close menu">
            <X className="h-5 w-5 text-zinc-500" />
          </button>
        </div>

        <div className="border-b border-zinc-200 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-zinc-400">Organization</p>
          <p className="truncate text-sm font-semibold text-zinc-800">{user?.tenantName || '—'}</p>
          {user?.tenantSlug && <p className="truncate font-mono text-xs text-zinc-500">/{user.tenantSlug}</p>}
        </div>

        <nav className="space-y-1 p-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-zinc-600 hover:bg-zinc-100'
                }`
              }
            >
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-2 border-t border-zinc-200 p-3">
          <div className="mb-2 px-1">
            <p className="truncate text-sm font-medium text-zinc-800">{user?.name}</p>
            <p className="truncate text-xs text-zinc-500">{user?.role?.replace(/_/g, ' ')}</p>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Content */}
      <div className="flex min-h-screen flex-1 flex-col lg:min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-4 lg:px-6">
          <button onClick={() => setOpen(true)} className="lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5 text-zinc-600" />
          </button>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-zinc-500">Tenant dashboard</p>
          </div>
          {user?.tenantSlug && (
            <Link
              to={`/t/${user.tenantSlug}`}
              target="_blank"
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              View public page ↗
            </Link>
          )}
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
