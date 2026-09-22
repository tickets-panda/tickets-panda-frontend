import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { LogIn, Key, Mail, ShieldAlert } from 'lucide-react';
import api, { apiErrorMessage } from '../shared/api/client.js';
import { useAuthStore, isPlatformUser } from '../shared/store/auth.js';
import Input from '../shared/components/Input.jsx';
import Button from '../shared/components/Button.jsx';
import { RevealGroup } from '../shared/components/Reveal.jsx';

export default function LoginPage() {
  const { register, handleSubmit, formState } = useForm({
    defaultValues: { email: '', password: '' },
  });
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/auth/login', values);
      const { accessToken, user } = data.data;
      setAuth(user, accessToken);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);

      const target = isPlatformUser(user)
        ? '/platform/dashboard'
        : location.state?.from || '/studio/dashboard';
      navigate(target, { replace: true });
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
          Organizer & Staff Studio
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Sign in to manage your college festivals, competitions, and gate admissions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Work or College Email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@nehru-college.edu"
              icon={Mail}
              error={formState.errors.email?.message}
              {...register('email', { required: 'Email address is required' })}
            />

            <Input
              label="Account Password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              icon={Key}
              error={formState.errors.password?.message}
              {...register('password', { required: 'Password is required' })}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <Link to="/forgot-password" className="font-semibold text-brand-600 hover:underline">
                Forgot password?
              </Link>
              <Link to="/studio/register" className="font-semibold text-slate-700 hover:text-slate-900">
                Register New College
              </Link>
            </div>

            <Button
              type="submit"
              loading={formState.isSubmitting}
              className="w-full mt-2"
              size="lg"
              leftIcon={LogIn}
            >
              Sign In to Studio
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Looking for your festival tickets?{' '}
          <Link to="/my-tickets" className="font-bold text-brand-600 hover:underline">
            Go to Attendee Portal
          </Link>
        </p>
      </div>
      </RevealGroup>
    </div>
  );
}
