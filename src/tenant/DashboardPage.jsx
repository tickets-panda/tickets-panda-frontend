import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, IndianRupee, Ticket, ScanLine, Plus } from 'lucide-react';
import api from '../shared/api/client.js';
import PageHeader from '../shared/components/PageHeader.jsx';
import Stat from '../shared/components/Stat.jsx';
import Card from '../shared/components/Card.jsx';
import Table, { Td } from '../shared/components/Table.jsx';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import { StatusBadge } from '../shared/components/Badge.jsx';
import { formatCurrency, formatDate } from '../shared/utils/format.js';

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['tenant-dashboard'],
    queryFn: async () => (await api.get('/tenant/dashboard/stats')).data.data,
  });

  if (isLoading) return <PageLoader label="Loading dashboard…" />;
  if (!data) return <EmptyState title="No data available" />;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your events, bookings and gate activity at a glance."
        actions={
          <Link
            to="/tenant/events/new"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            <Plus className="h-4 w-4" /> New event
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Stat label="Revenue" value={formatCurrency(data.revenue)} icon={IndianRupee} tone="green" />
        <Stat label="Confirmed bookings" value={data.totalRegistrations} icon={Ticket} />
        <Stat label="Tickets issued" value={data.ticketsSold} icon={Ticket} tone="blue" />
        <Stat label="Checked in" value={data.checkedIn} icon={ScanLine} tone="purple" />
        <Stat label="Events" value={data.totalEvents} hint={`${data.liveEvents} live`} icon={CalendarDays} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Upcoming events" bodyClassName="p-0">
          {data.upcomingEvents?.length ? (
            <Table columns={['Event', 'Date', 'Status']}>
              {data.upcomingEvents.map((event) => (
                <tr key={event.id}>
                  <Td>
                    <Link to={`/tenant/events/${event.id}`} className="font-medium text-brand-600 hover:underline">
                      {event.title}
                    </Link>
                  </Td>
                  <Td className="text-zinc-500">{formatDate(event.eventDate)}</Td>
                  <Td>
                    <StatusBadge status={event.status} />
                  </Td>
                </tr>
              ))}
            </Table>
          ) : (
            <div className="p-5">
              <EmptyState title="No events yet" description="Create your first event to start selling tickets." />
            </div>
          )}
        </Card>

        <Card title="Recent bookings" bodyClassName="p-0">
          {data.recentRegistrations?.length ? (
            <Table columns={['Customer', 'Event', 'Type', 'Status']}>
              {data.recentRegistrations.map((registration) => (
                <tr key={registration.id}>
                  <Td>
                    <span className="font-medium text-zinc-800">{registration.customer?.name}</span>
                    <span className="block text-xs text-zinc-500">{registration.customer?.email}</span>
                  </Td>
                  <Td className="text-zinc-600">{registration.event?.title}</Td>
                  <Td className="text-zinc-600">{registration.ticketType?.name}</Td>
                  <Td>
                    <StatusBadge status={registration.status} />
                  </Td>
                </tr>
              ))}
            </Table>
          ) : (
            <div className="p-5">
              <EmptyState title="No bookings yet" description="Bookings will appear here as customers register." />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
