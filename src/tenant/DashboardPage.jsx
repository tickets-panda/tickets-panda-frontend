import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CalendarDays,
  IndianRupee,
  Ticket,
  ScanLine,
  Plus,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import api from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import Stat from '../shared/components/Stat.jsx';
import Card from '../shared/components/Card.jsx';
import Table, { Td } from '../shared/components/Table.jsx';
import Button from '../shared/components/Button.jsx';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import { StatusBadge } from '../shared/components/Badge.jsx';
import { formatCurrency, formatDate } from '../shared/utils/format.js';
import { useAuthStore } from '../shared/store/auth.js';
import { RevealGroup } from '../shared/components/Reveal.jsx';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['tenant-dashboard'],
    queryFn: async () => (await api.get('/tenant/dashboard/stats')).data.data,
  });

  if (isLoading) return <PageLoader label="Loading organizer dashboard…" />;
  if (!data) return <EmptyState title="No dashboard data available" />;

  const checkinRate =
    data.ticketsSold > 0 ? Math.round((data.checkedIn / data.ticketsSold) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-brand-950 p-6 sm:p-8 text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-brand-300 backdrop-blur-sm mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Organizer Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Welcome back, {user?.name?.split(' ')[0] || 'Organizer'} 👋
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Monitor admissions, track real-time festival ticket sales, and oversee gate operations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/studio/scanner"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all"
          >
            <ScanLine className="h-4 w-4" /> Open Gate Scanner
          </Link>
          <Link
            to="/studio/events/new"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition-all"
          >
            <Plus className="h-4 w-4" /> Create New Event
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat
          label="Total Revenue"
          value={formatCurrency(data.revenue)}
          icon={IndianRupee}
          tone="green"
          hint="From all confirmed sales"
        />
        <Stat
          label="Confirmed Bookings"
          value={data.totalRegistrations}
          icon={Ticket}
          tone="orange"
          hint="Unique transactions"
        />
        <Stat
          label="Tickets Issued"
          value={data.ticketsSold}
          icon={Ticket}
          tone="blue"
          hint="Active QR passes"
        />
        <Stat
          label="Gate Check-ins"
          value={data.checkedIn}
          icon={ScanLine}
          tone="purple"
          hint={`${checkinRate}% scanned at entrance`}
        />
        <Stat
          label="Events & Festivals"
          value={data.totalEvents}
          hint={`${data.liveEvents} currently live`}
          icon={CalendarDays}
        />
      </RevealGroup>

      {/* Operational Overview Grid */}
      <div className="grid gap-5 lg:grid-cols-2 items-start">
        {/* Upcoming Events Card */}
        <Card
          title="Upcoming Festivals & Events"
          subtitle="Events scheduled for your college"
          action={
            <Link to="/studio/events" className="text-xs font-bold text-brand-600 hover:underline">
              View All ↗
            </Link>
          }
          bodyClassName="p-0"
        >
          {data.upcomingEvents?.length ? (
            <Table columns={['Event & Venue', 'Date', { label: 'Status', className: 'text-right' }]}>
              {data.upcomingEvents.map((event) => (
                <tr key={event.id} className="hover:bg-slate-50/80 transition-colors">
                  <Td>
                    <Link
                      to={`/organizer/events/${event.id}`}
                      className="font-bold text-slate-900 hover:text-brand-600 line-clamp-1"
                    >
                      {event.title}
                    </Link>
                    <span className="block text-xs text-slate-500 line-clamp-1">{event.venueName}</span>
                  </Td>
                  <Td className="whitespace-nowrap text-xs text-slate-600">
                    {formatDate(event.eventDate)}
                  </Td>
                  <Td align="right">
                    <div className="flex items-center justify-end gap-4">
                      <StatusBadge status={event.status} size="xs" />
                      <Link
                        to={`/organizer/events/${event.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                      >
                        <span>Manage</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </Td>
                </tr>
              ))}
            </Table>
          ) : (
            <div className="p-8 text-center">
              <EmptyState
                title="No upcoming events"
                description="Create your first festival or competition to begin receiving attendee registrations."
                actionLabel="Create Event"
                onAction={() => (window.location.href = '/studio/events/new')}
              />
            </div>
          )}
        </Card>

        {/* Recent Registrations Table Card */}
        <Card
          title="Recent Bookings"
          subtitle="Latest attendee orders received"
          action={
            <Link to="/studio/bookings" className="text-xs font-bold text-brand-600 hover:underline">
              All Orders ↗
            </Link>
          }
          bodyClassName="p-0"
        >
          {data.recentRegistrations?.length ? (
            <Table columns={['Attendee', 'Event / Tier', { label: 'Status', className: 'text-right' }]}>
              {data.recentRegistrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-slate-50/80 transition-colors">
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-100 text-xs font-bold text-brand-700">
                        {registration.customer?.name?.charAt(0) || 'A'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-slate-900 truncate">
                          {registration.customer?.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{registration.customer?.email}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">
                      {registration.event?.title}
                    </p>
                    <p className="text-[11px] text-brand-600 font-medium">
                      {registration.ticketType?.name || 'General Admission'}
                    </p>
                  </Td>
                  <Td align="right">
                    <StatusBadge status={registration.status} size="xs" />
                  </Td>
                </tr>
              ))}
            </Table>
          ) : (
            <div className="p-8 text-center">
              <EmptyState
                title="No bookings recorded yet"
                description="Bookings will automatically show up here as participants register for your festival."
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
