import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building2, CalendarDays, CreditCard, Ticket } from 'lucide-react';
import api from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import Stat from '../shared/components/Stat.jsx';
import Card from '../shared/components/Card.jsx';
import Table, { Td } from '../shared/components/Table.jsx';
import { PageLoader } from '../shared/components/Feedback.jsx';
import { StatusBadge } from '../shared/components/Badge.jsx';
import { formatCurrency, formatDate } from '../shared/utils/format.js';

export default function PlatformDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['platform-dashboard'],
    queryFn: async () => (await api.get('/platform/dashboard/stats')).data.data,
  });

  if (isLoading) return <PageLoader label="Loading platform metrics…" />;
  if (!data) return null;

  return (
    <div>
      <PageHeader title="Platform overview" description="Cross-tenant activity across Ticket Panda." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Revenue" value={formatCurrency(data.revenue)} icon={CreditCard} tone="green" />
        <Stat label="Tenants" value={data.totalTenants} hint={`${data.activeTenants} active`} icon={Building2} />
        <Stat label="Events" value={data.totalEvents} hint={`${data.liveEvents} live`} icon={CalendarDays} tone="blue" />
        <Stat label="Paid bookings" value={data.paidOrders} hint={`${data.ticketsIssued} tickets issued`} icon={Ticket} tone="purple" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Recent tenants" bodyClassName="p-0">
          <Table columns={['Tenant', 'Plan', 'Joined', 'Status']}>
            {data.recentTenants.map((tenant) => (
              <tr key={tenant.id}>
                <Td>
                  <Link to={`/platform/tenants/${tenant.id}`} className="font-medium text-brand-600 hover:underline">
                    {tenant.name}
                  </Link>
                  <span className="block font-mono text-xs text-zinc-500">/{tenant.slug}</span>
                </Td>
                <Td className="text-xs text-zinc-500">{tenant.subscriptionPlan}</Td>
                <Td className="text-xs text-zinc-500">{formatDate(tenant.createdAt)}</Td>
                <Td>
                  <StatusBadge status={tenant.status} />
                </Td>
              </tr>
            ))}
          </Table>
        </Card>

        <Card title="Tenants by status">
          <ul className="space-y-3">
            {data.tenantsByStatus.map((row) => (
              <li key={row.status} className="flex items-center justify-between text-sm">
                <StatusBadge status={row.status} />
                <span className="font-semibold text-zinc-800">{row.count}</span>
              </li>
            ))}
          </ul>
          {data.suspendedTenants > 0 && (
            <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
              {data.suspendedTenants} tenant(s) are currently suspended and cannot access their dashboards.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
