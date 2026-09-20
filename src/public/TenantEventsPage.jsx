import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, MapPin, Ticket } from 'lucide-react';
import api, { apiErrorMessage } from '../shared/api/client.js';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import { formatCurrency, formatDate, formatTime } from '../shared/utils/format.js';

export default function TenantEventsPage() {
  const { tenantSlug } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-tenant-events', tenantSlug],
    queryFn: async () => (await api.get(`/public/t/${tenantSlug}/events`)).data.data,
  });

  if (isLoading) return <PageLoader label="Loading events…" />;

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="Organizer not found" description={apiErrorMessage(error)} />
      </div>
    );
  }

  const { tenant, events } = data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 flex items-start gap-4">
        {tenant.logoUrl ? (
          <img src={tenant.logoUrl} alt={tenant.name} className="h-14 w-14 rounded-xl object-cover" />
        ) : (
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-brand-100 text-2xl">🐼</div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{tenant.name}</h1>
          {tenant.description && <p className="mt-1 max-w-2xl text-sm text-zinc-600">{tenant.description}</p>}
          {tenant.websiteUrl && (
            <a href={tenant.websiteUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs font-medium text-brand-600 hover:underline">
              {tenant.websiteUrl}
            </a>
          )}
        </div>
      </header>

      {events.length === 0 ? (
        <EmptyState title="No events on sale" description="This organizer has no live events right now." icon={Ticket} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link key={event.id} to={`/t/${tenantSlug}/events/${event.slug}`} className="card group overflow-hidden transition hover:shadow-md">
              <div className="h-36 w-full overflow-hidden bg-brand-100">
                {event.bannerUrl ? (
                  <img src={event.bannerUrl} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-3xl">🎟️</div>
                )}
              </div>
              <div className="p-4">
                <h2 className="line-clamp-1 font-semibold text-zinc-900">{event.title}</h2>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
                  <CalendarDays className="h-3.5 w-3.5" /> {formatDate(event.eventDate)} · {formatTime(event.eventTimeStart)}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                  <MapPin className="h-3.5 w-3.5" /> {event.venueName}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-zinc-900">
                    {event.priceFrom !== null ? `From ${formatCurrency(event.priceFrom)}` : 'Free'}
                  </span>
                  <span className={`text-xs font-medium ${event.soldOut ? 'text-red-600' : 'text-emerald-600'}`}>
                    {event.soldOut ? 'Sold out' : 'On sale'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
