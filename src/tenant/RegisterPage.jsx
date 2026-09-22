import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Building2, Mail, Key, Phone, Globe, Sparkles, ArrowRight } from 'lucide-react';
import api, { apiErrorMessage, apiFieldErrors } from '../shared/api/client.js';
import Input from '../shared/components/Input.jsx';
import Button from '../shared/components/Button.jsx';
import { RevealGroup } from '../shared/components/Reveal.jsx';

export default function RegisterPage() {
  const { register, handleSubmit, setError, formState, watch } = useForm({
    defaultValues: { name: '', email: '', password: '', phone: '', websiteUrl: '' },
  });
  const navigate = useNavigate();
  const orgName = watch('name');

  const slugPreview = orgName
    ? orgName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    : 'your-college';

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/auth/register/tenant', values);
      toast.success(`Organization created! Your public portal will be /t/${data.data.slug}`);
      navigate('/organizer/login');
    } catch (error) {
      const fieldErrors = apiFieldErrors(error);
      Object.entries(fieldErrors).forEach(([field, message]) => setError(field, { message }));
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <RevealGroup className="flex flex-col">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-2xl shadow-lg shadow-brand-500/25">
            🐼
          </span>
          <span className="text-2xl font-black tracking-tight text-slate-950">Ticket Panda</span>
        </Link>
        <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900">
          Create Your College Organization
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Set up your branded festival ticketing hub in under 2 minutes.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="College / Institution Name"
              required
              placeholder="e.g. PSG College of Technology"
              icon={Building2}
              error={formState.errors.name?.message}
              {...register('name', { required: 'Organization name is required' })}
            />

            {/* Subdomain Slug Preview */}
            <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3 text-xs text-slate-600">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Your Public Event Portal URL
              </span>
              <p className="font-mono font-bold text-brand-600 mt-0.5 truncate">
                ticketspanda.tech/t/{slugPreview}
              </p>
            </div>

            <Input
              label="Official Contact / Work Email"
              type="email"
              required
              placeholder="cultural.dean@college.edu"
              icon={Mail}
              error={formState.errors.email?.message}
              {...register('email', {
                required: 'Email address is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
              })}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Admin Password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="••••••••"
                icon={Key}
                error={formState.errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Minimum 8 characters' },
                })}
              />
              <Input
                label="Contact Phone"
                type="tel"
                placeholder="+91 98765 43210"
                icon={Phone}
                error={formState.errors.phone?.message}
                {...register('phone')}
              />
            </div>

            <Input
              label="Official Website URL"
              type="url"
              placeholder="https://psgtech.edu"
              icon={Globe}
              error={formState.errors.websiteUrl?.message}
              {...register('websiteUrl')}
            />

            <Button
              type="submit"
              loading={formState.isSubmitting}
              className="w-full mt-4"
              size="lg"
            >
              Register College & Get Started
            </Button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <p className="text-xs text-slate-500">
              Already have an organizer account?{' '}
              <Link to="/organizer/login" className="font-bold text-brand-600 hover:underline">
                Sign in to Studio
              </Link>
            </p>
          </div>
        </div>
      </div>
      </RevealGroup>
    </div>
  );
}
