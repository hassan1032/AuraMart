import { cn } from '../../lib/utils';

export const Spinner = ({ size = 24, className }) => (
  <svg
    style={{ width: size, height: size }}
    className={cn('animate-spin text-[#E63946]', className)}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

export const PageSpinner = () => (
  <div className="flex items-center justify-center py-24">
    <Spinner size={36} />
  </div>
);

export const FullPageSpinner = () => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
    <Spinner size={40} />
  </div>
);

export default Spinner;
