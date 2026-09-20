import { useEffect, useState, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Mail,
  KeyRound,
  LogOut,
  Ticket as TicketIcon,
  Search,
  Download,
  Calendar,
  MapPin,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import api, { baseURL, apiErrorMessage } from '../shared/api/client.js';
import { useCustomerStore } from '../shared/store/auth.js';
import Button from '../shared/components/Button.jsx';
import Input from '../shared/components/Input.jsx';
import Card from '../shared/components/Card.jsx';
import Tabs from '../shared/components/Tabs.jsx';
import { EmptyState, PageLoader } from '../shared/components/Feedback.jsx';
import { StatusBadge } from '../shared/components/Badge.jsx';
import TicketCard from '../shared/components/TicketCard.jsx';
import { formatDate, formatTime } from '../shared/utils/format.js';

export default function MyTicketsPage() {
  const { customer, accessToken, setAuth, clearAuth } = useCustomerStore();
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState(() => (accessToken && customer ? 'tickets' : 'identifier'));
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  // Load customer's tickets
  useEffect(() => {
    if (stage !== 'tickets' || !accessToken) return undefined;
    let cancelled = false;
    setLoadingTickets(true);

    api
      .get('/customer/my-tickets', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => {
        if (!cancelled) setTickets(response.data.data.tickets || []);
      })
      .catch((error) => {
        if (!cancelled) toast.error(apiErrorMessage(error));
      })
      .finally(() => {
        if (!cancelled) setLoadingTickets(false);
      });

    return () => {
      cancelled = true;
    };
  }, [stage, accessToken]);

  const sendOtp = useMutation({
    mutationFn: async () => (await api.post('/customer/otp/send', { identifier, type: 'EMAIL' })).data,
    onSuccess: () => {
      setStage('otp');
      toast.success('Verification code sent! Please check your inbox.');
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  const verifyOtp = useMutation({
    mutationFn: async () => (await api.post('/customer/otp/verify', { identifier, type: 'EMAIL', otp })).data.data,
    onSuccess: (data) => {
      setAuth(data.customer, data.accessToken);
      setStage('tickets');
      toast.success('Signed in successfully!');
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  const signOut = () => {
    clearAuth();
    setTickets([]);
    setOtp('');
    setStage('identifier');
    toast.success('Signed out.');
  };

  // Filter tickets by search and tab
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchQuery =
        !searchQuery ||
        t.event?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.ticketKey?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.ticketType?.name?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchQuery) return false;

      if (activeTab === 'upcoming') {
        return t.status === 'ACTIVE';
      }
      if (activeTab === 'past') {
        return t.status === 'USED' || t.status === 'CANCELLED' || t.status === 'EXPIRED';
      }
      return true;
    });
  }, [tickets, searchQuery, activeTab]);

  const upcomingCount = tickets.filter((t) => t.status === 'ACTIVE').length;
  const pastCount = tickets.filter((t) => t.status !== 'ACTIVE').length;

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100/70 border border-orange-200 px-3 py-1 text-xs font-bold text-brand-700 mb-2">
            <TicketIcon className="h-3.5 w-3.5" />
            <span>Attendee Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            My E-Tickets & Passes
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Access your verified QR admission tickets, download PDF passes, and check event schedules.
          </p>
        </div>

        {/* Authentication Form Card (when not logged in) */}
        {stage !== 'tickets' && (
          <div className="mx-auto max-w-md">
            <Card className="p-6 sm:p-8 shadow-card border-slate-200/90">
              <div className="text-center mb-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 border border-brand-100">
                  {stage === 'identifier' ? <Mail className="h-6 w-6" /> : <KeyRound className="h-6 w-6" />}
                </div>
                <h2 className="mt-3 text-lg font-bold text-slate-900">
                  {stage === 'identifier' ? 'Access Your Tickets' : 'Enter Verification Code'}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {stage === 'identifier'
                    ? 'Enter the email address you used when registering. No password required.'
                    : `We sent a 6-digit code to ${identifier}`}
                </p>
              </div>

              {stage === 'identifier' ? (
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendOtp.mutate();
                  }}
                >
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="student@college.edu"
                    hint="We'll send you an instant login code."
                  />
                  <Button
                    type="submit"
                    loading={sendOtp.isPending}
                    className="w-full"
                    size="lg"
                    leftIcon={Mail}
                  >
                    Send One-Time Code
                  </Button>
                </form>
              ) : (
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    verifyOtp.mutate();
                  }}
                >
                  <Input
                    label="6-Digit Code"
                    inputMode="numeric"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="text-center text-xl tracking-widest font-mono"
                    hint="Check your inbox or spam folder."
                  />
                  <Button
                    type="submit"
                    loading={verifyOtp.isPending}
                    className="w-full"
                    size="lg"
                    leftIcon={KeyRound}
                  >
                    Verify & View Tickets
                  </Button>
                  <div className="flex items-center justify-between pt-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setStage('identifier')}
                      className="font-medium text-slate-500 hover:text-slate-800"
                    >
                      Use different email
                    </button>
                    <button
                      type="button"
                      disabled={sendOtp.isPending}
                      onClick={() => sendOtp.mutate()}
                      className="font-semibold text-brand-600 hover:text-brand-700"
                    >
                      Resend code
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6 border-t border-slate-100 pt-4 text-center">
                <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Secure passwordless authentication</span>
                </div>
              </div>
            </Card>

            {/* Help Callout */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-brand-500" />
                Lost your ticket or registered with a typo?
              </p>
              <p className="mt-1 text-slate-500">
                If you made a payment but didn't receive your tickets, contact the event coordinator or our team at{' '}
                <a href="mailto:support@ticketspanda.tech" className="text-brand-600 font-semibold underline">
                  support@ticketspanda.tech
                </a>{' '}
                with your transaction reference.
              </p>
            </div>
          </div>
        )}

        {/* Authenticated Tickets View */}
        {stage === 'tickets' && (
          <div>
            {/* User Profile Bar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700 font-black">
                  {customer?.name?.charAt(0) || customer?.email?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {customer?.name || 'Attendee Account'}
                  </p>
                  <p className="text-xs text-slate-500">{customer?.email || identifier}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={signOut} leftIcon={LogOut}>
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Filter and Tab Controls */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <Tabs
                tabs={[
                  { id: 'upcoming', label: 'Upcoming Tickets', count: upcomingCount },
                  { id: 'past', label: 'Past & Used', count: pastCount },
                  { id: 'all', label: 'All Passes', count: tickets.length },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
                variant="pills"
              />

              <div className="w-full sm:w-64">
                <Input
                  icon={Search}
                  placeholder="Search by event or code…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="sm"
                />
              </div>
            </div>

            {/* Tickets Grid or Loading / Empty States */}
            {loadingTickets ? (
              <PageLoader label="Fetching your ticket passes…" />
            ) : filteredTickets.length === 0 ? (
              <EmptyState
                title={tickets.length === 0 ? 'No tickets in this account yet' : 'No matching tickets found'}
                description={
                  tickets.length === 0
                    ? 'When you register for college festivals or events, your confirmed tickets will show up here.'
                    : 'Try changing your search filter or switching tabs.'
                }
                actionLabel={tickets.length === 0 ? 'Explore Events' : undefined}
                onAction={tickets.length === 0 ? () => (window.location.href = '/events') : undefined}
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredTickets.map((t) => (
                  <TicketCard
                    key={t.id}
                    ticket={t}
                    event={t.event}
                    activity={t.activity}
                    customer={customer}
                    orderRef={t.bookingRef}
                    onDownloadPdf={
                      t.bookingRef
                        ? () => window.open(`${baseURL}/booking/confirmation/${t.bookingRef}/pdf`, '_blank')
                        : undefined
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
