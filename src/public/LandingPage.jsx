import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Database,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Mic2,
  QrCode,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Ticket,
  TrendingUp,
  Users,
  Wrench,
  XCircle,
  Zap,
} from 'lucide-react';
import Button from '../shared/components/Button.jsx';
import Reveal from '../shared/components/Reveal.jsx';

/* ─── Data ────────────────────────────────────────────────────────────────── */

const VALUE_PROPS = [
  {
    icon: CreditCard,
    title: 'Verified Payments',
    description: 'Every transaction is confirmed server-side before tickets are issued. No screenshot review, no manual reconciliation.',
    accent: 'bg-blue-50 text-blue-600',
  },
  {
    icon: QrCode,
    title: 'QR Digital Tickets',
    description: 'Single-use passes with random keys — displayed on screen and delivered as a PDF by email, automatically.',
    accent: 'bg-brand-50 text-brand-600',
  },
  {
    icon: ScanLine,
    title: 'Smart Gate Check-in',
    description: 'Staff scan with any smartphone. First scan admits, duplicates are declined instantly. Under 3 seconds per scan.',
    accent: 'bg-emerald-50 text-emerald-600',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: CalendarDays,
    title: 'Create',
    description: 'Organizer publishes an event with activities, ticket types, pricing, and custom registration fields.',
  },
  {
    step: '02',
    icon: FileText,
    title: 'Register',
    description: 'Attendees select a ticket, fill the form, and pay. Payment is verified server-side before proceeding.',
  },
  {
    step: '03',
    icon: Ticket,
    title: 'Receive',
    description: 'A single-use QR ticket appears on screen and is emailed as a PDF — no staff intervention needed.',
  },
  {
    step: '04',
    icon: ScanLine,
    title: 'Verify',
    description: 'Gate staff scan QR codes with their phone. Valid entries are admitted; repeats and fakes are declined.',
  },
];

const PAIN_POINTS = [
  { text: 'Reviewing payment screenshots one by one', icon: XCircle },
  { text: 'Managing registrations across disconnected spreadsheets', icon: XCircle },
  { text: 'Paper-based gate lists that can\'t detect duplicate entry', icon: XCircle },
];

const SOLUTIONS = [
  { text: 'Payments verified automatically on the server', icon: CheckCircle2 },
  { text: 'Registrations, payments, and tickets in one dashboard', icon: CheckCircle2 },
  { text: 'Single-use QR gates that block duplicates instantly', icon: CheckCircle2 },
];

const AUDIENCES = [
  {
    icon: GraduationCap,
    title: 'College Fests',
    description: 'Multi-activity festivals with per-activity registration, student volunteer scanners, and crowd capacity management.',
    color: 'border-blue-200 bg-blue-50/50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Mic2,
    title: 'Conferences & Summits',
    description: 'Tiered tickets, speaker session tracking, document collection, and attendee directory export for post-event follow-up.',
    color: 'border-purple-200 bg-purple-50/50',
    iconColor: 'text-purple-600',
  },
  {
    icon: Users,
    title: 'Concerts & Shows',
    description: 'High-capacity crowd control with real-time gate stats, anti-passback enforcement, and live admission monitoring.',
    color: 'border-brand-200 bg-brand-50/50',
    iconColor: 'text-brand-600',
  },
  {
    icon: Wrench,
    title: 'Workshops & Hackathons',
    description: 'Custom registration forms, team rosters, attendance tracking, and CSV export for certificates and follow-up.',
    color: 'border-emerald-200 bg-emerald-50/50',
    iconColor: 'text-emerald-600',
  },
];

const TRUST_SIGNALS = [
  {
    icon: ShieldCheck,
    title: 'Server-Side Verification',
    description: 'Gateway signature validation plus direct status check before any ticket is generated.',
  },
  {
    icon: ScanLine,
    title: 'Single-Use Admission',
    description: 'Database-locked ticket state ensures each pass admits once. Duplicates are declined.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Complete Audit Trail',
    description: 'Payment transitions, ticket issuance, and check-ins recorded with timestamps.',
  },
  {
    icon: Database,
    title: 'Tenant Data Isolation',
    description: 'Every query is scoped to the owning organizer. Data is never shared across tenants.',
  },
];

/* ─── Component ───────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden">

      {/* ================================================================= */}
      {/* 1. HERO                                                           */}
      {/* ================================================================= */}
      <Reveal as="section" className="relative border-b border-zinc-200/80 bg-gradient-to-b from-white via-zinc-50/30 to-white pt-14 pb-20 lg:pt-24 lg:pb-32">
        {/* Grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left — Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-brand-50/90 px-3.5 py-1 text-xs font-bold text-brand-700 shadow-subtle">
                <Sparkles className="h-3.5 w-3.5 text-brand-500" />
                <span>Event ticketing + QR gate verification</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-zinc-950 leading-[1.08] font-display">
                Your events, fully verified{' '}
                <span className="bg-gradient-to-r from-brand-600 to-orange-500 bg-clip-text text-transparent">
                  from payment to gate.
                </span>
              </h1>

              <p className="max-w-xl text-base sm:text-lg text-zinc-600 leading-relaxed">
                Ticket Panda handles registration, payment verification, QR ticket delivery, and smartphone gate check-in — so you never review a payment screenshot again.
              </p>

              {/* CTAs */}
              <div className="pt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Button size="xl" variant="primary" rightIcon={ArrowRight} onClick={() => navigate('/organizer/register')}>
                  Create Your Event
                </Button>
                <Button size="xl" variant="secondary" leftIcon={CalendarDays} onClick={() => navigate('/events')}>
                  Find Events
                </Button>
              </div>

              {/* Trust strip */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs font-semibold text-zinc-500">
                {['Verified Payments', 'QR Check-in', 'PDF e-Tickets'].map((t) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Ticket Card Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-brand-500/20 to-orange-400/10 blur-xl -z-10" />

                <div className="transform transition-transform hover:-translate-y-1 duration-300">
                  <div className="card overflow-hidden border-zinc-200/90 shadow-ticket bg-white">
                    {/* Header */}
                    <div className="bg-zinc-950 px-5 py-3.5 text-white flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">🐼</span>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-400">Verified Pass</p>
                          <p className="text-xs font-bold text-zinc-200">Your Organization Name</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ADMIT ONE
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-5 space-y-4">
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-600">Annual Fest 2026</span>
                        <h3 className="text-lg font-black text-zinc-950">Solo Dance Competition</h3>
                        <p className="text-xs text-zinc-500">15 October · 10:00 AM · Main Auditorium</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 rounded-xl bg-zinc-50 p-3 text-xs">
                        <div>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase">Attendee</p>
                          <p className="font-bold text-zinc-900">Your Name Here</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase">Status</p>
                          <p className="font-bold text-emerald-600">Verified & Active</p>
                        </div>
                      </div>

                      {/* Perforation */}
                      <div className="relative flex items-center justify-center">
                        <div className="absolute -left-9 h-5 w-5 rounded-full bg-zinc-100 border-r border-zinc-200" />
                        <div className="w-full border-t-2 border-dashed border-zinc-200" />
                        <div className="absolute -right-9 h-5 w-5 rounded-full bg-zinc-100 border-l border-zinc-200" />
                      </div>

                      {/* QR */}
                      <div className="flex items-center gap-4">
                        <div className="rounded-xl border-2 border-zinc-900 p-1.5 bg-white shrink-0 shadow-sm">
                          <QrCode className="h-16 w-16 text-zinc-950" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-mono text-xs font-black tracking-wider text-zinc-900">TP-K7X9-M2P4-R8</p>
                          <p className="text-[11px] text-zinc-500 mt-1">Show this QR at the gate for entry</p>
                          <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Payment Verified</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating stat */}
                <div className="absolute -bottom-4 -left-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-card hidden sm:flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-zinc-500 font-medium">Gate progress</p>
                    <p className="text-sm font-black text-zinc-900">1,428 / 1,500 checked in</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ================================================================= */}
      {/* 2. VALUE PROPOSITIONS                                             */}
      {/* ================================================================= */}
      <Reveal as="section" className="py-16 lg:py-20 bg-white border-b border-zinc-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center space-y-2 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Why Ticket Panda</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 font-display">
              Everything you need, nothing you don't.
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {VALUE_PROPS.map((vp, i) => {
              const Icon = vp.icon;
              return (
                <Reveal key={i} delay={i * 80} className="card p-8 space-y-4 hover:border-brand-300 hover:shadow-card-hover transition-all">
                  <div className={`rounded-2xl p-3.5 inline-block ${vp.accent}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900">{vp.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{vp.description}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* ================================================================= */}
      {/* 3. HOW IT WORKS — unified 4-step flow                             */}
      {/* ================================================================= */}
      <Reveal as="section" className="py-16 lg:py-20 bg-zinc-50 border-b border-zinc-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center space-y-2 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 font-display">
              Four steps from event to entry.
            </h2>
            <p className="text-sm text-zinc-600">
              A defined pipeline that handles every stage — from publishing your event to verifying the last attendee at the gate.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={i} delay={i * 90} className="card relative p-6 space-y-3 hover:border-brand-300 hover:shadow-card-hover transition-all">
                  <div className="flex items-center justify-between">
                    <div className="rounded-xl bg-brand-50 p-3 text-brand-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-black font-display text-zinc-200">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900">{item.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{item.description}</p>
                  {i < 3 && (
                    <ChevronRight className="hidden lg:block absolute top-1/2 -right-4 h-5 w-5 text-zinc-300 -translate-y-1/2 z-10" />
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* ================================================================= */}
      {/* 4. PROBLEM vs. SOLUTION                                           */}
      {/* ================================================================= */}
      <Reveal as="section" className="py-16 lg:py-20 bg-white border-b border-zinc-200/80">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center space-y-2 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Before vs. After</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 font-display">
              Replace the spreadsheets and screenshots.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Pain */}
            <div className="rounded-3xl border border-rose-200 bg-rose-50/40 p-8 space-y-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-rose-100 p-2.5 text-rose-700">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-rose-950">The manual way</h3>
              </div>
              <ul className="space-y-4">
                {PAIN_POINTS.map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-rose-900">
                    <p.icon className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{p.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solution */}
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-8 space-y-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-emerald-950">With Ticket Panda</h3>
              </div>
              <ul className="space-y-4">
                {SOLUTIONS.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-emerald-950">
                    <s.icon className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{s.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ================================================================= */}
      {/* 5. BUILT FOR — audience cards                                     */}
      {/* ================================================================= */}
      <Reveal as="section" className="py-16 lg:py-20 bg-zinc-50 border-b border-zinc-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center space-y-2 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Built For</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 font-display">
              Any event that needs verified entry.
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCES.map((a, i) => {
              const Icon = a.icon;
              return (
                <Reveal key={i} delay={i * 80} className={`rounded-2xl border p-6 space-y-3 transition-all hover:shadow-card ${a.color}`}>
                  <Icon className={`h-8 w-8 ${a.iconColor}`} />
                  <h3 className="text-base font-bold text-zinc-900">{a.title}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">{a.description}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* ================================================================= */}
      {/* 6. TRUST SIGNALS                                                  */}
      {/* ================================================================= */}
      <Reveal as="section" className="py-16 lg:py-20 bg-white border-b border-zinc-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center space-y-2 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Platform Assurance</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 font-display">
              Security and integrity built in.
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_SIGNALS.map((ts, i) => {
              const Icon = ts.icon;
              return (
                <Reveal key={i} delay={i * 70} className="card p-6 space-y-3">
                  <div className="rounded-xl bg-brand-50 p-2.5 text-brand-600 inline-block">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900">{ts.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{ts.description}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* ================================================================= */}
      {/* 7. FINAL CTA BANNER                                               */}
      {/* ================================================================= */}
      <Reveal as="section" className="py-20 bg-gradient-to-tr from-brand-600 via-orange-600 to-amber-600 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-6 relative z-10">
          <span className="text-5xl">🐼</span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-display text-white">
            Ready to automate your event gate?
          </h2>
          <p className="mx-auto max-w-xl text-sm sm:text-base text-white/90 leading-relaxed">
            Create your event in minutes. Get verified payments, instant QR tickets, and real-time gate check-in — all in one platform.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/organizer/register"
              className="inline-flex items-center gap-2 rounded-2xl bg-zinc-950 px-8 py-3.5 text-sm font-bold text-white shadow-xl hover:bg-zinc-900 active:scale-95 transition"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/20 backdrop-blur-md px-8 py-3.5 text-sm font-bold text-white border border-white/30 hover:bg-white/30 transition"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </Reveal>

    </div>
  );
}
