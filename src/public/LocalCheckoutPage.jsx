import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import api, { apiErrorMessage } from '../shared/api/client.js';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import Card from '../shared/components/Card.jsx';
import Button from '../shared/components/Button.jsx';
import { formatCurrency, formatDate, formatTime } from '../shared/utils/format.js';

export default function LocalCheckoutPage() {
  const { orderRef } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedMethod, setSelectedMethod] = useState('UPI');
  const [customFailureReason, setCustomFailureReason] = useState('Payment simulated as failed by user in local test mode');
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['local-checkout', orderRef],
    queryFn: async () => (await api.get(`/booking/checkout/${orderRef}`)).data.data,
    refetchInterval: false,
  });

  if (isLoading) return <PageLoader label="Loading simulated checkout…" />;
  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState title="Checkout unavailable" description={apiErrorMessage(error)} />
        <div className="mt-4 text-center">
          <Link to="/" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const {
    orderId,
    amount,
    currency,
    quantity,
    status,
    customer,
    event,
    activity,
    ticketType,
    payment,
    providerOrderId,
  } = data;

  const isPaid = status === 'PAID';
  const isFailed = status === 'FAILED';
  const isPending = status === 'PENDING' || status === 'PAYMENT_PENDING' || status === 'CREATED';

  const handleSimulatePayment = async (simulationState) => {
    setSubmitting(true);
    try {
      const payload = {
        orderRef,
        orderId,
        simulationState,
        method: selectedMethod,
        failureReason: simulationState === 'FAILED' ? customFailureReason : undefined,
      };

      const res = await api.post('/booking/verify-payment', payload);

      if (simulationState === 'SUCCESS') {
        toast.success(res.data.data?.alreadyProcessed ? 'Payment already captured — tickets ready!' : 'Payment simulated successfully! 🎉');
        await queryClient.invalidateQueries(['confirmation', orderRef]);
        navigate(`/booking/${orderRef}`);
      } else if (simulationState === 'PENDING') {
        toast('Payment marked as pending verification', { icon: '⏳' });
        refetch();
      }
    } catch (err) {
      if (simulationState === 'FAILED') {
        toast.error('Simulated payment failure recorded.');
        refetch();
      } else {
        toast.error(apiErrorMessage(err));
        refetch();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetryOrder = async () => {
    setSubmitting(true);
    try {
      await api.post('/booking/retry-payment', { orderRef });
      toast.success('Order refreshed for retry! You can now simulate payment again.');
      refetch();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Dev Mode Banner */}
      <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-amber-200 p-2 text-amber-800">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-600 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                Local Test Mode
              </span>
              <span className="text-xs text-amber-800 font-medium">Provider: LocalTestPaymentProvider</span>
            </div>
            <p className="mt-1 text-sm text-amber-900 font-medium">
              This is a sandbox simulator. No actual charges or external gateway keys are required.
            </p>
            <p className="mt-0.5 text-xs text-amber-700">
              Verify full end-to-end booking, ticket generation, QR codes, and email delivery using the simulation controls below.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-5">
        {/* Left column: Order summary (2 cols) */}
        <div className="space-y-6 md:col-span-2">
          <Card title="Order Summary">
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-zinc-500 font-medium">Event</p>
                <p className="font-semibold text-zinc-900 leading-tight">{event?.title}</p>
                {activity && (
                  <p className="text-xs text-brand-600 font-medium mt-0.5 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> {activity.title}
                  </p>
                )}
              </div>

              <div className="border-t border-zinc-100 pt-2">
                <p className="text-xs text-zinc-500 font-medium">Ticket Type</p>
                <p className="text-zinc-800 font-medium">
                  {quantity} × {ticketType?.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {formatCurrency(ticketType?.price, currency)} per ticket
                </p>
              </div>

              <div className="border-t border-zinc-100 pt-2">
                <p className="text-xs text-zinc-500 font-medium">Total Payable</p>
                <p className="text-xl font-bold text-zinc-900">
                  {formatCurrency(amount, currency)}
                </p>
              </div>

              <div className="border-t border-zinc-100 pt-2 text-xs text-zinc-600 space-y-1">
                <p><span className="text-zinc-400">Order Ref:</span> <span className="font-mono font-semibold">{orderRef}</span></p>
                {providerOrderId && (
                  <p><span className="text-zinc-400">Provider Ref:</span> <span className="font-mono">{providerOrderId}</span></p>
                )}
                <p>
                  <span className="text-zinc-400">Customer:</span> {customer?.name} ({customer?.email})
                </p>
              </div>

              <div className="border-t border-zinc-100 pt-2">
                <p className="text-xs text-zinc-500 font-medium mb-1">Current State</p>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    isPaid
                      ? 'bg-emerald-100 text-emerald-800'
                      : isFailed
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {isPaid && <CheckCircle2 className="h-3.5 w-3.5" />}
                  {isFailed && <XCircle className="h-3.5 w-3.5" />}
                  {isPending && <Clock className="h-3.5 w-3.5" />}
                  {status}
                </span>
              </div>
            </div>
          </Card>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600">
            <p className="font-semibold text-zinc-800 flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Production Safety Guard
            </p>
            <p className="mt-1">
              <code>LocalTestPaymentProvider</code> is strictly rejected when <code>NODE_ENV=production</code>.
            </p>
          </div>
        </div>

        {/* Right column: Simulation actions (3 cols) */}
        <div className="space-y-6 md:col-span-3">
          {/* Status-specific alert if already PAID or FAILED */}
          {isPaid && (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-7 w-7 text-emerald-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-emerald-900">Order Already Confirmed & Paid</h3>
                  <p className="text-xs text-emerald-700 mt-1">
                    Tickets have been generated and sent to {customer?.email}. You can view the confirmation or test idempotent repeat verification.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={`/booking/${orderRef}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700"
                >
                  View Confirmed Tickets <ChevronRight className="h-4 w-4" />
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={submitting}
                  onClick={() => handleSimulatePayment('SUCCESS')}
                >
                  {submitting ? 'Testing…' : 'Test Idempotent Call'}
                </Button>
              </div>
            </div>
          )}

          {isFailed && (
            <div className="rounded-xl border border-rose-300 bg-rose-50 p-5">
              <div className="flex items-start gap-3">
                <XCircle className="h-7 w-7 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-rose-900">Simulated Payment Failed</h3>
                  <p className="text-xs text-rose-700 mt-1">
                    Reason: {payment?.failedReason || 'User simulated failure or bank declined.'}
                  </p>
                  <p className="text-xs text-rose-600 mt-1">
                    The held capacity has been released. Click <strong>Retry Payment</strong> to re-lock the ticket and reattempt payment.
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  onClick={handleRetryOrder}
                  disabled={submitting}
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${submitting ? 'animate-spin' : ''}`} />
                  Retry Payment
                </Button>
              </div>
            </div>
          )}

          {/* Payment Method Selector */}
          <Card title="Simulate Payment Method">
            <p className="text-xs text-zinc-500 mb-3">
              Choose the simulated rail to record in payment metadata:
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { id: 'UPI', label: 'UPI / QR', icon: Smartphone },
                { id: 'CARD', label: 'Card', icon: CreditCard },
                { id: 'NETBANKING', label: 'Netbanking', icon: Building },
                { id: 'WALLET', label: 'Wallet', icon: Sparkles },
              ].map((m) => {
                const Icon = m.icon;
                const active = selectedMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMethod(m.id)}
                    className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border p-3 text-xs font-semibold transition ${
                      active
                        ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                        : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Simulation Action Controls */}
          <Card title="Simulation Controls">
            <p className="text-xs text-zinc-500 mb-4">
              Trigger authoritative backend state transitions to verify system resilience:
            </p>

            <div className="space-y-3">
              {/* Pay Successfully */}
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Simulate Success
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Transitions: <code>PENDING → CAPTURED</code>. Generates tickets, QR codes, sends confirmation email.
                  </p>
                </div>
                <Button
                  onClick={() => handleSimulatePayment('SUCCESS')}
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white whitespace-nowrap shadow-sm"
                >
                  {submitting ? 'Processing…' : 'Pay Successfully'}
                </Button>
              </div>

              {/* Simulate Failed */}
              <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-rose-950 flex items-center gap-1.5">
                      <XCircle className="h-4 w-4 text-rose-600" /> Simulate Failure
                    </h4>
                    <p className="text-xs text-rose-800 mt-0.5">
                      Transitions: <code>PENDING → FAILED</code>. Releases reserved inventory; allows subsequent retry.
                    </p>
                  </div>
                  <Button
                    onClick={() => handleSimulatePayment('FAILED')}
                    disabled={submitting || isPaid}
                    variant="outline"
                    className="border-rose-300 text-rose-700 hover:bg-rose-100 whitespace-nowrap"
                  >
                    Simulate Failure
                  </Button>
                </div>
                <div className="mt-2.5">
                  <input
                    type="text"
                    value={customFailureReason}
                    onChange={(e) => setCustomFailureReason(e.target.value)}
                    placeholder="Custom failure reason"
                    className="w-full rounded border border-rose-200 bg-white px-2.5 py-1 text-xs text-zinc-700 placeholder-zinc-400 focus:border-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Simulate Pending */}
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-amber-600" /> Simulate Pending
                  </h4>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Transitions: <code>PENDING</code>. Simulates asynchronous settlement lag.
                  </p>
                </div>
                <Button
                  onClick={() => handleSimulatePayment('PENDING')}
                  disabled={submitting || isPaid}
                  variant="outline"
                  className="whitespace-nowrap"
                >
                  Simulate Pending
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
