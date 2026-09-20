import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Plus,
  Search,
  CalendarDays,
  MapPin,
  Ticket,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import api from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import Table, { Td } from '../shared/components/Table.jsx';
import Pagination from '../shared/components/Pagination.jsx';
import Button from '../shared/components/Button.jsx';
import Input from '../shared/components/Input.jsx';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import { StatusBadge } from '../shared/components/Badge.jsx';
import { formatDate, formatTime } from '../shared/utils/format.js';
import { useAuthStore } from '../shared/store/auth.js';

const STATUS_FILTERS = [
  { value: '', label: 'All Statuses' },
  { value: 'LIVE', label: 'Live' },
  { value: 'DRAFT', label: 'Drafts' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function EventsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['tenant-events', page, status, search],
    queryFn: async () =>
      (await api.get('/tenant/events', { params: { page, limit: 10, status, search } })).data.data,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events & Festivals"
        description="Publish college festivals, cultural nights, tech hackathons, and departmental symposiums."
        actions={
          <Link
            to="/tenant/events/new"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition-all"
          >
            <Plus className="h-4 w-4" /> Create New Event
          </Link>
        }
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-200/90">
        <div className="w-full sm:w-72">
          <Input
            icon={Search}
            placeholder="Search by event title or venue…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            size="sm"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setStatus(f.value);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                status === f.value
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <PageLoader label="Loading events…" />
      ) : !data?.rows.length ? (
        <EmptyState
          title="No events found"
          description={
            search || status
              ? 'No events match the selected criteria. Try adjusting your search or filters.'
              : 'Create your first event or annual festival to begin issuing tickets.'
          }
          actionLabel={!search && !status ? 'Create New Event' : undefined}
          onAction={!search && !status ? () => (window.location.href = '/tenant/events/new') : undefined}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card">
          <Table columns={['Event & Venue', 'Schedule', 'Tickets & Bookings', 'Status', 'Actions']}>
            {data.rows.map((event) => (
              <tr key={event.id} className="hover:bg-slate-50/80 transition-colors">
                <Td>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-brand-700 font-bold text-sm">
                      {event.title.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/tenant/events/${event.id}`}
                        className="font-bold text-sm text-slate-900 hover:text-brand-600 transition-colors line-clamp-1"
                      >
                        {event.title}
                      </Link>
                      <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5 truncate">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{event.venueName}</span>
                      </p>
                    </div>
                  </div>
                </Td>
                <Td className="whitespace-nowrap">
                  <p className="text-xs font-bold text-slate-800">{formatDate(event.eventDate)}</p>
                  <p className="text-[11px] text-slate-500">{formatTime(event.eventTimeStart)}</p>
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-brand-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {event.stats?.ticketsSold ?? 0} issued
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {event.stats?.confirmedRegistrations ?? 0} booking(s)
                      </p>
                    </div>
                  </div>
                </Td>
                <Td>
                  <StatusBadge status={event.status} size="sm" />
                </Td>
                <Td className="text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    {user?.tenantSlug && (
                      <Link
                        to={`/t/${user.tenantSlug}/events/${event.slug}`}
                        target="_blank"
                        title="View Public Event Page"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                    <Link
                      to={`/tenant/events/${event.id}`}
                      className="rounded-lg bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 transition-all"
                    >
                      Manage
                    </Link>
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
          <div className="border-t border-slate-100 p-4">
            <Pagination pagination={data.pagination} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
}
