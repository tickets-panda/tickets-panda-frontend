import { STATUS_TONES } from '../utils/constants.js';
import { titleCase } from '../utils/format.js';

const TONES = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  red: 'bg-red-50 text-red-700 ring-red-200',
  blue: 'bg-blue-50 text-blue-700 ring-blue-200',
  purple: 'bg-purple-50 text-purple-700 ring-purple-200',
  zinc: 'bg-zinc-100 text-zinc-600 ring-zinc-200',
};

export default function Badge({ children, tone = 'zinc', className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TONES[tone] || TONES.zinc} ${className}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  if (!status) return null;
  return <Badge tone={STATUS_TONES[status] || 'zinc'}>{titleCase(status)}</Badge>;
}
