import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api, { apiErrorMessage } from '../shared/api/client.js';
import Input from '../shared/components/Input.jsx';
import Button from '../shared/components/Button.jsx';

export function ForgotPasswordPage() {
  const { register, handleSubmit, formState } = useForm({ defaultValues: { email: '' } });

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/auth/forgot-password', values);
      toast.success(data.message);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="card w-full max-w-md space-y-4 p-6">
        <h1 className="text-lg font-bold text-zinc-900">Reset your password</h1>
        <p className="text-sm text-zinc-500">We will email you a link to choose a new password.</p>
        <Input
          label="Email"
          type="email"
          required
          error={formState.errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <Button type="submit" loading={formState.isSubmitting} className="w-full">
          Send reset link
        </Button>
        <Link to="/tenant/login" className="block text-center text-xs font-medium text-zinc-500 hover:underline">
          Back to sign in
        </Link>
      </form>
    </div>
  );
}

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';
  const { register, handleSubmit, formState } = useForm({ defaultValues: { newPassword: '' } });

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/auth/reset-password', { token, newPassword: values.newPassword });
      toast.success(data.message);
      navigate('/tenant/login');
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="card w-full max-w-md space-y-4 p-6">
        <h1 className="text-lg font-bold text-zinc-900">Choose a new password</h1>
        {!token && <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-700">This reset link is missing its token.</p>}
        <Input
          label="New password"
          type="password"
          required
          autoComplete="new-password"
          error={formState.errors.newPassword?.message}
          {...register('newPassword', {
            required: 'Password is required',
            minLength: { value: 8, message: 'At least 8 characters' },
          })}
        />
        <Button type="submit" loading={formState.isSubmitting} disabled={!token} className="w-full">
          Update password
        </Button>
      </form>
    </div>
  );
}

export default { ForgotPasswordPage, ResetPasswordPage };
