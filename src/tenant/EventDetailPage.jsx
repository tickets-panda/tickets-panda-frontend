import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  MapPin,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle,
  Shield,
  Layers,
  Ticket as TicketIcon,
  FileText,
  ScanLine,
  Copy,
  Edit,
  BarChart3,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import api, { apiErrorMessage } from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import { RevealGroup } from '../shared/components/Reveal.jsx';
import Card from '../shared/components/Card.jsx';
import Button from '../shared/components/Button.jsx';
import Input, { Select } from '../shared/components/Input.jsx';
import Table, { Td } from '../shared/components/Table.jsx';
import Tabs from '../shared/components/Tabs.jsx';
import Stat from '../shared/components/Stat.jsx';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import { StatusBadge } from '../shared/components/Badge.jsx';
import { formatCurrency, formatDate, formatTime } from '../shared/utils/format.js';
import { rowsToCsv, downloadCsv, registrationsToRows } from '../shared/utils/csv.js';
import { TICKET_TYPE_OPTIONS, CHOICE_FIELD_TYPES } from '../shared/utils/constants.js';
import { useAuthStore } from '../shared/store/auth.js';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [exportingAct, setExportingAct] = useState(null);

  const [ticketType, setTicketType] = useState({
    name: '',
    price: '',
    quantity: '',
    minPerOrder: 1,
    maxPerOrder: 10,
    description: '',
    activityId: '',
  });

  const [activity, setActivity] = useState({
    title: '',
    shortDescription: '',
    venue: '',
    capacity: '',
    status: 'PUBLISHED',
  });

  const [field, setField] = useState({
    fieldName: '',
    fieldLabel: '',
    fieldType: 'TEXT',
    optionsText: '',
    helpText: '',
    isRequired: false,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['tenant-event', id],
    queryFn: async () => (await api.get(`/tenant/events/${id}`)).data.data,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['tenant-event', id] });
    queryClient.invalidateQueries({ queryKey: ['tenant-events'] });
  };

  const exportActivityCsv = async (act) => {
    setExportingAct(act.id);
    try {
      const all = [];
      let next = 1;
      for (let i = 0; i < 10; i += 1) {
        const res = await api.get('/tenant/registrations', {
          params: { page: next, limit: 100, eventId: id, activityId: act.id },
        });
        const batch = res.data.data.rows || [];
        all.push(...batch);
        const pagination = res.data.data.pagination;
        if (!pagination || next >= (pagination.totalPages || 1) || batch.length === 0) break;
        next += 1;
      }
      if (!all.length) return toast.error(`No registrations for ${act.title} yet`);
      const { columns, rows } = registrationsToRows(all);
      const safe = act.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      downloadCsv(`${safe}-students`, rowsToCsv(columns, rows));
      toast.success(`Exported ${all.length} student(s) from ${act.title}`);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setExportingAct(null);
    }
  };

  const setStatus = useMutation({
    mutationFn: async (status) => api.patch(`/tenant/events/${id}/status`, { status }),
    onSuccess: () => {
      toast.success('Event status updated');
      invalidate();
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  // Activity mutations
  const addActivity = useMutation({
    mutationFn: async (payload) => api.post(`/tenant/events/${id}/activities`, payload),
    onSuccess: () => {
      toast.success('Activity created successfully');
      setActivity({ title: '', shortDescription: '', venue: '', capacity: '', status: 'PUBLISHED' });
      invalidate();
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  const removeActivity = useMutation({
    mutationFn: async (actId) => api.delete(`/tenant/activities/${actId}`),
    onSuccess: () => {
      toast.success('Activity deleted');
      invalidate();
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  const toggleActivityStatus = useMutation({
    mutationFn: async ({ actId, status }) => api.patch(`/tenant/activities/${actId}/status`, { status }),
    onSuccess: () => {
      toast.success('Activity status updated');
      invalidate();
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  // Ticket type mutations
  const addTicketType = useMutation({
    mutationFn: async (payload) => api.post(`/tenant/events/${id}/ticket-types`, payload),
    onSuccess: () => {
      toast.success('Ticket tier added successfully');
      setTicketType({ name: '', price: '', quantity: '', minPerOrder: 1, maxPerOrder: 10, description: '', activityId: '' });
      invalidate();
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  const removeTicketType = useMutation({
    mutationFn: async (ticketTypeId) => api.delete(`/tenant/ticket-types/${ticketTypeId}`),
    onSuccess: () => {
      toast.success('Ticket type removed');
      invalidate();
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  // Form field mutations
  const addFormField = useMutation({
    mutationFn: async (payload) => api.post(`/tenant/events/${id}/form-fields`, payload),
    onSuccess: () => {
      toast.success('Form field added');
      setField({ fieldName: '', fieldLabel: '', fieldType: 'TEXT', optionsText: '', helpText: '', isRequired: false });
      invalidate();
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  const removeFormField = useMutation({
    mutationFn: async (fieldId) => api.delete(`/tenant/form-fields/${fieldId}`),
    onSuccess: () => {
      toast.success('Form field removed');
      invalidate();
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  if (isLoading) return <PageLoader label="Loading festival configuration…" />;
  if (!data?.event) return <EmptyState title="Event not found" />;

  const { event, stats } = data;
  const activities = event.activities || [];
  const ticketTypes = event.ticketTypes || [];
  const formFields = event.formFields || [];
  const tenantSlug = useAuthStore.getState().user?.tenantSlug;
  const publicUrl = `/t/${tenantSlug}/events/${event.slug}`;

  const copyPublicLink = () => {
    const fullUrl = `${window.location.origin}${publicUrl}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Public registration link copied!');
  };

  const submitActivity = (e) => {
    e.preventDefault();
    if (!activity.title.trim()) return toast.error('Activity title is required');
    addActivity.mutate({
      title: activity.title.trim(),
      shortDescription: activity.shortDescription.trim() || null,
      venue: activity.venue.trim() || null,
      capacity: activity.capacity ? Number(activity.capacity) : null,
      status: activity.status || 'PUBLISHED',
    });
  };

  const submitTicketType = (e) => {
    e.preventDefault();
    if (!ticketType.name || ticketType.price === '' || ticketType.quantity === '') {
      return toast.error('Name, price and quantity are required');
    }
    addTicketType.mutate({
      name: ticketType.name,
      description: ticketType.description || null,
      price: Number(ticketType.price),
      quantity: Number(ticketType.quantity),
      minPerOrder: Number(ticketType.minPerOrder || 1),
      maxPerOrder: Number(ticketType.maxPerOrder || 10),
      activityId: ticketType.activityId ? Number(ticketType.activityId) : null,
    });
  };

  const submitFormField = (e) => {
    e.preventDefault();
    if (!field.fieldLabel.trim() || !field.fieldName.trim()) {
      return toast.error('Field label and key are required');
    }
    const options = CHOICE_FIELD_TYPES.includes(field.fieldType)
      ? field.optionsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : null;

    addFormField.mutate({
      fieldLabel: field.fieldLabel.trim(),
      fieldName: field.fieldName.trim(),
      fieldType: field.fieldType,
      isRequired: field.isRequired,
      options,
      helpText: field.helpText.trim() || null,
    });
  };

  return (
    <RevealGroup className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/tenant/events')}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Festival Management
              </span>
              <StatusBadge status={event.status} size="xs" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{event.title}</h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {event.status !== 'LIVE' && (
            <Button
              size="sm"
              variant="success"
              onClick={() => setStatus.mutate('LIVE')}
              loading={setStatus.isPending}
            >
              Publish Live 🚀
            </Button>
          )}
          {event.status === 'LIVE' && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setStatus.mutate('CLOSED')}
              loading={setStatus.isPending}
            >
              Close Registrations
            </Button>
          )}
          <Link
            to={`/tenant/events/${id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
          >
            <Edit className="h-3.5 w-3.5" />
            <span>Edit Info</span>
          </Link>
          <Link
            to={publicUrl}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all"
          >
            <span>Public Page</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* High-Level Stats Strip */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Stat
          label="Tickets Issued"
          value={stats.ticketsSold}
          icon={TicketIcon}
          tone="blue"
          hint={`${stats.confirmedRegistrations} confirmed orders`}
        />
        <Stat
          label="Checked In at Gate"
          value={stats.checkedIn}
          icon={ScanLine}
          tone="green"
          hint={
            stats.ticketsSold > 0
              ? `${Math.round((stats.checkedIn / stats.ticketsSold) * 100)}% attendance`
              : 'Gate ready'
          }
        />
        <Stat
          label="Activities Configured"
          value={activities.length}
          icon={Layers}
          tone="orange"
          hint="Competitions & sub-events"
        />
        <Stat
          label="Ticket Tiers"
          value={ticketTypes.length}
          icon={TicketIcon}
          hint="Pricing / entry passes"
        />
      </div>

      {/* Navigation Tabs */}
      <Tabs
        tabs={[
          { id: 'overview', label: 'Overview & Logistics' },
          { id: 'activities', label: 'Activities & Competitions', count: activities.length },
          { id: 'tickets', label: 'Ticket Tiers & Passes', count: ticketTypes.length },
          { id: 'form', label: 'Custom Registration Form', count: formFields.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
      />

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card title="Festival Logistics & Schedule">
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5">
                  <CalendarDays className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Event Date & Timing</p>
                    <p className="text-slate-600 mt-0.5">{formatDate(event.eventDate)}</p>
                    <p className="text-slate-500">
                      {formatTime(event.eventTimeStart)} {event.eventTimeEnd ? `to ${formatTime(event.eventTimeEnd)}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5">
                  <MapPin className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Venue & Campus Location</p>
                    <p className="text-slate-700 font-medium mt-0.5">{event.venueName}</p>
                    {event.venueAddress && <p className="text-slate-500 text-[11px]">{event.venueAddress}</p>}
                  </div>
                </div>
              </div>

              {event.description && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="text-xs font-bold text-slate-800">Event Description</p>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
              )}
            </Card>

            {/* Quick Gate Launch Card */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                  <ScanLine className="h-4 w-4 text-emerald-600" />
                  Ready to scan attendee tickets at the gate?
                </h3>
                <p className="mt-1 text-xs text-emerald-800">
                  Open the high-speed QR viewfinder camera or type keys manually for fast admission verification.
                </p>
              </div>
              <Link
                to="/tenant/scanner"
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all"
              >
                Launch Scanner Now
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <Card title="Public Festival Link">
              <p className="text-xs text-slate-500 leading-relaxed">
                Share this URL on social media, WhatsApp groups, and your college portal for registrations:
              </p>
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-mono text-brand-600 break-all font-semibold">
                {window.location.origin}{publicUrl}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                leftIcon={Copy}
                onClick={copyPublicLink}
              >
                Copy Link to Clipboard
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVITIES & COMPETITIONS */}
      {activeTab === 'activities' && (
        <div className="space-y-6">
          <Card
            title="Festival Activities & Competitions"
            subtitle="Organize sub-events (e.g. Hackathon, Battle of Bands, RoboWars, Solo Dance)"
            bodyClassName="p-0"
          >
            {activities.length ? (
              <Table columns={['Activity Title', 'Venue / Stage', 'Capacity', 'Status', 'Tickets Linked', 'Actions']}>
                {activities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                    <Td>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">{act.title}</span>
                      {act.shortDescription && (
                        <p className="text-xs text-slate-500 truncate max-w-xs">{act.shortDescription}</p>
                      )}
                    </Td>
                    <Td className="text-xs text-slate-600">{act.venue || '—'}</Td>
                    <Td className="text-xs text-slate-600">{act.capacity ? `${act.capacity} slots` : 'Unlimited'}</Td>
                    <Td>
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                          act.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {act.status}
                      </span>
                    </Td>
                    <Td className="text-xs text-slate-500">
                      {act.ticketTypes?.length ? (
                        <span className="font-semibold text-brand-600">{act.ticketTypes.length} linked pass(es)</span>
                      ) : (
                        <span className="text-slate-400">None linked yet</span>
                      )}
                    </Td>
                    <Td className="text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          disabled={exportingAct === act.id}
                          onClick={() => exportActivityCsv(act)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline disabled:opacity-50"
                          title={`Download ${act.title} student list (CSV)`}
                        >
                          {exportingAct === act.id ? 'Exporting…' : 'Download CSV'}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            toggleActivityStatus.mutate({
                              actId: act.id,
                              status: act.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED',
                            })
                          }
                          className="text-xs font-bold text-brand-600 hover:underline"
                        >
                          {act.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeActivity.mutate(act.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                          aria-label={`Delete ${act.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </Table>
            ) : (
              <div className="p-8 text-center">
                <EmptyState
                  title="No activities configured yet"
                  description="Add individual competitions, workshops, or stages for your festival."
                />
              </div>
            )}

            {/* Add Activity Form */}
            <div className="border-t border-slate-200 bg-slate-50/80 p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Add New Activity / Competition
              </h4>
              <form onSubmit={submitActivity} className="grid gap-3 sm:grid-cols-5">
                <Input
                  label="Title"
                  value={activity.title}
                  onChange={(e) => setActivity({ ...activity, title: e.target.value })}
                  placeholder="e.g. Battle of Bands"
                  required
                />
                <Input
                  label="Short Description"
                  value={activity.shortDescription}
                  onChange={(e) => setActivity({ ...activity, shortDescription: e.target.value })}
                  placeholder="e.g. Western & Rock"
                />
                <Input
                  label="Venue / Stage"
                  value={activity.venue}
                  onChange={(e) => setActivity({ ...activity, venue: e.target.value })}
                  placeholder="e.g. Main Auditorium"
                />
                <Input
                  label="Max Capacity"
                  type="number"
                  min="1"
                  value={activity.capacity}
                  onChange={(e) => setActivity({ ...activity, capacity: e.target.value })}
                  placeholder="e.g. 50"
                />
                <div className="flex items-end">
                  <Button type="submit" className="w-full" loading={addActivity.isPending} leftIcon={Plus}>
                    Add Activity
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: TICKET TIERS */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <Card
            title="Admission Passes & Ticket Tiers"
            subtitle="Configure paid or free entry passes linked to the whole event or specific activities"
            bodyClassName="p-0"
          >
            {ticketTypes.length ? (
              <Table columns={['Pass Name', 'Activity Link', 'Price', 'Sold / Total', 'Limits', '']}>
                {ticketTypes.map((type) => {
                  const assignedAct = activities.find((a) => a.id === type.activityId);
                  return (
                    <tr key={type.id} className="hover:bg-slate-50/80 transition-colors">
                      <Td>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">{type.name}</span>
                        {!type.isActive && (
                          <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                            Inactive
                          </span>
                        )}
                      </Td>
                      <Td className="text-xs">
                        {assignedAct ? (
                          <span className="inline-flex rounded-lg bg-orange-100 border border-orange-200 px-2 py-0.5 font-bold text-brand-800">
                            {assignedAct.title}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">All-Festival Access</span>
                        )}
                      </Td>
                      <Td className="font-black text-slate-900">{formatCurrency(type.price, type.currency)}</Td>
                      <Td className="text-xs text-slate-600">
                        <span className="font-bold text-slate-900">{type.soldCount}</span> / {type.quantity}
                      </Td>
                      <Td className="text-xs text-slate-500">
                        {type.minPerOrder}–{type.maxPerOrder} per order
                      </Td>
                      <Td className="text-right">
                        <button
                          onClick={() => removeTicketType.mutate(type.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                          aria-label={`Delete ${type.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </Td>
                    </tr>
                  );
                })}
              </Table>
            ) : (
              <div className="p-8 text-center">
                <EmptyState
                  title="No ticket tiers created"
                  description="Create at least one admission pass (free or paid) so participants can register."
                />
              </div>
            )}

            {/* Add Ticket Tier Form */}
            <div className="border-t border-slate-200 bg-slate-50/80 p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Create New Ticket Pass Tier
              </h4>
              <form onSubmit={submitTicketType} className="grid gap-3 sm:grid-cols-6">
                <Input
                  label="Pass Name"
                  value={ticketType.name}
                  onChange={(e) => setTicketType({ ...ticketType, name: e.target.value })}
                  placeholder="e.g. General Admission"
                  required
                />
                <Select
                  label="Activity Link"
                  value={ticketType.activityId}
                  onChange={(e) => setTicketType({ ...ticketType, activityId: e.target.value })}
                >
                  <option value="">Event-wide / General</option>
                  {activities.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
                </Select>
                <Input
                  label="Price (₹)"
                  type="number"
                  min="0"
                  value={ticketType.price}
                  onChange={(e) => setTicketType({ ...ticketType, price: e.target.value })}
                  placeholder="0 for free"
                  required
                />
                <Input
                  label="Total Quantity"
                  type="number"
                  min="1"
                  value={ticketType.quantity}
                  onChange={(e) => setTicketType({ ...ticketType, quantity: e.target.value })}
                  placeholder="e.g. 200"
                  required
                />
                <Input
                  label="Max / Order"
                  type="number"
                  min="1"
                  value={ticketType.maxPerOrder}
                  onChange={(e) => setTicketType({ ...ticketType, maxPerOrder: e.target.value })}
                />
                <div className="flex items-end">
                  <Button type="submit" className="w-full" loading={addTicketType.isPending} leftIcon={Plus}>
                    Add Pass
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: CUSTOM REGISTRATION FORM */}
      {activeTab === 'form' && (
        <div className="space-y-6">
          <Card
            title="Attendee Registration Form Builder"
            subtitle="Customize the questionnaire attendees must complete during checkout"
            bodyClassName="p-0"
          >
            {formFields.length ? (
              <Table columns={['Field Label', 'Internal Key', 'Field Type', 'Help / Hint', 'Required', '']}>
                {formFields.map((formField) => (
                  <tr key={formField.id} className="hover:bg-slate-50/80 transition-colors">
                    <Td className="font-bold text-xs sm:text-sm text-slate-900">{formField.fieldLabel}</Td>
                    <Td className="font-mono text-xs text-slate-500">{formField.fieldName}</Td>
                    <Td className="text-xs">
                      <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] font-bold text-slate-700">
                        {formField.fieldType}
                      </span>
                    </Td>
                    <Td className="text-xs text-slate-400">{formField.helpText || '—'}</Td>
                    <Td className="text-xs font-bold">
                      {formField.isRequired ? (
                        <span className="text-red-600">Required</span>
                      ) : (
                        <span className="text-slate-400 font-normal">Optional</span>
                      )}
                    </Td>
                    <Td className="text-right">
                      <button
                        onClick={() => removeFormField.mutate(formField.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                        aria-label={`Delete ${formField.fieldLabel}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </Td>
                  </tr>
                ))}
              </Table>
            ) : (
              <div className="p-8 text-center">
                <EmptyState
                  title="No custom form fields added"
                  description="By default, checkout will only ask for Full Name, Email, and Phone Number. Add custom fields (e.g. Roll Number, College ID card upload) below."
                />
              </div>
            )}

            {/* Add Form Field Form */}
            <div className="border-t border-slate-200 bg-slate-50/80 p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Add Custom Field to Checkout Form
              </h4>
              <form onSubmit={submitFormField} className="grid gap-3 sm:grid-cols-5">
                <Input
                  label="Display Label"
                  value={field.fieldLabel}
                  onChange={(e) => setField({ ...field, fieldLabel: e.target.value })}
                  placeholder="e.g. College Roll Number"
                  required
                />
                <Input
                  label="Variable Key (unique)"
                  value={field.fieldName}
                  onChange={(e) => setField({ ...field, fieldName: e.target.value })}
                  placeholder="e.g. rollNumber"
                  required
                />
                <Select
                  label="Input Type"
                  value={field.fieldType}
                  onChange={(e) => setField({ ...field, fieldType: e.target.value })}
                >
                  {TICKET_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <Input
                  label="Options (if Dropdown/Radio)"
                  value={field.optionsText}
                  onChange={(e) => setField({ ...field, optionsText: e.target.value })}
                  disabled={!CHOICE_FIELD_TYPES.includes(field.fieldType)}
                  placeholder="CS, IT, Mech, Civil"
                />
                <Input
                  label="Help Text / Instructions"
                  value={field.helpText}
                  onChange={(e) => setField({ ...field, helpText: e.target.value })}
                  placeholder="e.g. Enter your university ID"
                />
                <div className="flex items-center justify-between sm:col-span-5 pt-2">
                  <label className="flex items-center gap-2 text-xs text-slate-700 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.isRequired}
                      onChange={(e) => setField({ ...field, isRequired: e.target.checked })}
                      className="rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                    />
                    <span>Mark as mandatory field for registration</span>
                  </label>
                  <Button type="submit" loading={addFormField.isPending} leftIcon={Plus}>
                    Add Form Field
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </RevealGroup>
  );
}
