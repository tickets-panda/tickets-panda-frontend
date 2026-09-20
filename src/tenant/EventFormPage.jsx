import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api, { apiErrorMessage, apiFieldErrors } from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
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
        toast.success('Event updated');
        navigate(`/tenant/events/${id}`);
      } else {
        const { data: created } = await api.post('/tenant/events', payload);
        toast.success('Event created — add ticket types next');
        navigate(`/tenant/events/${created.data.event.id}`);
      }
    } catch (error) {
      const fieldErrors = apiFieldErrors(error);
      Object.entries(fieldErrors).forEach(([field, message]) => setError(field, { message }));
      toast.error(apiErrorMessage(error));
    }
  };

  if (isEdit && isLoading) return <PageLoader label="Loading event…" />;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={isEdit ? 'Edit event' : 'Create event'}
        description="Set the basics now — you can add ticket types and a custom form afterwards."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card title="Event details">
          <div className="space-y-4">
            <Input
              label="Event title"
              required
              placeholder="NGK Fest 2026"
              error={formState.errors.title?.message}
              {...register('title', { required: 'Title is required' })}
            />
            <Textarea label="Description" placeholder="What is this event about?" {...register('description')} />
            <Input label="Banner image URL" type="url" placeholder="https://…" {...register('bannerUrl')} />
          </div>
        </Card>

        <Card title="Venue & schedule">
          <div className="space-y-4">
            <Input
              label="Venue name"
              required
              placeholder="Main Auditorium"
              error={formState.errors.venueName?.message}
              {...register('venueName', { required: 'Venue is required' })}
            />
            <Textarea label="Venue address" rows={2} {...register('venueAddress')} />
            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="Date"
                type="date"
                required
                error={formState.errors.eventDate?.message}
                {...register('eventDate', { required: 'Date is required' })}
              />
              <Input
                label="Start time"
                type="time"
                required
                error={formState.errors.eventTimeStart?.message}
                {...register('eventTimeStart', { required: 'Start time is required' })}
              />
              <Input label="End time" type="time" {...register('eventTimeEnd')} />
            </div>
          </div>
        </Card>

        <Card title="Capacity & deadlines">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Maximum capacity" type="number" min="1" placeholder="500" {...register('maxCapacity')} />
            <Input label="Registration deadline" type="datetime-local" {...register('registrationDeadline')} />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" loading={formState.isSubmitting}>
            {isEdit ? 'Save changes' : 'Create event'}
          </Button>
        </div>
      </form>
    </div>
  );
}
