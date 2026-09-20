import { STATUS_TONES } from '../utils/constants.js';
import { titleCase } from '../utils/format.js';

const TONES = {
  green: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dot: 'bg-emerald-500',
  },
  amber: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dot: 'bg-amber-500',
  },
  red: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dot: 'bg-rose-500',
  },
  blue: {
    badge: 'bg-sky-50 text-sky-700 border-sky-200/80',
    dot: 'bg-sky-500',
  },
  purple: {
    badge: 'bg-purple-50 text-purple-700 border-purple-200/80',
    dot: 'bg-purple-500',
  },
  brand: {
    badge: 'bg-brand-50 text-brand-700 border-brand-200/80',
    dot: 'bg-brand-500',
  },
  zinc: {
    badge: 'bg-zinc-100 text-zinc-700 border-zinc-200/80',
    dot: 'bg-zinc-400',
  },
};

export default function Badge({
  children,
  tone = 'zinc',
  withDot = false,
  size = 'sm',
  className = '',
}) {
  const currentTone = TONES[tone] || TONES.zinc;
  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border tracking-wide uppercase ${sizeClasses} ${currentTone.badge} ${className}`}
    >
      {withDot && <span className={`badge-dot ${currentTone.dot}`} />}
      <span>{children}</span>
    </span>
  );
}

export function StatusBadge({ status, size = 'sm', className = '' }) {
  if (!status) return null;
  const tone = STATUS_TONES[status] || 'zinc';
  return (
    <Badge tone={tone} withDot size={size} className={className}>
      {titleCase(status)}
    </Badge>
  );
}
