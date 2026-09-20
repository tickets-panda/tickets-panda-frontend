import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-sm shadow-brand-500/20 disabled:bg-brand-300 disabled:shadow-none border border-transparent',
  secondary: 'bg-white text-zinc-800 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 active:bg-zinc-100 shadow-subtle disabled:bg-zinc-50 disabled:text-zinc-400',
  outline: 'bg-transparent text-brand-600 border border-brand-300 hover:bg-brand-50 active:bg-brand-100 disabled:border-zinc-200 disabled:text-zinc-400',
  dark: 'bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-950 shadow-sm disabled:bg-zinc-400 border border-transparent',
  ghost: 'bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200 disabled:text-zinc-300 border border-transparent',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm disabled:bg-rose-300 border border-transparent',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm disabled:bg-emerald-300 border border-transparent',
};

const SIZES = {
  xs: 'px-2.5 py-1 text-xs rounded-lg gap-1.5',
  sm: 'px-3.5 py-1.5 text-xs font-semibold rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm font-semibold rounded-xl gap-2',
  lg: 'px-5 py-3 text-base font-semibold rounded-xl gap-2.5',
  xl: 'px-6 py-3.5 text-base font-bold rounded-2xl gap-3 shadow-md',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    fullWidth = false,
    className = '',
    type = 'button',
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:active:scale-100 ${
        VARIANTS[variant] || VARIANTS.primary
      } ${SIZES[size] || SIZES.md} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
      ) : (
        LeftIcon && <LeftIcon className="h-4 w-4 shrink-0" />
      )}
      <span>{children}</span>
      {!loading && RightIcon && <RightIcon className="h-4 w-4 shrink-0" />}
    </button>
  );
});

export default Button;
