import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, XCircle } from 'lucide-react';
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

  if (isLoading) return <PageLoader label="Checking ticket…" />;

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <XCircle className="mx-auto h-12 w-12 text-red-500" />
        <h1 className="mt-4 text-lg font-bold text-zinc-900">Ticket not recognised</h1>
        <p className="mt-1 text-sm text-zinc-600">{apiErrorMessage(error)}</p>
      </div>
    );
  }

  const valid = data.status === 'ACTIVE';

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className={`text-center ${valid ? 'text-emerald-600' : 'text-amber-600'}`}>
        {valid ? <CheckCircle2 className="mx-auto h-12 w-12" /> : <XCircle className="mx-auto h-12 w-12" />}
        <h1 className="mt-4 text-lg font-bold text-zinc-900">
          {valid ? 'Valid ticket' : data.status === 'USED' ? 'Already used' : 'Not valid for entry'}
        </h1>
      </div>

      <Card className="mt-6" title={data.event?.title}>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-500">Ticket key</dt>
            <dd className="font-mono font-semibold text-zinc-800">{data.ticketKey}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Holder</dt>
            <dd className="font-medium text-zinc-800">{data.holder || '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Type</dt>
            <dd className="font-medium text-zinc-800">{data.ticketType?.name || '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Date</dt>
            <dd className="font-medium text-zinc-800">
              {formatDate(data.event?.eventDate)} · {formatTime(data.event?.eventTimeStart)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Status</dt>
            <dd>
              <StatusBadge status={data.status} />
            </dd>
          </div>
          {data.checkedInAt && (
            <div className="flex justify-between">
              <dt className="text-zinc-500">Checked in</dt>
              <dd className="font-medium text-zinc-800">{formatDateTime(data.checkedInAt)}</dd>
            </div>
          )}
        </dl>
      </Card>

      <p className="mt-4 text-center text-xs text-zinc-500">
        This page only displays a ticket summary. Check-in happens in the organizer's scanner.
      </p>
    </div>
  );
}
