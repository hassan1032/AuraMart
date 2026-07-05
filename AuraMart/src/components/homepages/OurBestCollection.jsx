import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ApiUrl } from '../../utils/api';

const FALLBACK = [
  { _id: '1', name: 'Flower Girls & Bridesmaids', thumbnail: '/images/collection1.jpg' },
  { _id: '2', name: 'Boutique Collection',         thumbnail: '/images/col2.webp' },
  { _id: '3', name: 'Party Collection',            thumbnail: '/images/col3.jpg' },
  { _id: '4', name: 'First Holy Communion',        thumbnail: '/images/col4.jpg' },
  { _id: '5', name: 'Accessories',                thumbnail: '/images/col5.webp' },
  { _id: '6', name: 'Bespoke Service',            thumbnail: '/images/col6.jpg' },
  { _id: '7', name: 'Christening',               thumbnail: '/images/col7.jpg' },
  { _id: '8', name: 'Pageboys',                   thumbnail: '/images/col8.jpg' },
];

const OurBestCollection = () => {
  const [items, setItems] = useState(FALLBACK);

  useEffect(() => {
    axios.get(ApiUrl.getAllCollections)
      .then(res => {
        const data = res.data?.data;
        if (Array.isArray(data) && data.length > 0) {
          const active = data
            .filter(c => c.status !== 'inactive')
            .slice(0, 8)
            .map(c => ({ ...c, name: c.name || c.collectionName || c.title || 'Collection' }));
          if (active.length > 0) setItems(active);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="w-full py-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((cat, idx) => (
          <Link to="/collections" key={cat._id || idx}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="relative h-[300px] sm:h-[260px] lg:h-[340px] rounded-2xl overflow-hidden cursor-pointer shadow-md"
              style={{
                backgroundImage: `url(${cat.thumbnail || cat.bannerThumnail || cat.image || cat.bannerImage || '/images/col8.jpg'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'top center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <h3 className="text-white text-[1rem] font-medium leading-snug drop-shadow mr-16">
                  {cat.name}
                </h3>
                {cat.productCount > 0 && (
                  <p className="text-white/60 text-xs mt-0.5">{cat.productCount} items</p>
                )}
              </div>

              {/* Bottom-right corner cutout */}
              <div className="absolute bottom-0 right-0 w-[72px] h-[56px] bg-white rounded-tl-[28px] rounded-br-2xl" />

              {/* Arrow */}
              <div className="absolute bottom-3 right-3 w-9 h-9 rounded-[30%] bg-[#E63946] flex items-center justify-center text-white z-20 shadow">
                <ChevronRight size={16} />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OurBestCollection;
