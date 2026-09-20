import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';
import api, { apiErrorMessage } from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import Table, { Td } from '../shared/components/Table.jsx';
import Pagination from '../shared/components/Pagination.jsx';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import { StatusBadge } from '../shared/components/Badge.jsx';
import { formatDate } from '../shared/utils/format.js';

const STATUSES = ['', 'PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'INACTIVE'];

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
    <div>
      <PageHeader title="Tenants" description="Every organization on the platform." />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            className="input w-64 pl-9"
            placeholder="Search name, slug or email…"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          className="input w-52"
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
        <PageLoader label="Loading tenants…" />
      ) : !data?.rows.length ? (
        <EmptyState title="No tenants found" />
      ) : (
        <div className="card overflow-hidden">
          <Table columns={['Tenant', 'Plan', 'Events', 'Members', 'Joined', 'Status', 'Actions']}>
            {data.rows.map((tenant) => (
              <tr key={tenant.id}>
                <Td>
                  <Link to={`/platform/tenants/${tenant.id}`} className="font-medium text-zinc-800 hover:text-brand-600">
                    {tenant.name}
                  </Link>
                  <span className="block font-mono text-xs text-zinc-500">/{tenant.slug}</span>
                </Td>
                <Td className="text-xs text-zinc-500">{tenant.subscriptionPlan}</Td>
                <Td>{tenant.eventCount}</Td>
                <Td>{tenant.memberCount}</Td>
                <Td className="whitespace-nowrap text-xs text-zinc-500">{formatDate(tenant.createdAt)}</Td>
                <Td>
                  <StatusBadge status={tenant.status} />
                </Td>
                <Td>
                  <div className="flex gap-2">
                    {tenant.status !== 'ACTIVE' && (
                      <button
                        onClick={() => changeStatus.mutate({ id: tenant.id, next: 'ACTIVE' })}
                        className="text-xs font-semibold text-emerald-600 hover:underline"
                      >
                        Activate
                      </button>
                    )}
                    {tenant.status === 'ACTIVE' && (
                      <button
                        onClick={() => changeStatus.mutate({ id: tenant.id, next: 'SUSPENDED' })}
                        className="text-xs font-semibold text-red-600 hover:underline"
                      >
                        Suspend
                      </button>
                    )}
                  </div>
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
