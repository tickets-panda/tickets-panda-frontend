import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft, CalendarDays, ExternalLink, MapPin, Plus, Trash2, Sparkles, CheckCircle, Shield } from 'lucide-react';
import api, { apiErrorMessage } from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import Card from '../shared/components/Card.jsx';
import Button from '../shared/components/Button.jsx';
import Input, { Select } from '../shared/components/Input.jsx';
import Table, { Td } from '../shared/components/Table.jsx';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import { StatusBadge } from '../shared/components/Badge.jsx';
import { formatCurrency, formatDate, formatTime } from '../shared/utils/format.js';
import { TICKET_TYPE_OPTIONS, CHOICE_FIELD_TYPES } from '../shared/utils/constants.js';
import { useAuthStore } from '../shared/store/auth.js';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
      toast.success('Ticket type added');
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

  if (isLoading) return <PageLoader label="Loading event…" />;
  if (!data?.event) return <EmptyState title="Event not found" />;

  const { event, stats } = data;
  const activities = event.activities || [];
  const tenantSlug = useAuthStore.getState().user?.tenantSlug;

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
    <div className="space-y-6">
      <PageHeader
        title={event.title}
        breadcrumbs={[
          { label: 'Events', href: '/tenant/events' },
          { label: event.title },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={event.status} />
            {event.status !== 'LIVE' && (
              <Button size="sm" variant="success" onClick={() => setStatus.mutate('LIVE')} loading={setStatus.isPending}>
                Publish Event
              </Button>
            )}
            {event.status === 'LIVE' && (
              <Button size="sm" variant="secondary" onClick={() => setStatus.mutate('CLOSED')}>
                Close Registrations
              </Button>
            )}
            <Link
              to={`/tenant/events/${id}/edit`}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Edit Event
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card title="Schedule & Venue">
          <p className="flex items-center gap-2 text-sm text-zinc-700 font-medium">
            <CalendarDays className="h-4 w-4 text-brand-600" /> {formatDate(event.eventDate)} · {formatTime(event.eventTimeStart)}
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-zinc-700">
            <MapPin className="h-4 w-4 text-brand-600" /> {event.venueName}
          </p>
        </Card>

        <Card title="Registration Stats">
          <p className="text-2xl font-bold text-zinc-900">{stats.ticketsSold}</p>
          <p className="text-xs text-zinc-500">tickets issued · {stats.confirmedRegistrations} confirmed bookings</p>
          <p className="mt-2 text-sm font-semibold text-emerald-600">{stats.checkedIn} checked in at the gate</p>
        </Card>

        <Card title="Public Festival Link">
          <p className="break-all font-mono text-xs text-brand-600 font-semibold">/t/{tenantSlug}/events/{event.slug}</p>
          <p className="mt-2 text-xs text-zinc-500">
            Share this link on your college website or social media.
          </p>
          <div className="mt-2 flex items-center gap-3">
            <Link to={`/t/${tenantSlug}/events/${event.slug}`} target="_blank" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">
              View public page <ExternalLink className="h-3 w-3" />
            </Link>
            <Link to="/tenant/scanner" className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:underline">
              Open QR scanner
            </Link>
          </div>
        </Card>
      </div>

      {/* ACTIVITIES SECTION */}
      <Card
        title="Activities & Competitions"
        subtitle="Sub-events / activities belonging to this festival"
        bodyClassName="p-0"
      >
        {activities.length ? (
          <Table columns={['Activity Title', 'Venue', 'Capacity', 'Status', 'Tickets Linked', 'Actions']}>
            {activities.map((act) => (
              <tr key={act.id}>
                <Td>
                  <span className="font-bold text-zinc-900">{act.title}</span>
                  {act.shortDescription && <p className="text-xs text-zinc-500 truncate max-w-xs">{act.shortDescription}</p>}
                </Td>
                <Td className="text-xs text-zinc-600">{act.venue || '—'}</Td>
                <Td className="text-xs text-zinc-600">{act.capacity ? `${act.capacity} max` : 'Unlimited'}</Td>
                <Td>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    act.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-700'
                  }`}>
                    {act.status}
                  </span>
                </Td>
                <Td className="text-xs text-zinc-500">
                  {act.ticketTypes?.length ? `${act.ticketTypes.length} ticket tier(s)` : 'None'}
                </Td>
                <Td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => toggleActivityStatus.mutate({
                        actId: act.id,
                        status: act.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED',
                      })}
                      className="text-xs font-semibold text-brand-600 hover:underline"
                    >
                      {act.status === 'PUBLISHED' ? 'Set Draft' : 'Publish'}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeActivity.mutate(act.id)}
                      className="text-zinc-400 hover:text-red-600"
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
          <div className="p-5">
            <EmptyState
              title="No activities yet"
              description="Add competitions or sub-events (e.g. Solo Dance, Solo Singing, Quiz)."
            />
          </div>
        )}

        <form onSubmit={submitActivity} className="grid gap-3 border-t border-zinc-200 bg-zinc-50 p-4 sm:grid-cols-5">
          <Input
            label="Activity Title"
            value={activity.title}
            onChange={(e) => setActivity({ ...activity, title: e.target.value })}
            placeholder="e.g. Solo Dance"
            required
          />
          <Input
            label="Short Description"
            value={activity.shortDescription}
            onChange={(e) => setActivity({ ...activity, shortDescription: e.target.value })}
            placeholder="e.g. Solo Western & Classical"
          />
          <Input
            label="Venue / Stage"
            value={activity.venue}
            onChange={(e) => setActivity({ ...activity, venue: e.target.value })}
            placeholder="e.g. Open Air Theatre"
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
            <Button type="submit" className="w-full" loading={addActivity.isPending}>
              <Plus className="h-4 w-4" /> Add Activity
            </Button>
          </div>
        </form>
      </Card>

      {/* TICKET TYPES SECTION */}
      <Card className="mt-6" title="Ticket Types & Admission Passes" subtitle="Pricing tiers for this event or specific activities" bodyClassName="p-0">
        {event.ticketTypes?.length ? (
          <Table columns={['Name', 'Assigned Activity', 'Price', 'Sold / Total', 'Per Order', '']}>
            {event.ticketTypes.map((type) => {
              const assignedAct = activities.find((a) => a.id === type.activityId);
              return (
                <tr key={type.id}>
                  <Td>
                    <span className="font-medium text-zinc-800">{type.name}</span>
                    {!type.isActive && <span className="ml-2 text-xs text-zinc-400">inactive</span>}
                  </Td>
                  <Td className="text-xs">
                    {assignedAct ? (
                      <span className="rounded bg-orange-100 px-2 py-0.5 font-bold text-orange-800">
                        {assignedAct.title}
                      </span>
                    ) : (
                      <span className="text-zinc-400">All-Event</span>
                    )}
                  </Td>
                  <Td className="font-bold text-zinc-900">{formatCurrency(type.price, type.currency)}</Td>
                  <Td>
                    {type.soldCount} / {type.quantity}
                  </Td>
                  <Td className="text-xs text-zinc-500">
                    {type.minPerOrder}–{type.maxPerOrder}
                  </Td>
                  <Td className="text-right">
                    <button
                      onClick={() => removeTicketType.mutate(type.id)}
                      className="text-xs font-medium text-red-600 hover:underline"
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
          <div className="p-5">
            <EmptyState title="No ticket types yet" description="Add at least one ticket tier before publishing." />
          </div>
        )}

        <form onSubmit={submitTicketType} className="grid gap-3 border-t border-zinc-200 bg-zinc-50 p-4 sm:grid-cols-6">
          <Input label="Name" value={ticketType.name} onChange={(e) => setTicketType({ ...ticketType, name: e.target.value })} placeholder="General" />
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
          <Input label="Price (₹)" type="number" min="0" value={ticketType.price} onChange={(e) => setTicketType({ ...ticketType, price: e.target.value })} />
          <Input label="Quantity" type="number" min="1" value={ticketType.quantity} onChange={(e) => setTicketType({ ...ticketType, quantity: e.target.value })} />
          <Input label="Max / order" type="number" min="1" value={ticketType.maxPerOrder} onChange={(e) => setTicketType({ ...ticketType, maxPerOrder: e.target.value })} />
          <div className="flex items-end">
            <Button type="submit" className="w-full" loading={addTicketType.isPending}>
              <Plus className="h-4 w-4" /> Add Pass
            </Button>
          </div>
        </form>
      </Card>

      {/* REGISTRATION FORM BUILDER */}
      <Card className="mt-6" title="Dynamic Registration Form" subtitle="Custom questions participants fill out during checkout" bodyClassName="p-0">
        {event.formFields?.length ? (
          <Table columns={['Field Label', 'Field Key', 'Type', 'Help / Hint', 'Required', '']}>
            {event.formFields.map((formField) => (
              <tr key={formField.id}>
                <Td className="font-medium text-zinc-800">{formField.fieldLabel}</Td>
                <Td className="font-mono text-xs text-zinc-500">{formField.fieldName}</Td>
                <Td className="text-xs text-zinc-500">{formField.fieldType}</Td>
                <Td className="text-xs text-zinc-400">{formField.helpText || '—'}</Td>
                <Td className="text-xs font-semibold">{formField.isRequired ? <span className="text-red-600">Yes</span> : 'Optional'}</Td>
                <Td className="text-right">
                  <button onClick={() => removeFormField.mutate(formField.id)} className="text-red-600 hover:text-red-800" aria-label={`Delete ${formField.fieldLabel}`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </Td>
              </tr>
            ))}
          </Table>
        ) : (
          <div className="p-5">
            <EmptyState title="No custom fields configured" description="Participants will only be asked for Name, Email and Phone." />
          </div>
        )}

        <form onSubmit={submitFormField} className="grid gap-3 border-t border-zinc-200 bg-zinc-50 p-4 sm:grid-cols-5">
          <Input label="Label" value={field.fieldLabel} onChange={(e) => setField({ ...field, fieldLabel: e.target.value })} placeholder="Register Number" />
          <Input label="Key (variable)" value={field.fieldName} onChange={(e) => setField({ ...field, fieldName: e.target.value })} placeholder="registerNumber" />
          <Select label="Field Type" value={field.fieldType} onChange={(e) => setField({ ...field, fieldType: e.target.value })}>
            {TICKET_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Input
            label="Options (if dropdown/choice)"
            value={field.optionsText}
            onChange={(e) => setField({ ...field, optionsText: e.target.value })}
            disabled={!CHOICE_FIELD_TYPES.includes(field.fieldType)}
            placeholder="1st Year, 2nd Year"
          />
          <Input
            label="Help text / Hint"
            value={field.helpText}
            onChange={(e) => setField({ ...field, helpText: e.target.value })}
            placeholder="e.g. Enter your roll number"
          />
          <div className="flex items-center justify-between sm:col-span-5 pt-2">
            <label className="flex items-center gap-2 text-xs text-zinc-700 font-medium">
              <input
                type="checkbox"
                checked={field.isRequired}
                onChange={(e) => setField({ ...field, isRequired: e.target.checked })}
                className="rounded border-zinc-300 text-brand-500"
              />
              Required field for registration
            </label>
            <Button type="submit" loading={addFormField.isPending}>
              <Plus className="h-4 w-4" /> Add Form Field
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
