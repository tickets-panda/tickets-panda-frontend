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
  { value: '< 3 sec', label: 'average QR gate check-in' },
  { value: '100%', label: 'signature-verified payments' },
  { value: 'Zero', label: 'duplicate or shared pass fraud' },
  { value: 'Instant', label: 'PDF e-ticket delivery to email' },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    icon: CalendarDays,
    title: 'Create Your Event Page',
    description: 'Launch a custom college or organizational event portal in minutes. Add multi-tiered activities, competitions, and ticket types.',
  },
  {
    step: '02',
    icon: FileText,
    title: 'Collect Custom Registrations',
    description: 'Design dynamic form fields — text, phone, dropdowns, college ID proof uploads, and team member rosters.',
  },
  {
    step: '03',
    icon: CreditCard,
    title: 'Automate Verified Payments',
    description: 'Attendees pay securely online. Eliminates manual UPI screenshot verifications and bank statement matching completely.',
  },
  {
    step: '04',
    icon: Ticket,
    title: 'Auto-Generate Digital Tickets',
    description: 'Each attendee instantly receives a personalized digital pass with an opaque, unforgeable QR code and PDF ticket via email.',
  },
  {
    step: '05',
    icon: ScanLine,
    title: 'Lightning QR Gate Check-in',
    description: 'Event crew scans QR codes from any smartphone. Reused passes, duplicate entries, and fake screenshots are blocked on the spot.',
  },
];

const EVENT_EXAMPLES = [
  {
    category: 'College Cultural Fest',
    title: 'Pandaves 2026',
    organizer: 'Nehru College of Engineering',
    activities: ['Solo Dance', 'Group Dance', 'Battle of Bands', 'Fashion Walk'],
    capacity: '3,500 Attendees',
    tone: 'brand',
    badge: 'Flagship Fest',
  },
  {
    category: 'Technical Symposium',
    title: 'HackPanda Hackathon',
    organizer: 'Department of Computer Science',
    activities: ['24-Hr Hackathon', 'Code Sprint', 'Web3 Ideathon', 'Paper Presentation'],
    capacity: '600 Participants',
    tone: 'purple',
    badge: 'Tech & Dev',
  },
  {
    category: 'Conference & Summit',
    title: 'National Robotics Conclave',
    organizer: 'Robotics & Automation Society',
    activities: ['Keynote Sessions', 'RoboWars', 'Drone Racing', 'Project Expo'],
    capacity: '1,200 Delegates',
    tone: 'blue',
    badge: 'National Level',
  },
  {
    category: 'Concert & Pro-Night',
    title: 'Spring Euphoria 2026',
    organizer: 'Student Welfare Union',
    activities: ['DJ Night Pass', 'VIP Lounge', 'General Stage Arena'],
    capacity: '5,000 Passes',
    tone: 'green',
    badge: 'Live Concert',
  },
];

const FAQS = [
  {
    question: 'How does Ticket Panda stop duplicate payment screenshots and entry fraud?',
    answer:
      'Unlike manual Google Forms where organizers inspect forged payment screenshots, Ticket Panda processes payments through verified digital rails. Digital tickets with high-entropy cryptographic QR tokens are generated server-side. At the gate, each ticket is row-locked in the database upon the first scan — preventing any ticket from being admitted twice.',
  },
  {
    question: 'Can colleges run multi-activity festivals (e.g. Solo Dance, Quiz, Band)?',
    answer:
      'Yes! Ticket Panda features a dedicated Activity layer designed specifically for college festivals. An annual festival like "Pandaves 2026" can have distinct activities with independent capacities, individual rules, custom registration requirements (e.g. college ID upload), and specialized pricing.',
  },
  {
    question: 'Do gate scanners require special hardware or hand-held devices?',
    answer:
      'No expensive hardware needed. Any authorized staff member or student volunteer logs into the Ticket Panda Scanner on their own smartphone browser. The high-performance HTML5 camera scanner reads attendee QR codes in under 3 seconds.',
  },
  {
    question: 'What happens if an attendee loses their email or ticket?',
    answer:
      'Attendees can visit the "My Tickets" portal on Ticket Panda and enter their registered email to receive an instant, secure login code. They can view, screenshot, or download all their active passes anytime.',
  },
  {
    question: 'Can we collect document uploads such as College ID or Consent forms?',
    answer:
      'Yes. The registration form builder supports drag-and-drop document upload fields with file type restrictions (PDF, PNG, JPG) and size limits. Uploaded documents are linked directly to the attendee profile.',
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
                <Sparkles className="h-3.5 w-3.5 text-brand-500 animate-pulse" />
                <span>The Event Ticketing Operating System for Colleges & Organizations</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 leading-[1.08] font-display">
                From registration to entry,{' '}
                <span className="bg-gradient-to-r from-brand-600 to-orange-500 bg-clip-text text-transparent">
                  handled by Ticket Panda.
                </span>
              </h1>

              <p className="max-w-2xl text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
                Create branded event pages, collect verified registrations, issue secure digital e-tickets, and check attendees in with sub-second QR scanning. Say goodbye to manual Google Forms and fake payment screenshots forever.
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
                  <span>No special hardware needed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Anti-duplicate QR gate security</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Instant PDF ticket dispatch</span>
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
                            Nehru College of Engineering
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ADMIT ONE
                      </span>
                    </div>

                    {/* Ticket Body */}
                    <div className="p-5 space-y-4">
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-600">
                          Pandaves 2026 · Cultural Fest
                        </span>
                        <h3 className="text-lg font-black text-zinc-950">
                          Solo Dance Competition
                        </h3>
                        <p className="text-xs text-zinc-500">
                          15 October 2026 · 10:00 AM · Main Auditorium
                        </p>
                      </div>

                      {/* Details row */}
                      <div className="grid grid-cols-2 gap-2 rounded-xl bg-zinc-50 p-3 text-xs">
                        <div>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase">Participant</p>
                          <p className="font-bold text-zinc-900 truncate">Vishnu B</p>
                          <p className="text-[11px] text-zinc-500">24DS123 · College ID</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase">Gate Status</p>
                          <p className="font-bold text-emerald-600">Verified & Active</p>
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
                            TP-NGK26-8F72KD
                          </p>
                          <p className="text-[11px] text-zinc-500 mt-1 leading-snug">
                            Scan with Ticket Panda Scanner at Gate 01 for instant entry.
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
                        <span>Scanner validation speed: <strong>1.2s</strong></span>
                      </div>
                      <span className="font-mono text-[10px] text-zinc-400">UUID v4 Token</span>
                    </div>
                  </div>
                </div>

                {/* Floating Metrics Badge */}
                <div className="absolute -bottom-5 -left-4 rounded-2xl border border-zinc-200 bg-white p-3.5 shadow-card hidden sm:flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-medium">Pandaves Live Check-ins</p>
                    <p className="text-sm font-black text-zinc-900">1,428 / 1,500 Ingressed (95%)</p>
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
              Why Event Organizers Switch
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 font-display">
              The end of manual spreadsheets and payment screenshots.
            </h2>
            <p className="text-sm sm:text-base text-zinc-600">
              College events and festivals used to be an operational nightmare. See how Ticket Panda eliminates every manual friction point.
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
                  <h3 className="text-lg font-bold text-rose-950">The Old Manual Mess</h3>
                  <p className="text-xs text-rose-800">Prone to fraud, chaos at the gate, and human burnout</p>
                </div>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-rose-900">
                <li className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Google Forms + Screenshot Upload:</strong> Volunteers spend hours manually inspecting UPI screenshots that can be forged in Photoshop.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Cluttered Spreadsheets:</strong> Disjointed lists with missing entries, duplicate phone numbers, and untracked cancellations.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Manual WhatsApp Ticket Distribution:</strong> Volunteers copy-paste ticket numbers into WhatsApp DMs or send generic unverified PDFs.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Gate Chaos:</strong> Bouncers tick names off printed paper sheets. One person forwards a ticket image to 5 friends, causing gate stampedes.</span>
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
                  <h3 className="text-lg font-bold text-emerald-950">The Ticket Panda Pipeline</h3>
                  <p className="text-xs text-emerald-800">Automated, verified, unforgeable, and stress-free</p>
                </div>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-emerald-950">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Verified Digital Checkout:</strong> Registrations are only confirmed when payment settles. Zero manual screenshot checking required.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Automated E-Ticket Delivery:</strong> Attendees instantly receive cryptographic QR tickets on-screen and as downloadable PDFs in email.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Sub-Second Gate Ingress:</strong> Staff scans QR codes with any smartphone camera. Reused tickets trigger instant red alerts.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Real-Time Organizer Dashboard:</strong> Track live ticket sales, revenue breakdowns, and gate attendance counts per minute.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ========================================================================= */}
      {/* 3. 5-STEP HOW IT WORKS */}
      {/* ========================================================================= */}
      <Reveal as="section" className="py-20 bg-zinc-50 border-b border-zinc-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Simple 5-Step Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 font-display">
              How Ticket Panda powers your event
            </h2>
            <p className="text-sm text-zinc-600">
              From the moment an event is announced until the last attendee enters the gate.
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
      {/* 4. REAL PRODUCT EXAMPLES FOR COLLEGES & ORGANIZERS */}
      {/* ========================================================================= */}
      <Reveal as="section" className="py-20 bg-white border-b border-zinc-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Versatile Formats
              </span>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-zinc-950 font-display">
                Built for every kind of gathering
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-zinc-500">
                From inter-college cultural battles with 50 competitions to national technical conferences.
              </p>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              Browse live public events <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {EVENT_EXAMPLES.map((ex, i) => (
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
                      Featured Activities
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
                  <span>Capacity: {ex.capacity}</span>
                  <span className="font-bold text-emerald-600">QR Protected</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ========================================================================= */}
      {/* 5. QR GATE VERIFICATION SHOWCASE */}
      {/* ========================================================================= */}
      <Reveal as="section" className="py-20 bg-zinc-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left text */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1 text-xs font-bold text-brand-400">
                <ScanLine className="h-4 w-4" />
                <span>Anti-Passback & Dual-Entry Prevention</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-display">
                High-speed verification built for chaotic festival gates.
              </h2>

              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                When 2,000 students arrive at once, slow check-in turns into security hazards. Ticket Panda’s browser scanner validates passes in under 3 seconds with distinct visual and audio cues.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400 shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Instant First Scan: VALID (Green)</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Displays attendee name, activity, and ticket type. Atomically marks ticket as USED in database.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400 shrink-0">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Reused Ticket: REJECTED (Amber)</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Screenshots sent to friends trigger a bold alert showing the exact previous check-in time and gate.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-rose-500/20 p-2 text-rose-400 shrink-0">
                    <XCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Fake / Unregistered QR: INVALID (Red)</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Forged QR codes or passes belonging to another event are blocked instantly.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Mock Viewfinder */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-zinc-200">Scanner Live · Gate 01</span>
                  </div>
                  <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-400">FPS: 30</span>
                </div>

                {/* Viewfinder box */}
                <div className="scanner-viewfinder relative flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-black/60 h-64 p-4 text-center">
                  <div className="rounded-xl border border-dashed border-brand-500/60 p-4 bg-brand-500/5">
                    <QrCode className="h-28 w-28 text-brand-400 opacity-90 animate-pulse" />
                  </div>
                  <p className="mt-3 text-[11px] text-zinc-400">Align attendee QR code inside frame</p>
                </div>

                {/* Mock Live Result Banner */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3.5 flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-300 uppercase tracking-wide">✓ VALID ENTRY</span>
                      <span className="text-[10px] text-zinc-400">Just now</span>
                    </div>
                    <p className="text-xs font-bold text-white truncate">Vishnu B · Solo Dance</p>
                    <p className="text-[10px] font-mono text-zinc-400 truncate">Key: TP-NGK26-8F72KD</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ========================================================================= */}
      {/* 6. FAQ ACCORDION */}
      {/* ========================================================================= */}
      <Reveal as="section" className="py-20 bg-white border-b border-zinc-200/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Common Questions
            </span>
            <h2 className="text-3xl font-black tracking-tight text-zinc-950 font-display">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500">
              Everything organizers and attendees need to know about Ticket Panda.
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
      {/* 7. FINAL CALL TO ACTION BANNER */}
      {/* ========================================================================= */}
      <Reveal as="section" className="py-20 bg-gradient-to-tr from-brand-600 via-orange-600 to-amber-600 text-white relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-6 relative z-10">
          <span className="text-4xl">🐼</span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-display text-white">
            Ready to automate your next college festival or event?
          </h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-white/90 leading-relaxed">
            Join forward-thinking colleges and event teams. Create your organizer portal today and start issuing verified digital passes in under 10 minutes.
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
