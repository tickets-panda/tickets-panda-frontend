import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import Card from '../shared/components/Card.jsx';
import Stat from '../shared/components/Stat.jsx';
import Table, { Td } from '../shared/components/Table.jsx';
import { Select } from '../shared/components/Input.jsx';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import { formatTime } from '../shared/utils/format.js';

export default function GateStatsPage() {
  const [eventId, setEventId] = useState('');

  const { data: events } = useQuery({
    queryKey: ['tenant-events', 'gate-stats'],
    queryFn: async () => (await api.get('/tenant/events', { params: { limit: 50, status: 'LIVE' } })).data.data.rows,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['gate-stats', eventId],
    queryFn: async () => (await api.get(`/staff/event/${eventId}/gate-stats`)).data.data,
    enabled: Boolean(eventId),
    refetchInterval: 30_000, // Live updates via polling (30s)
  });

  return (
    <div>
      <PageHeader title="Gate stats" description="Live check-in progress, refreshed every 30 seconds." />

      <Card className="mb-5">
        <Select label="Event" value={eventId} onChange={(e) => setEventId(e.target.value)}>
          <option value="">Select a live event…</option>
          {(events || []).map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </Select>
      </Card>

      {!eventId ? (
        <EmptyState title="Pick an event" description="Choose a live event to see its gate activity." />
      ) : isLoading ? (
        <PageLoader label="Loading gate stats…" />
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-4">
            <Stat label="Total tickets" value={data.totalTickets} />
            <Stat label="Checked in" value={data.checkedIn} tone="green" />
            <Stat label="Remaining" value={data.remaining} tone="amber" />
            <Stat label="Entered" value={`${data.percentEntered}%`} tone="purple" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card title="By ticket type" bodyClassName="p-0">
              <Table columns={['Type', 'Issued', 'Entered']}>
                {data.byTicketType.map((type) => (
                  <tr key={type.name}>
                    <Td className="font-medium text-zinc-800">{type.name}</Td>
                    <Td>{type.total}</Td>
                    <Td>{type.checkedIn}</Td>
                  </tr>
                ))}
              </Table>
            </Card>

            <Card title="Recent check-ins" bodyClassName="p-0">
              {data.recentCheckins.length ? (
                <Table columns={['Name', 'Ticket', 'Gate', 'Time']}>
                  {data.recentCheckins.map((entry) => (
                    <tr key={`${entry.ticketKey}-${entry.time}`}>
                      <Td className="font-medium text-zinc-800">{entry.name}</Td>
                      <Td className="font-mono text-xs text-zinc-500">{entry.ticketKey}</Td>
                      <Td className="text-xs text-zinc-500">{entry.gate || '—'}</Td>
                      <Td className="text-xs text-zinc-500">{formatTime(entry.time)}</Td>
                    </tr>
                  ))}
                </Table>
              ) : (
                <div className="p-5">
                  <EmptyState title="No check-ins yet" description="Scanned tickets will appear here." />
                </div>
              )}
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
