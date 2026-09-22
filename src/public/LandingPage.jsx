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
  FileSpreadsheet,
  FileText,
  Fingerprint,
  Globe,
  GraduationCap,
  KeyRound,
  Layers,
  Lock,
  Mail,
  MapPin,
  QrCode,
  RefreshCw,
  ScanLine,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Ticket,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
  Zap,
} from 'lucide-react';
import Button from '../shared/components/Button.jsx';
import TicketCard from '../shared/components/TicketCard.jsx';
import Badge from '../shared/components/Badge.jsx';
import Reveal from '../shared/components/Reveal.jsx';

const STATS = [
  { value: '< 3 sec', label: 'average QR gate check-in time' },
  { value: '100%', label: 'server-side verified payments' },
  { value: 'Single-use', label: 'QR admission enforcement' },
  { value: 'Automatic', label: 'PDF e-ticket delivery by email' },
];

const ATTENDEE_CHAIN = [
  {
    step: '01',
    icon: FileText,
    title: 'Registration',
    description:
      'Attendees open the organizer\u2019s event link, select a ticket type, and complete the registration form configured for that event.',
  },
  {
    step: '02',
    icon: CreditCard,
    title: 'Verified Payment',
    description:
      'Payment is completed through the integrated gateway and verified on the server before any ticket is issued. No manual screenshot review.',
  },
  {
    step: '03',
    icon: QrCode,
    title: 'QR Ticket',
    description:
      'Each verified booking generates a single-use QR ticket with a random, non-sequential key, shown on screen and emailed as a PDF.',
  },
  {
    step: '04',
    icon: ScanLine,
    title: 'Gate Scan',
    description:
      'Gate staff scan the QR code with a standard smartphone. First scan admits; any repeat presentation is flagged immediately.',
  },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    icon: CalendarDays,
    title: 'Publish the Event Page',
    description: 'Create a branded event portal with activities, ticket types, capacities, schedules, and venue details.',
  },
  {
    step: '02',
    icon: FileText,
    title: 'Configure Registration Fields',
    description: 'Define required attendee information such as name, contact, roll number, team details, and document uploads.',
  },
  {
    step: '03',
    icon: CreditCard,
    title: 'Accept Verified Payments',
    description: 'Online payments are confirmed server-side. Organizers do not reconcile UPI screenshots or bank statements manually.',
  },
  {
    step: '04',
    icon: Ticket,
    title: 'Issue Digital Tickets Automatically',
    description: 'Each verified booking receives a personalized QR pass on screen and a PDF copy by email without staff intervention.',
  },
  {
    step: '05',
    icon: ScanLine,
    title: 'Verify Entry at the Gate',
    description: 'Authorized staff scan QR codes with any smartphone browser. Reused or invalid codes are declined with a clear alert.',
  },
];

/* Static, generic illustrations for orientation. Not live client events. */
const EXAMPLE_FORMATS = [
  {
    category: 'Example \u00b7 Cultural Fest',
    title: 'Example Annual Cultural Fest',
    organizer: 'Example host institution',
    activities: ['Solo Dance', 'Group Dance', 'Battle of Bands', 'Fashion Walk'],
    capacity: 'Illustrative capacity: 3,500',
    tone: 'brand',
    badge: 'Example',
  },
  {
    category: 'Example \u00b7 Technical Symposium',
    title: 'Example Hackathon Program',
    organizer: 'Example department host',
    activities: ['24-Hr Hackathon', 'Code Sprint', 'Ideathon', 'Paper Presentation'],
    capacity: 'Illustrative capacity: 600',
    tone: 'purple',
    badge: 'Example',
  },
  {
    category: 'Example \u00b7 Conference',
    title: 'Example Robotics Conclave',
    organizer: 'Example academic society',
    activities: ['Keynote Sessions', 'Robo Challenge', 'Drone Demo', 'Project Expo'],
    capacity: 'Illustrative capacity: 1,200',
    tone: 'blue',
    badge: 'Example',
  },
  {
    category: 'Example \u00b7 Concert Evening',
    title: 'Example Spring Concert',
    organizer: 'Example student union',
    activities: ['General Arena', 'Reserved Seating', 'Backstage Pass'],
    capacity: 'Illustrative capacity: 5,000',
    tone: 'green',
    badge: 'Example',
  },
];

const TRUST_SIGNALS = [
  {
    icon: ShieldCheck,
    title: 'Server-Side Payment Verification',
    description:
      'Every transaction is confirmed on the server using gateway signature validation and a direct status fetch before tickets are generated. Unpaid or mismatched orders never produce admission passes.',
  },
  {
    icon: ScanLine,
    title: 'Single-Use Admission Control',
    description:
      'Each ticket carries a random, non-sequential key. The first valid scan marks the ticket as used under a database lock, so forwarded screenshots and duplicate presentations are declined at the gate.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Audit Logs for Reconciliation',
    description:
      'Payment transitions, ticket issuance, and check-in events are recorded with timestamps and operator references, giving organizers a dependable record for finance review and dispute handling.',
  },
  {
    icon: Database,
    title: 'Tenant Data Isolation',
    description:
      'Each organizer\u2019s events, bookings, payments, and attendee records are scoped to their own tenant. Organizers can access only their own data; attendee information is never shared across tenants.',
  },
];

const GETTING_STARTED = [
  {
    step: '1',
    title: 'Create the organizer account',
    description:
      'Register the institution or organization workspace and complete the profile with official name, contact, and branding.',
  },
  {
    step: '2',
    title: 'Create the event and ticket types',
    description:
      'Add event title, schedule, venue, capacity, and ticket tiers. For festivals, add activities with independent capacities and rules.',
  },
  {
    step: '3',
    title: 'Configure registration and publish',
    description:
      'Define the registration fields and document requirements, then publish the shareable event link for distribution.',
  },
  {
    step: '4',
    title: 'Monitor bookings and payments',
    description:
      'Track registrations, verified payments, and revenue from the dashboard. Export attendee records when required.',
  },
  {
    step: '5',
    title: 'Prepare gate verification',
    description:
      'Invite gate staff, assign scanner access, and verify entry with standard smartphones on event day.',
  },
];

const FAQS = [
  {
    question: 'How does Ticket Panda verify payments?',
    answer:
      'Payments are verified on the server. The gateway signature is validated and the transaction status is fetched directly from the payment provider before any ticket is generated. Orders without a confirmed settlement do not produce admission passes, which removes the need for manual screenshot inspection.',
  },
  {
    question: 'How does gate verification prevent repeat entry with the same ticket?',
    answer:
      'Each ticket contains a random, non-sequential key that resolves to a single booking record. The first valid scan marks the ticket as used under a database lock. Any later presentation of the same code is declined with the prior check-in time and gate reference shown to staff.',
  },
  {
    question: 'Can a multi-activity festival be managed under one event?',
    answer:
      'Yes. An event can include multiple activities with independent capacities, schedules, pricing, and registration requirements. Attendees register for specific activities, and gate staff see the activity and ticket tier for each scan.',
  },
  {
    question: 'What equipment is required for gate scanning?',
    answer:
      'No dedicated hardware is required. Authorized staff open the scanner in a standard mobile browser and use the device camera. Each scan typically completes in under three seconds with a clear valid, repeat, or invalid indication.',
  },
  {
    question: 'How do attendees receive and recover their tickets?',
    answer:
      'After verified payment, the ticket is displayed on the confirmation screen and a PDF copy is emailed to the registered address. If the email is misplaced, attendees can use the My Tickets section with a secure login code to view or download active passes.',
  },
  {
    question: 'Can registration collect documents such as college ID or consent forms?',
    answer:
      'Yes. Organizers can add document upload fields with permitted file types and size limits. Uploads are attached to the booking record for review prior to the event.',
  },
  {
    question: 'Is organizer data kept separate from other organizers?',
    answer:
      'Yes. The platform applies tenant-scoped data isolation: every events, bookings, payments, and attendee query is restricted to the owning organizer. Organizers can view and export only their own records.',
  },
  {
    question: 'What records are available for reconciliation after the event?',
    answer:
      'The dashboard retains booking, payment, ticket, and check-in records with timestamps, and supports CSV export of the attendee directory. Payment status and gate activity can therefore be reconciled against settlement reports.',
  },
  {
    question: 'Where can organizers get help with setup or event-day operations?',
    answer:
      'The Help Center covers ticket recovery and scanner setup, and the contact page reaches platform support for onboarding, configuration, and operational questions. See /help and /contact for guidance.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <Reveal as="section" className="relative border-b border-zinc-200/80 bg-gradient-to-b from-white via-zinc-50/50 to-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Copy (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-brand-50/90 px-3.5 py-1 text-xs font-bold text-brand-700 shadow-subtle">
                <Sparkles className="h-3.5 w-3.5 text-brand-500" />
                <span>Ticketing, verified payments, and QR gate check-in for colleges and organizations</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 leading-[1.08] font-display">
                Registration, verified payments, and gate check-in,{' '}
                <span className="bg-gradient-to-r from-brand-600 to-orange-500 bg-clip-text text-transparent">
                  managed in one platform.
                </span>
              </h1>

              <p className="max-w-2xl text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
                Ticket Panda provides branded event pages, structured registration, server-verified payments, single-use QR tickets with PDF email delivery, and smartphone-based gate verification. It replaces manual forms, spreadsheets, and screenshot-based payment review.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Button
                  size="xl"
                  variant="primary"
                  rightIcon={ArrowRight}
                  onClick={() => navigate('/tenant/register')}
                >
                  Create an Event
                </Button>
                <Button
                  size="xl"
                  variant="secondary"
                  leftIcon={CalendarDays}
                  onClick={() => navigate('/events')}
                >
                  Explore Events
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Server-side payment verification</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Single-use QR admission control</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Standard smartphones for gate scanning</span>
                </div>
              </div>
            </div>

            {/* Right Product Preview UI (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual Glass Glow */}
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-brand-500/20 to-orange-400/10 blur-xl -z-10" />

                {/* Simulated Digital Ticket Artifact */}
                <div className="transform transition-transform hover:-translate-y-1 duration-300">
                  <div className="card overflow-hidden border-zinc-200/90 shadow-ticket bg-white">
                    {/* Ticket Header */}
                    <div className="bg-zinc-950 px-5 py-3 text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🐼</span>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-400">
                            Verified Pass
                          </p>
                          <p className="text-xs font-bold text-zinc-200">
                            Example host institution
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        ADMIT ONE
                      </span>
                    </div>

                    {/* Ticket Body */}
                    <div className="p-5 space-y-4">
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-600">
                          Example fest &middot; Sample ticket layout
                        </span>
                        <h3 className="text-lg font-black text-zinc-950">
                          Solo Dance Competition
                        </h3>
                        <p className="text-xs text-zinc-500">
                          15 October 2026 &middot; 10:00 AM &middot; Main Auditorium
                        </p>
                      </div>

                      {/* Details row */}
                      <div className="grid grid-cols-2 gap-2 rounded-xl bg-zinc-50 p-3 text-xs">
                        <div>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase">Participant</p>
                          <p className="font-bold text-zinc-900 truncate">Registered Attendee</p>
                          <p className="text-[11px] text-zinc-500">ID verified at registration</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase">Gate Status</p>
                          <p className="font-bold text-emerald-600">Verified &amp; Active</p>
                          <p className="text-[11px] text-zinc-500">Tier: General Entry</p>
                        </div>
                      </div>

                      {/* Perforation Cut */}
                      <div className="relative my-2 flex items-center justify-center">
                        <div className="absolute -left-9 h-5 w-5 rounded-full bg-zinc-100 border-r border-zinc-200" />
                        <div className="w-full border-t-2 border-dashed border-zinc-200" />
                        <div className="absolute -right-9 h-5 w-5 rounded-full bg-zinc-100 border-l border-zinc-200" />
                      </div>

                      {/* Mock QR + Key */}
                      <div className="flex items-center gap-4">
                        <div className="rounded-xl border-2 border-zinc-900 p-1.5 bg-white shrink-0 shadow-sm">
                          <QrCode className="h-20 w-20 text-zinc-950" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-mono text-xs font-black tracking-wider text-zinc-900">
                            TP-EXAMPLE-000000
                          </p>
                          <p className="text-[11px] text-zinc-500 mt-1 leading-snug">
                            Present this QR code at the designated gate for verification. Illustrative layout only.
                          </p>
                          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Payment Verified Online</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Live Scanner Callout Pill */}
                    <div className="border-t border-zinc-100 bg-zinc-50/80 px-5 py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-zinc-600">
                        <ScanLine className="h-3.5 w-3.5 text-brand-500" />
                        <span>Typical scanner decision: <strong>under 3 seconds</strong></span>
                      </div>
                      <span className="font-mono text-[10px] text-zinc-400">Opaque token</span>
                    </div>
                  </div>
                </div>

                {/* Floating Metrics Badge */}
                <div className="absolute -bottom-5 -left-4 rounded-2xl border border-zinc-200 bg-white p-3.5 shadow-card hidden sm:flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-medium">Illustrative gate progress</p>
                    <p className="text-sm font-black text-zinc-900">1,428 / 1,500 checked in (95%)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick KPI Bar */}
          <div className="mt-16 grid grid-cols-2 gap-4 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-subtle sm:grid-cols-4">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center sm:text-left sm:border-r last:border-0 border-zinc-100 sm:px-4">
                <p className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 font-display">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-zinc-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ========================================================================= */}
      {/* 2. THE PROBLEM VS TICKET PANDA SOLUTION */}
      {/* ========================================================================= */}
      <Reveal as="section" className="py-20 bg-white border-b border-zinc-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Why Organizers Adopt Ticket Panda
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 font-display">
              A structured alternative to manual registration and payment review.
            </h2>
            <p className="text-sm sm:text-base text-zinc-600">
              Manual forms, spreadsheets, and screenshot verification create administrative overhead and admission risk. Ticket Panda provides a defined pipeline from registration to gate verification.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {/* The Old Broken Way */}
            <div className="rounded-3xl border border-rose-200 bg-rose-50/40 p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-rose-100 p-2.5 text-rose-700">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-rose-950">Manual administration</h3>
                  <p className="text-xs text-rose-800">Common limitations of forms and spreadsheets</p>
                </div>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-rose-900">
                <li className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Form plus screenshot collection:</strong> Staff review payment screenshots individually, a process that is time-consuming and difficult to authenticate.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Disconnected spreadsheets:</strong> Registration records, payment notes, and cancellations are maintained separately and can become inconsistent.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Manual ticket distribution:</strong> Passes are sent individually through messages or email without a verifiable admission record.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Paper-based gate lists:</strong> Names are checked against printed sheets, which cannot detect forwarded or duplicated passes.</span>
                </li>
              </ul>
            </div>

            {/* The Ticket Panda Way */}
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-950">The Ticket Panda process</h3>
                  <p className="text-xs text-emerald-800">Defined, verified, and recorded at each stage</p>
                </div>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-emerald-950">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Verified checkout:</strong> Bookings are confirmed only after server-side payment verification. Manual screenshot review is not required.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Automatic ticket issuance:</strong> Attendees receive a single-use QR ticket on screen and a PDF copy by email immediately after verification.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Controlled gate verification:</strong> Staff scan passes with standard smartphones. Repeat presentations are declined with a staff-facing alert.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Recorded operations:</strong> Bookings, payments, issuance, and check-ins are logged for review, export, and reconciliation.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ========================================================================= */}
      {/* 3. ATTENDEE PROCESS: REGISTRATION -> PAYMENT -> QR -> GATE */}
      {/* ========================================================================= */}
      <Reveal as="section" className="py-20 bg-zinc-50 border-b border-zinc-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Attendee Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 font-display">
              Registration to gate verification in four stages
            </h2>
            <p className="text-sm text-zinc-600">
              Each booking follows the same verified sequence. Tickets are issued only after payment confirmation.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ATTENDEE_CHAIN.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="card relative flex flex-col justify-between p-6 border-zinc-200/90 hover:border-brand-300 hover:shadow-card-hover transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="rounded-xl bg-brand-50 p-3 text-brand-600">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-xl font-black font-display text-zinc-300">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* ========================================================================= */}
      {/* 4. 5-STEP ORGANIZER WORKFLOW */}
      {/* ========================================================================= */}
      <Reveal as="section" className="py-20 bg-white border-b border-zinc-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Organizer Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 font-display">
              How organizers operate an event on Ticket Panda
            </h2>
            <p className="text-sm text-zinc-600">
              From event configuration to gate verification, each stage is handled within the organizer workspace.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {WORKFLOW_STEPS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="card relative flex flex-col justify-between p-6 border-zinc-200/90 hover:border-brand-300 hover:shadow-card-hover transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="rounded-xl bg-brand-50 p-3 text-brand-600">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-xl font-black font-display text-zinc-300">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* ========================================================================= */}
      {/* 5. EXAMPLE EVENT FORMATS (STATIC ILLUSTRATIONS, NOT CLIENT EVENTS) */}
      {/* ========================================================================= */}
      <Reveal as="section" className="py-20 bg-white border-b border-zinc-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Illustrative Formats
              </span>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-zinc-950 font-display">
                Example structures for common event types
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-zinc-500">
                Static examples for orientation and tutorial purposes. These are not live client events and are not fetched from organizer data. Live listings appear in the public events directory.
              </p>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              Open the public events directory <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {EXAMPLE_FORMATS.map((ex, i) => (
              <div
                key={i}
                className="card flex flex-col justify-between p-6 border-zinc-200 hover:border-zinc-300 transition-all hover:shadow-card"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      {ex.category}
                    </span>
                    <Badge tone={ex.tone} size="xs">
                      {ex.badge}
                    </Badge>
                  </div>

                  <h3 className="mt-3 text-lg font-black text-zinc-900">
                    {ex.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-brand-600">
                    {ex.organizer}
                  </p>

                  <div className="mt-4 border-t border-zinc-100 pt-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Example Activities
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {ex.activities.map((act, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-zinc-100 px-2 py-1 text-[11px] font-medium text-zinc-700"
                        >
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                  <span>{ex.capacity}</span>
                  <span className="font-bold text-emerald-600">QR Protected</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ========================================================================= */}
      {/* 6. PLATFORM ASSURANCE / TRUST SIGNALS */}
      {/* ========================================================================= */}
      <Reveal as="section" className="py-20 bg-zinc-50 border-b border-zinc-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Platform Assurance
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 font-display">
              Verification, admission control, and records by design
            </h2>
            <p className="text-sm sm:text-base text-zinc-600">
              Admission integrity is enforced through server-side checks, single-use ticket state, complete operational records, and strict separation of organizer data.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_SIGNALS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="card p-6 space-y-3 border-zinc-200/90 bg-white">
                  <div className="rounded-xl bg-brand-50 p-3 text-brand-600 inline-block">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900">{item.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* ========================================================================= */}
      {/* 7. QR GATE VERIFICATION */}
      {/* ========================================================================= */}
      <Reveal as="section" className="py-20 bg-zinc-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left text */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1 text-xs font-bold text-brand-400">
                <ScanLine className="h-4 w-4" />
                <span>Single-Use Verification at the Gate</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-display">
                Defined verification outcomes for gate staff.
              </h2>

              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                When attendees arrive together, staff require unambiguous decisions. The scanner validates each pass against the booking record and presents one of three documented outcomes.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400 shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">First scan: valid entry</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Displays attendee name, activity, and ticket type. Records the ticket as used in the database.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400 shrink-0">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Repeat presentation: declined</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Forwarded or duplicated codes produce a staff-facing alert with the original check-in time and gate reference.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-rose-500/20 p-2 text-rose-400 shrink-0">
                    <XCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Unrecognized code: invalid</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Codes that do not correspond to a booking for that event are declined without admission.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Mock Viewfinder */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold text-zinc-200">Scanner &middot; Gate 01 (illustration)</span>
                  </div>
                  <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-400">Sample</span>
                </div>

                {/* Viewfinder box */}
                <div className="scanner-viewfinder relative flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-black/60 h-64 p-4 text-center">
                  <div className="rounded-xl border border-dashed border-brand-500/60 p-4 bg-brand-500/5">
                    <QrCode className="h-28 w-28 text-brand-400 opacity-90" />
                  </div>
                  <p className="mt-3 text-[11px] text-zinc-400">Align the attendee QR code inside the frame</p>
                </div>

                {/* Mock Live Result Banner */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3.5 flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-300 uppercase tracking-wide">Valid entry (sample)</span>
                      <span className="text-[10px] text-zinc-400">Sample</span>
                    </div>
                    <p className="text-xs font-bold text-white truncate">Registered Attendee &middot; Solo Dance</p>
                    <p className="text-[10px] font-mono text-zinc-400 truncate">Key: TP-EXAMPLE-000000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ========================================================================= */}
      {/* 8. GETTING STARTED FOR ORGANIZERS */}
      {/* ========================================================================= */}
      <Reveal as="section" className="py-20 bg-white border-b border-zinc-200/80">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Getting Started
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 font-display">
              Organizer setup in five documented steps
            </h2>
            <p className="text-sm text-zinc-600 max-w-2xl mx-auto">
              A standard sequence for preparing an event, from workspace creation to gate readiness. Detailed operational guidance is available in the Help Center.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {GETTING_STARTED.map((s, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-start gap-6 card p-8 border-zinc-200">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500 text-white font-display font-black text-xl shrink-0 shadow-sm shadow-brand-500/20">
                  {s.step}
                </div>
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-xl font-bold text-zinc-950">{s.title}</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button size="lg" variant="primary" rightIcon={ArrowRight} onClick={() => navigate('/tenant/register')}>
              Register as Organizer
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/how-it-works')}>
              Review the Full Process
            </Button>
          </div>
        </div>
      </Reveal>

      {/* ========================================================================= */}
      {/* 9. FAQ ACCORDION */}
      {/* ========================================================================= */}
      <Reveal as="section" className="py-20 bg-white border-b border-zinc-200/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Common Questions
            </span>
            <h2 className="text-3xl font-black tracking-tight text-zinc-950 font-display">
              Frequently asked questions
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500">
              Verification, admission control, data handling, and operational guidance for organizers and attendees.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-zinc-200/80 bg-white overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-zinc-900 hover:text-brand-600 transition"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-brand-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 bg-zinc-50/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* ========================================================================= */}
      {/* 10. FINAL CALL TO ACTION BANNER */}
      {/* ========================================================================= */}
      <Reveal as="section" className="py-20 bg-gradient-to-tr from-brand-600 via-orange-600 to-amber-600 text-white relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-6 relative z-10">
          <span className="text-4xl">🐼</span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-display text-white">
            Prepare your next event with verified ticketing.
          </h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-white/90 leading-relaxed">
            Create an organizer workspace, configure the event and ticket structure, and issue single-use QR passes with server-verified payments and recorded gate check-in.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/tenant/register"
              className="inline-flex items-center gap-2 rounded-2xl bg-zinc-950 px-8 py-3.5 text-sm font-bold text-white shadow-xl hover:bg-zinc-900 active:scale-95 transition"
            >
              <span>Get Started as Organizer</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/20 backdrop-blur-md px-8 py-3.5 text-sm font-bold text-white border border-white/30 hover:bg-white/30 transition"
            >
              Explore Public Events
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
