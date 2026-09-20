import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, Clock, MapPin, Users, HelpCircle, ShieldCheck, Sparkles, ChevronDown, ChevronUp, Mail, Phone, ExternalLink } from 'lucide-react';
import api, { apiErrorMessage } from '../shared/api/client.js';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import Badge from '../shared/components/Badge.jsx';
import { formatCurrency, formatDate, formatTime } from '../shared/utils/format.js';

export default function EventDetailPage() {
  const { tenantSlug, eventSlug } = useParams();
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-event', tenantSlug, eventSlug],
    queryFn: async () => (await api.get(`/public/t/${tenantSlug}/events/${eventSlug}`)).data.data,
  });

  if (isLoading) return <PageLoader label="Loading event…" />;
  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="Event unavailable" description={apiErrorMessage(error)} />
      </div>
    );
  }

  const { tenant, event, activities = [], ticketTypes = [], stats } = data;
  const soldOut = ticketTypes.length > 0 && ticketTypes.every((type) => type.remaining <= 0);

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Hero Card */}
      <div className="card overflow-hidden shadow-sm">
        <div className="relative h-56 w-full bg-gradient-to-r from-orange-500 to-brand-600 sm:h-72">
          {event.bannerUrl ? (
            <img src={event.bannerUrl} alt={event.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-white">
              <span className="text-6xl">🐼</span>
              <p className="mt-2 text-xl font-bold tracking-tight opacity-90">{event.title}</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">
            <div>
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                {tenant.name}
              </span>
              <h1 className="mt-1 text-2xl font-black drop-shadow-md sm:text-3xl">{event.title}</h1>
              {event.shortDescription && (
                <p className="mt-1 max-w-2xl text-xs text-white/90 drop-shadow sm:text-sm">{event.shortDescription}</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-3 rounded-xl bg-zinc-50 p-4 text-sm text-zinc-700 sm:grid-cols-2 lg:grid-cols-4">
            <p className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-brand-600 shrink-0" />
              <span>{formatDate(event.eventDate)}</span>
            </p>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-600 shrink-0" />
              <span>
                {formatTime(event.eventTimeStart)}
                {event.eventTimeEnd ? ` – ${formatTime(event.eventTimeEnd)}` : ''}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-600 shrink-0" />
              <span className="truncate">{event.venueName}</span>
            </p>
            {stats?.maxCapacity && (
              <p className="flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-600 shrink-0" />
                <span>{stats.seatsRemaining ?? stats.maxCapacity} seats remaining</span>
              </p>
            )}
          </div>

          {event.description && (
            <div className="mt-6 border-t border-zinc-100 pt-5">
              <h2 className="text-base font-bold text-zinc-900">About the Event</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-zinc-600">{event.description}</p>
            </div>
          )}

          {event.venueAddress && (
            <div className="mt-4 text-xs text-zinc-500">
              <span className="font-semibold text-zinc-700">Full Address:</span> {event.venueAddress}
              {event.venueMapUrl && (
                <a href={event.venueMapUrl} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center gap-1 text-brand-600 hover:underline">
                  View Map <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Activities / Competitions Section */}
      {activities.length > 0 && (
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand-500" /> Featured Activities & Competitions
              </h2>
              <p className="text-xs text-zinc-500">Select an activity to register and participate.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {activities.map((act) => {
              const actTicket = act.ticketTypes?.[0] || null;
              return (
                <div key={act.id} className="card flex flex-col justify-between border border-zinc-200/80 p-5 transition hover:border-brand-300 hover:shadow-md">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-zinc-900 text-lg">{act.title}</h3>
                      {actTicket && (
                        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700 border border-brand-200">
                          {Number(actTicket.price) > 0 ? formatCurrency(actTicket.price, actTicket.currency) : 'Free'}
                        </span>
                      )}
                    </div>
                    {act.shortDescription && (
                      <p className="mt-1 text-xs text-zinc-600">{act.shortDescription}</p>
                    )}
                    {act.description && (
                      <p className="mt-2 text-xs text-zinc-500 line-clamp-3">{act.description}</p>
                    )}

                    <div className="mt-4 space-y-1 text-xs text-zinc-500">
                      {act.venue && (
                        <p className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-zinc-400" /> Venue: {act.venue}
                        </p>
                      )}
                      {act.eligibility && (
                        <p className="flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" /> Eligibility: {act.eligibility}
                        </p>
                      )}
                      {act.capacity && (
                        <p className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-zinc-400" /> Max Capacity: {act.capacity} participants
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">
                      {actTicket?.remaining > 0 ? `${actTicket.remaining} slots open` : 'Slots available'}
                    </span>
                    <button
                      onClick={() => navigate(`/t/${tenantSlug}/events/${eventSlug}/register?activity=${act.slug}${actTicket ? `&ticketTypeId=${actTicket.id}` : ''}`)}
                      className="rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-600 shadow-sm"
                    >
                      Register Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ticket Selection Section */}
      <div className="mt-10">
        <h2 className="mb-3 text-xl font-bold text-zinc-900">Choose Your Ticket</h2>
        <div className="space-y-3">
          {ticketTypes.map((type) => (
            <div key={type.id} className="card flex flex-wrap items-center justify-between gap-4 p-5 transition hover:border-zinc-300">
              <div>
                <p className="font-semibold text-zinc-900 text-base">{type.name}</p>
                {type.description && <p className="mt-0.5 text-xs text-zinc-500">{type.description}</p>}
                <p className="mt-1 text-xs text-zinc-500">
                  {type.remaining > 0 ? `${type.remaining} available` : 'Sold out'}
                  {type.maxPerOrder ? ` · max ${type.maxPerOrder} per order` : ''}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xl font-black text-zinc-900">
                  {Number(type.price) > 0 ? formatCurrency(type.price, type.currency) : 'Free'}
                </span>
                <Badge tone={type.remaining > 0 ? 'green' : 'red'}>
                  {type.remaining > 0 ? 'Available' : 'Sold out'}
                </Badge>
                <button
                  disabled={type.remaining <= 0 || !event.registrationOpen}
                  onClick={() => navigate(`/t/${tenantSlug}/events/${eventSlug}/register?ticketTypeId=${type.id}`)}
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-brand-50/50 border border-brand-100 p-4">
          <div>
            <p className="text-sm font-bold text-zinc-900">Ready to secure your pass?</p>
            <p className="text-xs text-zinc-500">Quick online registration with verified e-ticket and QR check-in.</p>
          </div>
          <button
            disabled={soldOut || !event.registrationOpen}
            onClick={() => navigate(`/t/${tenantSlug}/events/${eventSlug}/register`)}
            className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-zinc-300 shadow-sm"
          >
            {soldOut ? 'Sold out' : event.registrationOpen ? 'Register & Pay Online' : 'Registration Closed'}
          </button>
        </div>
      </div>

      {/* Rules & Guidelines */}
      {event.rules && (
        <div className="card mt-10 p-6">
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" /> Event Rules & Code of Conduct
          </h2>
          <p className="mt-3 whitespace-pre-line text-xs leading-relaxed text-zinc-600 bg-zinc-50 rounded-lg p-4 border border-zinc-100">
            {event.rules}
          </p>
        </div>
      )}

      {/* FAQ Section */}
      {Array.isArray(event.faqJson) && event.faqJson.length > 0 && (
        <div className="card mt-6 p-6">
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-brand-600" /> Frequently Asked Questions
          </h2>
          <div className="mt-4 divide-y divide-zinc-100">
            {event.faqJson.map((faq, idx) => (
              <div key={idx} className="py-3">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between text-left font-medium text-sm text-zinc-800 hover:text-brand-600"
                >
                  <span>{faq.question}</span>
                  {openFaqIndex === idx ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {openFaqIndex === idx && (
                  <p className="mt-2 text-xs text-zinc-600 pl-2 border-l-2 border-brand-400">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact & Support Section */}
      {event.contactJson && (
        <div className="card mt-6 p-6">
          <h2 className="text-base font-bold text-zinc-900">Event Organizer Contact</h2>
          <div className="mt-3 grid gap-2 text-xs text-zinc-600 sm:grid-cols-3">
            {event.contactJson.coordinator && (
              <p><span className="font-semibold text-zinc-700">Coordinator:</span> {event.contactJson.coordinator}</p>
            )}
            {event.contactJson.email && (
              <p className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-zinc-400" /> {event.contactJson.email}
              </p>
            )}
            {event.contactJson.phone && (
              <p className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-zinc-400" /> {event.contactJson.phone}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <div className="mt-12 text-center text-xs text-zinc-400">
        <p>Powered by <span className="font-semibold text-zinc-600">Ticket Panda</span> 🐼 — Secure event registration & QR admission</p>
      </div>
    </div>
  );
}
