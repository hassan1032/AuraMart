import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Gem } from 'lucide-react';
import axios from 'axios';
import { ApiUrl } from '../../utils/api.js';

const FALLBACK = [
  {
    label: 'Jewellery',
    sub: 'Necklaces, earrings & more',
    emoji: '💍',
    image: '/images/col3.jpg',
  },
  {
    label: 'Bags',
    sub: 'Clutches, totes & pouches',
    emoji: '👜',
    image: '/images/col4.jpg',
  },
  {
    label: 'Apparel Accessories',
    sub: 'Belts, scarves & headbands',
    emoji: '🎀',
    image: '/images/col5.jpg',
  },
  {
    label: 'Eyewear',
    sub: 'Glasses & sunglasses',
    emoji: '🕶️',
    image: '/images/col6.jpg',
  },
];

export default function AccessoriesDropdown() {
  const [types, setTypes] = useState(FALLBACK);

  useEffect(() => {
    axios.get(ApiUrl.getAllAccessoryTypes)
      .then(res => {
        const data = res.data?.data;
        if (Array.isArray(data) && data.length) {
          setTypes(data.slice(0, 4).map((t, i) => ({
            label: t.name || t.typeName || 'Accessory',
            sub: t.description || FALLBACK[i % FALLBACK.length].sub,
            emoji: FALLBACK[i % FALLBACK.length].emoji,
            image: t.thumbnail || t.image || FALLBACK[i % FALLBACK.length].image,
            _id: t._id,
          })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="bg-white rounded-2xl shadow-2xl border border-[#EAEAEA] overflow-hidden"
      style={{ width: '520px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#EAEAEA] bg-[#FAF7F2]">
        <div className="flex items-center gap-2">
          <Gem size={14} className="text-[#E63946]" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] leading-none">Shop</p>
            <p className="text-sm font-bold text-[#2B2D42]">Accessories</p>
          </div>
        </div>
        <Link
          to="/accessories"
          className="flex items-center gap-1 text-xs font-semibold text-[#E63946] hover:underline"
        >
          View All <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex">
        {/* Type list */}
        <div className="flex-1 p-3 space-y-1">
          {types.map((type, i) => (
            <Link
              key={type._id || i}
              to="/accessories"
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FFF1F1] transition-colors"
            >
              {/* Icon circle */}
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[#FAF7F2] flex-shrink-0 ring-1 ring-[#EAEAEA] group-hover:ring-[#E63946] transition-all">
                <img
                  src={type.image}
                  alt={type.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={e => { e.target.src = '/images/col8.jpg'; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#2B2D42] group-hover:text-[#E63946] transition-colors">
                  {type.emoji} {type.label}
                </p>
                <p className="text-[11px] text-[#6B7280] truncate">{type.sub}</p>
              </div>
              <ChevronRight size={14} className="text-[#EAEAEA] group-hover:text-[#E63946] flex-shrink-0 transition-colors" />
            </Link>
          ))}
        </div>

        {/* Side panel */}
        <div className="w-40 flex-shrink-0 border-l border-[#EAEAEA] bg-[#FAF7F2] p-4 flex flex-col">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#E63946] mb-3">Trending</p>
          <div className="flex-1 rounded-xl overflow-hidden mb-3 bg-gray-100">
            <img
              src="/images/col2.jpg"
              alt="Trending Accessories"
              className="w-full h-full object-cover"
              onError={e => { e.target.src = '/images/col8.jpg'; }}
            />
          </div>
          <p className="text-xs font-bold text-[#2B2D42] leading-tight mb-1">Style Essentials</p>
          <p className="text-[11px] text-[#6B7280] leading-relaxed mb-3">
            Complete your look with our curated picks
          </p>
          <Link
            to="/accessories"
            className="w-full py-2 bg-[#E63946] hover:bg-[#C5303A] text-white text-xs font-bold rounded-lg text-center transition-colors"
          >
            Explore
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
