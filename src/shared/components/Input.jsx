export function Field({ label, error, hint, required, children, htmlFor }) {
  return (
    <div>
      {label && (
        <label className="label" htmlFor={htmlFor}>
          {label} {required && <span className="text-brand-600">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function Input({ label, error, hint, required, className = '', id, ...props }) {
  const inputId = id || props.name;
  return (
    <Field label={label} error={error} hint={hint} required={required} htmlFor={inputId}>
      <input id={inputId} className={`input ${error ? 'border-red-400' : ''} ${className}`} {...props} />
    </Field>
  );
}

export function Textarea({ label, error, hint, required, className = '', id, ...props }) {
  const inputId = id || props.name;
  return (
    <Field label={label} error={error} hint={hint} required={required} htmlFor={inputId}>
      <textarea id={inputId} rows={4} className={`input ${error ? 'border-red-400' : ''} ${className}`} {...props} />
    </Field>
  );
}

export function Select({ label, error, hint, required, className = '', id, children, ...props }) {
  const inputId = id || props.name;
  return (
    <Field label={label} error={error} hint={hint} required={required} htmlFor={inputId}>
      <select id={inputId} className={`input ${error ? 'border-red-400' : ''} ${className}`} {...props}>
        {children}
      </select>
    </Field>
  );
}
