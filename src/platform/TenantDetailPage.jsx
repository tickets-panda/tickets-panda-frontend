import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft, Building2, Ticket, CreditCard, CalendarDays, ExternalLink, Globe, Phone, Mail } from 'lucide-react';
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

  if (isLoading) return <PageLoader label="Loading tenant details…" />;
  if (!data?.tenant) return <EmptyState title="Tenant not found" />;

  const { tenant, stats } = data;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/platform/tenants')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to All Tenants
      </button>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-purple-600 font-bold">/{tenant.slug}</span>
            <StatusBadge status={tenant.status} size="xs" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{tenant.name}</h1>
          <p className="text-xs text-slate-500">{tenant.email}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {tenant.status === 'ACTIVE' ? (
            <Button
              size="sm"
              variant="danger"
              onClick={() => changeStatus.mutate('SUSPENDED')}
              loading={changeStatus.isPending}
            >
              Suspend Tenant
            </Button>
          ) : (
            <Button
              size="sm"
              variant="success"
              onClick={() => changeStatus.mutate('ACTIVE')}
              loading={changeStatus.isPending}
            >
              Activate Tenant
            </Button>
          )}
          <Link
            to={`/t/${tenant.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <span>College Portal</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Total Festivals / Events" value={stats.events} icon={CalendarDays} />
        <Stat label="Paid Bookings" value={stats.paidOrders} icon={Ticket} tone="blue" />
        <Stat label="Total Tickets Issued" value={stats.ticketsIssued} icon={Ticket} tone="purple" />
        <Stat label="Total Sales Volume" value={formatCurrency(stats.revenue)} icon={CreditCard} tone="green" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Organization Overview">
          <dl className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Subdomain Slug</dt>
              <dd className="font-mono font-bold text-slate-900">/{tenant.slug}</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Subscription Tier</dt>
              <dd className="font-bold text-purple-700">{tenant.subscriptionPlan}</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Support Contact Phone</dt>
              <dd className="font-medium text-slate-800">{tenant.phone || '—'}</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Website</dt>
              <dd className="font-medium text-slate-800 truncate max-w-[200px]">{tenant.websiteUrl || '—'}</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Account Created</dt>
              <dd className="font-medium text-slate-800">{formatDate(tenant.createdAt)}</dd>
            </div>
          </dl>
          {tenant.description && (
            <div className="mt-4 border-t border-slate-100 pt-3">
              <p className="text-[11px] font-bold text-slate-700">About Organization</p>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">{tenant.description}</p>
            </div>
          )}
        </Card>

        <Card title="Authorized Staff Members" bodyClassName="p-0">
          {tenant.members?.length ? (
            <Table columns={['Staff Member', 'Role', 'Last Active']}>
              {tenant.members.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/80">
                  <Td>
                    <p className="font-bold text-xs text-slate-900">{member.user?.name}</p>
                    <p className="text-[11px] text-slate-500">{member.user?.email}</p>
                  </Td>
                  <Td className="text-xs font-bold text-slate-700">{member.role?.replace(/_/g, ' ')}</Td>
                  <Td className="whitespace-nowrap text-xs text-slate-500 font-mono">
                    {member.user?.lastLoginAt ? formatDateTime(member.user.lastLoginAt) : 'Never'}
                  </Td>
                </tr>
              ))}
            </Table>
          ) : (
            <div className="p-8 text-center">
              <EmptyState title="No members found" icon={Building2} />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
