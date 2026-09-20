export default function Card({
  title,
  subtitle,
  actions,
  children,
  footer,
  hoverable = false,
  className = '',
  bodyClassName = '',
  headerClassName = '',
  footerClassName = '',
}) {
  return (
    <section
      className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`}
    >
      {(title || actions || subtitle) && (
        <header
          className={`flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-6 py-4.5 ${headerClassName}`}
        >
          <div>
            {title && <h2 className="text-sm font-bold tracking-tight text-zinc-900">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={`p-6 ${bodyClassName}`}>{children}</div>
      {footer && (
        <footer
          className={`border-t border-zinc-100 bg-zinc-50/50 px-6 py-3.5 rounded-b-2xl ${footerClassName}`}
        >
          {footer}
        </footer>
      )}
    </section>
  );
}
