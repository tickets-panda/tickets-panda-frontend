export default function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'underline', // 'underline' | 'pills' | 'segmented'
  className = '',
}) {
  if (variant === 'segmented') {
    return (
      <div className={`inline-flex rounded-xl bg-zinc-100 p-1 text-xs font-semibold text-zinc-600 ${className}`}>
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 transition-all ${
                active
                  ? 'bg-white text-zinc-900 shadow-subtle font-bold'
                  : 'hover:text-zinc-900'
              }`}
            >
              {tab.icon && <tab.icon className="h-3.5 w-3.5" />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] ${active ? 'bg-brand-100 text-brand-700' : 'bg-zinc-200 text-zinc-600'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                active
                  ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
              }`}
            >
              {tab.icon && <tab.icon className="h-3.5 w-3.5" />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-600'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default: underline
  return (
    <div className={`flex border-b border-zinc-200 gap-6 ${className}`}>
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 border-b-2 py-3 text-sm font-semibold transition-colors ${
              active
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-800'
            }`}
          >
            {tab.icon && <tab.icon className="h-4 w-4" />}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${active ? 'bg-brand-50 text-brand-600' : 'bg-zinc-100 text-zinc-500'}`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
