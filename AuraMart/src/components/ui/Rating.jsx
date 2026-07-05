import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

const Rating = ({ value = 4.2, count, className }) => {
  const full  = Math.floor(value);
  const half  = value - full >= 0.4;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {Array(full).fill(null).map((_, i) => (
          <Star key={`f${i}`} size={11} className="fill-[#F4A261] text-[#F4A261]" />
        ))}
        {half && (
          <span className="relative inline-block w-[11px] h-[11px]">
            <Star size={11} className="text-gray-300 fill-gray-200 absolute inset-0" />
            <span className="absolute inset-0 overflow-hidden w-1/2">
              <Star size={11} className="fill-[#F4A261] text-[#F4A261]" />
            </span>
          </span>
        )}
        {Array(empty).fill(null).map((_, i) => (
          <Star key={`e${i}`} size={11} className="text-gray-300 fill-gray-200" />
        ))}
      </div>
      <span className="text-[11px] font-semibold text-white bg-[#7CB342] px-1.5 py-0.5 rounded">
        {value.toFixed(1)} ★
      </span>
      {count && (
        <span className="text-[11px] text-gray-500">({count.toLocaleString()})</span>
      )}
    </div>
  );
};

export default Rating;
