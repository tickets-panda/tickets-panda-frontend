import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, CalendarDays, MapPin, Search, Ticket, Users, X, Clock, ShieldCheck } from 'lucide-react';
import api from '../../shared/api/client.js';
import { PageLoader, EmptyState } from '../../shared/components/Feedback.jsx';
import Reveal, { RevealGroup } from '../../shared/components/Reveal.jsx';
import './ngk.css';

const TENANT_SLUG = 'nehru-college';
const EVENT_SLUG = 'ngk-2026';
const COUNTDOWN_TARGET = new Date('2026-10-13T00:00:00+05:30').getTime();

const DAYS = [
  { day: 'DAY 01', date: '13 OCT 2026', title: 'Avatar-X-stream', blurb: 'Talent, culture and stage performance.', img: '/ngk/day1.png', open: true },
  { day: 'DAY 02', date: '14 OCT 2026', title: 'Fantabulous', blurb: 'Creativity, fine arts and imagination.', img: '/ngk/day2.png', open: true },
  { day: 'DAY 03', date: '15 OCT 2026', title: 'Avatar', blurb: 'Technology, ideas and management.', img: '/ngk/day3.png', open: false },
  { day: 'DAY 04', date: '16 OCT 2026', title: 'Festember', blurb: 'Fun, energy and celebration.', img: '/ngk/day4.png', open: false },
];

const CATEGORIES = ['Cultural', 'Fine Arts', 'Technical', 'Management', 'Fun Events'];

// NASC day structure: each festival day owns its categories
const DAY_FILTERS = [
  { day: 'DAY 01', title: 'Avatar-X-stream', categories: ['Cultural'] },
  { day: 'DAY 02', title: 'Fantabulous', categories: ['Fine Arts'] },
  { day: 'DAY 03', title: 'Avatar', categories: ['Technical', 'Management'] },
  { day: 'DAY 04', title: 'Festember', categories: ['Fun Events'] },
];

function useCountdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, COUNTDOWN_TARGET - now);
  return {
    live: diff === 0,
    days: Math.floor(diff / 864e5),
    hours: Math.floor(diff / 36e5) % 24,
    minutes: Math.floor(diff / 6e4) % 60,
    seconds: Math.floor(diff / 1e3) % 60,
  };
}

function RulesModal({ activity, onClose, onRegister }) {
  useEffect(() => {
    const fn = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);
  if (!activity) return null;
  const rules = (activity.rules || '').split('\n').filter(Boolean);
  return (
    <div className="ngk-modal-backdrop" onClick={onClose}>
      <div className="ngk-modal" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="ngk-cat-pill">{activity.venue || 'Event'}</span>
            <h3 className="font-display-ngk mt-2 text-3xl font-bold text-[#032b22]">{activity.title}</h3>
            <p className="mt-1 text-xs text-zinc-500">{activity.shortDescription}</p>
          </div>
          <button onClick={onClose} className="rounded-full bg-zinc-100 p-2 text-zinc-500 hover:bg-zinc-200" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-zinc-600">
          {activity.eligibility && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-emerald-800">
              <Users className="h-3.5 w-3.5" /> {activity.eligibility}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-amber-800">
            <Ticket className="h-3.5 w-3.5" /> ₹250 per entry
          </span>
        </div>
        {rules.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-black uppercase tracking-widest text-[#0b6b4f]">Rules & Regulations</p>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-zinc-700">
              {rules.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e5a420]" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-zinc-200 pt-4">
          <p className="text-lg font-black text-[#032b22]">₹250 <span className="text-xs font-semibold text-zinc-500">per entry</span></p>
          <button className="ngk-btn-gold" onClick={() => onRegister(activity)}>
            Register for this Event <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NehruHome() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('All');
  const [day, setDay] = useState('All');
  const [active, setActive] = useState(null);
  const [query, setQuery] = useState('');
  const cd = useCountdown();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['ngk-event', EVENT_SLUG],
    queryFn: async () => (await api.get(`/public/t/${TENANT_SLUG}/events/${EVENT_SLUG}`)).data.data,
    staleTime: 60_000,
  });

  const event = data?.event;
  const activities = useMemo(() => data?.activities || [], [data]);
  const ticketTypes = useMemo(() => data?.ticketTypes || [], [data]);
  const pass = ticketTypes[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const dayCats = day === 'All' ? null : DAY_FILTERS.find((d) => d.day === day)?.categories;
    return activities.filter(
      (a) =>
        (!dayCats || dayCats.includes(a.venue || '')) &&
        (category === 'All' || (a.venue || '') === category) &&
        (!q || a.title.toLowerCase().includes(q)),
    );
  }, [activities, category, day, query]);

  const pickDay = (dayLabel) => {
    setDay(dayLabel);
    document.getElementById('ngk-events')?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeDayTitle = day === 'All' ? null : DAY_FILTERS.find((d) => d.day === day)?.title;

  const goRegister = (activity) => {
    const params = new URLSearchParams();
    if (activity) params.set('activity', activity.slug);
    if (pass) params.set('ticketTypeId', String(pass.id));
    navigate(`/t/${TENANT_SLUG}/events/${EVENT_SLUG}/register?${params.toString()}`);
  };

  if (isLoading) return <PageLoader label="Loading NGK 2026…" />;
  if (isError || !event) {
    return (
      <div className="ngk">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <EmptyState title="NGK 2026 is getting ready" description="The festival portal will be live shortly. Check back soon!" />
        </div>
      </div>
    );
  }

  return (
    <div className="ngk">
      {/* HERO */}
      <section className="ngk-hero relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 text-center sm:px-6">
          <Reveal>
            <img src="/ngk/ngk-2026-logo.png" alt="NGK 2026" className="mx-auto h-28 w-auto sm:h-36" />
          </Reveal>
          <Reveal delay={100}>
            <p className="ngk-kicker mt-6">Nehru Grand Kacheri · NASC & NIET</p>
            <h1 className="ngk-title mx-auto mt-4 max-w-4xl text-5xl sm:text-7xl">
              Nehru Grand <em>Kacheri 2026</em>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/75 sm:text-base">
              4 days · 35 competitions · Cultural, Fine Arts, Technical, Management & Fun Events —
              with verified e-tickets and QR gate entry.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-6 flex items-center justify-center gap-2 sm:gap-3" aria-live="polite">
              {[
                [cd.days, 'Days'],
                [cd.hours, 'Hours'],
                [cd.minutes, 'Mins'],
                [cd.seconds, 'Secs'],
              ].map(([v, l]) => (
                <div key={l} className="ngk-count-box">
                  <strong>{String(v).padStart(2, '0')}</strong>
                  <span>{cd.live ? 'Live' : l}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs font-bold uppercase tracking-widest text-white/60">
              {cd.live ? 'The fest is live now' : 'Event begins · 13 Oct 2026'}
            </p>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#ngk-events" className="ngk-btn-gold">
                Explore Events & Book Pass <ArrowRight className="h-4 w-4" />
              </a>
              <Link to="/my-tickets" className="ngk-btn-ghost">
                <Search className="h-4 w-4" /> Find My Pass
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* DAYS */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <Reveal className="text-center">
          <p className="ngk-section-kicker">Festival Days</p>
          <h2 className="ngk-section-title mt-1 text-4xl sm:text-5xl">Four days, one grand stage</h2>
        </Reveal>
        <RevealGroup className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DAYS.map((d) => (
            <div key={d.day} className="ngk-day-card">
              <img src={d.img} alt={d.title} className="h-40 w-full object-cover" loading="lazy" />
              <div className="p-5">
                <p className="text-[11px] font-black tracking-widest text-[#0b6b4f]">{d.day} · {d.date}</p>
                <h3 className="font-display-ngk mt-1 text-2xl font-bold text-[#032b22]">{d.title}</h3>
                <p className="mt-1 text-xs text-zinc-500">{d.blurb}</p>
                {d.open ? (
                  <button
                    className="ngk-btn-gold mt-4 w-full justify-center !py-2.5 text-xs"
                    onClick={() => pickDay(d.day)}
                  >
                    Register Now · ₹250 <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    className="ngk-btn-gold mt-4 w-full justify-center !py-2.5 text-xs"
                    onClick={() => pickDay(d.day)}
                  >
                    View {d.title} Events <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </RevealGroup>
      </section>

      {/* EVENTS EXPLORER */}
      <section id="ngk-events" className="border-y border-[#e3efe7] bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="ngk-section-kicker">Competitions</p>
              <h2 className="ngk-section-title mt-1 text-4xl sm:text-5xl">
                {activeDayTitle ? `${activeDayTitle} events` : 'Pick your stage'} ({filtered.length})
              </h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events…"
                className="w-full rounded-xl border border-[#cfe3d6] bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#0b6b4f] sm:w-64"
              />
            </div>
          </Reveal>
          <Reveal delay={100} className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => setDay('All')} className={`ngk-filter-btn${day === 'All' ? ' active' : ''}`}>
              All Days
            </button>
            {DAY_FILTERS.map((d) => (
              <button key={d.day} onClick={() => setDay(d.day)} className={`ngk-filter-btn${day === d.day ? ' active' : ''}`}>
                {d.day} · {d.title}
              </button>
            ))}
          </Reveal>
          <Reveal delay={140} className="mt-3 flex flex-wrap gap-2">
            {['All', ...CATEGORIES].map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={`ngk-filter-btn${category === c ? ' active' : ''}`}>
                {c}
              </button>
            ))}
          </Reveal>
          <RevealGroup className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <div key={a.slug} className="ngk-event-card">
                <div className="relative h-44 overflow-hidden bg-[#eaf8ef]">
                  <img
                    src={a.posterUrl || `/ngk/events/${a.slug}.svg`}
                    alt={a.title}
                    loading="lazy"
                    className="h-full w-full object-contain p-4"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <span className="ngk-fee-pill absolute right-3 top-3">₹250</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="ngk-cat-pill self-start">{a.venue || 'Event'}</span>
                  <h3 className="font-display-ngk mt-2 text-2xl font-bold leading-tight text-[#032b22]">{a.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{a.shortDescription}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500">
                    <Users className="h-3.5 w-3.5 text-[#0b6b4f]" /> {a.eligibility || 'Open entry'}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setActive(a)}
                      className="flex-1 rounded-xl border border-[#cfe3d6] bg-white py-2.5 text-xs font-bold text-[#0b6b4f] hover:border-[#0b6b4f]"
                    >
                      View Details
                    </button>
                    <button onClick={() => goRegister(a)} className="ngk-btn-gold flex-1 justify-center !py-2.5 text-xs">
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </RevealGroup>
          {filtered.length === 0 && (
            <p className="mt-8 text-center text-sm text-zinc-500">No events match your search.</p>
          )}
        </div>
      </section>

      {/* PASS STRIP */}
      {pass && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <Reveal className="ngk-pass-row flex flex-col items-center justify-between gap-4 p-6 sm:flex-row sm:p-8">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#064e3b] text-[#ffe8a6]">
                <Ticket className="h-7 w-7" />
              </div>
              <div>
                <p className="ngk-section-kicker">Official Entry Pass</p>
                <h3 className="font-display-ngk text-3xl font-bold text-[#032b22]">{pass.name} · ₹{Number(pass.price)}</h3>
                <p className="text-xs text-zinc-500">Single QR pass · verified payment · instant PDF ticket</p>
              </div>
            </div>
            <button className="ngk-btn-gold" onClick={() => goRegister(null)}>
              Book Your Pass <ArrowRight className="h-4 w-4" />
            </button>
          </Reveal>
        </section>
      )}

      {/* CONTACT */}
      <section className="ngk-contact">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-2">
          <Reveal>
            <p className="ngk-section-kicker !text-[#ffe8a6]">Venue</p>
            <h2 className="font-display-ngk mt-1 text-4xl font-bold text-white">Nehru Gardens</h2>
            <p className="mt-3 flex items-start gap-2 text-sm text-white/70">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#f4b73c]" />
              Thirumalayampalayam, Coimbatore 641105
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm text-white/70">
              <CalendarDays className="h-4 w-4 shrink-0 text-[#f4b73c]" />
              13 – 16 October 2026
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm text-white/70">
              <Clock className="h-4 w-4 shrink-0 text-[#f4b73c]" />
              Gates open 8:00 AM daily
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p className="ngk-section-kicker !text-[#ffe8a6]">Good to know</p>
            <ul className="mt-3 space-y-2.5 text-sm text-white/75">
              {[
                'College ID is mandatory at the gate.',
                'Each QR pass allows single entry only.',
                'Retrieve your pass anytime from My Tickets.',
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#f4b73c]" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <p className="border-t border-white/10 py-5 text-center text-[11px] text-white/50">
          © 2026 Nehru Group of Institutions · Powered by Ticket Panda
        </p>
      </section>

      <RulesModal activity={active} onClose={() => setActive(null)} onRegister={(a) => { setActive(null); goRegister(a); }} />
    </div>
  );
}
