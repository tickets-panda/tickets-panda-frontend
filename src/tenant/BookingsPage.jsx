import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Ticket, Calendar, Download, Filter } from 'lucide-react';
import api from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import Table, { Td } from '../shared/components/Table.jsx';
import Pagination from '../shared/components/Pagination.jsx';
import Input from '../shared/components/Input.jsx';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import { StatusBadge } from '../shared/components/Badge.jsx';
import { formatCurrency, formatDateTime } from '../shared/utils/format.js';

const STATUSES = [
  { value: '', label: 'All Orders' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PAYMENT_PENDING', label: 'Pending Payment' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'REFUNDED', label: 'Refunded' },
];

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
    <div className="space-y-6">
      <PageHeader
        title="Bookings & Orders"
        description="Every attendee ticket registration across your events and festival activities."
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-200/90">
        <div className="w-full sm:w-80">
          <Input
            icon={Search}
            placeholder="Search customer name or email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            size="sm"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                setStatus(item.value);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                status === item.value
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <PageLoader label="Loading attendee bookings…" />
      ) : !data?.rows.length ? (
        <EmptyState
          title="No bookings found"
          description={
            search || status
              ? 'Try adjusting your search criteria or resetting filters.'
              : 'Bookings will appear here as soon as customers buy tickets.'
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card">
          <Table columns={['Attendee', 'Festival / Event', 'Pass Tier', 'Qty', 'Amount Paid', 'Status', 'Date']}>
            {data.rows.map((registration) => (
              <tr key={registration.id} className="hover:bg-slate-50/80 transition-colors">
                <Td>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-xs font-bold text-brand-700 shrink-0">
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
                <Td className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[200px]">
                  {registration.event?.title}
                </Td>
                <Td className="text-xs text-brand-600 font-semibold">
                  {registration.ticketType?.name || 'General'}
                </Td>
                <Td className="text-xs font-bold text-slate-900">{registration.quantity}</Td>
                <Td className="text-xs font-black text-slate-900">
                  {registration.order ? formatCurrency(registration.order.amount, registration.order.currency) : '—'}
                </Td>
                <Td>
                  <StatusBadge status={registration.status} size="xs" />
                </Td>
                <Td className="whitespace-nowrap text-[11px] text-slate-500 font-mono">
                  {formatDateTime(registration.createdAt)}
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
