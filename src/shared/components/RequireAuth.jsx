import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, isPlatformUser, isTenantUser } from '../store/auth.js';
import { PageLoader } from './Feedback.jsx';

/**
 * Guards a route group by area ("tenant" | "platform").
 * Redirects to the matching login page when unauthenticated or wrong role.
 */
export default function RequireAuth({ area, children }) {
  const { user, accessToken, bootstrapped } = useAuthStore();
  const location = useLocation();

  if (!bootstrapped) return <PageLoader label="Restoring session…" />;

  const loginPath = area === 'platform' ? '/platform/login' : '/studio/login';

  if (!accessToken || !user) {
    return <Navigate to={loginPath} state={{ from: location.pathname }} replace />;
  }

  const allowed = area === 'platform' ? isPlatformUser(user) : isTenantUser(user);
  if (!allowed) {
    return <Navigate to={isPlatformUser(user) ? '/platform/dashboard' : '/studio/dashboard'} replace />;
  }

  return children;
}
