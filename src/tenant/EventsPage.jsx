import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import api from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import Table, { Td } from '../shared/components/Table.jsx';
import Pagination from '../shared/components/Pagination.jsx';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import { StatusBadge } from '../shared/components/Badge.jsx';
import { formatDate, formatTime } from '../shared/utils/format.js';

const STATUS_OPTIONS = ['', 'DRAFT', 'LIVE', 'CLOSED', 'CANCELLED'];

export default function EventsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['tenant-events', page, status, search],
    queryFn: async () =>
      (await api.get('/tenant/events', { params: { page, limit: 10, status, search } })).data.data,
  });

  return (
    <div>
      <PageHeader
        title="Events"
        description="Create, publish and manage your events."
        actions={
          <Link
            to="/tenant/events/new"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            <Plus className="h-4 w-4" /> New event
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            className="input w-64 pl-9"
            placeholder="Search events…"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          className="input w-40"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option || 'all'} value={option}>
              {option ? option.replace(/_/g, ' ') : 'All statuses'}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <PageLoader label="Loading events…" />
      ) : !data?.rows.length ? (
        <EmptyState title="No events found" description="Create an event to get started." />
      ) : (
        <div className="card overflow-hidden">
          <Table columns={['Event', 'Date', 'Tickets sold', 'Status', '']}>
            {data.rows.map((event) => (
              <tr key={event.id}>
                <Td>
                  <Link to={`/tenant/events/${event.id}`} className="font-medium text-zinc-800 hover:text-brand-600">
                    {event.title}
                  </Link>
                  <span className="block truncate text-xs text-zinc-500">{event.venueName}</span>
                </Td>
                <Td className="whitespace-nowrap text-zinc-600">
                  {formatDate(event.eventDate)}
                  <span className="block text-xs text-zinc-400">{formatTime(event.eventTimeStart)}</span>
                </Td>
                <Td className="text-zinc-600">
                  {event.stats?.ticketsSold ?? 0}
                  <span className="block text-xs text-zinc-400">
                    {event.stats?.confirmedRegistrations ?? 0} booking(s)
                  </span>
                </Td>
                <Td>
                  <StatusBadge status={event.status} />
                </Td>
                <Td className="text-right">
                  <Link to={`/tenant/events/${event.id}`} className="text-xs font-semibold text-brand-600 hover:underline">
                    Manage
                  </Link>
                </Td>
              </tr>
            ))}
          </Table>
          <Pagination pagination={data.pagination} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
