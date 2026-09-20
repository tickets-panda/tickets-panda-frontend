import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building2, CalendarDays, CreditCard, Ticket, ShieldAlert, ArrowRight, Activity } from 'lucide-react';
import api from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import Stat from '../shared/components/Stat.jsx';
import Card from '../shared/components/Card.jsx';
import Table, { Td } from '../shared/components/Table.jsx';
import { PageLoader } from '../shared/components/Feedback.jsx';
import { StatusBadge } from '../shared/components/Badge.jsx';
import { formatCurrency, formatDate } from '../shared/utils/format.js';
import { RevealGroup } from '../shared/components/Reveal.jsx';

export default function PlatformDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['platform-dashboard'],
    queryFn: async () => (await api.get('/platform/dashboard/stats')).data.data,
  });

  if (isLoading) return <PageLoader label="Aggregating platform metrics across all colleges…" />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Control Center"
        description="Global cross-tenant analytics, institutional tenant governance, and system-wide sales."
      />

      <RevealGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Total Gross Platform Volume"
          value={formatCurrency(data.revenue)}
          icon={CreditCard}
          tone="green"
          hint="All processed orders"
        />
        <Stat
          label="Registered Institutions"
          value={data.totalTenants}
          hint={`${data.activeTenants} active college tenants`}
          icon={Building2}
          tone="purple"
        />
        <Stat
          label="Total Events & Festivals"
          value={data.totalEvents}
          hint={`${data.liveEvents} currently live`}
          icon={CalendarDays}
          tone="blue"
        />
        <Stat
          label="Paid Bookings"
          value={data.paidOrders}
          hint={`${data.ticketsIssued} tickets issued globally`}
          icon={Ticket}
          tone="orange"
        />
      </RevealGroup>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Tenants Card */}
        <Card
          title="Recently Onboarded Institutions"
          subtitle="Latest colleges registered on Ticket Panda"
          action={
            <Link to="/platform/tenants" className="text-xs font-bold text-purple-600 hover:underline">
              View All ↗
            </Link>
          }
          bodyClassName="p-0"
        >
          <Table columns={['College / Tenant', 'Plan', 'Joined', 'Status']}>
            {data.recentTenants.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-slate-50/80 transition-colors">
                <Td>
                  <Link
                    to={`/platform/tenants/${tenant.id}`}
                    className="font-bold text-xs sm:text-sm text-slate-900 hover:text-purple-600 line-clamp-1"
                  >
                    {tenant.name}
                  </Link>
                  <span className="block font-mono text-[10px] text-slate-400">/{tenant.slug}</span>
                </Td>
                <Td className="text-xs font-semibold text-slate-600">{tenant.subscriptionPlan}</Td>
                <Td className="text-xs text-slate-500 whitespace-nowrap">{formatDate(tenant.createdAt)}</Td>
                <Td>
                  <StatusBadge status={tenant.status} size="xs" />
                </Td>
              </tr>
            ))}
          </Table>
        </Card>

        {/* Tenant Status Distribution */}
        <Card title="Tenant Governance & Health" subtitle="Operational distribution across all accounts">
          <ul className="divide-y divide-slate-100">
            {data.tenantsByStatus.map((row) => (
              <li key={row.status} className="flex items-center justify-between py-3 text-xs">
                <StatusBadge status={row.status} size="sm" />
                <span className="font-bold text-slate-900 text-sm">{row.count} institution{row.count > 1 ? 's' : ''}</span>
              </li>
            ))}
          </ul>

          {data.suspendedTenants > 0 && (
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Suspended Accounts ({data.suspendedTenants})</p>
                <p className="mt-0.5 text-amber-700">
                  Suspended colleges cannot accept new attendee registrations or access their studio.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
