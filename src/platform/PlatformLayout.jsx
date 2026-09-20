import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, Ticket, CreditCard, LogOut, Menu, X } from 'lucide-react';
import api from '../shared/api/client.js';
import { useAuthStore } from '../shared/store/auth.js';

const NAV = [
  { to: '/platform/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/platform/tenants', label: 'Tenants', icon: Building2 },
  { to: '/platform/bookings', label: 'All bookings', icon: Ticket },
  { to: '/platform/payments', label: 'All payments', icon: CreditCard },
];

export default function PlatformLayout() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Local sign-out still succeeds.
    }
    clearAuth();
    navigate('/tenant/login');
  };

  return (
    <div className="min-h-screen bg-zinc-50 lg:flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-zinc-800 bg-zinc-900 text-zinc-300 transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-4">
          <Link to="/platform/dashboard" className="flex items-center gap-2 font-extrabold text-white">
            <span className="text-xl">🐼</span> Platform
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden" aria-label="Close menu">
            <X className="h-5 w-5 text-zinc-400" />
          </button>
        </div>

        <nav className="space-y-1 p-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-brand-500 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-zinc-800 p-3">
          <p className="truncate px-1 text-sm font-medium text-white">{user?.name}</p>
          <p className="truncate px-1 text-xs text-zinc-500">{user?.role?.replace(/_/g, ' ')}</p>
          <button
            onClick={logout}
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex min-h-screen flex-1 flex-col lg:min-w-0">
        <header className="flex h-16 items-center gap-3 border-b border-zinc-200 bg-white px-4 lg:px-6">
          <button onClick={() => setOpen(true)} className="lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5 text-zinc-600" />
          </button>
          <p className="text-sm font-medium text-zinc-500">Platform administration</p>
        </header>
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
