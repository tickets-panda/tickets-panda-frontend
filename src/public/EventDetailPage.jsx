import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  Mail,
  Phone,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  Share2,
  FileText,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import api, { apiErrorMessage } from '../shared/api/client.js';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import Badge from '../shared/components/Badge.jsx';
import Button from '../shared/components/Button.jsx';
import ActivityCard from '../shared/components/ActivityCard.jsx';
import { RevealGroup } from '../shared/components/Reveal.jsx';
import { formatCurrency, formatDate, formatTime } from '../shared/utils/format.js';
import toast from 'react-hot-toast';

export default function EventDetailPage() {
  const { tenantSlug, eventSlug } = useParams();
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-event', tenantSlug, eventSlug],
    queryFn: async () => (await api.get(`/public/t/${tenantSlug}/events/${eventSlug}`)).data.data,
  });

  if (isLoading) return <PageLoader label="Loading festival details…" />;
  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="Event unavailable" description={apiErrorMessage(error)} />
      </div>
    );
  }

  const { tenant, event, activities = [], ticketTypes = [], stats } = data;
  const soldOut = ticketTypes.length > 0 && ticketTypes.every((type) => type.remaining <= 0);
  const minPrice = ticketTypes.length
    ? Math.min(...ticketTypes.map((t) => Number(t.price)))
    : 0;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${event.title} — ${tenant.name}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Event link copied to clipboard!');
    }
  };

  return (
    <div className="pb-24 lg:pb-16">
      {/* College Breadcrumb Bar */}
      <div className="border-b border-zinc-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link
            to={`/t/${tenantSlug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-brand-600 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to {tenant.name}</span>
          </Link>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 rounded-lg px-2.5 py-1 hover:bg-zinc-100 transition"
          >
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 sm:pt-8 space-y-10">
        {/* ========================================================================= */}
        {/* HERO BANNER & PRIMARY METADATA */}
        {/* ========================================================================= */}
        <div className="card overflow-hidden border-zinc-200/90 shadow-card bg-white">
          <div className="relative h-64 sm:h-80 lg:h-96 w-full bg-gradient-to-r from-zinc-900 to-zinc-950 overflow-hidden">
            {event.bannerUrl ? (
              <img
                src={event.bannerUrl}
                alt={event.title}
                className="h-full w-full object-cover opacity-85"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-tr from-brand-600 via-orange-600 to-amber-600 text-white p-6 text-center">
                <span className="text-6xl animate-bounce">🐼</span>
                <p className="mt-3 text-2xl font-black tracking-tight drop-shadow font-display">
                  {event.title}
                </p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Floating Top College Tag */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
              <span className="rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-3.5 py-1 text-xs font-bold text-white">
                {tenant.name}
              </span>
            </div>

            {/* Bottom Title on Hero */}
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
              <span className="inline-block rounded-md bg-brand-500 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                Official Festival Event
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-md font-display leading-tight">
                {event.title}
              </h1>
              {event.shortDescription && (
                <p className="max-w-3xl text-xs sm:text-sm text-zinc-200 line-clamp-2 drop-shadow">
                  {event.shortDescription}
                </p>
              )}
            </div>
          </div>

          {/* Quick Schedule, Venue & Capacity Badges */}
          <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs text-zinc-700">
              <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-zinc-200/70 shadow-subtle">
                <div className="rounded-lg bg-brand-50 p-2 text-brand-600 shrink-0">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-zinc-400">Date</p>
                  <p className="font-bold text-zinc-900">{formatDate(event.eventDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-zinc-200/70 shadow-subtle">
                <div className="rounded-lg bg-brand-50 p-2 text-brand-600 shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-zinc-400">Time</p>
                  <p className="font-bold text-zinc-900">
                    {formatTime(event.eventTimeStart)}
                    {event.eventTimeEnd ? ` – ${formatTime(event.eventTimeEnd)}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-zinc-200/70 shadow-subtle">
                <div className="rounded-lg bg-brand-50 p-2 text-brand-600 shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase text-zinc-400">Venue</p>
                  <p className="font-bold text-zinc-900 truncate">{event.venueName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-zinc-200/70 shadow-subtle">
                <div className="rounded-lg bg-brand-50 p-2 text-brand-600 shrink-0">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-zinc-400">Availability</p>
                  <p className={`font-bold ${soldOut ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {soldOut ? 'Sold out' : stats?.seatsRemaining ? `${stats.seatsRemaining} seats left` : 'Registration Open'}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="mt-6 pt-5 border-t border-zinc-200/70">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  About this Festival
                </h3>
                <p className="whitespace-pre-line text-sm text-zinc-700 leading-relaxed max-w-4xl">
                  {event.description}
                </p>
              </div>
            )}

            {event.venueAddress && (
              <div className="mt-4 text-xs text-zinc-500 flex flex-wrap items-center gap-2">
                <span className="font-semibold text-zinc-700">Location:</span>
                <span>{event.venueAddress}</span>
                {event.venueMapUrl && (
                  <a
                    href={event.venueMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline"
                  >
                    View on Map <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ACTIVITIES & COMPETITIONS SECTION */}
        {/* ========================================================================= */}
        {activities.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-200/80 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  Festival Tracks
                </span>
                <h2 className="text-2xl font-black tracking-tight text-zinc-950 font-display">
                  Competitions & Activities ({activities.length})
                </h2>
                <p className="text-xs text-zinc-500">
                  Register individually for your chosen events. Each activity carries independent rules and slots.
                </p>
              </div>
            </div>

            <RevealGroup className="grid gap-6 sm:grid-cols-2">
              {activities.map((act) => {
                const actTicket = act.ticketTypes?.[0] || null;
                return (
                  <ActivityCard
                    key={act.id}
                    activity={act}
                    onRegister={() =>
                      navigate(
                        `/t/${tenantSlug}/events/${eventSlug}/register?activity=${act.slug}${
                          actTicket ? `&ticketTypeId=${actTicket.id}` : ''
                        }`,
                      )
                    }
                  />
                );
              })}
            </RevealGroup>
          </div>
        )}

        {/* ========================================================================= */}
        {/* GENERAL PASSES & TICKET TIERS */}
        {/* ========================================================================= */}
        <div className="space-y-6">
          <div className="border-b border-zinc-200/80 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Admission Passes
            </span>
            <h2 className="text-2xl font-black tracking-tight text-zinc-950 font-display">
              Select Your Pass
            </h2>
            <p className="text-xs text-zinc-500">
              Choose your attendance tier. Digital e-tickets with single-entry QR will be generated immediately.
            </p>
          </div>

          <RevealGroup className="space-y-3.5">
            {ticketTypes.map((type) => {
              const isAvailable = type.remaining > 0;
              return (
                <div
                  key={type.id}
                  className="card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-zinc-200/90 hover:border-zinc-300 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-lg font-bold text-zinc-950">{type.name}</h4>
                      <Badge tone={isAvailable ? 'green' : 'red'} size="xs">
                        {isAvailable ? `${type.remaining} Available` : 'Sold out'}
                      </Badge>
                    </div>
                    {type.description && (
                      <p className="text-xs text-zinc-500 max-w-xl">{type.description}</p>
                    )}
                    <p className="text-[11px] text-zinc-400">
                      {type.minPerOrder ? `Min ${type.minPerOrder}` : ''}
                      {type.maxPerOrder ? ` · Max ${type.maxPerOrder} per booking` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-2xl font-black tracking-tight text-zinc-950 font-display">
                        {Number(type.price) > 0 ? formatCurrency(type.price, type.currency) : 'Free'}
                      </span>
                    </div>

                    <Button
                      variant={isAvailable ? 'primary' : 'secondary'}
                      disabled={!isAvailable || !event.registrationOpen}
                      onClick={() =>
                        navigate(`/t/${tenantSlug}/events/${eventSlug}/register?ticketTypeId=${type.id}`)
                      }
                    >
                      {isAvailable ? 'Select' : 'Sold out'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </RevealGroup>
        </div>

        {/* ========================================================================= */}
        {/* RULES & CODE OF CONDUCT */}
        {/* ========================================================================= */}
        {event.rules && (
          <div className="card p-6 sm:p-8 space-y-3 border-zinc-200/90">
            <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" /> Event Rules & Code of Conduct
            </h3>
            <p className="whitespace-pre-line text-xs sm:text-sm text-zinc-600 leading-relaxed">
              {event.rules}
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* EVENT FAQ */}
        {/* ========================================================================= */}
        {event.faqJson && Array.isArray(event.faqJson) && event.faqJson.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-zinc-950 font-display">
              Frequently Asked Questions
            </h3>
            <div className="space-y-2.5">
              {event.faqJson.map((faq, idx) => (
                <div key={idx} className="card overflow-hidden border-zinc-200/90">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full p-4.5 text-left font-bold text-sm text-zinc-900 flex items-center justify-between gap-3 hover:text-brand-600"
                  >
                    <span>{faq.q || faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-zinc-400 transition-transform ${
                        openFaqIndex === idx ? 'rotate-180 text-brand-600' : ''
                      }`}
                    />
                  </button>
                  {openFaqIndex === idx && (
                    <div className="px-4.5 pb-4 pt-1 text-xs text-zinc-600 border-t border-zinc-100 bg-zinc-50/50 leading-relaxed">
                      {faq.a || faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ORGANIZER SUPPORT CONTACT */}
        {/* ========================================================================= */}
        <div className="rounded-2xl border border-zinc-200/80 bg-zinc-100/60 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Need assistance with this event?
            </p>
            <p className="text-sm font-bold text-zinc-900">
              Organized by {tenant.name}
            </p>
            <p className="text-xs text-zinc-500">
              For event queries, stage timings, or accommodation assistance, reach out directly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {tenant.supportEmail && (
              <a
                href={`mailto:${tenant.supportEmail}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-bold text-zinc-800 hover:bg-zinc-50 shadow-subtle"
              >
                <Mail className="h-3.5 w-3.5 text-brand-500" />
                <span>Email Support</span>
              </a>
            )}
            {tenant.supportPhone && (
              <a
                href={`tel:${tenant.supportPhone}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-bold text-zinc-800 hover:bg-zinc-50 shadow-subtle"
              >
                <Phone className="h-3.5 w-3.5 text-brand-500" />
                <span>Call Organizer</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STICKY BOTTOM REGISTRATION BAR FOR MOBILE */}
      {/* ========================================================================= */}
      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-zinc-200 bg-white/95 backdrop-blur-md p-3.5 sm:hidden shadow-lg flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase font-bold text-zinc-400">Registration</p>
          <p className="text-sm font-black text-zinc-950">
            {minPrice > 0 ? `From ${formatCurrency(minPrice)}` : 'Free Entry'}
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          disabled={soldOut || !event.registrationOpen}
          onClick={() => navigate(`/t/${tenantSlug}/events/${eventSlug}/register`)}
          rightIcon={ArrowRight}
        >
          {soldOut ? 'Sold out' : event.registrationOpen ? 'Register Now' : 'Closed'}
        </Button>
      </div>
    </div>
  );
}
