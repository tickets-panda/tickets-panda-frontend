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
} from 'lucide-react';
import Button from '../shared/components/Button.jsx';
import Card from '../shared/components/Card.jsx';
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
            Every tool required to run friction-free events.
          </h1>
          <p className="text-base text-zinc-600">
            Built from first principles for multi-tier college fests, competitions, and conferences.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Layers,
              title: 'Multi-Activity Event Hierarchy',
              description: 'Structure complex festivals into individual activities (Solo Dance, Quiz, Hackathon) with separate pricing, capacities, and rules.',
            },
            {
              icon: FileText,
              title: 'Dynamic Form Builder',
              description: 'Collect custom attendee data including college roll numbers, branch, team members, and file uploads (college ID, consent slips).',
            },
            {
              icon: ShieldCheck,
              title: 'Verified Digital Payments',
              description: 'Zero manual screenshot inspections. Registrations are confirmed automatically via bank-grade digital signatures.',
            },
            {
              icon: Ticket,
              title: 'Cryptographic E-Tickets',
              description: 'Generates unforgeable QR tokens and PDF tickets with event branding, venue details, and single-admission locks.',
            },
            {
              icon: ScanLine,
              title: 'Sub-Second Gate Scanner',
              description: 'Turn any smartphone into an operational gate terminal. Instant green/red validation alerts prevent pass sharing.',
            },
            {
              icon: BarChart3,
              title: 'Live Attendance Analytics',
              description: 'Monitor gate ingress velocities, sales velocity by ticket tier, and activity participation in real time.',
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
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 rounded-3xl bg-zinc-950 p-10 text-white text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold font-display">Ready to see it in action?</h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Set up your organization portal and launch an event in less than 10 minutes.
          </p>
          <div className="pt-2">
            <Link to="/tenant/register">
              <Button size="lg" variant="primary" rightIcon={ArrowRight}>
                Create an Event Now
              </Button>
            </Link>
          </div>
        </div>
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
            Step-by-Step Architecture
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 font-display">
            How Ticket Panda Works
          </h1>
          <p className="text-base text-zinc-600 max-w-2xl mx-auto">
            A seamless journey from initial event announcement to post-event gate analytics.
          </p>
        </div>

        <div className="mt-16 space-y-12">
          {[
            {
              step: '1',
              title: 'Organizers Launch the Portal',
              subtitle: 'Multi-Tenant Branded Workspace',
              content: 'Colleges and event planners create an account, upload their logo, and configure their festival with distinct activities and ticket types.',
            },
            {
              step: '2',
              title: 'Attendees Register Online',
              subtitle: 'Custom Dynamic Registration Flow',
              content: 'Students or guests open the link from WhatsApp, Instagram, or email. They select their category, fill the custom fields, and upload any required ID documents.',
            },
            {
              step: '3',
              title: 'Instant Verified Payment',
              subtitle: 'Zero Manual Reconciliation',
              content: 'Payment is completed via UPI, card, or netbanking. The backend verifies the transaction server-side before releasing capacity.',
            },
            {
              step: '4',
              title: 'Instant Ticket & QR Dispatch',
              subtitle: 'Cryptographic Single-Use Admission Token',
              content: 'The digital pass is generated immediately on screen and a formal PDF ticket is emailed directly to the attendee’s inbox.',
            },
            {
              step: '5',
              title: 'Rapid QR Gate Ingress',
              subtitle: 'Anti-Duplicate Row-Lock Security',
              content: 'At the entrance, gate crew scans the pass with their phone camera. Reused screenshots or unauthorized duplicates trigger an immediate audio/visual alert.',
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
        </div>
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
            <span>Dedicated College Fest Edition</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 font-display">
            Built specifically for college cultural & technical fests.
          </h1>
          <p className="text-base text-zinc-600">
            Running 30+ simultaneous stage competitions with thousands of external college participants? Ticket Panda handles the chaos effortlessly.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          <div className="card p-8 space-y-3">
            <h3 className="text-lg font-bold text-zinc-900">Per-Activity Registration</h3>
            <p className="text-xs sm:text-sm text-zinc-500">
              Students can register specifically for Solo Dance, Battle of the Bands, or Coding Relay without confusion. Each activity maintains its own slot limits.
            </p>
          </div>
          <div className="card p-8 space-y-3">
            <h3 className="text-lg font-bold text-zinc-900">College ID Verification</h3>
            <p className="text-xs sm:text-sm text-zinc-500">
              Enforce student ID card uploads during registration to ensure participants genuinely represent their claimed universities.
            </p>
          </div>
          <div className="card p-8 space-y-3">
            <h3 className="text-lg font-bold text-zinc-900">Student Volunteer Scanners</h3>
            <p className="text-xs sm:text-sm text-zinc-500">
              Invite student council volunteers as Check-in Staff. They can scan attendees right from their phones without accessing financial records.
            </p>
          </div>
        </div>

        <div className="mt-14 rounded-3xl border border-brand-200 bg-brand-50/50 p-8 text-center space-y-4">
          <h3 className="text-xl font-bold text-zinc-900">Empower your college student committee</h3>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto">
            Take your annual fest to commercial production quality with branded e-tickets and live attendance counters.
          </p>
          <div className="pt-2">
            <Link to="/tenant/register">
              <Button variant="primary" rightIcon={ArrowRight}>
                Get Started for Your College
              </Button>
            </Link>
          </div>
        </div>
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
            For Professional Event Planners
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 font-display">
            The enterprise ticketing engine that scales with your crowd.
          </h1>
          <p className="text-base text-zinc-600">
            Designed for commercial summits, concerts, club nights, and exhibitions where security, reliability, and speed at the gate are paramount.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Tiered Pricing', desc: 'VIP, Early Bird, General Pass, and Group tables with custom inventory rules.' },
            { title: 'Anti-Passback Lock', desc: 'Row-level database locks ensure no QR pass can be scanned at two gates simultaneously.' },
            { title: 'Full Data Ownership', desc: 'Download CSV exports of your attendee directory with all custom responses anytime.' },
            { title: 'Audited Actions', desc: 'Every ticket check-in and payment transition is immutably logged for reconciliation.' },
          ].map((item, idx) => (
            <div key={idx} className="card p-6 space-y-2 border-zinc-200">
              <h3 className="text-base font-bold text-zinc-900">{item.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
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
            Find answers to common questions about ticket retrieval, payments, and scanning.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="card p-6 space-y-3">
            <h3 className="font-bold text-zinc-900 text-base flex items-center gap-2">
              <Ticket className="h-4 w-4 text-brand-500" /> Attendees: Retrieve Lost Tickets
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              If you didn't receive your ticket PDF or deleted your confirmation email, you can retrieve your active passes through the My Tickets portal.
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
              To start scanning at the door, invite gate staff members from your Staff & Team dashboard. They can open the scanner directly in Chrome or Safari.
            </p>
            <Link to="/tenant/scanner" className="inline-block text-xs font-bold text-brand-600 hover:underline">
              Open Gate Scanner →
            </Link>
          </div>
        </div>
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
            Have questions about college licensing, event partnerships, or support? We are here to help.
          </p>
        </div>

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
              <Input label="Organization / College" placeholder="Nehru College Student Council" />
              <Textarea label="Message" required rows={4} placeholder="How can we assist your event?" />
              <Button type="submit" variant="primary" fullWidth rightIcon={Send}>
                Send Message
              </Button>
            </form>
          )}
        </Card>
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
