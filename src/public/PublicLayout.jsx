import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Ticket,
  Calendar,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  ShieldCheck,
  Building2,
  GraduationCap,
  HelpCircle,
  Mail,
  ExternalLink,
} from 'lucide-react';

const MARKETING_LINKS = [
  { to: '/features', label: 'Features' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/for-colleges', label: 'For Colleges' },
  { to: '/for-organizers', label: 'For Organizers' },
  { to: '/events', label: 'Explore Events' },
];

export default function PublicLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if current route is a tenant-branded event page
  const isTenantPage = location.pathname.startsWith('/t/');
  const isCheckoutPage = location.pathname.startsWith('/checkout/');

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 font-black text-xl tracking-tight text-zinc-950 group">
            <span className="text-2xl transition-transform duration-200 group-hover:scale-110">🐼</span>
            <span className="font-display">Ticket Panda</span>
          </Link>

          {/* Desktop Marketing Navigation */}
          {!isTenantPage && (
            <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-zinc-600">
              {MARKETING_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `transition hover:text-brand-600 ${
                      isActive ? 'text-brand-600 font-black' : ''
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          )}

          {/* Desktop Right Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/my-tickets"
              className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition"
            >
              <Ticket className="h-4 w-4 text-brand-500" />
              <span>My Tickets</span>
            </Link>

            <Link
              to="/studio/login"
              className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition"
            >
              Sign In
            </Link>

            <Link
              to="/studio/register"
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-brand-500/20 hover:bg-brand-600 active:scale-95 transition"
            >
              <span>Create an Event</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden rounded-lg p-2 text-zinc-600 hover:bg-zinc-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-b border-zinc-200 bg-white px-4 py-5 space-y-4 animate-fadeIn">
            {!isTenantPage && (
              <div className="flex flex-col space-y-3 pb-3 border-b border-zinc-100">
                {MARKETING_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-bold text-zinc-800 hover:text-brand-600"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-2 pt-1">
              <Link
                to="/my-tickets"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-zinc-100 px-4 py-2.5 text-xs font-bold text-zinc-800"
              >
                <Ticket className="h-4 w-4 text-brand-500" />
                <span>My Tickets</span>
              </Link>
              <Link
                to="/studio/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-800"
              >
                Organizer Sign In
              </Link>
              <Link
                to="/studio/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-bold text-white"
              >
                <span>Create an Event</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Body (page sections animate via their own Reveal wrappers) */}
      <main className="flex-1" key={location.pathname}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/80 bg-white">
        {/* On College/Tenant pages: subtle powered by footer */}
        {isTenantPage ? (
          <div className="mx-auto max-w-7xl px-4 py-8 text-center text-xs text-zinc-500">
            <p className="flex items-center justify-center gap-1.5 font-medium">
              <span>Powered by</span>
              <Link to="/" className="font-bold text-zinc-800 hover:text-brand-600 flex items-center gap-1">
                <span>Ticket Panda</span> <span>🐼</span>
              </Link>
              <span>· Modern Event Ticketing & QR Gate Verification</span>
            </p>
          </div>
        ) : (
          /* Full SaaS Marketing Footer */
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-16">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {/* Brand Col */}
              <div className="lg:col-span-2 space-y-3.5">
                <Link to="/" className="flex items-center gap-2 font-black text-xl text-zinc-950">
                  <span className="text-2xl">🐼</span> Ticket Panda
                </Link>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
                  The multi-tenant event registration and entry verification platform. Powering college cultural fests, technical summits, and professional conferences with instant e-tickets and sub-second QR check-in.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>100% Verified Registrations · Zero Gate Queues</span>
                </div>
              </div>

              {/* Col 1: Product */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">Product</p>
                <ul className="space-y-2 text-xs text-zinc-600">
                  <li><Link to="/features" className="hover:text-brand-600">Features & Platform</Link></li>
                  <li><Link to="/how-it-works" className="hover:text-brand-600">How it Works</Link></li>
                  <li><Link to="/events" className="hover:text-brand-600">Browse Public Events</Link></li>
                  <li><Link to="/studio/scanner" className="hover:text-brand-600">QR Gate Scanner</Link></li>
                  <li><Link to="/my-tickets" className="hover:text-brand-600">My Tickets Portal</Link></li>
                </ul>
              </div>

              {/* Col 2: Solutions */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">Solutions</p>
                <ul className="space-y-2 text-xs text-zinc-600">
                  <li><Link to="/for-colleges" className="hover:text-brand-600">For College Fests</Link></li>
                  <li><Link to="/for-organizers" className="hover:text-brand-600">For Conferences</Link></li>
                  <li><Link to="/for-organizers" className="hover:text-brand-600">Hackathons & Workshops</Link></li>
                  <li><Link to="/studio/register" className="hover:text-brand-600">Start as Organizer</Link></li>
                </ul>
              </div>

              {/* Col 3: Support & Legal */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">Support & Legal</p>
                <ul className="space-y-2 text-xs text-zinc-600">
                  <li><Link to="/help" className="hover:text-brand-600">Help Center & FAQ</Link></li>
                  <li><Link to="/contact" className="hover:text-brand-600">Contact Support</Link></li>
                  <li><Link to="/privacy" className="hover:text-brand-600">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-brand-600">Terms of Service</Link></li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
              <p>© {new Date().getFullYear()} Ticket Panda Technologies. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <span>Designed for fast, queue-free events. 🐼</span>
              </div>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}
