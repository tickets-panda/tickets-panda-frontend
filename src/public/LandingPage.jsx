import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Database,
  FileText,
  Fingerprint,
  Globe,
  GraduationCap,
  KeyRound,
  Layers,
  Lock,
  Mail,
  QrCode,
  RefreshCw,
  ScanLine,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Ticket,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react';

const STATS = [
  { value: '< 5s', label: 'payment to ticket in inbox' },
  { value: '< 3s', label: 'per person at the gate' },
  { value: '100%', label: 'payments verified, never assumed' },
  { value: 'Zero', label: 'cross-tenant data leaks' },
];

const PROBLEMS = [
  'Cash, UPI screenshots and bank transfers collected by hand',
  'Someone eyeballs every screenshot to "confirm" payment',
  'Ticket numbers assigned manually in a spreadsheet',
  'Gate staff tick names off a printed list',
  'No reliable record of who paid, who entered, or what was collected',
];

const FIXES = [
  'Razorpay checkout — the gateway collects, not a person',
  'Payment verified by signature and re-checked against the gateway API',
  'Ticket generated with a unique key, opaque QR token and PDF',
  'One scan at the gate; a reused ticket is rejected instantly',
  'Every registration, payment, ticket and check-in is recorded',
];

const CHAIN = [
  { icon: FileText, title: 'Registration', text: 'Attendee fills the fields the organizer defined for that event.' },
  { icon: CreditCard, title: 'Payment', text: 'Checkout completes through Razorpay — no manual collection.' },
  { icon: ShieldCheck, title: 'Verification', text: 'Server-side signature check, then confirmed with the gateway.' },
  { icon: Ticket, title: 'Ticket generation', text: 'Unique ticket key, opaque token and QR image created.' },
  { icon: Mail, title: 'Delivery', text: 'PDF e-ticket emailed to the attendee within seconds.' },
  { icon: ScanLine, title: 'Check-in', text: 'QR scanned at the gate; duplicates and fakes are blocked.' },
  { icon: BarChart3, title: 'Analytics', text: 'Live gate counts, revenue and registrations for the organizer.' },
  { icon: Fingerprint, title: 'Audit trail', text: 'Append-only record of every critical action on the platform.' },
];

const AUDIENCES = [
  {
    icon: Server,
    tag: 'Platform',
    title: 'Ticket Panda team',
    points: ['Manage and activate tenants', 'Platform-wide metrics', 'Billing and plan administration', 'Security and audit oversight'],
  },
  {
    icon: Building2,
    tag: 'Organizer',
    title: 'Colleges, clubs, venues',
    points: ['Build events and ticket types', 'Design their own registration form', 'Track bookings, payments and revenue', 'Manage gate staff and scanners'],
  },
  {
    icon: UserCheck,
    tag: 'Gate staff',
    title: 'Front-desk and bouncers',
    points: ['Log in with scoped access', 'Scan QR or type a ticket key', 'See valid / invalid / already-used', 'Watch live checked-in counts'],
  },
  {
    icon: Ticket,
    tag: 'Attendee',
    title: 'Students, guests, diners',
    points: ['Browse the event page', 'Pick a ticket and pay', 'Get the QR by email instantly', 'Access tickets any time via OTP'],
  },
];

const AUDIENCE_TAGS = ['Colleges', 'Festivals', 'Concerts', 'Restaurant nights', 'Exhibitions', 'Workshops', 'Club parties', 'Conferences'];

const ATTENDEE_STEPS = [
  { icon: Globe, title: 'Find the event', text: 'Open the organizer\u2019s page from a shared link or code — no app to install.' },
  { icon: CreditCard, title: 'Register and pay', text: 'Pick a ticket type, fill in the form and pay securely. No screenshot requests, ever.' },
  { icon: QrCode, title: 'Show your QR', text: 'The e-ticket lands in your inbox. Show the QR at the gate and walk in.' },
];

const FEATURES = [
  { icon: CalendarDays, title: 'Event builder', text: 'Title, banner, description, venue, schedule and capacity.' },
  { icon: Layers, title: 'Ticket types', text: 'Multiple tiers per event with their own price and quantity.' },
  { icon: FileText, title: 'Dynamic forms', text: 'Text, dropdown, radio, checkbox, number, date and more — per event.' },
  { icon: Globe, title: 'Publish and share', text: 'Publish when ready and share one clean event link.' },
  { icon: CreditCard, title: 'Bookings and payments', text: 'Filter registrations and inspect the payment behind each one.' },
  { icon: Users, title: 'Staff accounts', text: 'Give gate staff exactly the access they need and nothing more.' },
  { icon: ScanLine, title: 'QR scanner', text: 'Camera scan or manual ticket-key entry for broken or dim screens.' },
  { icon: TrendingUp, title: 'Live gate stats', text: 'See checked-in counts update as the queue moves.' },
  { icon: BarChart3, title: 'Dashboards', text: 'Events, bookings, revenue and check-ins at a glance.' },
];

const SECURITY = [
  { icon: ShieldCheck, title: 'Cryptographic payment verification', text: 'The payment signature is verified server-side, then re-confirmed against Razorpay\u2019s API before a ticket is allowed to exist.' },
  { icon: Lock, title: 'No manual trust', text: 'A screenshot is never treated as proof of payment. Only the gateway can say a payment happened.' },
  { icon: Database, title: 'Tenant data isolation', text: 'Every query is scoped to its tenant. Cross-tenant lookups are rejected, not filtered.' },
  { icon: KeyRound, title: 'Opaque ticket tokens', text: 'The QR holds a random token — never a name, phone number or email address.' },
  { icon: BadgeCheck, title: 'Role-based access control', text: 'Platform admins, organizers and gate staff hold strictly separate permissions.' },
  { icon: Fingerprint, title: 'Audit logging', text: 'An append-only trail of critical actions, plus rate limits and hardened security headers.' },
];

const PLANS = [
  { name: 'Free', blurb: 'For a first event or a one-off fest.', points: ['Limited events per month', 'QR tickets and check-in', 'Standard support'], cta: 'Start free' },
  { name: 'Starter', blurb: 'For clubs running a season of events.', points: ['More events per month', 'Basic analytics', 'Staff accounts'], cta: 'Get Starter', highlight: true },
  { name: 'Business', blurb: 'For venues and agencies at volume.', points: ['Unlimited events', 'Custom branding', 'API access'], cta: 'Talk to us' },
  { name: 'Enterprise', blurb: 'For organizations with their own domain.', points: ['Custom domain', 'SLA and priority support', 'Onboarding assistance'], cta: 'Contact sales' },
];

const FAQS = [
  { q: 'Do attendees need to create an account?', a: 'No. They buy with their details and can reopen their tickets any time using a one-time code sent to their phone or email — no password to remember.' },
  { q: 'How do you stop fake payment screenshots?', a: 'Screenshots are never accepted. The payment signature is verified on the server and then re-confirmed directly with the gateway API, so a ticket is only issued for a payment that actually happened.' },
  { q: 'What happens if the same ticket is scanned twice?', a: 'The first successful scan marks the ticket as used. The next scan is rejected as already used, and the attempt is recorded against the staff member who made it.' },
  { q: 'Can an organizer ask for their own questions?', a: 'Yes. Each event has its own registration form built from the field types the organizer chooses — short text, long text, dropdown, single choice, checkboxes, number, date and more.' },
  { q: 'Is one organization\u2019s data visible to another?', a: 'No. Tenant isolation is enforced on every query, and platform-level access is a separate, audited role.' },
  { q: 'What exactly does the attendee receive?', a: 'An email with a PDF ticket and QR code, plus a confirmation page. The same ticket can be downloaded again from My Tickets.' },
];

function Section({ eyebrow, title, subtitle, children, dark = false, className = '' }) {
  return (
    <section className={`mx-auto max-w-6xl px-4 py-14 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-2xl text-center">
        {eyebrow && (
          <p className={`text-xs font-bold uppercase tracking-widest ${dark ? 'text-brand-300' : 'text-brand-600'}`}>
            {eyebrow}
          </p>
        )}
        <h2
          className={`mt-2 text-2xl font-bold tracking-tight sm:text-3xl ${
            dark ? 'text-white' : 'text-zinc-900'
          }`}
        >
          {title}
        </h2>
        {subtitle && (
          <p className={`mt-3 text-sm sm:text-base ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export default function LandingPage() {
  const [slug, setSlug] = useState('');
  const [openFaq, setOpenFaq] = useState(0);
  const navigate = useNavigate();

  const go = (event) => {
    event.preventDefault();
    const clean = slug.trim().replace(/^\/+|\/+$/g, '');
    if (clean) navigate(`/t/${clean}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-brand-50 to-zinc-50">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-16 text-center sm:pb-20 sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3 py-1 text-xs font-semibold text-brand-700">
            <Sparkles className="h-3.5 w-3.5" /> Multi-tenant ticketing platform
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-5xl">
            Sell tickets. Verify payments. Scan at the gate.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-zinc-600 sm:text-lg">
            Ticket Panda automates the whole chain for any paid event — registration, payment verification,
            ticket generation, QR delivery and event-day entry. No spreadsheets, no screenshots, no manual
            checking at the door.
          </p>

          <form onSubmit={go} className="mx-auto mt-8 flex max-w-md items-center gap-2" id="find-event">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="Enter an organizer code, e.g. demo-college"
                className="input pl-9"
                aria-label="Organizer code"
              />
            </div>
            <button
              type="submit"
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              Find event <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-zinc-500">
            <Link to="/tenant/register" className="font-semibold text-brand-600 hover:underline">
              Create an organizer account
            </Link>
            <span className="text-zinc-300">•</span>
            <Link to="/tenant/login" className="font-semibold text-brand-600 hover:underline">
              Organizer sign in
            </Link>
            <span className="text-zinc-300">•</span>
            <Link to="/my-tickets" className="font-semibold text-brand-600 hover:underline">
              Already have tickets?
            </Link>
          </div>

          <dl className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-zinc-200 bg-white/70 px-3 py-4">
                <dt className="text-2xl font-extrabold tracking-tight text-brand-600">{stat.value}</dt>
                <dd className="mt-1 text-xs leading-snug text-zinc-600">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* The problem */}
      <Section
        eyebrow="The problem"
        title="Running a gate on trust is expensive"
        subtitle="Most events still reconcile payments by hand. It is slow, it does not scale, and it leaks money through fraud and honest mistakes."
      >
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-900">
              <XCircle className="h-4 w-4 text-red-500" /> The manual way
            </h3>
            <ul className="mt-4 space-y-3">
              {PROBLEMS.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-zinc-600">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border-2 border-brand-300 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> With Ticket Panda
            </h3>
            <ul className="mt-4 space-y-3">
              {FIXES.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-zinc-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* The chain */}
      <div className="bg-zinc-900">
        <Section
          eyebrow="How it works"
          title="One automated chain, end to end"
          subtitle="Every step that used to be a person is now a system step — and each one leaves a record behind."
          dark
        >
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CHAIN.map(({ icon: Icon, title, text }, index) => (
              <div key={title} className="rounded-xl border border-zinc-700 bg-zinc-800/60 p-5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex rounded-lg bg-brand-500/15 p-2 text-brand-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-bold text-zinc-500">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-white">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">{text}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Who it's for */}
      <Section
        eyebrow="Who it's for"
        title="One platform, four kinds of user"
        subtitle="Everyone gets their own view, their own permissions and their own job to do."
      >
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCES.map(({ icon: Icon, tag, title, points }) => (
            <div key={tag} className="card p-5">
              <span className="inline-flex rounded-lg bg-brand-50 p-2 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-brand-600">{tag}</p>
              <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
              <ul className="mt-3 space-y-2">
                {points.map((point) => (
                  <li key={point} className="flex gap-2 text-xs text-zinc-600">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold text-zinc-500">Built for:</span>
          {AUDIENCE_TAGS.map((tag) => (
            <span key={tag} className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600">
              {tag}
            </span>
          ))}
        </div>
      </Section>

      {/* Attendee journey */}
      <div className="bg-white">
        <Section
          eyebrow="For attendees"
          title="Three steps from link to gate"
          subtitle="Nothing to install, no account to create, no password to forget."
        >
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {ATTENDEE_STEPS.map(({ icon: Icon, title, text }, index) => (
              <div key={title} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <Icon className="h-5 w-5 text-brand-600" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-zinc-900">{title}</h3>
                <p className="mt-1 text-sm text-zinc-600">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/t/demo-college"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              See a live event page <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/my-tickets"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
            >
              <Ticket className="h-4 w-4" /> Open My Tickets
            </Link>
          </div>
        </Section>
      </div>

      {/* Organizer features */}
      <Section
        eyebrow="For organizers"
        title="Everything the event desk needs"
        subtitle="Set the event up once, then watch the bookings, payments and gate traffic come in."
      >
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-5 transition hover:border-brand-300 hover:shadow-md">
              <span className="inline-flex rounded-lg bg-brand-50 p-2 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-zinc-900">{title}</h3>
              <p className="mt-1 text-sm text-zinc-600">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Security */}
      <div className="bg-gradient-to-b from-brand-800 to-brand-900">
        <Section
          eyebrow="Security"
          title="No manual trust, anywhere in the chain"
          subtitle="The whole point of the platform is that a ticket exists only because a verified payment created one."
          dark
        >
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SECURITY.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <span className="inline-flex rounded-lg bg-white/15 p-2 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-sm font-semibold text-white">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-brand-50">{text}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Product boundary */}
      <Section
        eyebrow="Scope"
        title="What is in — and what is not"
        subtitle="Being clear about the boundary is part of the design."
      >
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Available today
            </h3>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {['Multi-tenant architecture', 'Events and ticket types', 'Dynamic registration forms', 'Razorpay payments', 'Signature verification', 'Ticket generation with QR', 'PDF tickets by email', 'OTP access to My Tickets', 'Scanner check-in for staff', 'Organizer dashboard', 'Platform admin dashboard', 'Audit logging and RBAC'].map((item) => (
                <li key={item} className="flex gap-2 text-sm text-zinc-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-900">
              <RefreshCw className="h-4 w-4 text-zinc-400" /> On the roadmap
            </h3>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {['Embeddable widget', 'Public REST API', 'Tenant webhooks', 'CSV and PDF exports', 'Refund management', 'Event reminders', 'Custom tenant branding', 'SaaS billing', 'Assigned seating', 'Multi-currency', 'Native mobile app', 'Offline check-in'].map((item) => (
                <li key={item} className="flex gap-2 text-sm text-zinc-500">
                  <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Plans */}
      <div className="bg-white">
        <Section
          eyebrow="Plans"
          title="Pricing that starts free"
          subtitle="Plans are provisioned per organization, so each tenant keeps its own events, data and staff."
        >
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col rounded-2xl border p-6 ${
                  plan.highlight ? 'border-brand-400 bg-brand-50 shadow-md' : 'border-zinc-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-900">{plan.name}</h3>
                  {plan.highlight && (
                    <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      Popular
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-zinc-600">{plan.blurb}</p>
                <ul className="mt-4 flex-1 space-y-2">
                  {plan.points.map((point) => (
                    <li key={point} className="flex gap-2 text-xs text-zinc-600">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/tenant/register"
                  className={`mt-5 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    plan.highlight
                      ? 'bg-brand-500 text-white hover:bg-brand-600'
                      : 'border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50'
                  }`}
                >
                  {plan.cta} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* FAQ */}
      <Section eyebrow="FAQ" title="Questions people ask first">
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          {FAQS.map((faq, index) => {
            const open = openFaq === index;
            return (
              <div key={faq.q}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? -1 : index)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-zinc-900">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-zinc-400 transition ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && <p className="px-5 pb-4 text-sm leading-relaxed text-zinc-600">{faq.a}</p>}
              </div>
            );
          })}
        </div>
      </Section>

      {/* Final CTA */}
      <section className="bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <GraduationCap className="mx-auto h-8 w-8 text-brand-400" />
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Automate the gate. 🐼
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400">
            Set up an event, share one link, and let the platform handle payments, tickets and entry.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/tenant/register"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              Create an organizer account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/tenant/login"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800"
            >
              <Lock className="h-4 w-4" /> Sign in
            </Link>
          </div>
          <p className="mt-6 text-xs text-zinc-500">
            <Mail className="mr-1 inline h-3.5 w-3.5" />
            Attendees keep tickets in{' '}
            <Link to="/my-tickets" className="font-semibold text-brand-400 hover:underline">
              My Tickets
            </Link>{' '}
            — verified with a one-time code, no password needed.
          </p>
        </div>
      </section>
    </div>
  );
}
