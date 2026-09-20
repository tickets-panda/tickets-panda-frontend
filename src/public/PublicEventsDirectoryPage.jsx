import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, CalendarDays, MapPin, Sparkles, ArrowRight, Tag, Users } from 'lucide-react';
import api, { apiErrorMessage } from '../shared/api/client.js';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import Badge from '../shared/components/Badge.jsx';
import { formatCurrency, formatDate, formatTime } from '../shared/utils/format.js';
import { RevealGroup } from '../shared/components/Reveal.jsx';

export default function PublicEventsDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-all-events'],
    queryFn: async () => (await api.get('/public/events')).data.data.events,
  });

  const events = data || [];

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchSearch =
        !searchTerm.trim() ||
        e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.tenant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.venueName?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [events, searchTerm]);

  return (
    <div className="py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Live Ticket Panda Events
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 font-display">
            Explore Events & Festivals
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Browse upcoming college cultural fests, technical symposia, hackathons, and conferences.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mx-auto max-w-xl">
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-4 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by event title, college name, or venue…"
              className="w-full rounded-2xl border border-zinc-200/90 bg-white py-3.5 pl-11 pr-4 text-sm text-zinc-900 placeholder-zinc-400 shadow-card focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition"
            />
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <PageLoader label="Discovering upcoming events…" />
        ) : error ? (
          <EmptyState title="Could not load events" description={apiErrorMessage(error)} />
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            title="No matching events found"
            description="Try searching with a different keyword or check back soon for newly published festivals."
          />
        ) : (
          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-4">
            {filteredEvents.map((event) => {
              const tenantSlug = event.tenant?.slug || 'event';
              return (
                <Link
                  key={event.id}
                  to={`/t/${tenantSlug}/events/${event.slug}`}
                  className="card group flex flex-col justify-between overflow-hidden border border-zinc-200/90 transition-all hover:border-brand-300 hover:shadow-card-hover"
                >
                  <div>
                    {/* Event Banner */}
                    <div className="relative h-48 w-full overflow-hidden bg-zinc-100">
                      {event.bannerUrl ? (
                        <img
                          src={event.bannerUrl}
                          alt={event.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-brand-500 to-orange-400 text-white">
                          <span className="text-4xl">🐼</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white border border-white/20">
                          {event.tenant?.name}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${event.soldOut ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
                          {event.soldOut ? 'Sold out' : 'Registration Open'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <h3 className="text-lg font-bold text-zinc-950 group-hover:text-brand-600 transition-colors line-clamp-1">
                        {event.title}
                      </h3>

                      <div className="space-y-1.5 text-xs text-zinc-500">
                        <p className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                          <span>{formatDate(event.eventDate)} · {formatTime(event.eventTimeStart)}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                          <span className="truncate">{event.venueName}</span>
                        </p>
                      </div>

                      {event.activities && event.activities.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {event.activities.slice(0, 3).map((act) => (
                            <span
                              key={act.id}
                              className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600"
                            >
                              {act.title}
                            </span>
                          ))}
                          {event.activities.length > 3 && (
                            <span className="text-[10px] font-bold text-zinc-400 self-center">
                              +{event.activities.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Bar */}
                  <div className="border-t border-zinc-100 bg-zinc-50/60 px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-zinc-400">Pass Starting At</p>
                      <p className="text-sm font-black text-zinc-900">
                        {event.priceFrom !== null && Number(event.priceFrom) > 0
                          ? formatCurrency(event.priceFrom)
                          : 'Free Entry'}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 group-hover:translate-x-1 transition-transform">
                      View Event <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </RevealGroup>
        )}
      </div>
    </div>
  );
}
