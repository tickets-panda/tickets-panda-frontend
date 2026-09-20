import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Search, Building2, ExternalLink, ShieldCheck, ShieldAlert } from 'lucide-react';
import api, { apiErrorMessage } from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import Table, { Td } from '../shared/components/Table.jsx';
import Pagination from '../shared/components/Pagination.jsx';
import Input from '../shared/components/Input.jsx';
import Button from '../shared/components/Button.jsx';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import { StatusBadge } from '../shared/components/Badge.jsx';
import { formatDate } from '../shared/utils/format.js';

const STATUSES = [
  { value: '', label: 'All Tenants' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PENDING_VERIFICATION', label: 'Pending Verification' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'INACTIVE', label: 'Inactive' },
];

export default function TenantsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['platform-tenants', page, status, search],
    queryFn: async () =>
      (await api.get('/platform/tenants', { params: { page, limit: 15, status, search } })).data.data,
  });

  const changeStatus = useMutation({
    mutationFn: async ({ id, next }) => api.patch(`/platform/tenants/${id}/status`, { status: next }),
    onSuccess: () => {
      toast.success('Tenant status updated');
      queryClient.invalidateQueries({ queryKey: ['platform-tenants'] });
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="College Tenants"
        description="All registered institutions, festival accounts, and their platform subscription status."
      />

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-200/90">
        <div className="w-full sm:w-80">
          <Input
            icon={Search}
            placeholder="Search by college name, slug, or email…"
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
                  ? 'bg-purple-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <PageLoader label="Fetching registered tenants…" />
      ) : !data?.rows.length ? (
        <EmptyState title="No tenants found" description="Try adjusting your search query or status filter." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card">
          <Table columns={['College / Tenant', 'Plan', 'Events', 'Team Size', 'Joined', 'Status', 'Actions']}>
            {data.rows.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-slate-50/80 transition-colors">
                <Td>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-xs font-bold text-purple-700 shrink-0">
                      {tenant.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/platform/tenants/${tenant.id}`}
                        className="font-bold text-xs sm:text-sm text-slate-900 hover:text-purple-600 transition-colors truncate block"
                      >
                        {tenant.name}
                      </Link>
                      <span className="font-mono text-[10px] text-slate-400">/{tenant.slug}</span>
                    </div>
                  </div>
                </Td>
                <Td className="text-xs font-bold text-slate-600">{tenant.subscriptionPlan}</Td>
                <Td className="text-xs font-bold text-slate-900">{tenant.eventCount}</Td>
                <Td className="text-xs text-slate-600">{tenant.memberCount} members</Td>
                <Td className="whitespace-nowrap text-xs text-slate-500">{formatDate(tenant.createdAt)}</Td>
                <Td>
                  <StatusBadge status={tenant.status} size="xs" />
                </Td>
                <Td className="whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/platform/tenants/${tenant.id}`}
                      className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-xs font-bold text-slate-700 transition-all"
                    >
                      Manage
                    </Link>
                    {tenant.status !== 'ACTIVE' && (
                      <button
                        onClick={() => changeStatus.mutate({ id: tenant.id, next: 'ACTIVE' })}
                        className="rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-all"
                      >
                        Activate
                      </button>
                    )}
                    {tenant.status === 'ACTIVE' && (
                      <button
                        onClick={() => changeStatus.mutate({ id: tenant.id, next: 'SUSPENDED' })}
                        className="rounded-lg bg-red-50 border border-red-200 px-2 py-1 text-xs font-bold text-red-700 hover:bg-red-100 transition-all"
                      >
                        Suspend
                      </button>
                    )}
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
