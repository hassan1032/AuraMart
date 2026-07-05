import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import axios from 'axios';
import { ApiUrl } from '../../utils/api.js';

const FALLBACK = [
  { label: 'Flower Girl',        image: '/images/col1.jpg', tag: 'Best Seller' },
  { label: 'Bridesmaid',         image: '/images/col2.jpg', tag: null },
  { label: 'First Communion',    image: '/images/col3.jpg', tag: 'New' },
  { label: 'Party Dresses',      image: '/images/col4.jpg', tag: null },
  { label: 'Wedding Collection', image: '/images/col5.jpg', tag: 'Trending' },
  { label: 'Christening Gowns',  image: '/images/col6.jpg', tag: null },
];

export default function CollectionsDropdown() {
  const [items, setItems] = useState(FALLBACK);

  useEffect(() => {
    axios.get(ApiUrl.getAllCollections)
      .then(res => {
        const data = res.data?.data;
        if (Array.isArray(data) && data.length) {
          setItems(data.slice(0, 6).map((c, i) => ({
            label: c.collectionName || c.name || 'Collection',
            image: c.thumbnail || c.image || FALLBACK[i % FALLBACK.length].image,
            tag: null,
            _id: c._id,
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
      style={{ width: '660px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#EAEAEA] bg-[#FAF7F2]">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-[#E63946]" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] leading-none">Browse</p>
            <p className="text-sm font-bold text-[#2B2D42]">Collections</p>
          </div>
        </div>
        <Link
          to="/collections"
          className="flex items-center gap-1 text-xs font-semibold text-[#E63946] hover:underline"
        >
          View All <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex">
        {/* Category grid */}
        <div className="flex-1 grid grid-cols-3 gap-1 p-4">
          {items.map((item, i) => (
            <Link
              key={item._id || i}
              to="/collections"
              className="group relative flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-[#FFF1F1] transition-colors text-center"
            >
              <div className="relative w-[62px] h-[62px] rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-[#E63946] transition-all duration-200 shadow-sm">
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={e => { e.target.src = '/images/col8.jpg'; }}
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#2B2D42] group-hover:text-[#E63946] transition-colors leading-tight line-clamp-2">
                  {item.label}
                </p>
                {item.tag && (
                  <span className="inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#E63946] text-white">
                    {item.tag}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Featured panel */}
        <div className="w-44 flex-shrink-0 border-l border-[#EAEAEA] bg-[#FAF7F2] p-4 flex flex-col">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#E63946] mb-3">Featured</p>
          <div className="flex-1 rounded-xl overflow-hidden mb-3 bg-gray-100">
            <img
              src="/images/col7.jpg"
              alt="New Arrivals"
              className="w-full h-full object-cover"
              onError={e => { e.target.src = '/images/col8.jpg'; }}
            />
          </div>
          <p className="text-sm font-bold text-[#2B2D42] leading-tight mb-1">New Arrivals</p>
          <p className="text-[11px] text-[#6B7280] leading-relaxed mb-3">
            Handcrafted styles for every special occasion
          </p>
          <Link
            to="/collections"
            className="w-full py-2 bg-[#E63946] hover:bg-[#C5303A] text-white text-xs font-bold rounded-lg text-center transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
