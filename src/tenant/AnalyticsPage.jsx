import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Users, ScanLine, CreditCard, Trophy, Clock } from 'lucide-react';
import api from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import Card from '../shared/components/Card.jsx';
import Stat from '../shared/components/Stat.jsx';
import Table, { Td } from '../shared/components/Table.jsx';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import { RevealGroup } from '../shared/components/Reveal.jsx';
import { formatCurrency } from '../shared/utils/format.js';

function Bars({ data, height = 120, color = '#f97316', formatLabel = (d) => d.day?.slice(5) }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="flex h-32 items-end gap-1.5" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="group relative flex-1" title={`${formatLabel(d)}: ${d.count}`}>
          <div
            className="w-full rounded-t-md transition-all"
            style={{ height: `${Math.max(4, (d.count / max) * height)}px`, background: color }}
          />
          <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
            {d.count}
          </span>
        </div>
      ))}
      {data.length === 0 && <p className="text-xs text-slate-400">No data yet</p>}
    </div>
  );
}

function Funnel({ funnel }) {
  const stages = [
    { label: 'Initiated', value: funnel.initiated, color: '#94a3b8' },
    { label: 'Confirmed', value: funnel.confirmed, color: '#f97316' },
    { label: 'Tickets Issued', value: funnel.ticketsIssued, color: '#0ea5e9' },
    { label: 'Checked In', value: funnel.checkedIn, color: '#10b981' },
  ];
  const max = Math.max(1, funnel.initiated);
  return (
    <div className="space-y-2.5">
      {stages.map((s, i) => {
        const pct = Math.round((s.value / max) * 100);
        const drop = i > 0 ? stages[i - 1].value - s.value : 0;
        return (
          <div key={s.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">{s.label}</span>
              <span className="font-mono font-bold text-slate-900">
                {s.value}
                {drop > 0 && <span className="ml-1.5 font-sans font-medium text-rose-500">−{drop}</span>}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: s.color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['tenant-analytics'],
    queryFn: async () => (await api.get('/tenant/analytics')).data.data,
  });
  const { data: stats } = useQuery({
    queryKey: ['tenant-dashboard-stats'],
    queryFn: async () => (await api.get('/tenant/dashboard/stats')).data.data,
  });

  if (isLoading) return <PageLoader label="Crunching event analytics…" />;
  if (!data) return <EmptyState title="No analytics yet" description="Data appears here once tickets start selling." />;

  const funnel = data.funnel || { initiated: 0, confirmed: 0, ticketsIssued: 0, checkedIn: 0 };
  const conversion = funnel.initiated ? Math.round((funnel.confirmed / funnel.initiated) * 100) : 0;
  const checkinRate = funnel.ticketsIssued ? Math.round((funnel.checkedIn / funnel.ticketsIssued) * 100) : 0;
  const revenue = (data.revenueByEvent || []).reduce((s, e) => s + Number(e.revenue || 0), 0);
  const topActivities = data.topActivities || [];
  const tiers = data.ticketTypeBreakdown || [];
  const hourPeak = (data.admissionsByHour || []).reduce(
    (best, h) => (h.count > (best?.count || -1) ? h : best),
    null,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Event Analytics"
        description="Bookings funnel, gate flow, top competitions and revenue — everything organizers need to grow the next edition."
      />

      <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total Revenue" value={formatCurrency(revenue)} icon={TrendingUp} tone="green" hint="Captured payments" />
        <Stat label="Booking Conversion" value={`${conversion}%`} icon={Users} tone="orange" hint={`${funnel.confirmed}/${funnel.initiated} confirmed`} />
        <Stat label="Gate Check-in Rate" value={`${checkinRate}%`} icon={ScanLine} tone="blue" hint={`${funnel.checkedIn}/${funnel.ticketsIssued} entered`} />
        <Stat label="Payment Success" value={`${data.paymentSuccessRate || 0}%`} icon={CreditCard} tone="purple" hint={`${data.avgTicketsPerOrder || 0} tickets / order`} />
      </RevealGroup>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Bookings Funnel" subtitle="Initiated → confirmed → issued → checked in">
          <Funnel funnel={funnel} />
        </Card>
        <Card
          title="Revenue by Event"
          subtitle={hourPeak ? `Peak gate hour: ${hourPeak.hour}:00 (${hourPeak.count} entries)` : 'Revenue ranking'}
        >
          <div className="space-y-3">
            {(data.revenueByEvent || []).length === 0 && (
              <p className="text-xs text-slate-400">No captured revenue yet.</p>
            )}
            {(data.revenueByEvent || []).map((e) => (
              <div key={e.eventId} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-bold text-slate-800">{e.eventTitle}</span>
                <span className="whitespace-nowrap font-mono font-black text-slate-900">{formatCurrency(e.revenue)}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
              <Clock className="h-3.5 w-3.5 text-brand-500" />
              Staff more gates around the peak hour above to cut queues.
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Registrations per Day" subtitle="Booking momentum over time">
          <Bars data={data.registrationsByDay || []} color="#f97316" />
        </Card>
        <Card title="Gate Entries per Day" subtitle="Actual footfall">
          <Bars data={data.checkinsByDay || []} color="#10b981" />
        </Card>
      </div>

      <Card title="Admissions by Hour of Day" subtitle="When do attendees actually arrive? Plan gate staffing around peaks.">
        <Bars data={data.admissionsByHour || []} height={100} color="#0ea5e9" formatLabel={(d) => `${d.hour}:00`} />
        <div className="mt-1 flex justify-between text-[10px] font-bold text-slate-400">
          <span>12am</span><span>6am</span><span>12pm</span><span>6pm</span><span>11pm</span>
        </div>
      </Card>

      <Card
        title="Top Competitions"
        subtitle="Registrations, tickets and gate conversion per activity"
        bodyClassName="p-0"
      >
        {topActivities.length ? (
          <Table columns={['Competition', 'Registrations', 'Tickets', 'Checked In', 'Gate Conversion']}>
            {topActivities.map((a, i) => {
              const rate = a.tickets ? Math.round(((a.checkedIn || 0) / a.tickets) * 100) : 0;
              return (
                <tr key={a.id || `general-${i}`} className="hover:bg-slate-50/80 transition-colors">
                  <Td>
                    <div className="flex items-center gap-2">
                      {i < 3 && <Trophy className={`h-4 w-4 ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-slate-400' : 'text-amber-700'}`} />}
                      <span className="font-bold text-xs text-slate-900">{a.title}</span>
                    </div>
                  </Td>
                  <Td className="text-xs font-bold text-slate-900">{a.registrations}</Td>
                  <Td className="text-xs font-bold text-slate-900">{a.tickets}</Td>
                  <Td className="text-xs font-bold text-emerald-700">{a.checkedIn || 0}</Td>
                  <Td className="min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${rate}%` }} />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-700">{rate}%</span>
                    </div>
                  </Td>
                </tr>
              );
            })}
          </Table>
        ) : (
          <div className="p-8 text-center">
            <EmptyState title="No activity data yet" description="Competition stats appear after the first bookings." />
          </div>
        )}
      </Card>

      <Card title="Ticket Tier Sell-through" subtitle="Which passes are moving? Reprice or promote slow tiers.">
        <div className="grid gap-4 sm:grid-cols-2">
          {tiers.map((t) => {
            const pct = t.quantity ? Math.round((Number(t.soldCount || 0) / Number(t.quantity)) * 100) : 0;
            return (
              <div key={t.id}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{t.name}</span>
                  <span className="font-mono text-slate-500">
                    {t.soldCount}/{t.quantity} · {pct}%
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${pct >= 90 ? 'bg-rose-500' : pct >= 60 ? 'bg-brand-500' : 'bg-sky-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
          {tiers.length === 0 && <p className="text-xs text-slate-400">No ticket tiers yet.</p>}
        </div>
      </Card>

      {stats && (
        <p className="text-center text-[11px] text-slate-400">
          {stats.liveEvents} live event(s) · {stats.totalRegistrations} confirmed bookings lifetime
        </p>
      )}
    </div>
  );
}
