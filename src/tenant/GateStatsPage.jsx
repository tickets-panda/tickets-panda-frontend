import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ScanLine, Ticket, Clock, CheckCircle2, Radio, Activity, Trophy } from 'lucide-react';
import api from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import { RevealGroup } from '../shared/components/Reveal.jsx';
import Card from '../shared/components/Card.jsx';
import Stat from '../shared/components/Stat.jsx';
import Table, { Td } from '../shared/components/Table.jsx';
import { Select } from '../shared/components/Input.jsx';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import { formatDateTime, formatTime } from '../shared/utils/format.js';

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
    refetchInterval: 30_000,
  });

  const { data: staffStats } = useQuery({
    queryKey: ['gate-staff-stats'],
    queryFn: async () => (await api.get('/tenant/staff-stats')).data.data,
  });

  return (
    <RevealGroup className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader
          title="Gate Check-In Telemetry"
          description="Real-time admissions monitoring, crowd flow, and gate throughput."
        />
        {eventId && (
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Live Telemetry Active</span>
          </div>
        )}
      </div>

      <Card className="p-4 shadow-sm">
        <Select
          label="Select Live Event to Monitor"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        >
          <option value="">Select a live festival or event…</option>
          {(events || []).map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </Select>
      </Card>

      {!eventId ? (
        <EmptyState
          title="No event selected"
          description="Select an active festival above to inspect gate admission telemetry."
        />
      ) : isLoading ? (
        <PageLoader label="Connecting to gate sensor telemetry…" />
      ) : data ? (
        <>
          {/* Progress Bar Header */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Check-in Rate</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">
                  {data.percentEntered}% Admitted
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {data.checkedIn} of {data.totalTickets} tickets
              </span>
            </div>
            <div className="mt-3 h-3.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${Math.min(data.percentEntered, 100)}%` }}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <Stat label="Total Tickets Issued" value={data.totalTickets} icon={Ticket} />
            <Stat label="Checked In" value={data.checkedIn} tone="green" icon={CheckCircle2} />
            <Stat label="Remaining Outside" value={data.remaining} tone="amber" icon={Clock} />
            <Stat label="Admittance %" value={`${data.percentEntered}%`} tone="purple" icon={Activity} />
          </div>

          {staffStats?.staff?.length > 0 && (
            <Card title="Top Gate Staff" subtitle="Admissions by scanner this festival">
              <div className="grid gap-3 sm:grid-cols-2">
                {staffStats.staff.slice(0, 4).map((m, i) => (
                  <div key={m.userId} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex items-center gap-2.5">
                      {i === 0 && <Trophy className="h-4 w-4 text-amber-500" />}
                      <div>
                        <p className="text-xs font-black text-slate-900">{m.name || m.email}</p>
                        <p className="text-[11px] text-slate-500">{m.role?.replace(/_/g, ' ')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-emerald-700">{m.admitted} admitted</p>
                      <p className="text-[11px] text-slate-400">{m.scans} total · {m.failed} failed</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Breakdown by Tier */}
            <Card title="Admissions by Ticket Tier" bodyClassName="p-0">
              <Table columns={['Ticket Tier', 'Issued', 'Admitted', 'Progress']}>
                {data.byTicketType.map((type) => {
                  const pct = type.total > 0 ? Math.round((type.checkedIn / type.total) * 100) : 0;
                  return (
                    <tr key={type.name} className="hover:bg-slate-50/80">
                      <Td className="font-bold text-xs text-slate-900">{type.name}</Td>
                      <Td className="text-xs text-slate-600">{type.total}</Td>
                      <Td className="text-xs font-bold text-emerald-700">{type.checkedIn}</Td>
                      <Td className="w-32">
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-slate-500">{pct}%</span>
                        </div>
                      </Td>
                    </tr>
                  );
                })}
              </Table>
            </Card>

            {/* Live Gate Feed */}
            <Card title="Recent Gate Check-Ins" subtitle="Last scanned entry passes" bodyClassName="p-0">
              {data.recentCheckins.length ? (
                <Table columns={['Attendee', 'Ticket Key', 'Gate', 'Time']}>
                  {data.recentCheckins.map((entry) => (
                    <tr key={`${entry.ticketKey}-${entry.time}`} className="hover:bg-slate-50/80">
                      <Td className="font-bold text-xs text-slate-900">{entry.name}</Td>
                      <Td className="font-mono text-[11px] text-slate-500">{entry.ticketKey}</Td>
                      <Td className="text-xs font-medium text-slate-700">{entry.gate || 'Main Gate'}</Td>
                      <Td className="text-xs text-slate-500 font-mono">{formatTime(entry.time)}</Td>
                    </tr>
                  ))}
                </Table>
              ) : (
                <div className="p-8 text-center">
                  <EmptyState title="No check-ins yet" description="Scanned passes will appear here in real time." />
                </div>
              )}
            </Card>
          </div>
        </>
      ) : null}
    </RevealGroup>
  );
}
