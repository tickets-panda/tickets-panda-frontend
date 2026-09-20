export default function Stat({
  label,
  value,
  icon: Icon,
  hint,
  trend,
  trendType = 'up', // 'up' | 'down' | 'neutral'
  tone = 'brand',
  className = '',
}) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600 border-brand-100',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-sky-50 text-sky-600 border-sky-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    zinc: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  };

  return (
    <div className={`card p-5 hover:shadow-card-hover transition-all ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">{label}</p>
          <p className="mt-1.5 text-2xl font-black tracking-tight text-zinc-950 truncate">{value}</p>
          {(hint || trend) && (
            <div className="mt-2 flex items-center gap-2 text-xs">
              {trend && (
                <span
                  className={`font-semibold ${
                    trendType === 'up'
                      ? 'text-emerald-600'
                      : trendType === 'down'
                      ? 'text-rose-600'
                      : 'text-zinc-500'
                  }`}
                >
                  {trend}
                </span>
              )}
              {hint && <span className="text-zinc-400 truncate">{hint}</span>}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`rounded-xl p-2.5 border shadow-subtle shrink-0 ${tones[tone] || tones.brand}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}
