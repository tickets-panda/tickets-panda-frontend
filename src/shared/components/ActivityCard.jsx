import { useState } from 'react';
import { MapPin, Users, Calendar, ShieldCheck, Sparkles, ChevronRight, FileText } from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../utils/format.js';
import Button from './Button.jsx';
import Modal from './Modal.jsx';

export default function ActivityCard({
  activity,
  onRegister,
  className = '',
}) {
  const [rulesOpen, setRulesOpen] = useState(false);
  const ticketType = activity.ticketTypes?.[0] || null;
  const price = ticketType ? Number(ticketType.price) : 0;
  const currency = ticketType?.currency || 'INR';
  const remaining = ticketType?.remaining;

  return (
    <>
      <div
        className={`card group flex flex-col justify-between overflow-hidden border border-zinc-200/90 transition-all hover:border-brand-300 hover:shadow-card-hover ${className}`}
      >
        <div>
          {/* Activity Header or Poster Thumbnail */}
          {activity.posterUrl ? (
            <div className="h-40 w-full overflow-hidden bg-zinc-100 relative">
              <img
                src={activity.posterUrl}
                alt={activity.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3">
                <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/20">
                  {price > 0 ? formatCurrency(price, currency) : 'Free Entry'}
                </span>
              </div>
            </div>
          ) : (
            <div className="border-b border-zinc-100 bg-gradient-to-r from-orange-50 to-brand-50/40 p-5 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/10 text-brand-600">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Competition / Activity
                </span>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-zinc-900 border border-zinc-200 shadow-subtle">
                {price > 0 ? formatCurrency(price, currency) : 'Free'}
              </span>
            </div>
          )}

          {/* Body Content */}
          <div className="p-5">
            <h3 className="text-lg font-bold text-zinc-900 group-hover:text-brand-600 transition-colors">
              {activity.title}
            </h3>

            {activity.shortDescription && (
              <p className="mt-1 text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                {activity.shortDescription}
              </p>
            )}

            {/* Quick Metadata */}
            <div className="mt-4 space-y-1.5 text-xs text-zinc-600">
              {activity.startsAt && (
                <p className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                  <span>{formatDate(activity.startsAt)} · {formatTime(activity.startsAt)}</span>
                </p>
              )}
              {activity.venue && (
                <p className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                  <span className="truncate">{activity.venue}</span>
                </p>
              )}
              {activity.eligibility && (
                <p className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Eligibility: {activity.eligibility}</span>
                </p>
              )}
              {remaining !== undefined && (
                <p className="flex items-center gap-2 text-zinc-500">
                  <Users className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <span>{remaining > 0 ? `${remaining} slots remaining` : 'Full / Waitlist'}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-zinc-100 bg-zinc-50/50 p-4 flex items-center justify-between gap-2">
          {activity.rules ? (
            <button
              type="button"
              onClick={() => setRulesOpen(true)}
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 underline underline-offset-2 flex items-center gap-1"
            >
              <FileText className="h-3.5 w-3.5" /> Rules
            </button>
          ) : (
            <span className="text-xs text-zinc-400">Entry open</span>
          )}

          <Button
            size="sm"
            variant="primary"
            onClick={onRegister}
            disabled={remaining === 0}
            rightIcon={ChevronRight}
          >
            {remaining === 0 ? 'Sold out' : 'Register Now'}
          </Button>
        </div>
      </div>

      {/* Rules Modal */}
      {activity.rules && (
        <Modal
          open={rulesOpen}
          onClose={() => setRulesOpen(false)}
          title={`Rules & Guidelines — ${activity.title}`}
          description="Please review eligibility and event guidelines before registering."
        >
          <div className="space-y-4 text-sm text-zinc-700">
            {activity.eligibility && (
              <div className="rounded-xl bg-brand-50/60 border border-brand-200/80 p-3.5">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-800">
                  Eligibility Criteria
                </p>
                <p className="mt-1 text-xs text-brand-950 font-medium">{activity.eligibility}</p>
              </div>
            )}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                Activity Rules
              </h4>
              <p className="whitespace-pre-line leading-relaxed text-xs text-zinc-600">
                {activity.rules}
              </p>
            </div>
            {activity.description && (
              <div className="border-t border-zinc-100 pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Full Details
                </h4>
                <p className="whitespace-pre-line leading-relaxed text-xs text-zinc-600">
                  {activity.description}
                </p>
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setRulesOpen(false);
                onRegister();
              }}
            >
              Accept & Register
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
