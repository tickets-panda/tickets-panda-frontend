import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Layers,
  GraduationCap,
  Building2,
  ScanLine,
  Mail,
  Ticket,
  Lock,
  BarChart3,
  HelpCircle,
  FileText,
  Clock,
  Phone,
  Send,
  CreditCard,
  QrCode,
  Database,
  FileSpreadsheet,
} from 'lucide-react';
import Button from '../shared/components/Button.jsx';
import Card from '../shared/components/Card.jsx';
import Reveal, { RevealGroup } from '../shared/components/Reveal.jsx';
import Input, { Textarea } from '../shared/components/Input.jsx';
import toast from 'react-hot-toast';

/* ------------------------------------------------------------------------- *
 * 1. FEATURES PAGE (/features)
 * ------------------------------------------------------------------------- */
export function FeaturesPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Platform Capabilities
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 font-display">
            Ticketing, verification, and records for institutional events.
          </h1>
          <p className="text-base text-zinc-600">
            Structured registration, server-verified payments, single-use QR admission, and auditable operational records for multi-activity festivals and conferences.
          </p>
        </div>

        <RevealGroup className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Layers,
              title: 'Multi-Activity Event Structure',
              description: 'Organize festivals into activities with independent capacities, schedules, pricing, and registration requirements.',
            },
            {
              icon: FileText,
              title: 'Structured Registration Forms',
              description: 'Collect attendee details including roll number, branch, team rosters, and document uploads with defined file constraints.',
            },
            {
              icon: CreditCard,
              title: 'Server-Verified Payments',
              description: 'Transactions are confirmed server-side with signature validation and a direct status check. Tickets are issued only after settlement.',
            },
            {
              icon: QrCode,
              title: 'Single-Use QR Tickets',
              description: 'Each booking receives a random, non-sequential QR key with event branding, venue details, and PDF email delivery.',
            },
            {
              icon: ScanLine,
              title: 'Smartphone Gate Verification',
              description: 'Authorized staff scan passes with standard mobile browsers. Repeat presentations are declined with a staff-facing alert.',
            },
            {
              icon: BarChart3,
              title: 'Operational Reporting',
              description: 'Monitor registrations, verified revenue, and gate check-in counts per event, activity, and ticket tier.',
            },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="card p-8 space-y-3 hover:border-brand-300 hover:shadow-card-hover transition">
                <div className="rounded-xl bg-brand-50 p-3 text-brand-600 inline-block">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">{f.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </RevealGroup>

        {/* Platform assurance */}
        <div className="mx-auto mt-20 max-w-3xl text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Platform Assurance
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 font-display">
            Verification and data handling by design.
          </h2>
          <p className="text-sm text-zinc-600">
            Admission integrity and record-keeping are enforced at the platform level, not left to manual review.
          </p>
        </div>

        <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, title: 'Server-Side Verification', desc: 'Gateway signature validation plus a direct transaction status fetch before ticket issuance.' },
            { icon: ScanLine, title: 'Single-Use Admission Control', desc: 'Database-enforced ticket state ensures each pass admits once; duplicates are declined.' },
            { icon: FileSpreadsheet, title: 'Audit Logs', desc: 'Payment, issuance, and check-in events are recorded with timestamps for reconciliation.' },
            { icon: Database, title: 'Tenant Data Isolation', desc: 'Every query is scoped to the owning organizer. Records are never shared across tenants.' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="card p-6 space-y-2 border-zinc-200">
                <div className="rounded-xl bg-brand-50 p-2.5 text-brand-600 inline-block">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-900">{item.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </RevealGroup>

        {/* Bottom CTA */}
        <Reveal className="mt-20 rounded-3xl bg-zinc-950 p-10 text-white text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold font-display">Prepare your event with verified ticketing.</h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Create an organizer workspace, configure the event structure, and issue single-use QR passes with recorded verification.
          </p>
          <div className="pt-2">
            <Link to="/tenant/register">
              <Button size="lg" variant="primary" rightIcon={ArrowRight}>
                Create an Event Now
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- *
 * 2. HOW IT WORKS PAGE (/how-it-works)
 * ------------------------------------------------------------------------- */
export function HowItWorksPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Process Documentation
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 font-display">
            How Ticket Panda Works
          </h1>
          <p className="text-base text-zinc-600 max-w-2xl mx-auto">
            A defined sequence from event publication to gate verification. Attendee tickets are issued only after server-side payment confirmation.
          </p>
        </div>

        {/* Attendee chain: Registration -> Verified Payment -> QR Ticket -> Gate Scan */}
        <div className="mx-auto mt-14 max-w-3xl text-center space-y-2">
          <h2 className="text-xl font-bold text-zinc-900">Attendee sequence</h2>
          <p className="text-sm text-zinc-600">
            Registration, verified payment, QR ticket issuance, and gate scan. Each stage is a prerequisite for the next.
          </p>
        </div>

        <RevealGroup className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { step: '01', icon: FileText, title: 'Registration', desc: 'Attendees select a ticket type and complete the organizer-defined registration form.' },
            { step: '02', icon: CreditCard, title: 'Verified Payment', desc: 'Payment is verified on the server before capacity is consumed or tickets issued.' },
            { step: '03', icon: QrCode, title: 'QR Ticket', desc: 'A single-use QR pass with a random key is shown on screen and emailed as a PDF.' },
            { step: '04', icon: ScanLine, title: 'Gate Scan', desc: 'Staff scan the code with a smartphone. First scan admits; repeats are declined.' },
          ].map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="card p-6 space-y-3 border-zinc-200">
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-brand-50 p-2.5 text-brand-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-black font-display text-zinc-300">{s.step}</span>
                </div>
                <h3 className="text-base font-bold text-zinc-900">{s.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </RevealGroup>

        <div className="mx-auto mt-16 max-w-3xl text-center space-y-2">
          <h2 className="text-xl font-bold text-zinc-900">Organizer sequence</h2>
          <p className="text-sm text-zinc-600">
            Workspace setup, event configuration, publication, monitoring, and gate preparation.
          </p>
        </div>

        <RevealGroup className="mt-8 space-y-6">
          {[
            {
              step: '1',
              title: 'Organizers establish the workspace',
              subtitle: 'Tenant Workspace Setup',
              content: 'Institutions and organizations register a dedicated workspace, complete the official profile, and invite team members with defined roles.',
            },
            {
              step: '2',
              title: 'Events and ticket structures are configured',
              subtitle: 'Event and Activity Configuration',
              content: 'Organizers define event details, activities with independent capacities, ticket tiers and pricing, and registration fields including document requirements.',
            },
            {
              step: '3',
              title: 'The event link is published',
              subtitle: 'Distribution and Registration',
              content: 'The shareable event page is distributed through institutional channels. Attendees register, pay, and receive tickets without staff mediation.',
            },
            {
              step: '4',
              title: 'Payments are verified and tickets issued',
              subtitle: 'Automated Verification and Issuance',
              content: 'Each payment is verified server-side. Verified bookings automatically generate single-use QR tickets delivered on screen and by email.',
            },
            {
              step: '5',
              title: 'Entry is verified and recorded',
              subtitle: 'Gate Operations and Records',
              content: 'Gate staff scan passes with standard smartphones. Check-in outcomes are logged with timestamps for attendance reporting and reconciliation.',
            },
          ].map((s, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-start gap-6 card p-8 border-zinc-200">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500 text-white font-display font-black text-xl shrink-0 shadow-sm shadow-brand-500/20">
                {s.step}
              </div>
              <div className="space-y-1.5 flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">{s.subtitle}</span>
                <h3 className="text-xl font-bold text-zinc-950">{s.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{s.content}</p>
              </div>
            </div>
          ))}
        </RevealGroup>

        {/* Assurance note + tutorial links */}
        <Reveal className="mt-12 rounded-3xl border border-zinc-200 bg-zinc-50 p-8 space-y-4">
          <h3 className="text-lg font-bold text-zinc-900">Assurance applied at every stage</h3>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            Server-side payment verification, single-use admission state with database locking, timestamped audit logs, and tenant-scoped data isolation apply across registration, issuance, and gate verification. Organizers access only their own records.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Link to="/tenant/register">
              <Button variant="primary" rightIcon={ArrowRight}>Register as Organizer</Button>
            </Link>
            <Link to="/help">
              <Button variant="secondary">Open the Help Center</Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- *
 * 3. FOR COLLEGES PAGE (/for-colleges)
 * ------------------------------------------------------------------------- */
export function ForCollegesPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-200 px-3.5 py-1 text-xs font-bold text-brand-700">
            <GraduationCap className="h-4 w-4" />
            <span>College and Institutional Events</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 font-display">
            Structured ticketing for college festivals and symposia.
          </h1>
          <p className="text-base text-zinc-600">
            Multi-activity cultural festivals, technical symposia, and inter-collegiate competitions with verified registration and controlled gate entry.
          </p>
        </div>

        <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-3">
          <div className="card p-8 space-y-3">
            <h3 className="text-lg font-bold text-zinc-900">Per-Activity Registration</h3>
            <p className="text-xs sm:text-sm text-zinc-500">
              Attendees register for specific activities with independent capacities, schedules, and eligibility rules, keeping large festivals organized by competition or session.
            </p>
          </div>
          <div className="card p-8 space-y-3">
            <h3 className="text-lg font-bold text-zinc-900">Document Collection</h3>
            <p className="text-xs sm:text-sm text-zinc-500">
              Require institutional ID or consent documents during registration with defined file types and size limits. Uploads remain attached to the booking record.
            </p>
          </div>
          <div className="card p-8 space-y-3">
            <h3 className="text-lg font-bold text-zinc-900">Delegated Gate Staff</h3>
            <p className="text-xs sm:text-sm text-zinc-500">
              Assign student volunteers as check-in staff with scanner-only access. They verify entry from their phones without access to payment or revenue records.
            </p>
          </div>
        </RevealGroup>

        {/* Getting started for college committees */}
        <Reveal className="mt-14 rounded-3xl border border-zinc-200 bg-zinc-50 p-8 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-zinc-900">Getting started for student committees</h3>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto">
              A standard setup path: register the workspace, configure the fest and activities, publish the link, monitor verified bookings, and prepare gate teams.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-5 text-left">
            {[
              'Register the organizer workspace',
              'Configure events and activities',
              'Publish the registration link',
              'Monitor bookings and payments',
              'Assign and brief gate staff',
            ].map((t, i) => (
              <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-4">
                <p className="text-xs font-black text-brand-600">Step {i + 1}</p>
                <p className="mt-1 text-xs font-bold text-zinc-900 leading-snug">{t}</p>
              </div>
            ))}
          </div>
          <div className="pt-2 text-center">
            <Link to="/tenant/register">
              <Button variant="primary" rightIcon={ArrowRight}>
                Get Started for Your College
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- *
 * 4. FOR ORGANIZERS PAGE (/for-organizers)
 * ------------------------------------------------------------------------- */
export function ForOrganizersPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            For Professional Event Organizers
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 font-display">
            Verified ticketing with controlled admission.
          </h1>
          <p className="text-base text-zinc-600">
            For summits, concerts, exhibitions, and institutional programs where payment confirmation, admission control, and reconciliable records are required.
          </p>
        </div>

        <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Tiered Ticket Structures', desc: 'General, reserved, VIP, and group tiers with defined inventory and pricing rules.' },
            { title: 'Single-Use Admission Control', desc: 'Database-enforced ticket state prevents concurrent or repeat admission with the same pass.' },
            { title: 'Data Export', desc: 'Export the attendee directory with registration responses for reporting and compliance.' },
            { title: 'Audit Records', desc: 'Ticket check-ins and payment transitions are logged with timestamps for reconciliation.' },
          ].map((item, idx) => (
            <div key={idx} className="card p-6 space-y-2 border-zinc-200">
              <h3 className="text-base font-bold text-zinc-900">{item.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </RevealGroup>

        <Reveal className="mt-14 rounded-3xl border border-zinc-200 bg-zinc-50 p-8 space-y-4">
          <h3 className="text-lg font-bold text-zinc-900 text-center">Organizer setup sequence</h3>
          <div className="grid gap-4 sm:grid-cols-5">
            {[
              { s: '1', t: 'Register the workspace and team roles' },
              { s: '2', t: 'Configure events, tiers, and forms' },
              { s: '3', t: 'Publish and distribute the event link' },
              { s: '4', t: 'Monitor verified bookings and revenue' },
              { s: '5', t: 'Operate gate verification on event day' },
            ].map((x, i) => (
              <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-4">
                <p className="text-xs font-black text-brand-600">Step {x.s}</p>
                <p className="mt-1 text-xs font-bold text-zinc-900 leading-snug">{x.t}</p>
              </div>
            ))}
          </div>
          <div className="pt-2 text-center">
            <Link to="/tenant/register">
              <Button variant="primary" rightIcon={ArrowRight}>Register as Organizer</Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- *
 * 5. HELP CENTER (/help)
 * ------------------------------------------------------------------------- */
export function HelpCenterPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Support & Guides</span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 font-display">
            Help Center
          </h1>
          <p className="text-sm text-zinc-500">
            Guidance on ticket recovery, payment verification, gate scanning, and organizer records.
          </p>
        </div>

        <RevealGroup className="grid gap-6 sm:grid-cols-2">
          <div className="card p-6 space-y-3">
            <h3 className="font-bold text-zinc-900 text-base flex items-center gap-2">
              <Ticket className="h-4 w-4 text-brand-500" /> Attendees: Retrieve Lost Tickets
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              If the confirmation email or ticket PDF is unavailable, retrieve active passes through the My Tickets section using a secure login code sent to the registered email.
            </p>
            <Link to="/my-tickets" className="inline-block text-xs font-bold text-brand-600 hover:underline">
              Go to My Tickets →
            </Link>
          </div>

          <div className="card p-6 space-y-3">
            <h3 className="font-bold text-zinc-900 text-base flex items-center gap-2">
              <ScanLine className="h-4 w-4 text-brand-500" /> Organizers: Gate Scanner Setup
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Invite gate staff from the team management section and assign scanner access. Staff open the scanner in a standard mobile browser; no dedicated hardware is required.
            </p>
            <Link to="/tenant/scanner" className="inline-block text-xs font-bold text-brand-600 hover:underline">
              Open Gate Scanner →
            </Link>
          </div>

          <div className="card p-6 space-y-3">
            <h3 className="font-bold text-zinc-900 text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-500" /> Payments: How Verification Works
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Tickets are generated only after the server confirms payment through gateway signature validation and a direct status check. Orders without confirmed settlement do not produce admission passes.
            </p>
            <Link to="/how-it-works" className="inline-block text-xs font-bold text-brand-600 hover:underline">
              Review the full process →
            </Link>
          </div>

          <div className="card p-6 space-y-3">
            <h3 className="font-bold text-zinc-900 text-base flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-brand-500" /> Organizers: Records and Exports
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Bookings, payments, ticket issuance, and check-ins are logged with timestamps. Organizers can review dashboard reports and export the attendee directory for reconciliation.
            </p>
            <Link to="/features" className="inline-block text-xs font-bold text-brand-600 hover:underline">
              View platform capabilities →
            </Link>
          </div>
        </RevealGroup>

        {/* FAQ additions */}
        <Reveal className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 space-y-4">
          <h3 className="text-lg font-bold text-zinc-900">Frequently requested clarification</h3>
          <div className="space-y-4 text-xs sm:text-sm text-zinc-600 leading-relaxed">
            <p><strong className="text-zinc-900">Are organizer records shared across tenants?</strong> No. All events, bookings, payments, and attendee data are scoped to the owning organizer and never shared across tenants.</p>
            <p><strong className="text-zinc-900">What happens when the same QR code is presented twice?</strong> The first valid scan admits and marks the ticket as used. Later presentations are declined with the original check-in reference shown to staff.</p>
            <p><strong className="text-zinc-900">How do attendees prove entry if email access is lost?</strong> The My Tickets section re-authenticates the registered email with a login code and restores access to active passes.</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- *
 * 6. CONTACT PAGE (/contact)
 * ------------------------------------------------------------------------- */
export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Your message has been received! Our team will respond shortly.');
  };

  return (
    <div className="py-16">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <div className="text-center space-y-3 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Get in Touch</span>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 font-display">
            Contact Ticket Panda
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Questions on institutional onboarding, event configuration, or operational support are welcome.
          </p>
        </div>

        <Reveal>
          <Card>
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="rounded-full bg-emerald-100 p-3 text-emerald-600 inline-block">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">Message Sent!</h3>
              <p className="text-xs text-zinc-500">
                Thank you for reaching out. We will get back to you at your provided email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Your Name" required placeholder="Alex Mercer" />
              <Input label="Email Address" type="email" required placeholder="alex@college.edu" />
              <Input label="Organization / College" placeholder="Example College Student Council" />
              <Textarea label="Message" required rows={4} placeholder="How can we assist your event?" />
              <Button type="submit" variant="primary" fullWidth rightIcon={Send}>
                Send Message
              </Button>
            </form>
          )}
        </Card>
        </Reveal>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- *
 * 7. LEGAL PAGES (/privacy and /terms)
 * ------------------------------------------------------------------------- */
export function PrivacyPolicyPage() {
  return (
    <div className="py-16 mx-auto max-w-3xl px-4 sm:px-6 space-y-6 text-zinc-700 text-sm">
      <h1 className="text-3xl font-black text-zinc-950 font-display">Privacy Policy</h1>
      <p className="text-xs text-zinc-400">Last updated: September 2026</p>
      <div className="space-y-4 leading-relaxed">
        <p>
          Ticket Panda Technologies ("Ticket Panda", "we", "our") operates the multi-tenant ticketing platform. We respect your privacy and are committed to safeguarding personal information collected during event registrations.
        </p>
        <h3 className="text-base font-bold text-zinc-900 pt-2">1. Information We Collect</h3>
        <p>
          When you register for an event, we collect your name, email address, contact phone number, and any custom details configured by the event organizer (such as college ID proof or student roll number).
        </p>
        <h3 className="text-base font-bold text-zinc-900 pt-2">2. How We Use Information</h3>
        <p>
          Attendee data is used exclusively to generate unique digital e-tickets, verify payment settlement, transmit PDF tickets, and validate admission at the venue gate.
        </p>
        <h3 className="text-base font-bold text-zinc-900 pt-2">3. Data Isolation</h3>
        <p>
          Ticket Panda strictly enforces multi-tenant row isolation. Event organizers can only access registrations associated with their own events. We never sell attendee information to third parties.
        </p>
      </div>
    </div>
  );
}

export function TermsOfServicePage() {
  return (
    <div className="py-16 mx-auto max-w-3xl px-4 sm:px-6 space-y-6 text-zinc-700 text-sm">
      <h1 className="text-3xl font-black text-zinc-950 font-display">Terms of Service</h1>
      <p className="text-xs text-zinc-400">Last updated: September 2026</p>
      <div className="space-y-4 leading-relaxed">
        <p>
          By creating an account, publishing an event, or purchasing tickets on Ticket Panda, you agree to these Terms of Service.
        </p>
        <h3 className="text-base font-bold text-zinc-900 pt-2">1. Organizer Responsibilities</h3>
        <p>
          Organizers must ensure that event descriptions, dates, venue locations, and activity rules are accurate. Ticket Panda provides the ticketing and QR verification infrastructure but is not the producer of the physical event.
        </p>
        <h3 className="text-base font-bold text-zinc-900 pt-2">2. Single-Admission E-Tickets</h3>
        <p>
          Each digital ticket is licensed for single-person entry. Passing, duplicating, or screenshotting QR codes to facilitate multiple entries is strictly prohibited and automatically detected by our gate verification system.
        </p>
      </div>
    </div>
  );
}

export default {
  FeaturesPage,
  HowItWorksPage,
  ForCollegesPage,
  ForOrganizersPage,
  HelpCenterPage,
  ContactPage,
  PrivacyPolicyPage,
  TermsOfServicePage,
};
