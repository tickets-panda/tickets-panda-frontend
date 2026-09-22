import { forwardRef, useEffect, useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, FileText, X, AlertCircle } from 'lucide-react';

export function Field({ label, error, hint, required, children, htmlFor, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <label className="label" htmlFor={htmlFor}>
          {label} {required && <span className="text-brand-600 font-bold ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-zinc-500 leading-normal">{hint}</p>}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export const Input = forwardRef(function Input(
  { label, error, hint, required, className = '', id, leftIcon: LeftIcon, rightIcon: RightIcon, ...props },
  ref,
) {
  const inputId = id || props.name;
  return (
    <Field label={label} error={error} hint={hint} required={required} htmlFor={inputId}>
      <div className="relative flex items-center">
        {LeftIcon && (
          <div className="pointer-events-none absolute left-3.5 text-zinc-400">
            <LeftIcon className="h-4 w-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`input ${LeftIcon ? 'pl-10' : ''} ${RightIcon ? 'pr-10' : ''} ${
            error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : ''
          } ${className}`}
          {...props}
        />
        {RightIcon && (
          <div className="pointer-events-none absolute right-3.5 text-zinc-400">
            <RightIcon className="h-4 w-4" />
          </div>
        )}
      </div>
    </Field>
  );
});

export const Textarea = forwardRef(function Textarea(
  { label, error, hint, required, className = '', id, rows = 4, ...props },
  ref,
) {
  const inputId = id || props.name;
  return (
    <Field label={label} error={error} hint={hint} required={required} htmlFor={inputId}>
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={`input ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : ''} ${className}`}
        {...props}
      />
    </Field>
  );
});

export const Select = forwardRef(function Select(
  { label, error, hint, required, className = '', id, children, ...props },
  ref,
) {
  const inputId = id || props.name;
  return (
    <Field label={label} error={error} hint={hint} required={required} htmlFor={inputId}>
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          className={`input appearance-none pr-9 bg-no-repeat ${
            error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : ''
          } ${className}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '1.25em 1.25em',
          }}
          {...props}
        >
          {children}
        </select>
      </div>
    </Field>
  );
});

export const Checkbox = forwardRef(function Checkbox(
  { label, error, hint, id, className = '', ...props },
  ref,
) {
  const inputId = id || props.name;
  return (
    <div>
      <label htmlFor={inputId} className="flex cursor-pointer items-start gap-2.5 text-sm select-none">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className={`mt-0.5 h-4 w-4 rounded border-zinc-300 text-brand-600 focus:ring-brand-500/30 ${className}`}
          {...props}
        />
        <div>
          <span className="font-medium text-zinc-900">{label}</span>
          {hint && <p className="text-xs text-zinc-500 mt-0.5">{hint}</p>}
        </div>
      </label>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
});

/**
 * Polished Drag-and-Drop File Upload Component
 */
export function FileUpload({
  label,
  hint = 'PDF, PNG, JPG up to 5 MB',
  required,
  error,
  value,
  fileName,
  onChange,
  accept = '.pdf,.png,.jpg,.jpeg',
  maxSizeMb = 5,
}) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const describe = (v, name) => {
    if (!v) return null;
    if (typeof v === 'string') return { name: name || 'Attached file', size: null };
    return { name: v.name, size: v.size };
  };
  const [localFile, setLocalFile] = useState(() => describe(value, fileName));

  // Keep the display in sync when the parent sets the value asynchronously
  // (e.g. after FileReader converts the upload to a data URL).
  useEffect(() => {
    setLocalFile(describe(value, fileName));
  }, [value, fileName]);

  const handleFiles = (files) => {
    if (!files || !files.length) return;
    const file = files[0];
    if (file.size > maxSizeMb * 1024 * 1024) {
      alert(`File size exceeds ${maxSizeMb} MB`);
      return;
    }
    setLocalFile({ name: file.name, size: file.size });
    if (onChange) onChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Field label={label} required={required} error={error} hint={hint}>
      {!localFile ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
            dragActive
              ? 'border-brand-500 bg-brand-50/60 ring-4 ring-brand-500/10'
              : 'border-zinc-200 bg-zinc-50/50 hover:border-zinc-300 hover:bg-zinc-50'
          }`}
        >
          <div className="rounded-full bg-white p-3 shadow-subtle text-brand-600">
            <UploadCloud className="h-6 w-6" />
          </div>
          <p className="mt-2.5 text-xs font-semibold text-zinc-900">
            <span className="text-brand-600 underline underline-offset-2">Click to browse</span> or drag & drop
          </p>
          <p className="mt-1 text-[11px] text-zinc-400 uppercase tracking-wide font-medium">{hint}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700 shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 truncate">
              <p className="text-xs font-bold text-zinc-900 truncate flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                {localFile.name}
              </p>
              {localFile.size && (
                <p className="text-[11px] text-zinc-500">{formatFileSize(localFile.size)}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 underline px-2 py-1"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => { setLocalFile(null); if (onChange) onChange(null); }}
              className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
        </div>
      )}
    </Field>
  );
}

export default Input;
