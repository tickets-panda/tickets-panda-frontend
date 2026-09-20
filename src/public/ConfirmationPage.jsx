import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Clock, Download, MapPin } from 'lucide-react';
import api, { apiErrorMessage } from '../shared/api/client.js';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import Card from '../shared/components/Card.jsx';
import { StatusBadge } from '../shared/components/Badge.jsx';
import { formatCurrency, formatDate, formatTime } from '../shared/utils/format.js';

export default function ConfirmationPage() {
  const { orderRef } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['confirmation', orderRef],
    queryFn: async () => (await api.get(`/booking/confirmation/${orderRef}`)).data.data,
  });

  if (isLoading) return <PageLoader label="Fetching your booking…" />;
  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="Booking not found" description={apiErrorMessage(error)} />
      </div>
    );
  }

  const { status, event, customer, tickets, amount, currency, quantity } = data;
  const paid = status === 'PAID';

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className={`card p-6 ${paid ? 'border-emerald-200 bg-emerald-50' : ''}`}>
        <div className="flex items-start gap-3">
          {paid ? <CheckCircle2 className="h-7 w-7 text-emerald-600" /> : <Clock className="h-7 w-7 text-amber-600" />}
          <div>
            <h1 className="text-lg font-bold text-zinc-900">
              {paid ? 'Payment verified — you are going! 🎉' : `Booking status: ${status}`}
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Booked as <strong>{customer?.name}</strong> · Order <span className="font-mono">{orderRef}</span>
            </p>
          </div>
        </div>
      </div>

      <Card className="mt-5" title="Event">
        <p className="font-semibold text-zinc-900">{event?.title}</p>
        <div className="mt-2 space-y-1 text-sm text-zinc-600">
          <p>{formatDate(event?.eventDate)} · {formatTime(event?.eventTimeStart)}</p>
          <p className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-zinc-400" /> {event?.venueName}
          </p>
          <p className="pt-1">
            {quantity} × {data.ticketType?.name} — <strong>{formatCurrency(amount, currency)}</strong>
          </p>
        </div>
      </Card>

      <h2 className="mb-3 mt-6 text-sm font-semibold text-zinc-900">
        Your ticket{tickets.length === 1 ? '' : 's'} ({tickets.length})
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-2">
              <span className="font-mono text-sm font-semibold text-zinc-800">{ticket.ticketKey}</span>
              <StatusBadge status={ticket.status} />
            </div>
            <div className="grid place-items-center p-4">
              {ticket.qrData ? (
                <img src={ticket.qrData} alt={`QR for ${ticket.ticketKey}`} className="h-40 w-40" />
              ) : (
                <div className="grid h-40 w-40 place-items-center bg-zinc-100 text-xs text-zinc-400">QR unavailable</div>
              )}
              <p className="mt-2 text-center text-xs text-zinc-500">Show this at the gate</p>
            </div>
          </div>
        ))}
      </div>

      {tickets.length === 0 && (
        <EmptyState
          title="Tickets are being generated"
          description="Refresh this page in a moment — your tickets will appear here once the payment is confirmed."
        />
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {paid && (
          <a
            href={`http://localhost:5000/api/v1/booking/confirmation/${orderRef}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 shadow-sm"
          >
            <Download className="h-4 w-4" /> Download Official PDF Ticket
          </a>
        )}
        <Link
          to="/my-tickets"
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Access from My Tickets
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Print / save
        </button>
      </div>
    </div>
  );
}
