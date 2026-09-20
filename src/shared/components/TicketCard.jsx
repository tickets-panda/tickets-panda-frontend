import { Download, Calendar, MapPin, CheckCircle2, QrCode, Clock, Share2 } from 'lucide-react';
import { StatusBadge } from './Badge.jsx';
import { formatDate, formatTime } from '../utils/format.js';
import Button from './Button.jsx';

export default function TicketCard({
  ticket,
  event,
  activity,
  customer,
  orderRef,
  onDownloadPdf,
  showActions = true,
  className = '',
}) {
  const isUsed = ticket.status === 'USED';
  const isActive = ticket.status === 'ACTIVE';

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-white border border-zinc-200/90 shadow-ticket transition-all ${className}`}
    >
      {/* Top Header Strip */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 px-6 py-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐼</span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-400">
              Verified E-Ticket
            </p>
            <p className="text-xs font-bold tracking-tight text-zinc-200">
              {event?.tenantName || 'Ticket Panda Event'}
            </p>
          </div>
        </div>
        <StatusBadge status={ticket.status} size="xs" />
      </div>

      {/* Main Ticket Details Body */}
      <div className="p-6">
        <div className="space-y-1">
          <h3 className="text-xl font-black tracking-tight text-zinc-950">
            {event?.title || 'Event Admission'}
          </h3>
          {activity?.title && (
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 border border-orange-200/80 px-2.5 py-1 text-xs font-bold text-brand-700">
              <span>Activity:</span> {activity.title}
            </div>
          )}
        </div>

        {/* Schedule & Venue Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3 border-y border-dashed border-zinc-200 py-3.5 text-xs text-zinc-600">
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-zinc-900">{formatDate(event?.eventDate)}</p>
              <p className="text-zinc-500">{formatTime(event?.eventTimeStart)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-zinc-900 truncate">{event?.venueName || 'Venue TBD'}</p>
              {event?.venueAddress && (
                <p className="text-zinc-500 truncate">{event.venueAddress}</p>
              )}
            </div>
          </div>
        </div>

        {/* Attendee Info */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Attendee</p>
            <p className="text-sm font-bold text-zinc-900">{customer?.name || ticket.holder || 'Ticket Holder'}</p>
            {customer?.email && (
              <p className="text-xs text-zinc-500 truncate">{customer.email}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Tier / Type</p>
            <p className="text-sm font-bold text-brand-600">{ticket.ticketTypeName || ticket.ticketType?.name || 'General Admission'}</p>
            {orderRef && <p className="text-[11px] font-mono text-zinc-400">{orderRef}</p>}
          </div>
        </div>

        {/* Perforation Divider Notches */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute -left-10 h-6 w-6 rounded-full bg-zinc-50 border-r border-zinc-200/90" />
          <div className="w-full border-t-2 border-dashed border-zinc-200" />
          <div className="absolute -right-10 h-6 w-6 rounded-full bg-zinc-50 border-l border-zinc-200/90" />
        </div>

        {/* QR Section */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative rounded-2xl border-2 border-zinc-900 p-2.5 bg-white shadow-md">
            {ticket.qrData ? (
              <img
                src={ticket.qrData}
                alt={`QR code for ticket ${ticket.ticketKey}`}
                className="h-44 w-44 object-contain rounded-lg"
              />
            ) : (
              <div className="grid h-44 w-44 place-items-center bg-zinc-100 rounded-lg text-zinc-400">
                <QrCode className="h-16 w-16" />
              </div>
            )}
            {isUsed && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-[2px] rounded-xl">
                <div className="rounded-xl bg-zinc-900 px-4 py-2 text-center text-white shadow-lg">
                  <p className="text-xs font-black uppercase tracking-wider text-amber-400">Already Used</p>
                  <p className="text-[10px] text-zinc-300">Entry recorded at gate</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3">
            <p className="font-mono text-sm font-black tracking-widest text-zinc-900">
              {ticket.ticketKey}
            </p>
            <p className="mt-1 text-[11px] text-zinc-500">
              Present this QR code at the event gate for entry scanning.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="border-t border-zinc-100 bg-zinc-50/80 px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Secured by Ticket Panda</span>
          </div>
          {onDownloadPdf && (
            <Button
              size="sm"
              variant="dark"
              leftIcon={Download}
              onClick={onDownloadPdf}
            >
              Download PDF
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
