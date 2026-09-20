import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import Table, { Td } from '../shared/components/Table.jsx';
import Pagination from '../shared/components/Pagination.jsx';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import { StatusBadge } from '../shared/components/Badge.jsx';
import { formatCurrency, formatDateTime } from '../shared/utils/format.js';

const BOOKING_STATUSES = ['', 'PAID', 'PAYMENT_PENDING', 'CREATED', 'FAILED', 'CANCELLED', 'REFUNDED'];
const PAYMENT_STATUSES = ['', 'CAPTURED', 'AUTHORIZED', 'CREATED', 'FAILED', 'REFUNDED'];

export function PlatformBookingsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['platform-bookings', page, status],
    queryFn: async () => (await api.get('/platform/bookings', { params: { page, limit: 15, status } })).data.data,
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Cross-Tenant Orders" description="All attendee ticket registrations across the platform." />

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-200/90">
        <div className="flex flex-wrap gap-1.5">
          {BOOKING_STATUSES.map((item) => (
            <button
              key={item || 'all'}
              onClick={() => {
                setStatus(item);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                status === item
                  ? 'bg-purple-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item ? item.replace(/_/g, ' ') : 'All Statuses'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <PageLoader label="Loading platform orders…" />
      ) : !data?.rows.length ? (
        <EmptyState title="No orders found" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card">
          <Table columns={['Order Ref', 'College Tenant', 'Attendee', 'Event Title', 'Amount', 'Status', 'Date']}>
            {data.rows.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                <Td className="font-mono text-xs font-bold text-slate-800">{order.orderRef}</Td>
                <Td>
                  <Link
                    to={`/platform/tenants/${order.tenantId}`}
                    className="font-bold text-xs text-purple-700 hover:underline"
                  >
                    {order.tenant?.name}
                  </Link>
                </Td>
                <Td>
                  <p className="font-bold text-xs text-slate-900">{order.customer?.name}</p>
                  <p className="text-[11px] text-slate-500">{order.customer?.email}</p>
                </Td>
                <Td className="text-xs text-slate-700 font-medium line-clamp-1 max-w-[200px]">
                  {order.registration?.event?.title}
                </Td>
                <Td className="font-black text-xs text-slate-900">{formatCurrency(order.amount, order.currency)}</Td>
                <Td>
                  <StatusBadge status={order.status} size="xs" />
                </Td>
                <Td className="whitespace-nowrap text-[11px] text-slate-500 font-mono">
                  {formatDateTime(order.createdAt)}
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

export function PlatformPaymentsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['platform-payments', page, status],
    queryFn: async () => (await api.get('/platform/payments', { params: { page, limit: 15, status } })).data.data,
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Gateway Transactions" description="Payment ledger and settlement records across all college portals." />

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-200/90">
        <div className="flex flex-wrap gap-1.5">
          {PAYMENT_STATUSES.map((item) => (
            <button
              key={item || 'all'}
              onClick={() => {
                setStatus(item);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                status === item
                  ? 'bg-purple-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item ? item.replace(/_/g, ' ') : 'All Statuses'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <PageLoader label="Loading gateway transactions…" />
      ) : !data?.rows.length ? (
        <EmptyState title="No transactions found" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card">
          <Table columns={['Gateway ID / Ref', 'College Tenant', 'Order Ref', 'Method', 'Amount', 'Status', 'Captured At']}>
            {data.rows.map((payment) => (
              <tr key={payment.id} className="hover:bg-slate-50/80 transition-colors">
                <Td className="font-mono text-xs font-bold text-slate-800">{payment.razorpayPaymentId || 'LOCAL-TEST'}</Td>
                <Td>
                  <Link
                    to={`/platform/tenants/${payment.tenantId}`}
                    className="font-bold text-xs text-purple-700 hover:underline"
                  >
                    {payment.tenant?.name}
                  </Link>
                </Td>
                <Td className="font-mono text-xs text-slate-500">{payment.order?.orderRef}</Td>
                <Td className="text-xs uppercase font-bold text-slate-600">{payment.method || 'LOCAL_GATEWAY'}</Td>
                <Td className="font-black text-xs text-slate-900">{formatCurrency(payment.amount, payment.currency)}</Td>
                <Td>
                  <StatusBadge status={payment.status} size="xs" />
                </Td>
                <Td className="whitespace-nowrap text-[11px] text-slate-500 font-mono">
                  {payment.capturedAt ? formatDateTime(payment.capturedAt) : '—'}
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

export default { PlatformBookingsPage, PlatformPaymentsPage };
