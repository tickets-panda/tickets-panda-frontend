import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import api, { apiErrorMessage } from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import Card from '../shared/components/Card.jsx';
import Table, { Td } from '../shared/components/Table.jsx';
import Button from '../shared/components/Button.jsx';
import Input, { Select } from '../shared/components/Input.jsx';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import { StatusBadge } from '../shared/components/Badge.jsx';
import { formatDateTime } from '../shared/utils/format.js';

const ROLES = [
  { value: 'TENANT_ADMIN', label: 'Admin — full access' },
  { value: 'EVENT_MANAGER', label: 'Event manager — assigned events' },
  { value: 'FINANCE_VIEWER', label: 'Finance viewer — read-only' },
  { value: 'CHECKIN_STAFF', label: 'Check-in staff — gate only' },
];

export default function StaffPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'CHECKIN_STAFF' });

  const { data, isLoading } = useQuery({
    queryKey: ['tenant-members'],
    queryFn: async () => (await api.get('/tenant/members')).data.data.members,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['tenant-members'] });

  const addMember = useMutation({
    mutationFn: async (payload) => api.post('/tenant/members', payload),
    onSuccess: () => {
      toast.success('Team member added');
      setForm({ name: '', email: '', phone: '', role: 'CHECKIN_STAFF' });
      invalidate();
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  const removeMember = useMutation({
    mutationFn: async (memberId) => api.delete(`/tenant/members/${memberId}`),
    onSuccess: () => {
      toast.success('Team member removed');
      invalidate();
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  const submit = (event) => {
    event.preventDefault();
    if (!form.name || !form.email) return toast.error('Name and email are required');
    return addMember.mutate({ ...form, phone: form.phone || null });
  };

  return (
    <div>
      <PageHeader title="Staff & team" description="Control who can manage events and scan tickets." />

      {isLoading ? (
        <PageLoader label="Loading team…" />
      ) : !data?.length ? (
        <EmptyState title="No team members" description="Add gate staff so they can scan tickets." />
      ) : (
        <div className="card overflow-hidden">
          <Table columns={['Member', 'Role', 'Status', 'Last login', '']}>
            {data.map((member) => (
              <tr key={member.id}>
                <Td>
                  <span className="font-medium text-zinc-800">{member.user?.name}</span>
                  <span className="block text-xs text-zinc-500">{member.user?.email}</span>
                </Td>
                <Td className="text-zinc-600">{member.role.replace(/_/g, ' ')}</Td>
                <Td>
                  <StatusBadge status={member.isActive ? 'ACTIVE' : 'INACTIVE'} />
                </Td>
                <Td className="whitespace-nowrap text-xs text-zinc-500">
                  {member.user?.lastLoginAt ? formatDateTime(member.user.lastLoginAt) : 'Never'}
                </Td>
                <Td className="text-right">
                  {member.role !== 'TENANT_OWNER' && (
                    <button
                      onClick={() => removeMember.mutate(member.id)}
                      className="text-red-600 hover:underline"
                      aria-label={`Remove ${member.user?.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </Td>
              </tr>
            ))}
          </Table>
        </div>
      )}

      <Card className="mt-6" title="Add a team member">
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-5">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Gate Staff" />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="staff@example.com" />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Select label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            {ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </Select>
          <div className="flex items-end">
            <Button type="submit" className="w-full" loading={addMember.isPending}>
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        </form>
        <p className="mt-3 text-xs text-zinc-500">
          New members sign in with this email and use “Forgot password” to set their own password.
        </p>
      </Card>
    </div>
  );
}
