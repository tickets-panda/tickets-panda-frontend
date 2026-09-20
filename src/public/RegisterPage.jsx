import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Check, CreditCard, Minus, Plus, Sparkles, Upload, FileText, ArrowLeft } from 'lucide-react';
import api, { apiErrorMessage, apiFieldErrors } from '../shared/api/client.js';
import { PageLoader, EmptyState } from '../shared/components/Feedback.jsx';
import Input from '../shared/components/Input.jsx';
import Button from '../shared/components/Button.jsx';
import { formatCurrency } from '../shared/utils/format.js';
import { openRazorpay } from '../shared/utils/razorpay.js';

const STEPS = ['Ticket', 'Your details', 'Review & Pay'];

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

  const { register, handleSubmit, getValues, formState } = useForm({
    defaultValues: { name: '', email: '', phone: '' },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-event', tenantSlug, eventSlug],
    queryFn: async () => (await api.get(`/public/t/${tenantSlug}/events/${eventSlug}`)).data.data,
  });

  // If ticketTypeParam is provided or activities exist, resolve tickets
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
    () => allTicketTypes.find((type) => type.id === ticketTypeId) || null,
    [allTicketTypes, ticketTypeId],
  );

  // Auto-select if ticketTypeId param is in URL
  useEffect(() => {
    if (ticketTypeParam && allTicketTypes.length > 0) {
      const match = allTicketTypes.find((t) => t.id === Number(ticketTypeParam));
      if (match) {
        setTicketTypeId(match.id);
        setQuantity(Math.min(Math.max(match.minPerOrder || 1, 1), match.remaining || 1));
      }
    }
  }, [ticketTypeParam, allTicketTypes]);

  if (isLoading) return <PageLoader label="Preparing registration…" />;
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
        <EmptyState title="No tickets on sale" description="This event has no active ticket types." />
      </div>
    );
  }

  const selectTicket = (type) => {
    setTicketTypeId(type.id);
    setQuantity(Math.min(Math.max(type.minPerOrder || 1, 1), type.remaining || 1));
  };

  const validateCustomFields = () => {
    for (const field of formFields) {
      if (field.isRequired && !String(customValues[field.id] ?? '').trim()) {
        toast.error(`${field.fieldLabel} is required`);
        return false;
      }
    }
    return true;
  };

  const goToDetails = () => {
    if (!selected) return toast.error('Choose a ticket type first');
    setStep(1);
  };

  const goToPayment = async () => {
    const valid = await handleSubmit(() => true)();
    if (!valid) return;
    if (!validateCustomFields()) return;
    setStep(2);
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
      if (firstFieldError) setStep(1);
    } finally {
      setSubmitting(false);
    }
  };

  const total = selected ? Number(selected.price) * quantity : 0;
  const { name: formName, email: formEmail, phone: formPhone } = getValues();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(`/t/${tenantSlug}/events/${eventSlug}`)}
            className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 mb-1"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Event
          </button>
          <h1 className="text-xl font-bold text-zinc-900">{event.title}</h1>
          <p className="text-xs text-brand-600 font-semibold uppercase tracking-wider">{tenant.name}</p>
        </div>
      </div>

      {activityParam && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-orange-50 border border-orange-200 px-3 py-2 text-xs text-orange-800">
          <Sparkles className="h-4 w-4 text-orange-600" />
          <span>Registering for activity: <strong>{activityParam.replace('-', ' ').toUpperCase()}</strong></span>
        </div>
      )}

      {/* Stepper */}
      <ol className="mt-6 flex items-center gap-2 text-xs font-medium">
        {STEPS.map((label, index) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${
                index < step ? 'bg-emerald-500 text-white' : index === step ? 'bg-brand-500 text-white' : 'bg-zinc-200 text-zinc-500'
              }`}
            >
              {index < step ? <Check className="h-3.5 w-3.5" /> : index + 1}
            </span>
            <span className={index === step ? 'font-bold text-zinc-900' : 'text-zinc-500'}>{label}</span>
            {index < STEPS.length - 1 && <span className="hidden h-px flex-1 bg-zinc-200 sm:block" />}
          </li>
        ))}
      </ol>

      <div className="card mt-5 p-6 shadow-sm border border-zinc-200">
        {step === 0 && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-zinc-800">Select Admission or Activity Pass</p>
            <div className="space-y-3">
              {allTicketTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  disabled={type.remaining <= 0}
                  onClick={() => selectTicket(type)}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition disabled:opacity-50 ${
                    ticketTypeId === type.id ? 'border-brand-500 bg-brand-50/60 ring-1 ring-brand-500' : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-zinc-900">{type.name}</p>
                      {type.activityTitle && (
                        <span className="rounded bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-800">
                          {type.activityTitle}
                        </span>
                      )}
                    </div>
                    {type.description && <p className="mt-0.5 text-xs text-zinc-500">{type.description}</p>}
                    <p className="mt-1 text-xs text-zinc-500">
                      {type.remaining > 0 ? `${type.remaining} tickets left` : 'Sold out'}
                    </p>
                  </div>
                  <span className="font-bold text-zinc-900 text-base">
                    {Number(type.price) > 0 ? formatCurrency(type.price, type.currency) : 'Free'}
                  </span>
                </button>
              ))}
            </div>

            {selected && selected.remaining > 0 && (
              <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-4 border border-zinc-200">
                <span className="text-sm font-medium text-zinc-700">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(selected.minPerOrder || 1, q - 1))}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-zinc-300 bg-white hover:bg-zinc-100"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-6 text-center font-bold text-zinc-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(selected.maxPerOrder || 10, selected.remaining, q + 1))}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-zinc-300 bg-white hover:bg-zinc-100"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3">
              <Button onClick={goToDetails} disabled={!selected || selected.remaining <= 0}>
                Continue to Details
              </Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goToPayment();
            }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-sm font-bold text-zinc-800">Primary Contact Information</h2>
              <p className="text-xs text-zinc-500">Your digital tickets and entry pass will be delivered here.</p>
            </div>

            <Input label="Full Name" required error={formState.errors.name?.message} {...register('name', { required: 'Name is required' })} />
            <Input
              label="Email Address"
              type="email"
              required
              error={formState.errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
              })}
              hint="E-ticket PDF and QR admission token will be sent to this email."
            />
            <Input label="Phone Number" type="tel" error={formState.errors.phone?.message} {...register('phone')} />

            {formFields.length > 0 && (
              <div className="space-y-4 border-t border-zinc-200 pt-5">
                <div>
                  <h3 className="text-sm font-bold text-zinc-800">Registration Details</h3>
                  <p className="text-xs text-zinc-500">Required event/college registration questions.</p>
                </div>

                {formFields.map((field) => {
                  const value = customValues[field.id] ?? '';
                  const onChange = (raw) => setCustomValues((prev) => ({ ...prev, [field.id]: raw }));

                  if (field.fieldType === 'TEXTAREA') {
                    return (
                      <div key={field.id}>
                        <label className="label">
                          {field.fieldLabel} {field.isRequired && <span className="text-brand-600">*</span>}
                        </label>
                        <textarea
                          className="input"
                          rows={3}
                          value={value}
                          placeholder={field.placeholder || ''}
                          onChange={(e) => onChange(e.target.value)}
                        />
                        {field.helpText && <p className="mt-1 text-xs text-zinc-400">{field.helpText}</p>}
                      </div>
                    );
                  }

                  if (field.fieldType === 'SELECT') {
                    return (
                      <div key={field.id}>
                        <label className="label">
                          {field.fieldLabel} {field.isRequired && <span className="text-brand-600">*</span>}
                        </label>
                        <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
                          <option value="">Select option…</option>
                          {(field.options || []).map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {field.helpText && <p className="mt-1 text-xs text-zinc-400">{field.helpText}</p>}
                      </div>
                    );
                  }

                  if (field.fieldType === 'RADIO') {
                    return (
                      <div key={field.id}>
                        <label className="label">
                          {field.fieldLabel} {field.isRequired && <span className="text-brand-600">*</span>}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {(field.options || []).map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => onChange(option)}
                              className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                                value === option ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-zinc-300 text-zinc-700'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                        {field.helpText && <p className="mt-1 text-xs text-zinc-400">{field.helpText}</p>}
                      </div>
                    );
                  }

                  if (field.fieldType === 'CHECKBOX') {
                    const selectedValues = Array.isArray(value) ? value : [];
                    return (
                      <div key={field.id}>
                        <label className="label">
                          {field.fieldLabel} {field.isRequired && <span className="text-brand-600">*</span>}
                        </label>
                        <div className="space-y-1">
                          {(field.options || []).map((option) => (
                            <label key={option} className="flex items-center gap-2 text-xs text-zinc-700">
                              <input
                                type="checkbox"
                                className="rounded border-zinc-300 text-brand-500"
                                checked={selectedValues.includes(option)}
                                onChange={(e) =>
                                  onChange(
                                    e.target.checked
                                      ? [...selectedValues, option]
                                      : selectedValues.filter((item) => item !== option),
                                  )
                                }
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                        {field.helpText && <p className="mt-1 text-xs text-zinc-400">{field.helpText}</p>}
                      </div>
                    );
                  }

                  if (field.fieldType === 'FILE') {
                    return (
                      <div key={field.id}>
                        <label className="label">
                          {field.fieldLabel} {field.isRequired && <span className="text-brand-600">*</span>}
                        </label>
                        <div className="mt-1 flex items-center gap-3">
                          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100">
                            <Upload className="h-4 w-4 text-zinc-500" />
                            <span>{value ? 'Change document' : 'Upload document'}</span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  onChange(file.name);
                                  toast.success(`Attached: ${file.name}`);
                                }
                              }}
                            />
                          </label>
                          {value && (
                            <span className="flex items-center gap-1 text-xs text-zinc-600 truncate max-w-xs">
                              <FileText className="h-3.5 w-3.5 text-brand-600" /> {value}
                            </span>
                          )}
                        </div>
                        {field.helpText && <p className="mt-1 text-xs text-zinc-400">{field.helpText}</p>}
                      </div>
                    );
                  }

                  const inputType =
                    field.fieldType === 'EMAIL' ? 'email' : field.fieldType === 'NUMBER' ? 'number' : field.fieldType === 'DATE' ? 'date' : field.fieldType === 'PHONE' ? 'tel' : 'text';

                  return (
                    <div key={field.id}>
                      <label className="label">
                        {field.fieldLabel} {field.isRequired && <span className="text-brand-600">*</span>}
                      </label>
                      <input
                        type={inputType}
                        className="input"
                        value={value}
                        placeholder={field.placeholder || ''}
                        onChange={(e) => onChange(e.target.value)}
                      />
                      {field.helpText && <p className="mt-1 text-xs text-zinc-400">{field.helpText}</p>}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-zinc-100">
              <Button variant="secondary" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button type="submit">Review & Pay</Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-zinc-900">Review Registration Summary</h2>
              <p className="text-xs text-zinc-500">Please confirm your details before completing payment.</p>
            </div>

            {/* Read-only Review Groups per spec 03-CUSTOMER-AND-EVENT-UX.txt */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 space-y-3 text-xs">
              <div className="flex justify-between border-b border-zinc-200/80 pb-2">
                <span className="text-zinc-500">Event:</span>
                <span className="font-bold text-zinc-900">{event.title}</span>
              </div>
              {selected?.activityTitle && (
                <div className="flex justify-between border-b border-zinc-200/80 pb-2">
                  <span className="text-zinc-500">Activity:</span>
                  <span className="font-bold text-orange-700">{selected.activityTitle}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-zinc-200/80 pb-2">
                <span className="text-zinc-500">Pass Type:</span>
                <span className="font-medium text-zinc-900">{selected.name} × {quantity}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-200/80 pb-2">
                <span className="text-zinc-500">Participant Name:</span>
                <span className="font-medium text-zinc-900">{formName}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-200/80 pb-2">
                <span className="text-zinc-500">Email:</span>
                <span className="font-medium text-zinc-900">{formEmail}</span>
              </div>
              {formPhone && (
                <div className="flex justify-between border-b border-zinc-200/80 pb-2">
                  <span className="text-zinc-500">Phone:</span>
                  <span className="font-medium text-zinc-900">{formPhone}</span>
                </div>
              )}

              {/* Custom fields review */}
              {formFields.map((f) => {
                const val = customValues[f.id];
                if (!val) return null;
                return (
                  <div key={f.id} className="flex justify-between border-b border-zinc-200/80 pb-2">
                    <span className="text-zinc-500">{f.fieldLabel}:</span>
                    <span className="font-medium text-zinc-900">{Array.isArray(val) ? val.join(', ') : String(val)}</span>
                  </div>
                );
              })}

              <div className="flex justify-between pt-1 font-bold text-sm text-zinc-900">
                <span>Total Amount:</span>
                <span className="text-brand-600 font-black text-base">{formatCurrency(total, selected.currency)}</span>
              </div>
            </div>

            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
              <p>🔒 <strong>Instant Confirmation:</strong> Your payment will be verified server-side. A unique digital QR e-ticket and PDF will be generated immediately and sent to {formEmail}.</p>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="secondary" onClick={() => setStep(1)} disabled={submitting}>
                Edit Details
              </Button>
              <Button onClick={pay} loading={submitting}>
                <CreditCard className="h-4 w-4" /> Pay {formatCurrency(total, selected.currency)}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
