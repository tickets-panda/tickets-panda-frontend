import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Check,
  CreditCard,
  Minus,
  Plus,
  Sparkles,
  Upload,
  FileText,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
} from 'lucide-react';
import api, { apiErrorMessage, apiFieldErrors } from '../shared/api/client.js';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import Input, { Textarea, Select, Checkbox, FileUpload } from '../shared/components/Input.jsx';
import Button from '../shared/components/Button.jsx';
import Card from '../shared/components/Card.jsx';
import { formatCurrency } from '../shared/utils/format.js';
import { openRazorpay } from '../shared/utils/razorpay.js';

const STEPS = ['Ticket & Attendee', 'Event Details', 'Documents', 'Review & Pay'];

export default function RegisterPage() {
  const { tenantSlug, eventSlug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const activityParam = searchParams.get('activity');
  const ticketTypeParam = searchParams.get('ticketTypeId');

  const [step, setStep] = useState(0);
  const [ticketTypeId, setTicketTypeId] = useState(ticketTypeParam ? Number(ticketTypeParam) : null);
  const [quantity, setQuantity] = useState(1);
  const [customValues, setCustomValues] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, getValues, formState, trigger } = useForm({
    defaultValues: { name: '', email: '', phone: '' },
    mode: 'onBlur',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-event', tenantSlug, eventSlug],
    queryFn: async () => (await api.get(`/public/t/${tenantSlug}/events/${eventSlug}`)).data.data,
  });

  const { event, ticketTypes = [], activities = [], formFields = [], tenant } = data || {};

  // Flatten all ticket types from event and activities
  const allTicketTypes = useMemo(() => {
    const list = [...ticketTypes];
    activities.forEach((act) => {
      (act.ticketTypes || []).forEach((tt) => {
        if (!list.some((existing) => existing.id === tt.id)) {
          list.push({ ...tt, activityTitle: act.title, activitySlug: act.slug });
        }
      });
    });
    return list;
  }, [ticketTypes, activities]);

  const selected = useMemo(
    () => allTicketTypes.find((type) => type.id === ticketTypeId) || allTicketTypes[0] || null,
    [allTicketTypes, ticketTypeId],
  );

  useEffect(() => {
    if (selected && !ticketTypeId) {
      setTicketTypeId(selected.id);
      setQuantity(Math.min(Math.max(selected.minPerOrder || 1, 1), selected.remaining || 1));
    }
  }, [selected, ticketTypeId]);

  useEffect(() => {
    if (ticketTypeParam && allTicketTypes.length > 0) {
      const match = allTicketTypes.find((t) => t.id === Number(ticketTypeParam));
      if (match) {
        setTicketTypeId(match.id);
        setQuantity(Math.min(Math.max(match.minPerOrder || 1, 1), match.remaining || 1));
      }
    }
  }, [ticketTypeParam, allTicketTypes]);

  // Separate document upload fields from text/choice fields
  const fileFields = useMemo(() => formFields.filter((f) => f.fieldType === 'FILE'), [formFields]);
  const regularFields = useMemo(() => formFields.filter((f) => f.fieldType !== 'FILE'), [formFields]);

  if (isLoading) return <PageLoader label="Preparing event registration…" />;
  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="Event unavailable" description={apiErrorMessage(error)} />
      </div>
    );
  }

  if (!allTicketTypes.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="No tickets on sale" description="This event currently has no active ticket types." />
      </div>
    );
  }

  const selectTicket = (type) => {
    setTicketTypeId(type.id);
    setQuantity(Math.min(Math.max(type.minPerOrder || 1, 1), type.remaining || 1));
  };

  const handleStep0Next = async () => {
    if (!selected) {
      toast.error('Please choose a ticket tier');
      return;
    }
    const isValid = await trigger(['name', 'email', 'phone']);
    if (!isValid) return;

    if (regularFields.length > 0) {
      setStep(1);
    } else if (fileFields.length > 0) {
      setStep(2);
    } else {
      setStep(3); // Go straight to review
    }
  };

  const handleStep1Next = () => {
    // Validate required regular fields
    for (const field of regularFields) {
      if (field.isRequired && !String(customValues[field.id] ?? '').trim()) {
        toast.error(`${field.fieldLabel} is required`);
        return;
      }
    }
    if (fileFields.length > 0) {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  const handleStep2Next = () => {
    // Validate required file fields
    for (const field of fileFields) {
      if (field.isRequired && !customValues[field.id]) {
        toast.error(`Please upload ${field.fieldLabel}`);
        return;
      }
    }
    setStep(3);
  };

  const pay = async () => {
    setSubmitting(true);
    const { name, email, phone } = getValues();
    try {
      const initiate = await api.post('/booking/initiate', {
        eventId: event.id,
        activityId: selected.activityId || null,
        ticketTypeId: selected.id,
        quantity,
        customer: { name, email, phone },
        formData: customValues,
      });

      const booking = initiate.data.data;

      // 1. If provider is local test payment, navigate to the local simulation checkout
      if (booking.paymentProvider === 'local' || booking.checkoutUrl) {
        toast('Redirecting to Local Test Checkout…', { icon: '🧪' });
        navigate(booking.checkoutUrl || `/checkout/local/${booking.orderRef}`);
        return;
      }

      // 2. Future gateway / Razorpay flow
      const result = await openRazorpay({
        key: booking.razorpayKeyId,
        amount: booking.amount,
        currency: booking.currency,
        orderId: booking.razorpayOrderId,
        name: tenant.name,
        description: selected.activityTitle ? `${event.title} - ${selected.activityTitle}` : event.title,
        prefill: { name, email, contact: phone },
      });

      await api.post('/booking/verify-payment', {
        orderId: booking.orderId,
        razorpayOrderId: result.razorpay_order_id,
        razorpayPaymentId: result.razorpay_payment_id,
        razorpaySignature: result.razorpay_signature,
      });

      toast.success('Payment verified — your tickets are ready!');
      navigate(`/booking/${booking.orderRef}`);
    } catch (err) {
      const fieldErrors = apiFieldErrors(err);
      const firstFieldError = Object.values(fieldErrors)[0];
      toast.error(firstFieldError || apiErrorMessage(err));
      if (firstFieldError) setStep(0);
    } finally {
      setSubmitting(false);
    }
  };

  const total = selected ? Number(selected.price) * quantity : 0;
  const { name: formName, email: formEmail, phone: formPhone } = getValues();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate(`/t/${tenantSlug}/events/${eventSlug}`)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-800 transition mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Event Details
          </button>
          <h1 className="text-2xl font-black tracking-tight text-zinc-950 font-display">
            {event.title}
          </h1>
          <p className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            {tenant.name}
          </p>
        </div>
      </div>

      {/* Activity Callout banner if registering specifically for an activity */}
      {selected?.activityTitle && (
        <div className="mb-6 flex items-center gap-2 rounded-2xl bg-orange-50 border border-orange-200/90 p-4 text-xs text-orange-950 shadow-subtle">
          <Sparkles className="h-4 w-4 text-orange-600 shrink-0" />
          <span>
            Registering for Track / Activity:{' '}
            <strong>{selected.activityTitle}</strong>
          </span>
        </div>
      )}

      {/* Stepper Wizard Bar */}
      <div className="mb-8">
        <ol className="flex items-center justify-between gap-2">
          {STEPS.map((label, index) => {
            const isCompleted = index < step;
            const isCurrent = index === step;
            return (
              <li key={label} className="flex flex-1 items-center gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-xl text-xs font-black transition-all shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : isCurrent
                        ? 'bg-brand-500 text-white shadow-sm ring-4 ring-brand-500/20'
                        : 'bg-zinc-200 text-zinc-500'
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                  </span>
                  <span
                    className={`text-xs font-bold truncate hidden sm:inline ${
                      isCurrent ? 'text-zinc-950' : 'text-zinc-500'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <span
                    className={`h-0.5 flex-1 transition-colors ${
                      index < step ? 'bg-emerald-500' : 'bg-zinc-200'
                    }`}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* ========================================================================= */}
      {/* STEP 0: PASS SELECTION & PARTICIPANT DETAILS */}
      {/* ========================================================================= */}
      {step === 0 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Ticket Type Selector */}
          <Card title="1. Select Admission Pass">
            <div className="space-y-3">
              {allTicketTypes.map((type) => {
                const isSelected = selected?.id === type.id;
                const isAvailable = type.remaining > 0;
                return (
                  <div
                    key={type.id}
                    onClick={() => isAvailable && selectTicket(type)}
                    className={`cursor-pointer rounded-2xl border p-4.5 transition-all ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/20 shadow-subtle'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    } ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={isSelected}
                            onChange={() => selectTicket(type)}
                            disabled={!isAvailable}
                            className="h-4 w-4 text-brand-600 focus:ring-brand-500"
                          />
                          <h4 className="font-bold text-sm text-zinc-950">{type.name}</h4>
                          {type.activityTitle && (
                            <span className="text-[10px] font-semibold text-brand-600 bg-brand-100/70 px-2 py-0.5 rounded-md">
                              {type.activityTitle}
                            </span>
                          )}
                        </div>
                        {type.description && (
                          <p className="text-xs text-zinc-500 pl-6">{type.description}</p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-zinc-950 font-display">
                          {Number(type.price) > 0 ? formatCurrency(type.price, type.currency) : 'Free'}
                        </span>
                        <p className="text-[10px] text-zinc-400">
                          {isAvailable ? `${type.remaining} left` : 'Sold out'}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Selector inside selected card */}
                    {isSelected && isAvailable && (
                      <div className="mt-4 pt-3 border-t border-brand-200/60 flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-700">Quantity</span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuantity((q) => Math.max(type.minPerOrder || 1, q - 1));
                            }}
                            disabled={quantity <= (type.minPerOrder || 1)}
                            className="h-8 w-8 rounded-lg border border-zinc-200 bg-white grid place-items-center text-zinc-600 hover:bg-zinc-100 disabled:opacity-40"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="font-mono text-sm font-bold text-zinc-900 w-6 text-center">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuantity((q) => Math.min(type.maxPerOrder || 10, type.remaining, q + 1));
                            }}
                            disabled={quantity >= Math.min(type.maxPerOrder || 10, type.remaining)}
                            className="h-8 w-8 rounded-lg border border-zinc-200 bg-white grid place-items-center text-zinc-600 hover:bg-zinc-100 disabled:opacity-40"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Attendee Details Form */}
          <Card title="2. Participant Information">
            <div className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Alex Mercer"
                required
                leftIcon={User}
                error={formState.errors.name?.message}
                {...register('name', { required: 'Full name is required' })}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="alex@college.edu"
                  required
                  leftIcon={Mail}
                  hint="Your digital QR ticket PDF will be delivered here."
                  error={formState.errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                />

                <Input
                  label="Phone Number"
                  placeholder="+91 9876543210"
                  required
                  leftIcon={Phone}
                  hint="Used for SMS gate alerts & identity verification."
                  error={formState.errors.phone?.message}
                  {...register('phone', {
                    required: 'Phone number is required',
                    minLength: { value: 8, message: 'Enter a valid phone number' },
                  })}
                />
              </div>
            </div>
          </Card>

          {/* Total & Action */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xs text-zinc-400 font-bold uppercase">Estimated Total</p>
              <p className="text-xl font-black text-zinc-950 font-display">
                {formatCurrency(total, selected?.currency)}
              </p>
            </div>
            <Button size="lg" variant="primary" onClick={handleStep0Next} rightIcon={ArrowRight}>
              Continue to Details
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: EVENT / ACTIVITY CUSTOM FORM FIELDS */}
      {/* ========================================================================= */}
      {step === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <Card
            title="Custom Registration Details"
            subtitle="Please complete the fields required by the event organizers."
          >
            <div className="space-y-4">
              {regularFields.map((f) => {
                const fieldId = String(f.id);
                const isReq = f.isRequired;
                const label = f.fieldLabel;
                const hint = f.helpText;
                const currentVal = customValues[fieldId] ?? '';

                if (f.fieldType === 'TEXTAREA' || f.fieldType === 'LONGTEXT') {
                  return (
                    <Textarea
                      key={f.id}
                      label={label}
                      required={isReq}
                      hint={hint}
                      placeholder={f.placeholder || ''}
                      value={currentVal}
                      onChange={(e) =>
                        setCustomValues((prev) => ({ ...prev, [fieldId]: e.target.value }))
                      }
                    />
                  );
                }

                if (f.fieldType === 'SELECT') {
                  const opts = Array.isArray(f.options)
                    ? f.options
                    : (f.optionsText || '').split('\n').filter(Boolean);
                  return (
                    <Select
                      key={f.id}
                      label={label}
                      required={isReq}
                      hint={hint}
                      value={currentVal}
                      onChange={(e) =>
                        setCustomValues((prev) => ({ ...prev, [fieldId]: e.target.value }))
                      }
                    >
                      <option value="">Select an option</option>
                      {opts.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </Select>
                  );
                }

                if (f.fieldType === 'CHECKBOX') {
                  return (
                    <Checkbox
                      key={f.id}
                      label={label}
                      hint={hint}
                      checked={Boolean(currentVal)}
                      onChange={(e) =>
                        setCustomValues((prev) => ({ ...prev, [fieldId]: e.target.checked }))
                      }
                    />
                  );
                }

                // Default text/number/email/phone/date
                const inputType =
                  f.fieldType === 'EMAIL'
                    ? 'email'
                    : f.fieldType === 'NUMBER'
                    ? 'number'
                    : f.fieldType === 'DATE'
                    ? 'date'
                    : f.fieldType === 'PHONE'
                    ? 'tel'
                    : 'text';

                return (
                  <Input
                    key={f.id}
                    label={label}
                    type={inputType}
                    required={isReq}
                    hint={hint}
                    placeholder={f.placeholder || ''}
                    value={currentVal}
                    onChange={(e) =>
                      setCustomValues((prev) => ({ ...prev, [fieldId]: e.target.value }))
                    }
                  />
                );
              })}
            </div>
          </Card>

          <div className="flex justify-between pt-2">
            <Button variant="secondary" onClick={() => setStep(0)} leftIcon={ArrowLeft}>
              Back
            </Button>
            <Button variant="primary" onClick={handleStep1Next} rightIcon={ArrowRight}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: DOCUMENTS & FILE UPLOADS */}
      {/* ========================================================================= */}
      {step === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <Card
            title="Upload Required Documents"
            subtitle="Please provide clear copies of student ID or documents requested by the organizer."
          >
            <div className="space-y-5">
              {fileFields.map((f) => {
                const fieldId = String(f.id);
                return (
                  <FileUpload
                    key={f.id}
                    label={f.fieldLabel}
                    required={f.isRequired}
                    hint={f.helpText || 'PDF, PNG, JPG up to 5 MB'}
                    value={customValues[fieldId]}
                    onChange={(file) => {
                      setCustomValues((prev) => ({ ...prev, [fieldId]: file }));
                    }}
                  />
                );
              })}
            </div>
          </Card>

          <div className="flex justify-between pt-2">
            <Button
              variant="secondary"
              onClick={() => setStep(regularFields.length > 0 ? 1 : 0)}
              leftIcon={ArrowLeft}
            >
              Back
            </Button>
            <Button variant="primary" onClick={handleStep2Next} rightIcon={ArrowRight}>
              Review Booking
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: ORDER REVIEW & CONFIRMATION */}
      {/* ========================================================================= */}
      {step === 3 && (
        <div className="space-y-6 animate-fadeIn">
          <Card title="Review & Confirm Registration">
            <div className="space-y-4 text-sm">
              {/* Event / Activity */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase">Event</p>
                  <p className="font-bold text-zinc-950 text-base">{event.title}</p>
                  {selected?.activityTitle && (
                    <p className="text-xs text-brand-600 font-semibold mt-0.5">
                      Activity: {selected.activityTitle}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="text-xs font-bold text-brand-600 hover:underline"
                >
                  Change
                </button>
              </div>

              {/* Attendee */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase">Participant</p>
                  <p className="font-bold text-zinc-900">{formName}</p>
                  <p className="text-xs text-zinc-500">
                    {formEmail} · {formPhone}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="text-xs font-bold text-brand-600 hover:underline"
                >
                  Edit
                </button>
              </div>

              {/* Pass details */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase">Ticket Type</p>
                  <p className="font-bold text-zinc-900">
                    {quantity} × {selected?.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatCurrency(selected?.price, selected?.currency)} per ticket
                  </p>
                </div>
                <p className="font-black text-zinc-950 text-base font-display">
                  {formatCurrency(total, selected?.currency)}
                </p>
              </div>

              {/* Custom Details Preview */}
              {formFields.length > 0 && (
                <div className="border-b border-zinc-100 pb-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-zinc-400 uppercase">Additional Info</p>
                    <button
                      type="button"
                      onClick={() => setStep(regularFields.length > 0 ? 1 : 2)}
                      className="text-xs font-bold text-brand-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  {formFields.map((f) => {
                    const val = customValues[f.id];
                    if (!val) return null;
                    const displayVal = typeof val === 'object' ? val.name || 'File Attached' : String(val);
                    return (
                      <div key={f.id} className="flex justify-between text-xs">
                        <span className="text-zinc-500">{f.fieldLabel}:</span>
                        <span className="font-semibold text-zinc-800">{displayVal}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Total Row */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-base text-zinc-900">Total Payable</span>
                <span className="text-2xl font-black text-brand-600 font-display">
                  {formatCurrency(total, selected?.currency)}
                </span>
              </div>
            </div>
          </Card>

          {/* Trust Banner */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-950 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Instant E-Ticket & Gate Confirmation</p>
              <p className="text-emerald-800 mt-0.5">
                Upon completing payment, your digital ticket with encrypted single-entry QR code and PDF receipt will be delivered immediately to <strong>{formEmail}</strong>.
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-between pt-2">
            <Button
              variant="secondary"
              disabled={submitting}
              onClick={() => setStep(fileFields.length > 0 ? 2 : regularFields.length > 0 ? 1 : 0)}
              leftIcon={ArrowLeft}
            >
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              loading={submitting}
              onClick={pay}
              leftIcon={CreditCard}
            >
              Proceed to Payment ({formatCurrency(total, selected?.currency)})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
