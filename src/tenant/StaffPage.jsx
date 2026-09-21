import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Trash2, Users, Shield, Mail, Phone, UserCheck, UserX } from 'lucide-react';
import api, { apiErrorMessage } from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import { RevealGroup } from '../shared/components/Reveal.jsx';
import Card from '../shared/components/Card.jsx';
import Table, { Td } from '../shared/components/Table.jsx';
import Button from '../shared/components/Button.jsx';
import Input, { Select } from '../shared/components/Input.jsx';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import { StatusBadge } from '../shared/components/Badge.jsx';
import { formatDateTime } from '../shared/utils/format.js';

const ROLES = [
  { value: 'TENANT_ADMIN', label: 'Admin — Full college access' },
  { value: 'EVENT_MANAGER', label: 'Event Manager — Manage festivals & competitions' },
  { value: 'FINANCE_VIEWER', label: 'Finance Viewer — Orders & revenue read-only' },
  { value: 'CHECKIN_STAFF', label: 'Gate Staff — QR scanner entry verification' },
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
      toast.success('Team member invited successfully');
      setForm({ name: '', email: '', phone: '', role: 'CHECKIN_STAFF' });
      invalidate();
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  const removeMember = useMutation({
    mutationFn: async (memberId) => api.delete(`/tenant/members/${memberId}`),
    onSuccess: () => {
      toast.success('Member removed');
      invalidate();
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  const toggleAccess = useMutation({
    mutationFn: async (member) => api.put(`/tenant/members/${member.id}`, { isActive: !member.isActive }),
    onSuccess: (_, member) => {
      toast.success(member.isActive ? 'Access suspended' : 'Access approved');
      invalidate();
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      return toast.error('Name and email are required');
    }
    return addMember.mutate({ ...form, phone: form.phone.trim() || null });
  };

  return (
    <RevealGroup className="space-y-6">
      <PageHeader
        title="Staff & Gate Volunteers"
        description="Assign event organizers, coordinators, and gate volunteers for ticket check-in."
      />

      {isLoading ? (
        <PageLoader label="Loading team roster…" />
      ) : !data?.length ? (
        <EmptyState title="No team members" description="Add volunteers or staff so they can scan tickets at gates." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card">
          <Table columns={['Staff Member', 'Assigned Role', 'Access Status', 'Last Activity', 'Actions']}>
            {data.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                <Td>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-xs font-bold text-brand-700">
                      {member.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">{member.user?.name}</p>
                      <p className="text-[11px] text-slate-500">{member.user?.email}</p>
                    </div>
                  </div>
                </Td>
                <Td>
                  <span className="inline-flex rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                    {member.role?.replace(/_/g, ' ')}
                  </span>
                </Td>
                <Td>
                  <StatusBadge status={member.isActive ? 'ACTIVE' : 'INACTIVE'} size="xs" />
                </Td>
                <Td className="whitespace-nowrap text-xs text-slate-500 font-mono">
                  {member.user?.lastLoginAt ? formatDateTime(member.user.lastLoginAt) : 'Never logged in'}
                </Td>
                <Td className="text-right">
                  {member.role !== 'TENANT_OWNER' && (
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleAccess.mutate(member)}
                        className={`rounded-lg p-1.5 transition-colors ${
                          member.isActive
                            ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                            : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                        aria-label={member.isActive ? `Suspend ${member.user?.name}` : `Approve ${member.user?.name}`}
                        title={member.isActive ? 'Suspend access' : 'Approve access'}
                      >
                        {member.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => removeMember.mutate(member.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        aria-label={`Remove ${member.user?.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </Td>
              </tr>
            ))}
          </Table>
        </div>
      )}

      {/* Add New Team Member Card */}
      <Card title="Add New Organizer or Gate Volunteer" subtitle="Send an invite to join your organization studio">
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-5">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Rahul Sharma"
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="rahul@college.edu"
            required
          />
          <Input
            label="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+91 98765 43210"
          />
          <Select
            label="Role & Access"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            {ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </Select>
          <div className="flex items-end">
            <Button type="submit" className="w-full" loading={addMember.isPending} leftIcon={Plus}>
              Invite Member
            </Button>
          </div>
        </form>
        <p className="mt-3 text-xs text-slate-500">
          New volunteers will sign in with this email and set their password via the “Forgot password” link.
        </p>
      </Card>
    </RevealGroup>
  );
}
