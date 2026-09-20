import { Loader2, Inbox, AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button.jsx';

export function Spinner({ className = 'h-5 w-5', textClassName = 'text-brand-500' }) {
  return <Loader2 className={`${className} animate-spin ${textClassName}`} />;
}

export function PageLoader({ label = 'Loading…', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3.5 py-20 text-zinc-500">
      <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 shadow-subtle border border-brand-100/80">
        <span className="text-2xl animate-bounce">🐼</span>
        <div className="absolute inset-0 rounded-2xl border-2 border-brand-500 border-t-transparent animate-spin" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">{label}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}

export function EmptyState({
  title = 'Nothing here yet',
  description,
  action,
  icon: Icon = Inbox,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3.5 rounded-2xl border-2 border-dashed border-zinc-200 bg-white px-6 py-16 text-center ${className}`}
    >
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-zinc-50 text-zinc-400 border border-zinc-200/60 shadow-subtle">
        <Icon className="h-6 w-6" />
      </div>
      <div className="max-w-sm">
        <h3 className="text-sm font-bold text-zinc-900">{title}</h3>
        {description && <p className="mt-1 text-xs text-zinc-500 leading-relaxed">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We encountered an error loading this information.',
  onRetry,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center ${className}`}
    >
      <div className="rounded-full bg-rose-100 p-3 text-rose-600">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-rose-950">{title}</h3>
      <p className="max-w-md text-xs text-rose-800">{description}</p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          leftIcon={RefreshCw}
          className="mt-2"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}

export function Skeleton({ className = 'h-4 w-full', rounded = 'rounded-lg' }) {
  return (
    <div
      className={`bg-zinc-200/70 relative overflow-hidden ${rounded} ${className} before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10" rounded="rounded-xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="flex justify-between pt-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}

export default {
  Spinner,
  PageLoader,
  EmptyState,
  ErrorState,
  Skeleton,
  SkeletonCard,
};
