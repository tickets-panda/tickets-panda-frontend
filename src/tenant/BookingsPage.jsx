import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import api from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import Table, { Td } from '../shared/components/Table.jsx';
import Pagination from '../shared/components/Pagination.jsx';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import { StatusBadge } from '../shared/components/Badge.jsx';
import { formatCurrency, formatDateTime } from '../shared/utils/format.js';

const STATUSES = ['', 'PAYMENT_PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED', 'EXPIRED'];

export default function BookingsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['tenant-registrations', page, status, search],
    queryFn: async () =>
      (await api.get('/tenant/registrations', { params: { page, limit: 15, status, search } })).data.data,
  });

  return (
    <div>
      <PageHeader title="Bookings" description="Every registration across your events." />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            className="input w-64 pl-9"
            placeholder="Search customer name or email…"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          className="input w-48"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
        >
          {STATUSES.map((value) => (
            <option key={value || 'all'} value={value}>
              {value ? value.replace(/_/g, ' ') : 'All statuses'}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <PageLoader label="Loading bookings…" />
      ) : !data?.rows.length ? (
        <EmptyState title="No bookings found" description="Try a different filter, or wait for your first sale." />
      ) : (
        <div className="card overflow-hidden">
          <Table columns={['Customer', 'Event', 'Type', 'Qty', 'Amount', 'Status', 'Booked']}>
            {data.rows.map((registration) => (
              <tr key={registration.id}>
                <Td>
                  <span className="font-medium text-zinc-800">{registration.customer?.name}</span>
                  <span className="block text-xs text-zinc-500">{registration.customer?.email}</span>
                </Td>
                <Td className="text-zinc-600">{registration.event?.title}</Td>
                <Td className="text-zinc-600">{registration.ticketType?.name}</Td>
                <Td>{registration.quantity}</Td>
                <Td className="font-medium">
                  {registration.order ? formatCurrency(registration.order.amount, registration.order.currency) : '—'}
                </Td>
                <Td>
                  <StatusBadge status={registration.status} />
                </Td>
                <Td className="whitespace-nowrap text-xs text-zinc-500">{formatDateTime(registration.createdAt)}</Td>
              </tr>
            ))}
          </Table>
          <Pagination pagination={data.pagination} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
