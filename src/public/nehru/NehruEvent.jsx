import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, CalendarDays, MapPin, Ticket, Users } from 'lucide-react';
import api from '../../shared/api/client.js';
import { PageLoader, EmptyState } from '../../shared/components/Feedback.jsx';
import Reveal, { RevealGroup } from '../../shared/components/Reveal.jsx';
import './ngk.css';

export default function NehruEvent() {
  const { tenantSlug = 'nehru-college', eventSlug = 'ngk-2026' } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState('All');
  const [openRules, setOpenRules] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['ngk-event-detail', eventSlug],
    queryFn: async () => (await api.get(`/public/t/${tenantSlug}/events/${eventSlug}`)).data.data,
    staleTime: 60_000,
  });

  const event = data?.event;
  const activities = useMemo(() => data?.activities || [], [data]);
  const ticketTypes = useMemo(() => data?.ticketTypes || [], [data]);
  const categories = useMemo(() => ['All', ...new Set(activities.map((a) => a.venue || 'Event'))], [activities]);
  const filtered = useMemo(
    () => activities.filter((a) => category === 'All' || (a.venue || '') === category),
    [activities, category],
  );

  const goRegister = (activity) => {
    const params = new URLSearchParams();
    if (activity) params.set('activity', activity.slug);
    const first = ticketTypes[0];
    if (first) params.set('ticketTypeId', String(first.id));
    navigate(`/t/${tenantSlug}/events/${eventSlug}/register?${params.toString()}`);
  };

  if (isLoading) return <PageLoader label="Loading event…" />;
  if (isError || !event) {
    return (
      <div className="ngk"><div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState title="Event not found" description="This festival page is unavailable right now." />
      </div></div>
    );
  }

  return (
    <div className="ngk">
      {/* HERO */}
      <section className="ngk-hero">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <Reveal>
            <Link to={`/t/${tenantSlug}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-white/70 hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to NGK 2026
            </Link>
            <p className="ngk-kicker mt-4">Official Festival Event</p>
            <h1 className="ngk-title mt-3 max-w-4xl text-5xl sm:text-6xl">{event.title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/70">{event.shortDescription}</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-white/80">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-[#f4b73c]" /> {event.eventDate?.slice(0, 10)} · {event.eventTimeStart || ''}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#f4b73c]" /> {event.venueName}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PASSES */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Reveal>
          <p className="ngk-section-kicker">Admission Passes</p>
          <h2 className="ngk-section-title mt-1 text-3xl sm:text-4xl">Select your pass</h2>
        </Reveal>
        <RevealGroup className="mt-6 space-y-4">
          {ticketTypes.map((t) => (
            <div key={t.id} className="ngk-pass-row flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
              <div>
                <h3 className="text-lg font-black text-[#032b22]">{t.name}</h3>
                <p className="text-xs text-zinc-500">{t.remaining} available · Min {t.minPerOrder || 1}{t.maxPerOrder ? ` · Max ${t.maxPerOrder}` : ''} per booking</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-display-ngk text-3xl font-bold text-[#032b22]">₹{Number(t.price)}</span>
                <button className="ngk-btn-gold !py-2.5 text-xs" disabled={t.remaining <= 0} onClick={() => goRegister(null)}>
                  {t.remaining > 0 ? 'Select' : 'Sold out'}
                </button>
              </div>
            </div>
          ))}
        </RevealGroup>
      </section>

      {/* ACTIVITIES */}
      <section className="border-t border-[#e3efe7] bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="ngk-section-kicker">Festival Tracks</p>
              <h2 className="ngk-section-title mt-1 text-3xl sm:text-4xl">Competitions ({filtered.length})</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button key={c} onClick={() => setCategory(c)} className={`ngk-filter-btn${category === c ? ' active' : ''}`}>{c}</button>
              ))}
            </div>
          </Reveal>
          <RevealGroup className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <div key={a.slug} className="ngk-event-card">
                <div className="relative h-40 overflow-hidden bg-[#eaf8ef]">
                  <img src={a.posterUrl || `/ngk/events/${a.slug}.svg`} alt={a.title} loading="lazy"
                    className="h-full w-full object-contain p-4" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  <span className="ngk-fee-pill absolute right-3 top-3">₹250</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="ngk-cat-pill self-start">{a.venue || 'Event'}</span>
                  <h3 className="font-display-ngk mt-2 text-2xl font-bold text-[#032b22]">{a.title}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500">
                    <Users className="h-3.5 w-3.5 text-[#0b6b4f]" /> {a.eligibility || 'Open entry'}
                  </p>
                  {openRules === a.slug && a.rules && (
                    <ul className="mt-3 space-y-1.5 rounded-xl bg-[#f5fbf7] p-3 text-xs leading-relaxed text-zinc-700">
                      {a.rules.split('\n').filter(Boolean).map((r, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e5a420]" /><span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-4 flex gap-2">
                    {a.rules && (
                      <button onClick={() => setOpenRules(openRules === a.slug ? null : a.slug)}
                        className="flex-1 rounded-xl border border-[#cfe3d6] py-2.5 text-xs font-bold text-[#0b6b4f] hover:border-[#0b6b4f]">
                        {openRules === a.slug ? 'Hide Rules' : 'Rules'}
                      </button>
                    )}
                    <button onClick={() => goRegister(a)} className="ngk-btn-gold flex-1 justify-center !py-2.5 text-xs">
                      Register <Ticket className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>
      <p className="border-t border-[#e3efe7] py-5 text-center text-[11px] text-zinc-500">
        © 2026 Nehru Group of Institutions · Powered by Ticket Panda
      </p>
    </div>
  );
}
