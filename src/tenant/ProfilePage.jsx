import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api, { apiErrorMessage } from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import Card from '../shared/components/Card.jsx';
import Input, { Textarea } from '../shared/components/Input.jsx';
import Button from '../shared/components/Button.jsx';
import { PageLoader } from '../shared/components/Feedback.jsx';
import { StatusBadge } from '../shared/components/Badge.jsx';

export default function ProfilePage() {
  const { register, handleSubmit, reset, formState } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ['tenant-profile'],
    queryFn: async () => (await api.get('/tenant/profile')).data.data.tenant,
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        phone: data.phone || '',
        logoUrl: data.logoUrl || '',
        websiteUrl: data.websiteUrl || '',
        address: data.address || '',
        description: data.description || '',
      });
    }
  }, [data, reset]);

  const onSubmit = async (values) => {
    try {
      await api.put('/tenant/profile', values);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  if (isLoading) return <PageLoader label="Loading profile…" />;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Organization"
        description="How your brand appears to customers on your public page."
        actions={data && <StatusBadge status={data.status} />}
      />

      <Card title="Public page">
        <p className="text-sm text-zinc-600">
          Your public URL is{' '}
          <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800">/t/{data?.slug}</span>
        </p>
        <p className="mt-1 text-xs text-zinc-500">Share this with customers so they can find your events.</p>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <Card title="Details">
          <div className="space-y-4">
            <Input label="Organization name" required {...register('name', { required: true })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Contact phone" {...register('phone')} />
              <Input label="Website" type="url" {...register('websiteUrl')} />
            </div>
            <Input label="Logo URL" type="url" placeholder="https://…" {...register('logoUrl')} />
            <Textarea label="Description" rows={3} {...register('description')} />
            <Textarea label="Address" rows={2} {...register('address')} />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={formState.isSubmitting}>
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
