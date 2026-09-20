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

export function PlatformBookingsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['platform-bookings', page, status],
    queryFn: async () => (await api.get('/platform/bookings', { params: { page, limit: 15, status } })).data.data,
  });

  return (
    <div>
      <PageHeader title="All bookings" description="Cross-tenant order activity." />

      <select
        className="input mb-4 w-52"
        value={status}
        onChange={(event) => {
          setStatus(event.target.value);
          setPage(1);
        }}
      >
        <option value="">All statuses</option>
        {['CREATED', 'PAYMENT_PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED'].map((value) => (
          <option key={value} value={value}>
            {value.replace(/_/g, ' ')}
          </option>
        ))}
      </select>

      {isLoading ? (
        <PageLoader label="Loading bookings…" />
      ) : !data?.rows.length ? (
        <EmptyState title="No bookings found" />
      ) : (
        <div className="card overflow-hidden">
          <Table columns={['Order', 'Tenant', 'Customer', 'Event', 'Amount', 'Status', 'Created']}>
            {data.rows.map((order) => (
              <tr key={order.id}>
                <Td className="font-mono text-xs text-zinc-700">{order.orderRef}</Td>
                <Td>
                  <Link to={`/platform/tenants/${order.tenantId}`} className="font-medium text-brand-600 hover:underline">
                    {order.tenant?.name}
                  </Link>
                </Td>
                <Td>
                  <span className="text-zinc-700">{order.customer?.name}</span>
                  <span className="block text-xs text-zinc-500">{order.customer?.email}</span>
                </Td>
                <Td className="text-zinc-600">{order.registration?.event?.title}</Td>
                <Td className="font-medium">{formatCurrency(order.amount, order.currency)}</Td>
                <Td>
                  <StatusBadge status={order.status} />
                </Td>
                <Td className="whitespace-nowrap text-xs text-zinc-500">{formatDateTime(order.createdAt)}</Td>
              </tr>
            ))}
          </Table>
          <Pagination pagination={data.pagination} onPageChange={setPage} />
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
    <div>
      <PageHeader title="All payments" description="Gateway transactions across the platform." />

      <select
        className="input mb-4 w-52"
        value={status}
        onChange={(event) => {
          setStatus(event.target.value);
          setPage(1);
        }}
      >
        <option value="">All statuses</option>
        {['CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED'].map((value) => (
          <option key={value} value={value}>
            {value.replace(/_/g, ' ')}
          </option>
        ))}
      </select>

      {isLoading ? (
        <PageLoader label="Loading payments…" />
      ) : !data?.rows.length ? (
        <EmptyState title="No payments found" />
      ) : (
        <div className="card overflow-hidden">
          <Table columns={['Razorpay payment', 'Tenant', 'Order', 'Method', 'Amount', 'Status', 'Captured']}>
            {data.rows.map((payment) => (
              <tr key={payment.id}>
                <Td className="font-mono text-xs text-zinc-700">{payment.razorpayPaymentId || '—'}</Td>
                <Td>
                  <Link to={`/platform/tenants/${payment.tenantId}`} className="font-medium text-brand-600 hover:underline">
                    {payment.tenant?.name}
                  </Link>
                </Td>
                <Td className="font-mono text-xs text-zinc-500">{payment.order?.orderRef}</Td>
                <Td className="text-xs uppercase text-zinc-500">{payment.method || '—'}</Td>
                <Td className="font-medium">{formatCurrency(payment.amount, payment.currency)}</Td>
                <Td>
                  <StatusBadge status={payment.status} />
                </Td>
                <Td className="whitespace-nowrap text-xs text-zinc-500">
                  {payment.capturedAt ? formatDateTime(payment.capturedAt) : '—'}
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

export default { PlatformBookingsPage, PlatformPaymentsPage };
