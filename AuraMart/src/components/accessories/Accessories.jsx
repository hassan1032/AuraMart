import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';
import { ApiUrl } from '../../utils/api.js';

const TYPE_ICONS = {
  'Jewellery':           '💍',
  'Bags':                '👜',
  'Apparel Accessories': '👗',
  'Eyewear':             '🕶️',
};

const Skeleton = () => (
  <div className="rounded-2xl overflow-hidden border border-[#EAEAEA] bg-white">
    <div className="skeleton" style={{ height: 300 }} />
    <div className="p-4 space-y-2">
      <div className="skeleton h-4 rounded w-2/3" />
      <div className="skeleton h-3 rounded w-full" />
    </div>
  </div>
);

const Accessories = () => {
  const [types,   setTypes]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(ApiUrl.getAllAccessoryTypes)
      .then(res => {
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        setTypes(data.filter(t => t.status === 'active').slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)}
      </div>
    );
  }

  if (types.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-sm text-gray-400">No accessories available yet.</p>
        <Link to="/accessories" className="mt-3 inline-block text-xs font-semibold text-[#E63946] hover:underline">
          Browse Accessories →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {types.map((type, i) => {
        const icon = TYPE_ICONS[type.name] || '✨';
        const thumb = type.thumbnail || type.accessorybanner || '';
        return (
          <Link to="/accessories" key={type._id || i} className="group block">
            <div className="relative rounded-2xl overflow-hidden" style={{ height: 300 }}>
              {thumb ? (
                <img
                  src={thumb}
                  alt={type.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => { e.target.style.display = 'none'; e.target.nextSibling?.classList.remove('hidden'); }}
                />
              ) : null}
              {/* Fallback gradient if no image */}
              <div className={`absolute inset-0 w-full h-full bg-gradient-to-br from-[#2B2D42] to-[#E63946] ${thumb ? 'hidden' : ''}`} />

              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5" />

              {/* Icon badge */}
              <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm border border-white/25 flex items-center justify-center text-lg">
                {icon}
              </div>

              {/* Text content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-sm sm:text-base leading-snug mb-1">
                  {type.name}
                </h3>
                {type.description && (
                  <p className="text-white/65 text-xs mb-3 line-clamp-2">
                    {type.description}
                  </p>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-gray-800 text-[11px] font-semibold group-hover:bg-[#E63946] group-hover:text-white transition-colors">
                  Shop Now <ArrowRight size={10} />
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Accessories;
