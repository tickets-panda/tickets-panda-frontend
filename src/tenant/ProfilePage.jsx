import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ExternalLink, Copy, Building2, Globe, Phone, MapPin, Image as ImageIcon } from 'lucide-react';
import api, { apiErrorMessage } from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import Card from '../shared/components/Card.jsx';
import Input, { Textarea } from '../shared/components/Input.jsx';
import Button from '../shared/components/Button.jsx';
import { PageLoader } from '../shared/components/Feedback.jsx';
import { StatusBadge } from '../shared/components/Badge.jsx';

export default function ProfilePage() {
  const { register, handleSubmit, reset, formState, watch } = useForm();

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

  const logoUrl = watch('logoUrl');

  const onSubmit = async (values) => {
    try {
      await api.put('/tenant/profile', values);
      toast.success('Organization profile updated successfully');
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  const copySlugUrl = () => {
    if (data?.slug) {
      navigator.clipboard.writeText(`${window.location.origin}/t/${data.slug}`);
      toast.success('College portal link copied!');
    }
  };

  if (isLoading) return <PageLoader label="Loading organization details…" />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="College Organization Profile"
        description="Configure your institution's identity, public festival landing page, and contact details."
        actions={data && <StatusBadge status={data.status} />}
      />

      {/* Public College Portal Link Showcase */}
      <Card className="p-5 bg-gradient-to-br from-brand-50 to-orange-50/40 border-brand-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-brand-700">
              Your College Festival Portal
            </span>
            <p className="mt-0.5 font-mono text-xs sm:text-sm font-bold text-slate-900 break-all">
              {window.location.origin}/t/{data?.slug}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Share this permanent URL on banners, posters, and college social media.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={copySlugUrl} leftIcon={Copy}>
              Copy Link
            </Button>
            <a
              href={`/t/${data?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition-all"
            >
              <span>View Portal</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card title="Organization Identity & Branding">
          <div className="space-y-4">
            <Input
              label="College / Organization Name"
              required
              placeholder="e.g. Nehru Institute of Technology"
              {...register('name', { required: 'Organization name is required' })}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Official Contact Phone"
                placeholder="+91 98765 43210"
                {...register('phone')}
              />
              <Input
                label="Institution Website"
                type="url"
                placeholder="https://nehru-college.edu"
                {...register('websiteUrl')}
              />
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <Input
                  label="Official Logo Image URL"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  hint="Square PNG or SVG recommended (min 200x200px)"
                  {...register('logoUrl')}
                />
              </div>
              {logoUrl && (
                <div className="mt-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
                  <img src={logoUrl} alt="Logo preview" className="h-full w-full object-contain rounded-xl" />
                </div>
              )}
            </div>

            <Textarea
              label="About the Institution / Cultural Committee"
              rows={3}
              placeholder="Brief introduction displayed on your public events directory..."
              {...register('description')}
            />

            <Textarea
              label="Physical Campus Address"
              rows={2}
              placeholder="Campus Road, District, State, PIN"
              {...register('address')}
            />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" loading={formState.isSubmitting} size="lg">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
