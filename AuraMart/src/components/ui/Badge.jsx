import { cn } from '../../lib/utils';

const variants = {
  discount: 'bg-[#7CB342] text-white',
  new:      'bg-[#E63946] text-white',
  hot:      'bg-[#FF6161] text-white',
  sale:     'bg-[#F4A261] text-white',
  oos:      'bg-gray-400 text-white',
  default:  'bg-gray-100 text-gray-700',
};

const Badge = ({ children, variant = 'default', className }) => (
  <span
    className={cn(
      'inline-block px-1.5 py-0.5 text-[10px] font-bold tracking-wide rounded',
      variants[variant] || variants.default,
      className,
    )}
  >
    {children}
  </span>
);

export const DiscountBadge = ({ percent }) =>
  percent > 0 ? <Badge variant="discount">{percent}% OFF</Badge> : null;

export default Badge;
