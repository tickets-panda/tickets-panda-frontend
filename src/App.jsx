import { useEffect } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import api from './shared/api/client.js';
import { useAuthStore } from './shared/store/auth.js';
import RequireAuth from './shared/components/RequireAuth.jsx';
import SmoothScroll from './shared/components/SmoothScroll.jsx';

// Public (customer) app
import PublicLayout from './public/PublicLayout.jsx';
import LandingPage from './public/LandingPage.jsx';
import TenantEventsPage from './public/TenantEventsPage.jsx';
import EventDetailPage from './public/EventDetailPage.jsx';
import RegisterPage from './public/RegisterPage.jsx';
import ConfirmationPage from './public/ConfirmationPage.jsx';
import MyTicketsPage from './public/MyTicketsPage.jsx';
import VerifyTicketPage from './public/VerifyTicketPage.jsx';
import LocalCheckoutPage from './public/LocalCheckoutPage.jsx';
import PublicEventsDirectoryPage from './public/PublicEventsDirectoryPage.jsx';
import NehruHome from './public/nehru/NehruHome.jsx';
import NehruEvent from './public/nehru/NehruEvent.jsx';
import {
  FeaturesPage,
  HowItWorksPage,
  ForCollegesPage,
  ForOrganizersPage,
  HelpCenterPage,
  ContactPage,
  PrivacyPolicyPage,
  TermsOfServicePage,
} from './public/MarketingPages.jsx';

// Tenant dashboard
import TenantLayout from './tenant/TenantLayout.jsx';
import LoginPage from './tenant/LoginPage.jsx';
import TenantRegisterPage from './tenant/RegisterPage.jsx';
import { ForgotPasswordPage, ResetPasswordPage } from './tenant/PasswordPages.jsx';
import TenantDashboard from './tenant/DashboardPage.jsx';
import EventsPage from './tenant/EventsPage.jsx';
import EventFormPage from './tenant/EventFormPage.jsx';
import TenantEventDetailPage from './tenant/EventDetailPage.jsx';
import BookingsPage from './tenant/BookingsPage.jsx';
import AnalyticsPage from './tenant/AnalyticsPage.jsx';
import StaffPage from './tenant/StaffPage.jsx';
import ScannerPage from './tenant/ScannerPage.jsx';
import GateStatsPage from './tenant/GateStatsPage.jsx';
import ProfilePage from './tenant/ProfilePage.jsx';

// Platform admin
import PlatformLayout from './platform/PlatformLayout.jsx';
import PlatformDashboard from './platform/DashboardPage.jsx';
import TenantsPage from './platform/TenantsPage.jsx';
import TenantDetailPage from './platform/TenantDetailPage.jsx';
import { PlatformBookingsPage, PlatformPaymentsPage } from './platform/CrossTenantPages.jsx';

let bootstrapStarted = false;

/** Rebuilds the auth store from the httpOnly refresh cookie after a reload. */
async function restoreSession() {
  const { setAuth, setToken, finishBootstrap } = useAuthStore.getState();
  try {
    const { data } = await api.post('/auth/refresh-token');
    const accessToken = data.data.accessToken;
    setToken(accessToken);

    const me = await api.get('/auth/me', { headers: { Authorization: `Bearer ${accessToken}` } });
    const profile = me.data.data.user;
    const { role, tenantId } = me.data.data.token;
    const membership = (profile.memberships || []).find(
      (item) => item.tenantId === tenantId && item.isActive,
    );

    setAuth(
      {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role,
        tenantId,
        tenantName: membership?.tenantName || null,
        tenantSlug: membership?.tenantSlug || null,
      },
      accessToken,
    );
  } catch {
    finishBootstrap();
  }
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <span className="text-4xl">🐼</span>
      <h1 className="text-xl font-bold text-zinc-900">Page not found</h1>
      <p className="text-sm text-zinc-500">The page you were looking for does not exist.</p>
      <Link to="/" className="mt-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600">
        Back to home
      </Link>
    </div>
  );
}

/** Legacy redirects: /tenant/* and /studio/* → /organizer/* so old links keep working. */
function LegacyTenantRedirect() {
  const location = useLocation();
  const to = location.pathname.replace(/^\/(tenant|studio)/, '/organizer') + location.search + location.hash;
  return <Navigate to={to} replace />;
}

export default function App() {
  useEffect(() => {
    if (bootstrapStarted) return;
    bootstrapStarted = true;
    restoreSession();
  }, []);

  return (
    <SmoothScroll>
    <Routes>
      {/* Customer-facing & Marketing */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/for-colleges" element={<ForCollegesPage />} />
        <Route path="/for-organizers" element={<ForOrganizersPage />} />
        <Route path="/events" element={<PublicEventsDirectoryPage />} />
        <Route path="/help" element={<HelpCenterPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />

        <Route path="/t/nehru-college" element={<NehruHome />} />
        <Route path="/t/nehru-college/events/:eventSlug" element={<NehruEvent />} />
        <Route path="/t/:tenantSlug" element={<TenantEventsPage />} />
        <Route path="/t/:tenantSlug/events/:eventSlug" element={<EventDetailPage />} />
        <Route path="/t/:tenantSlug/events/:eventSlug/register" element={<RegisterPage />} />
        <Route path="/checkout/local/:orderRef" element={<LocalCheckoutPage />} />
        <Route path="/booking/:orderRef" element={<ConfirmationPage />} />
        <Route path="/my-tickets" element={<MyTicketsPage />} />
        <Route path="/verify/:token" element={<VerifyTicketPage />} />
      </Route>

      {/* Auth */}
      <Route path="/organizer/login" element={<LoginPage />} />
      <Route path="/platform/login" element={<LoginPage />} />
      <Route path="/organizer/register" element={<TenantRegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Tenant dashboard */}
      <Route
        path="/organizer"
        element={
          <RequireAuth area="tenant">
            <TenantLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/organizer/dashboard" replace />} />
        <Route path="dashboard" element={<TenantDashboard />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/new" element={<EventFormPage />} />
        <Route path="events/:id" element={<TenantEventDetailPage />} />
        <Route path="events/:id/edit" element={<EventFormPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="scanner" element={<ScannerPage />} />
        <Route path="gate-stats" element={<GateStatsPage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Legacy: old /tenant/* and /studio/* paths redirect */}
      <Route path="/tenant/*" element={<LegacyTenantRedirect />} />
      <Route path="/studio/*" element={<LegacyTenantRedirect />} />

      {/* Platform admin */}
      <Route
        path="/platform"
        element={
          <RequireAuth area="platform">
            <PlatformLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/platform/dashboard" replace />} />
        <Route path="dashboard" element={<PlatformDashboard />} />
        <Route path="tenants" element={<TenantsPage />} />
        <Route path="tenants/:id" element={<TenantDetailPage />} />
        <Route path="bookings" element={<PlatformBookingsPage />} />
        <Route path="payments" element={<PlatformPaymentsPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
    </SmoothScroll>
  );
}
