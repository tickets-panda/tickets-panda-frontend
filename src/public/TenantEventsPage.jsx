import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CalendarDays,
  MapPin,
  Ticket,
  Globe,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import api, { apiErrorMessage } from '../shared/api/client.js';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import Badge from '../shared/components/Badge.jsx';
import { formatCurrency, formatDate, formatTime } from '../shared/utils/format.js';

export default function TenantEventsPage() {
  const { tenantSlug } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-tenant-events', tenantSlug],
    queryFn: async () => (await api.get(`/public/t/${tenantSlug}/events`)).data.data,
  });

  if (isLoading) return <PageLoader label="Loading college events…" />;

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="Organizer not found" description={apiErrorMessage(error)} />
      </div>
    );
  }

  const { tenant, events = [] } = data;

  return (
    <div className="pb-20">
      {/* College / Organizer Cover Banner */}
      <div className="relative h-48 sm:h-64 w-full bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-950 overflow-hidden">
        {tenant.coverImageUrl ? (
          <img
            src={tenant.coverImageUrl}
            alt=""
            className="h-full w-full object-cover opacity-60"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
      </div>

      {/* College Profile Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative -mt-16 sm:-mt-20">
        <div className="card border-zinc-200/90 p-6 sm:p-8 bg-white shadow-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Logo */}
            {tenant.logoUrl ? (
              <img
                src={tenant.logoUrl}
                alt={tenant.name}
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover border-2 border-white shadow-md shrink-0 bg-white"
              />
            ) : (
              <div className="grid h-20 w-20 sm:h-24 sm:w-24 place-items-center rounded-2xl bg-brand-50 border-2 border-brand-200 text-3xl shadow-md shrink-0">
                <GraduationCap className="h-10 w-10 text-brand-600" />
              </div>
            )}

            {/* Profile Info */}
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-50 border border-brand-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-700">
                  {tenant.category || 'College / University'}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Verified Organization
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 font-display">
                {tenant.name}
              </h1>

              {tenant.description && (
                <p className="text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
                  {tenant.description}
                </p>
              )}

              {/* Links & Contact */}
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-zinc-500">
                {tenant.websiteUrl && (
                  <a
                    href={tenant.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-700 hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" /> {tenant.websiteUrl.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {tenant.supportEmail && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-zinc-400" /> {tenant.supportEmail}
                  </span>
                )}
                {tenant.supportPhone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-zinc-400" /> {tenant.supportPhone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid Header */}
        <div className="mt-10 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-950 font-display">
              Upcoming Events & Festivals
            </h2>
            <p className="text-xs text-zinc-500">
              Select a festival or competition to view activities and register online.
            </p>
          </div>
          <span className="text-xs font-semibold text-zinc-400">
            {events.length} event{events.length === 1 ? '' : 's'} scheduled
          </span>
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <EmptyState
            title="No events scheduled right now"
            description="This organizer currently has no live public events. Check back soon!"
            icon={Ticket}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/t/${tenantSlug}/events/${event.slug}`}
                className="card group flex flex-col justify-between overflow-hidden border border-zinc-200/90 transition-all hover:border-brand-300 hover:shadow-card-hover"
              >
                <div>
                  {/* Banner */}
                  <div className="relative h-44 w-full overflow-hidden bg-zinc-100">
                    {event.bannerUrl ? (
                      <img
                        src={event.bannerUrl}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-gradient-to-tr from-brand-500 to-orange-400 text-3xl text-white">
                        <Sparkles className="h-10 w-10" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          event.soldOut ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                        }`}
                      >
                        {event.soldOut ? 'Sold out' : 'On sale'}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-2.5">
                    <h3 className="line-clamp-1 text-base font-bold text-zinc-950 group-hover:text-brand-600 transition-colors">
                      {event.title}
                    </h3>
                    {event.shortDescription && (
                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                        {event.shortDescription}
                      </p>
                    )}
                    <div className="space-y-1 text-xs text-zinc-500 pt-1">
                      <p className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                        <span>{formatDate(event.eventDate)} · {formatTime(event.eventTimeStart)}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                        <span className="truncate">{event.venueName}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-zinc-100 bg-zinc-50/60 p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                      Pass Starts At
                    </span>
                    <span className="text-sm font-black text-zinc-900">
                      {event.priceFrom !== null && Number(event.priceFrom) > 0
                        ? formatCurrency(event.priceFrom)
                        : 'Free'}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 group-hover:translate-x-1 transition-transform">
                    Explore Event <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
