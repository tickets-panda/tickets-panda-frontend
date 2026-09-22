import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  CalendarDays,
  MapPin,
  Image as ImageIcon,
  Users,
  Clock,
  ArrowLeft,
  Sparkles,
  Info,
} from 'lucide-react';
import api, { apiErrorMessage, apiFieldErrors } from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import { RevealGroup } from '../shared/components/Reveal.jsx';
import Input, { Textarea } from '../shared/components/Input.jsx';
import Button from '../shared/components/Button.jsx';
import Card from '../shared/components/Card.jsx';
import { PageLoader } from '../shared/components/Feedback.jsx';
import { toInputDate } from '../shared/utils/format.js';

export default function EventFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, setError, formState } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ['tenant-event', id],
    queryFn: async () => (await api.get(`/tenant/events/${id}`)).data.data,
    enabled: isEdit,
  });

  useEffect(() => {
    if (!isEdit || !data?.event) return;
    const event = data.event;
    reset({
      title: event.title,
      description: event.description || '',
      bannerUrl: event.bannerUrl || '',
      venueName: event.venueName,
      venueAddress: event.venueAddress || '',
      eventDate: toInputDate(event.eventDate),
      eventTimeStart: (event.eventTimeStart || '').slice(0, 5),
      eventTimeEnd: (event.eventTimeEnd || '').slice(0, 5),
      maxCapacity: event.maxCapacity ?? '',
      registrationDeadline: event.registrationDeadline ? event.registrationDeadline.slice(0, 16) : '',
    });
  }, [data, isEdit, reset]);

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      maxCapacity: values.maxCapacity === '' ? null : Number(values.maxCapacity),
      eventTimeEnd: values.eventTimeEnd || null,
      registrationDeadline: values.registrationDeadline || null,
    };

    try {
      if (isEdit) {
        await api.put(`/tenant/events/${id}`, payload);
        toast.success('Event updated successfully');
        navigate(`/studio/events/${id}`);
      } else {
        const { data: created } = await api.post('/tenant/events', payload);
        toast.success('Event created! Now configure activities & ticket tiers.');
        navigate(`/studio/events/${created.data.event.id}`);
      }
    } catch (error) {
      const fieldErrors = apiFieldErrors(error);
      Object.entries(fieldErrors).forEach(([field, message]) => setError(field, { message }));
      toast.error(apiErrorMessage(error));
    }
  };

  if (isEdit && isLoading) return <PageLoader label="Loading event configuration…" />;

  return (
    <RevealGroup className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {isEdit ? 'Edit Event / Festival' : 'Create New Event / Festival'}
          </h1>
          <p className="text-xs text-slate-500">
            {isEdit
              ? 'Update the event details, venue, and scheduling.'
              : 'Set up the core festival details. You can add activities, competitions, and tickets next.'}
          </p>
        </div>
      </div>

      {!isEdit && (
        <div className="rounded-2xl border border-brand-200/80 bg-brand-50/50 p-4 text-xs text-brand-900 flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-brand-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold">Multi-Activity Architecture</p>
            <p className="mt-0.5 text-slate-600">
              For annual college fests (e.g. cultural fests, symposiums), create the parent festival here, then add
              individual activities (Battle of Bands, RoboWars, Dance) and link specific admission tickets inside.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Event Identity */}
        <Card title="1. Event Information" subtitle="Brand title, description, and promotional artwork">
          <div className="space-y-4">
            <Input
              label="Event / Festival Title"
              required
              placeholder="e.g. Pandaves 2026 — Annual Cultural Fest"
              error={formState.errors.title?.message}
              {...register('title', { required: 'Event title is required' })}
            />

            <Textarea
              label="Description & Highlights"
              rows={4}
              placeholder="Give attendees a thrilling overview of what to expect, celebrity guests, prizes, and theme..."
              {...register('description')}
            />

            <Input
              label="Banner Poster Image URL"
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              hint="High-resolution landscape image (16:9 recommended)"
              {...register('bannerUrl')}
            />
          </div>
        </Card>

        {/* Section 2: Location & Timing */}
        <Card title="2. Schedule & Venue" subtitle="Where and when is the event taking place?">
          <div className="space-y-4">
            <Input
              label="Venue Name / Auditorium"
              required
              placeholder="e.g. Nehru Auditorium & Open Air Grounds"
              error={formState.errors.venueName?.message}
              {...register('venueName', { required: 'Venue name is required' })}
            />

            <Textarea
              label="Full Campus Address / Hall Details"
              rows={2}
              placeholder="e.g. Main Campus, College Road, Block C, Gate 2"
              {...register('venueAddress')}
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="Event Date"
                type="date"
                required
                error={formState.errors.eventDate?.message}
                {...register('eventDate', { required: 'Date is required' })}
              />

              <Input
                label="Start Time"
                type="time"
                required
                error={formState.errors.eventTimeStart?.message}
                {...register('eventTimeStart', { required: 'Start time is required' })}
              />

              <Input label="End Time (optional)" type="time" {...register('eventTimeEnd')} />
            </div>
          </div>
        </Card>

        {/* Section 3: Capacity & Deadlines */}
        <Card title="3. Capacity & Cut-off" subtitle="Control crowd limits and registration cutoff">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Maximum Total Capacity"
              type="number"
              min="1"
              placeholder="e.g. 1500 (leave blank for unlimited)"
              {...register('maxCapacity')}
            />

            <Input
              label="Registration Deadline"
              type="datetime-local"
              hint="Registration closes automatically at this time"
              {...register('registrationDeadline')}
            />
          </div>
        </Card>

        {/* Form Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={() => navigate(-1)} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={formState.isSubmitting} size="lg">
            {isEdit ? 'Save Changes' : 'Create & Proceed to Setup'}
          </Button>
        </div>
      </form>
    </RevealGroup>
  );
}
