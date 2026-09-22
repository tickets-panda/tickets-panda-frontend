import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Mail, Key, ArrowLeft, ShieldCheck } from 'lucide-react';
import api, { apiErrorMessage } from '../shared/api/client.js';
import Input from '../shared/components/Input.jsx';
import Button from '../shared/components/Button.jsx';
import { RevealGroup } from '../shared/components/Reveal.jsx';

export function ForgotPasswordPage() {
  const { register, handleSubmit, formState } = useForm({ defaultValues: { email: '' } });

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/auth/forgot-password', values);
      toast.success(data.message || 'If an account exists, a reset link was sent.');
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <RevealGroup className="flex flex-col">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-2xl shadow-lg shadow-brand-500/25">
            🐼
          </span>
          <span className="text-2xl font-black tracking-tight text-slate-950">Ticket Panda</span>
        </Link>
        <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900">
          Reset Your Password
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter your registered email address to receive password reset instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Work / College Email"
              type="email"
              required
              placeholder="admin@nehru-college.edu"
              icon={Mail}
              error={formState.errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
            <Button
              type="submit"
              loading={formState.isSubmitting}
              className="w-full mt-2"
              size="lg"
            >
              Send Password Reset Link
            </Button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <Link
              to="/organizer/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
      </RevealGroup>
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
      const { data } = await api.post('/auth/reset-password', {
        token,
        newPassword: values.newPassword,
      });
      toast.success(data.message || 'Password updated successfully!');
      navigate('/organizer/login');
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <RevealGroup className="flex flex-col">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-2xl shadow-lg shadow-brand-500/25">
            🐼
          </span>
          <span className="text-2xl font-black tracking-tight text-slate-950">Ticket Panda</span>
        </Link>
        <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900">
          Create New Password
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Choose a secure, strong password for your organizer account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!token && (
              <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
                This reset link is missing its authentication token. Please request a new link.
              </p>
            )}

            <Input
              label="New Password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              icon={Key}
              error={formState.errors.newPassword?.message}
              {...register('newPassword', {
                required: 'Password is required',
                minLength: { value: 8, message: 'At least 8 characters required' },
              })}
            />

            <Button
              type="submit"
              loading={formState.isSubmitting}
              disabled={!token}
              className="w-full mt-2"
              size="lg"
            >
              Update Password & Sign In
            </Button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <Link
              to="/organizer/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
      </RevealGroup>
    </div>
  );
}

export default { ForgotPasswordPage, ResetPasswordPage };
