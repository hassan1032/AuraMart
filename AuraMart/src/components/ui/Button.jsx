import { cn } from '../../lib/utils';

const variants = {
  primary:   'bg-[#E63946] text-white hover:bg-[#C5303A] active:bg-[#C5303A]',
  cta:       'bg-[#F4A261] text-white hover:bg-[#DB7C3E] active:bg-[#DB7C3E]',
  outline:   'border border-[#E63946] text-[#E63946] hover:bg-[#FFF1F1] bg-white',
  ghost:     'text-gray-600 hover:bg-gray-100 bg-transparent',
  danger:    'bg-red-500 text-white hover:bg-red-600',
  white:     'bg-white text-[#E63946] hover:bg-gray-50 border border-gray-200',
};

const sizes = {
  sm:  'h-8  px-3 text-xs  gap-1.5',
  md:  'h-10 px-4 text-sm  gap-2',
  lg:  'h-12 px-6 text-base gap-2',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  icon,
  iconRight,
  loading = false,
  fullWidth = false,
  ...props
}) => (
  <button
    className={cn(
      'inline-flex items-center justify-center font-semibold rounded',
      'transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E63946]/50',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variants[variant] || variants.primary,
      sizes[size] || sizes.md,
      fullWidth && 'w-full',
      className,
    )}
    {...props}
  >
    {loading ? (
      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    ) : icon}
    {children}
    {!loading && iconRight}
  </button>
);

export default Button;
