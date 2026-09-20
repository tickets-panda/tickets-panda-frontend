import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Mail, KeyRound, LogOut } from 'lucide-react';
import api, { apiErrorMessage } from '../shared/api/client.js';
import { useCustomerStore } from '../shared/store/auth.js';
import Button from '../shared/components/Button.jsx';
import Input from '../shared/components/Input.jsx';
import Card from '../shared/components/Card.jsx';
import { EmptyState, PageLoader } from '../shared/components/Feedback.jsx';
import { StatusBadge } from '../shared/components/Badge.jsx';
import { formatDate, formatTime } from '../shared/utils/format.js';

export default function MyTicketsPage() {
  const { customer, accessToken, setAuth, clearAuth } = useCustomerStore();
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState(() => (accessToken && customer ? 'tickets' : 'identifier'));
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  // Load the customer's tickets whenever we reach the tickets stage.
  useEffect(() => {
    if (stage !== 'tickets' || !accessToken) return undefined;
    let cancelled = false;
    setLoadingTickets(true);

    api
      .get('/customer/my-tickets', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => {
        if (!cancelled) setTickets(response.data.data.tickets);
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
      toast.success('If we recognise that email, a code is on its way');
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  const verifyOtp = useMutation({
    mutationFn: async () => (await api.post('/customer/otp/verify', { identifier, type: 'EMAIL', otp })).data.data,
    onSuccess: (data) => {
      setAuth(data.customer, data.accessToken);
      setStage('tickets');
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  const signOut = () => {
    clearAuth();
    setTickets([]);
    setOtp('');
    setStage('identifier');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-xl font-bold text-zinc-900">My Tickets</h1>
      <p className="mt-1 text-sm text-zinc-500">Access your tickets with a one-time code. No password needed.</p>

      {stage !== 'tickets' && (
        <Card className="mt-6 max-w-md">
          {stage === 'identifier' ? (
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                sendOtp.mutate();
              }}
            >
              <Input
                label="Email address"
                type="email"
                required
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="you@example.com"
                hint="Use the email you booked with."
              />
              <Button type="submit" loading={sendOtp.isPending} className="w-full">
                <Mail className="h-4 w-4" /> Send my code
              </Button>
            </form>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                verifyOtp.mutate();
              }}
            >
              <Input
                label="One-time code"
                inputMode="numeric"
                required
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                hint={`Sent to ${identifier}.`}
              />
              <Button type="submit" loading={verifyOtp.isPending} className="w-full">
                <KeyRound className="h-4 w-4" /> Verify
              </Button>
              <button
                type="button"
                onClick={() => setStage('identifier')}
                className="w-full text-center text-xs font-medium text-zinc-500 hover:text-zinc-700"
              >
                Use a different email
              </button>
            </form>
          )}
        </Card>
      )}

      {stage === 'tickets' && (
        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-zinc-600">
              Signed in as <strong>{customer?.email || identifier}</strong>
            </p>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>

          {loadingTickets ? (
            <PageLoader label="Loading your tickets…" />
          ) : tickets.length === 0 ? (
            <EmptyState title="No tickets yet" description="Tickets appear here once a booking is confirmed." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="card overflow-hidden">
                  <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-2">
                    <span className="font-mono text-sm font-semibold text-zinc-800">{ticket.ticketKey}</span>
                    <StatusBadge status={ticket.status} />
                  </div>
                  <div className="flex gap-4 p-4">
                    {ticket.qrData ? (
                      <img src={ticket.qrData} alt={`QR for ${ticket.ticketKey}`} className="h-28 w-28 shrink-0" />
                    ) : (
                      <div className="grid h-28 w-28 shrink-0 place-items-center bg-zinc-100 text-xs text-zinc-400">No QR</div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-zinc-900">{ticket.event?.title}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {formatDate(ticket.event?.eventDate)} · {formatTime(ticket.event?.eventTimeStart)}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-zinc-500">{ticket.event?.venueName}</p>
                      <p className="mt-2 text-xs font-medium text-zinc-600">{ticket.ticketType?.name}</p>
                      {ticket.checkedInAt && <p className="mt-1 text-xs font-medium text-blue-600">Checked in</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
