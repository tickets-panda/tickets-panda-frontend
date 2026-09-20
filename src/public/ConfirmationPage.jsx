import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  Clock,
  Download,
  MapPin,
  Calendar,
  Sparkles,
  Printer,
  Ticket as TicketIcon,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Share2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api, { baseURL, apiErrorMessage } from '../shared/api/client.js';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import Card from '../shared/components/Card.jsx';
import Button from '../shared/components/Button.jsx';
import { StatusBadge } from '../shared/components/Badge.jsx';
import TicketCard from '../shared/components/TicketCard.jsx';
import { RevealGroup } from '../shared/components/Reveal.jsx';
import { formatCurrency, formatDate, formatTime } from '../shared/utils/format.js';

export default function ConfirmationPage() {
  const { orderRef } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['confirmation', orderRef],
    queryFn: async () => (await api.get(`/booking/confirmation/${orderRef}`)).data.data,
  });

  if (isLoading) return <PageLoader label="Retrieving your booking confirmation…" />;
  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="Booking not found"
          description={apiErrorMessage(error)}
          actionLabel="Go to My Tickets"
          onAction={() => (window.location.href = '/my-tickets')}
        />
      </div>
    );
  }

  const { status, event, customer, tickets = [], amount, currency, quantity, ticketType, activity } = data;
  const paid = status === 'PAID';
  const pdfDownloadUrl = `${baseURL}/booking/confirmation/${orderRef}/pdf`;

  const copyShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Confirmation link copied to clipboard!');
    }
  };

  // Google Calendar link generator
  const getGoogleCalendarUrl = () => {
    if (!event) return '#';
    const title = encodeURIComponent(event.title || 'Ticket Panda Event');
    const details = encodeURIComponent(
      `Registration Confirmed! Order Ref: ${orderRef}. View tickets at: ${window.location.href}`
    );
    const location = encodeURIComponent(event.venueName || '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-6">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Top Success Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-brand-950 p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1 text-xs font-bold text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>{paid ? 'Payment Confirmed & Verified' : `Status: ${status}`}</span>
              </div>
              <span className="font-mono text-xs text-slate-400 tracking-wider">
                REF: <span className="font-bold text-white">{orderRef}</span>
              </span>
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-white">
              {paid ? "You're all set! See you at the event 🎉" : 'Booking Pending Confirmation'}
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
              We've registered your ticket passes under{' '}
              <strong className="text-white">{customer?.name}</strong>. A confirmation copy and QR
              e-tickets have been dispatched to{' '}
              <strong className="text-brand-300 underline underline-offset-2">{customer?.email}</strong>.
            </p>

            {/* Quick Action Toolbar */}
            <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
              {paid && (
                <a
                  href={pdfDownloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <Download className="h-4 w-4" /> Download Official PDF Ticket
                </a>
              )}
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition-all"
              >
                <Printer className="h-4 w-4" /> Print / Save
              </button>
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition-all"
              >
                <Calendar className="h-4 w-4" /> Add to Calendar
              </a>
              <button
                onClick={copyShareLink}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition-all"
              >
                <Share2 className="h-4 w-4" /> Share Link
              </button>
            </div>
          </div>
        </div>

        {/* Order Details & Event Overview Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            {/* Event Summary Card */}
            <Card className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Event Pass</span>
                  <h2 className="text-lg font-black text-slate-900 mt-0.5">{event?.title}</h2>
                </div>
                <StatusBadge status={status} />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <Calendar className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800">Date & Time</p>
                    <p>{formatDate(event?.eventDate)}</p>
                    <p className="text-slate-500">{formatTime(event?.eventTimeStart)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800">Venue</p>
                    <p className="font-medium text-slate-700">{event?.venueName}</p>
                    {event?.venueAddress && <p className="text-slate-500 text-[11px]">{event.venueAddress}</p>}
                  </div>
                </div>
              </div>

              {activity && (
                <div className="mt-3 rounded-xl border border-orange-100 bg-orange-50/70 px-3.5 py-2.5 text-xs text-brand-800 flex items-center justify-between">
                  <span className="font-medium">Registered Activity: <strong className="font-bold">{activity.title}</strong></span>
                  <span className="font-mono text-[11px] text-brand-600 uppercase">Competition Entry</span>
                </div>
              )}
            </Card>

            {/* Generated E-Tickets Section */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TicketIcon className="h-5 w-5 text-brand-600" />
                  <h2 className="text-base font-black text-slate-900">
                    Your Digital Entry Pass{tickets.length > 1 ? 'es' : ''} ({tickets.length})
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-medium">Show at the gate for fast entry</span>
              </div>

              {tickets.length > 0 ? (
                <RevealGroup className="grid gap-6 sm:grid-cols-2">
                  {tickets.map((t) => (
                    <TicketCard
                      key={t.id}
                      ticket={t}
                      event={event}
                      activity={activity}
                      customer={customer}
                      orderRef={orderRef}
                      onDownloadPdf={() => window.open(pdfDownloadUrl, '_blank')}
                      showActions={true}
                    />
                  ))}
                </RevealGroup>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                  <Clock className="mx-auto h-10 w-10 text-amber-500 animate-spin" />
                  <h3 className="mt-3 text-sm font-bold text-slate-900">Tickets are being issued...</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Your payment was recorded. The server is finalizing QR code cryptographic signatures.
                    Refresh this page in a few seconds.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => window.location.reload()}
                  >
                    Refresh Status
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Breakdown & Entry Instructions */}
          <div className="space-y-6">
            {/* Receipt / Payment Summary */}
            <Card className="p-5">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
                Payment Summary
              </h3>

              <div className="mt-3 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Ticket Tier</span>
                  <span className="font-bold text-slate-900">{ticketType?.name || 'General Admission'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity</span>
                  <span className="font-bold text-slate-900">{quantity} ticket{quantity > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Channel</span>
                  <span className="font-medium text-slate-700">Online Checkout (Local Sandbox)</span>
                </div>
                <div className="flex justify-between">
                  <span>Reference ID</span>
                  <span className="font-mono text-[11px] text-slate-500">{orderRef}</span>
                </div>

                <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between items-center text-sm font-black text-slate-950">
                  <span>Total Amount Paid</span>
                  <span className="text-brand-600 text-base">{formatCurrency(amount, currency)}</span>
                </div>
              </div>
            </Card>

            {/* Entry Day Instructions */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Gate Entry Guidelines</span>
              </div>
              <ul className="mt-3 space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-brand-500 font-bold">•</span>
                  <span>Turn your phone screen brightness up to maximum when presenting the QR code.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-500 font-bold">•</span>
                  <span>Keep a valid College ID or Government Photo ID handy at the entrance gate.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-500 font-bold">•</span>
                  <span>Each QR code allows entry strictly once. Do not share your QR code screenshot with others.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-500 font-bold">•</span>
                  <span>Offline copy: You can save this page or download the official PDF ticket.</span>
                </li>
              </ul>
            </div>

            {/* My Tickets Portal Callout */}
            <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-orange-50/50 border border-brand-200/80 p-5">
              <p className="text-xs font-bold text-brand-900">Need your tickets later?</p>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                You can access all tickets you've ever booked anytime from the attendee portal using just your email.
              </p>
              <Link
                to="/my-tickets"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
              >
                <span>Go to My Tickets</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
