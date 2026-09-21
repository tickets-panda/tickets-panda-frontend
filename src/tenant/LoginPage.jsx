import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { LogIn, Key, Mail, ShieldCheck, Sparkles, Building2, ShieldAlert } from 'lucide-react';
import api, { apiErrorMessage } from '../shared/api/client.js';
import { useAuthStore, isPlatformUser } from '../shared/store/auth.js';
import Input from '../shared/components/Input.jsx';
import Button from '../shared/components/Button.jsx';
import { RevealGroup } from '../shared/components/Reveal.jsx';

export default function LoginPage() {
  const { register, handleSubmit, setValue, formState } = useForm({
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
        : location.state?.from || '/tenant/dashboard';
      navigate(target, { replace: true });
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  const fillCredentials = (email, password) => {
    setValue('email', email);
    setValue('password', password);
    toast.success(`Loaded credentials for ${email}`);
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
              <Link to="/tenant/register" className="font-semibold text-slate-700 hover:text-slate-900">
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

          {/* Local Sandbox Demo Credentials Quick-Fill */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Sandbox Quick-Fill Credentials</span>
            </p>
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin@nehru-college.edu', 'Password123')}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-left text-xs hover:bg-brand-50/50 hover:border-brand-200 transition-all"
              >
                <div>
                  <p className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-brand-600" />
                    <span>Nehru College (Organizer Admin)</span>
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">admin@nehru-college.edu</p>
                </div>
                <span className="text-[10px] font-bold text-brand-600">Auto-Fill</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('admin@ticketpanda.io', 'Password123')}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-left text-xs hover:bg-purple-50/50 hover:border-purple-200 transition-all"
              >
                <div>
                  <p className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
                    <span>Platform Super Admin</span>
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">admin@ticketpanda.io</p>
                </div>
                <span className="text-[10px] font-bold text-purple-600">Auto-Fill</span>
              </button>
            </div>
          </div>
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
