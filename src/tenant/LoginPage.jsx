import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api, { apiErrorMessage } from '../shared/api/client.js';
import { useAuthStore, isPlatformUser } from '../shared/store/auth.js';
import Input from '../shared/components/Input.jsx';
import Button from '../shared/components/Button.jsx';

export default function LoginPage() {
  const { register, handleSubmit, formState } = useForm({ defaultValues: { email: '', password: '' } });
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/auth/login', values);
      const { accessToken, user } = data.data;
      setAuth(user, accessToken);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}`);

      const target = isPlatformUser(user)
        ? '/platform/dashboard'
        : location.state?.from || '/tenant/dashboard';
      navigate(target, { replace: true });
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-brand-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="text-3xl">🐼</span>
          <h1 className="mt-2 text-xl font-bold text-zinc-900">Sign in to Ticket Panda</h1>
          <p className="text-sm text-zinc-500">Organizer & platform accounts</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
          <Input
            label="Email"
            type="email"
            required
            autoComplete="email"
            error={formState.errors.email?.message}
            {...register('email', { required: 'Email is required' })}
          />
          <Input
            label="Password"
            type="password"
            required
            autoComplete="current-password"
            error={formState.errors.password?.message}
            {...register('password', { required: 'Password is required' })}
          />

          <Button type="submit" loading={formState.isSubmitting} className="w-full">
            Sign in
          </Button>

          <div className="flex items-center justify-between text-xs">
            <Link to="/forgot-password" className="font-medium text-brand-600 hover:underline">
              Forgot password?
            </Link>
            <Link to="/tenant/register" className="font-medium text-zinc-600 hover:underline">
              Create an organization
            </Link>
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-zinc-500">
          Buying tickets?{' '}
          <Link to="/" className="font-medium text-brand-600 hover:underline">
            Go to the public site
          </Link>
        </p>
      </div>
    </div>
  );
}
