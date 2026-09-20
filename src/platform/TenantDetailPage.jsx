import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft, Building2, Ticket, CreditCard, CalendarDays } from 'lucide-react';
import api, { apiErrorMessage } from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import Card from '../shared/components/Card.jsx';
import Stat from '../shared/components/Stat.jsx';
import Table, { Td } from '../shared/components/Table.jsx';
import Button from '../shared/components/Button.jsx';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import { StatusBadge } from '../shared/components/Badge.jsx';
import { formatCurrency, formatDate, formatDateTime } from '../shared/utils/format.js';

export default function TenantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['platform-tenant', id],
    queryFn: async () => (await api.get(`/platform/tenants/${id}`)).data.data,
  });

  const changeStatus = useMutation({
    mutationFn: async (next) => api.patch(`/platform/tenants/${id}/status`, { status: next }),
    onSuccess: () => {
      toast.success('Tenant status updated');
      queryClient.invalidateQueries({ queryKey: ['platform-tenant', id] });
      queryClient.invalidateQueries({ queryKey: ['platform-tenants'] });
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  if (isLoading) return <PageLoader label="Loading tenant…" />;
  if (!data?.tenant) return <EmptyState title="Tenant not found" />;

  const { tenant, stats } = data;

  return (
    <div>
      <button onClick={() => navigate('/platform/tenants')} className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-700">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to tenants
      </button>

      <PageHeader
        title={tenant.name}
        description={tenant.email}
        actions={
          <>
            <StatusBadge status={tenant.status} />
            {tenant.status === 'ACTIVE' ? (
              <Button size="sm" variant="danger" onClick={() => changeStatus.mutate('SUSPENDED')}>
                Suspend tenant
              </Button>
            ) : (
              <Button size="sm" variant="success" onClick={() => changeStatus.mutate('ACTIVE')}>
                Activate tenant
              </Button>
            )}
            <Link
              to={`/t/${tenant.slug}`}
              target="_blank"
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Public page ↗
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Events" value={stats.events} icon={CalendarDays} />
        <Stat label="Paid bookings" value={stats.paidOrders} icon={Ticket} tone="blue" />
        <Stat label="Tickets issued" value={stats.ticketsIssued} icon={Ticket} tone="purple" />
        <Stat label="Revenue" value={formatCurrency(stats.revenue)} icon={CreditCard} tone="green" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Organization">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Slug</dt>
              <dd className="font-mono text-zinc-800">/{tenant.slug}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Plan</dt>
              <dd className="font-medium text-zinc-800">{tenant.subscriptionPlan}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Phone</dt>
              <dd className="text-zinc-800">{tenant.phone || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Website</dt>
              <dd className="truncate text-zinc-800">{tenant.websiteUrl || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Created</dt>
              <dd className="text-zinc-800">{formatDate(tenant.createdAt)}</dd>
            </div>
          </dl>
          {tenant.description && <p className="mt-4 text-sm text-zinc-600">{tenant.description}</p>}
        </Card>

        <Card title="Members" bodyClassName="p-0">
          {tenant.members?.length ? (
            <Table columns={['Name', 'Role', 'Last login']}>
              {tenant.members.map((member) => (
                <tr key={member.id}>
                  <Td>
                    <span className="font-medium text-zinc-800">{member.user?.name}</span>
                    <span className="block text-xs text-zinc-500">{member.user?.email}</span>
                  </Td>
                  <Td className="text-xs text-zinc-600">{member.role.replace(/_/g, ' ')}</Td>
                  <Td className="text-xs text-zinc-500">
                    {member.user?.lastLoginAt ? formatDateTime(member.user.lastLoginAt) : 'Never'}
                  </Td>
                </tr>
              ))}
            </Table>
          ) : (
            <div className="p-5">
              <EmptyState title="No members" icon={Building2} />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
