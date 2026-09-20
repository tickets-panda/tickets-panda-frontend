import { Link, Outlet } from 'react-router-dom';
import { Ticket } from 'lucide-react';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight text-zinc-900">
            <span className="text-xl">🐼</span> Ticket Panda
          </Link>
          <nav className="flex items-center gap-1 text-sm font-medium">
            <Link to="/my-tickets" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-zinc-600 hover:bg-zinc-100">
              <Ticket className="h-4 w-4" /> My Tickets
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-zinc-200 bg-white py-6 text-center text-xs text-zinc-500">
        Ticket Panda — Automate the gate. 🐼
      </footer>
    </div>
  );
}
