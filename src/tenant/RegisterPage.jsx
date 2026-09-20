import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api, { apiErrorMessage, apiFieldErrors } from '../shared/api/client.js';
import Input from '../shared/components/Input.jsx';
import Button from '../shared/components/Button.jsx';

export default function RegisterPage() {
  const { register, handleSubmit, setError, formState } = useForm({
    defaultValues: { name: '', email: '', password: '', phone: '', websiteUrl: '' },
  });
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/auth/register/tenant', values);
      toast.success(`Organization created — public page /t/${data.data.slug}`);
      navigate('/tenant/login');
    } catch (error) {
      const fieldErrors = apiFieldErrors(error);
      Object.entries(fieldErrors).forEach(([field, message]) => setError(field, { message }));
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-brand-50 px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <span className="text-3xl">🐼</span>
          <h1 className="mt-2 text-xl font-bold text-zinc-900">Create your organization</h1>
          <p className="text-sm text-zinc-500">Start selling tickets in minutes</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
          <Input
            label="Organization name"
            required
            placeholder="Nehru College"
            error={formState.errors.name?.message}
            {...register('name', { required: 'Organization name is required' })}
          />
          <Input
            label="Work email"
            type="email"
            required
            error={formState.errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
            })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Password"
              type="password"
              required
              autoComplete="new-password"
              error={formState.errors.password?.message}
              {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } })}
            />
            <Input label="Phone" type="tel" error={formState.errors.phone?.message} {...register('phone')} />
          </div>
          <Input
            label="Website"
            type="url"
            placeholder="https://example.com"
            error={formState.errors.websiteUrl?.message}
            {...register('websiteUrl')}
          />

          <Button type="submit" loading={formState.isSubmitting} className="w-full">
            Create organization
          </Button>

          <p className="text-center text-xs text-zinc-500">
            Already have an account?{' '}
            <Link to="/tenant/login" className="font-medium text-brand-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
