import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Ticket as TicketIcon,
  User,
  ArrowLeft,
} from 'lucide-react';
import api, { apiErrorMessage } from '../shared/api/client.js';
import { PageLoader } from '../shared/components/Feedback.jsx';
import Card from '../shared/components/Card.jsx';
import { StatusBadge } from '../shared/components/Badge.jsx';
import { formatDate, formatDateTime, formatTime } from '../shared/utils/format.js';

export default function VerifyTicketPage() {
  const { token } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['verify-token', token],
    queryFn: async () => (await api.get(`/public/verify/${token}`)).data.data,
    retry: false,
  });

  if (isLoading) return <PageLoader label="Verifying ticket authenticity with secure ledger…" />;

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-card border border-red-200">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <XCircle className="h-10 w-10" />
          </div>
          <h1 className="mt-5 text-xl font-black text-slate-900">Ticket Not Recognized</h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            {apiErrorMessage(error) || 'This ticket key could not be verified in the active registry.'}
          </p>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs text-slate-500 border border-slate-200">
            <p className="font-semibold text-slate-700">Possible reasons:</p>
            <p className="mt-1">The ticket link has expired, was cancelled by the organizer, or the code was mistyped.</p>
          </div>
          <Link
            to="/my-tickets"
            className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4" /> Check Your Active Tickets
          </Link>
        </div>
      </div>
    );
  }

  const valid = data.status === 'ACTIVE';
  const isUsed = data.status === 'USED';

  return (
    <div className="min-h-screen bg-slate-50/70 py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-lg">
        {/* Verification Status Badge */}
        <div
          className={`rounded-3xl p-6 text-center shadow-lg border ${
            valid
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : isUsed
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-red-50 border-red-300 text-red-950'
          }`}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
            {valid ? (
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            ) : isUsed ? (
              <AlertTriangle className="h-10 w-10 text-amber-600" />
            ) : (
              <XCircle className="h-10 w-10 text-red-600" />
            )}
          </div>

          <span
            className={`mt-4 inline-block text-[11px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full ${
              valid
                ? 'bg-emerald-200/80 text-emerald-800'
                : isUsed
                ? 'bg-amber-200/80 text-amber-800'
                : 'bg-red-200/80 text-red-800'
            }`}
          >
            Official Gate Verification
          </span>

          <h1 className="mt-2 text-2xl font-black tracking-tight">
            {valid ? 'Valid Ticket — Admitted' : isUsed ? 'Ticket Already Used' : 'Invalid for Entry'}
          </h1>
          <p className="mt-1 text-xs opacity-80">
            {valid
              ? 'This pass is active and verified by the host organization.'
              : isUsed
              ? 'This pass has already been scanned and checked in at the gate.'
              : 'This pass is cancelled or suspended.'}
          </p>
        </div>

        {/* Detailed Metadata Card */}
        <div className="mt-6 rounded-3xl bg-white p-6 shadow-card border border-slate-200/90">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Event</p>
              <h2 className="text-base font-black text-slate-900">{data.event?.title}</h2>
            </div>
            <StatusBadge status={data.status} size="sm" />
          </div>

          <dl className="mt-4 space-y-3.5 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Ticket Key</dt>
              <dd className="font-mono font-bold text-slate-900">{data.ticketKey}</dd>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Ticket Holder</dt>
              <dd className="font-bold text-slate-900">{data.holder || 'Attendee'}</dd>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Admission Tier</dt>
              <dd className="font-semibold text-brand-600">{data.ticketType?.name || 'General Admission'}</dd>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Event Date</dt>
              <dd className="font-medium text-slate-800">
                {formatDate(data.event?.eventDate)} · {formatTime(data.event?.eventTimeStart)}
              </dd>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <dt className="text-slate-500 font-medium">Venue</dt>
              <dd className="font-medium text-slate-800">{data.event?.venueName || 'Main Campus'}</dd>
            </div>

            {data.checkedInAt && (
              <div className="flex justify-between items-center py-1 bg-amber-50/70 -mx-2 px-2 rounded-lg text-amber-900">
                <dt className="font-medium">Checked In At</dt>
                <dd className="font-bold font-mono">{formatDateTime(data.checkedInAt)}</dd>
              </div>
            )}
          </dl>

          <div className="mt-6 rounded-2xl bg-slate-50 p-3.5 text-center text-[11px] text-slate-500 border border-slate-100">
            <div className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Cryptographically Secured by Ticket Panda</span>
            </div>
            <p className="mt-0.5">Scanned for security validation at physical checkpoint.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
