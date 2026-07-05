import { useState, useEffect, useRef } from 'react';
import { Heart, ShoppingCart, SlidersHorizontal, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ApiUrl } from '../../utils/api.js';
import { productPrice, normalizeProduct } from '../../utils/price.js';
import { useWishlist } from '../../context/WishlistContext.jsx';

const SORT_OPTIONS = [
  { value: '',             label: 'Featured' },
  { value: 'low-high',    label: 'Price: Low to High' },
  { value: 'high-low',    label: 'Price: High to Low' },
  { value: 'a-z',         label: 'Alphabetically: A–Z' },
  { value: 'z-a',         label: 'Alphabetically: Z–A' },
  { value: 'bestselling', label: 'Best Selling' },
];

const SkeletonCard = () => (
  <div className="bg-white rounded-lg border border-[#EAEAEA] overflow-hidden">
    <div className="skeleton aspect-[3/4]" />
    <div className="p-3 space-y-2">
      <div className="skeleton h-3.5 w-3/4 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="skeleton h-4 w-1/3 rounded" />
    </div>
  </div>
);

const FilterSection = ({ title, open, onToggle, children }) => (
  <div className="border-b border-[#EAEAEA] pb-3 mb-3">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between text-sm font-semibold text-gray-800 py-2"
    >
      {title}
      {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
    </button>
    {open && <div className="mt-2">{children}</div>}
  </div>
);

const Collection = ({ addToCart, openCart }) => {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [products,      setProducts]      = useState([]);
  const [sorted,        setSorted]        = useState([]);
  const [collections,   setCollections]   = useState([]);
  const [colorOptions,  setColorOptions]  = useState([]);
  const [sizeOptions,   setSizeOptions]   = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [sortBy,        setSortBy]        = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes,  setSelectedSizes]  = useState([]);
  const [added,          setAdded]        = useState({});
  const [showMobile,     setShowMobile]   = useState(false);
  const [activeCollection, setActiveCollection] = useState(null);

  // Filter sections open state
  const [openSort,  setOpenSort]  = useState(true);
  const [openColor, setOpenColor] = useState(true);
  const [openSize,  setOpenSize]  = useState(false);

  const bannerRef = useRef(null);
  const scrollBanner = (dir) => {
    if (!bannerRef.current) return;
    const isMobile = window.innerWidth < 640;
    const w = isMobile ? bannerRef.current.clientWidth : bannerRef.current.clientWidth / 4;
    bannerRef.current.scrollBy({ left: dir * w, behavior: 'smooth' });
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [pr, cr] = await Promise.allSettled([
          axios.get(`${ApiUrl.getAllProducts}?limit=60`),
          axios.get(ApiUrl.getAllCollections),
        ]);
        if (pr.status === 'fulfilled' && pr.value.data?.data?.length) {
          const norm = pr.value.data.data.map(normalizeProduct);
          setProducts(norm);
          setSorted(norm);
          const colors = norm.flatMap(p => p.colors || []).filter(Boolean);
          setColorOptions([...new Set(colors)].slice(0, 20));
          const sizes = norm.flatMap(p => p.sizes || []).filter(Boolean);
          setSizeOptions([...new Set(sizes)].slice(0, 15));
        }
        if (cr.status === 'fulfilled' && cr.value.data?.data?.length) {
          setCollections(cr.value.data.data);
        }
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  useEffect(() => {
    if (collections.length === 0) return;
    const t = setInterval(() => {
      if (!bannerRef.current || window.innerWidth >= 640) return;
      const ref = bannerRef.current;
      if (ref.scrollLeft + ref.clientWidth >= ref.scrollWidth - 5) {
        ref.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        ref.scrollBy({ left: ref.clientWidth, behavior: 'smooth' });
      }
    }, 3500);
    return () => clearInterval(t);
  }, [collections.length]);

  useEffect(() => {
    let list = [...products];
    // Filter by active collection
    if (activeCollection !== null && collections[activeCollection]) {
      const collName = collections[activeCollection].name || collections[activeCollection].collectionName;
      if (collName) {
        list = list.filter(p =>
          p.category === collName ||
          (Array.isArray(p.selectCollection) && p.selectCollection.includes(collName))
        );
      }
    }
    const parse = (p) => parseFloat(String(p.price || '0').replace(/[₹$,]/g, '')) || 0;
    if (sortBy === 'low-high') list.sort((a, b) => parse(a) - parse(b));
    else if (sortBy === 'high-low') list.sort((a, b) => parse(b) - parse(a));
    else if (sortBy === 'a-z') list.sort((a, b) => (a.title||'').localeCompare(b.title||''));
    else if (sortBy === 'z-a') list.sort((a, b) => (b.title||'').localeCompare(a.title||''));
    if (selectedColors.length) list = list.filter(p => p.colors?.some(c => selectedColors.includes(c)));
    if (selectedSizes.length) list = list.filter(p => p.sizes?.some(s => selectedSizes.includes(s)));
    setSorted(list);
  }, [sortBy, products, selectedColors, selectedSizes, activeCollection, collections]);

  const toggleColor = (c) => setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  const toggleSize  = (s) => setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleWL    = (e, product) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); };
  const handleAddToCart = (e, product) => {
    e.preventDefault(); e.stopPropagation();
    if (addToCart) addToCart(product);
    if (openCart) openCart();
    setAdded(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [product._id]: false })), 1800);
  };
  const clearFilters = () => { setSortBy(''); setSelectedColors([]); setSelectedSizes([]); setActiveCollection(null); };

  const Sidebar = () => (
    <div className="space-y-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">
          Filters
          {(sortBy || selectedColors.length || selectedSizes.length || activeCollection !== null) && (
            <span className="ml-2 text-xs bg-[#E63946] text-white rounded-full px-1.5 py-0.5">
              {[sortBy, ...selectedColors, ...selectedSizes, activeCollection !== null ? '1' : ''].filter(Boolean).length}
            </span>
          )}
        </h3>
        {(sortBy || selectedColors.length || selectedSizes.length || activeCollection !== null) && (
          <button onClick={clearFilters} className="text-xs text-[#E63946] hover:underline font-semibold">Clear All</button>
        )}
      </div>

      <FilterSection title="Sort By" open={openSort} onToggle={() => setOpenSort(v => !v)}>
        <div className="space-y-1.5">
          {SORT_OPTIONS.map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sort"
                value={opt.value}
                checked={sortBy === opt.value}
                onChange={() => setSortBy(opt.value)}
                className="accent-[#E63946]"
              />
              <span className={`text-sm ${sortBy === opt.value ? 'text-[#E63946] font-medium' : 'text-gray-600'}`}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {colorOptions.length > 0 && (
        <FilterSection title="Colour" open={openColor} onToggle={() => setOpenColor(v => !v)}>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((c, i) => (
              <button
                key={i}
                onClick={() => toggleColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  selectedColors.includes(c) ? 'border-[#E63946] scale-110' : 'border-gray-300 hover:border-gray-500'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {sizeOptions.length > 0 && (
        <FilterSection title="Size" open={openSize} onToggle={() => setOpenSize(v => !v)}>
          <div className="flex flex-wrap gap-1.5">
            {sizeOptions.map(s => (
              <button
                key={s}
                onClick={() => toggleSize(s)}
                className={`px-2 py-0.5 rounded text-xs border transition-all ${
                  selectedSizes.includes(s)
                    ? 'bg-[#E63946] text-white border-[#E63946]'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-[#E63946]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </FilterSection>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2]">

      {/* Banner — scrollable 4-panel carousel with arrows */}
      <div className="h-56 sm:h-64 relative overflow-hidden bg-gray-900">
        <div
          ref={bannerRef}
          className="flex h-full overflow-x-scroll no-scrollbar"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {collections.length > 0 ? collections.map((col, i) => (
            <div
              key={col._id || i}
              onClick={() => setActiveCollection(i === activeCollection ? null : i)}
              className="flex-shrink-0 w-full sm:w-1/4 relative overflow-hidden cursor-pointer group border-r border-white/10 last:border-r-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              <img
                src={col.bannerThumnail || col.thumbnail || '/images/col8.jpg'}
                alt={col.name || col.collectionName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={e => { e.target.src = '/images/col8.jpg'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
              {activeCollection === i && <div className="absolute inset-0 ring-inset ring-2 ring-white/50" />}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                <h2 className="font-bold text-xs sm:text-sm uppercase tracking-widest mb-0.5 drop-shadow">
                  {col.name || col.collectionName}
                </h2>
                <p className="text-[10px] text-white/65 italic mb-2.5 hidden sm:block line-clamp-1">
                  {col.description || 'Shop the collection'}
                </p>
                <span className="inline-block px-3 py-1 border border-white/80 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest group-hover:bg-white group-hover:text-gray-900 transition-colors">
                  SHOP NOW
                </span>
              </div>
            </div>
          )) : Array(4).fill(null).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-full sm:w-1/4 h-full skeleton border-r border-white/10" />
          ))}
        </div>
        <button
          onClick={() => scrollBanner(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => scrollBanner(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Collection circles */}
      {collections.length > 0 && (
        <div className="bg-white border-b border-[#EAEAEA]">
          <div className="max-w-[1400px] mx-auto px-4 py-6">
            <div
              className="flex justify-center gap-6 sm:gap-8 overflow-x-auto py-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', overflowY: 'visible' }}
            >
              {collections.map((col, i) => (
                <button
                  key={col._id || i}
                  onClick={() => setActiveCollection(i === activeCollection ? null : i)}
                  className="flex-shrink-0 flex flex-col items-center gap-2 group"
                >
                  <div className={`w-[72px] h-[72px] rounded-full overflow-hidden border-2 transition-all duration-200 group-hover:scale-110 group-hover:shadow-md ${
                    activeCollection === i
                      ? 'border-[#E63946] scale-105 shadow-md ring-2 ring-[#E63946]/20'
                      : 'border-gray-200 group-hover:border-[#E63946]'
                  }`}>
                    <img
                      src={col.thumbnail || col.bannerThumnail || '/images/col8.jpg'}
                      alt={col.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/images/col8.jpg'; }}
                    />
                  </div>
                  <span className={`text-xs font-semibold transition-colors ${
                    activeCollection === i ? 'text-[#E63946]' : 'text-gray-600 group-hover:text-[#E63946]'
                  }`}>
                    {col.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delivery notice */}
      <div className="bg-[#FFF1F1] border-b border-[#FECACA] text-center py-2 px-4 text-xs text-[#E63946] font-medium">
        🚚 Free delivery on orders above ₹499 &nbsp;|&nbsp; Easy 7-day returns &nbsp;|&nbsp; Genuine products guaranteed
      </div>

      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-4">

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-3 bg-white rounded-lg border border-[#EAEAEA] px-3 py-2">
          <p className="text-sm text-[#6B7280]">
            Showing <span className="font-semibold text-gray-800">{sorted.length}</span> results
            {activeCollection !== null && collections[activeCollection] && (
              <span className="ml-2 text-[#E63946] font-semibold">
                in {collections[activeCollection].name}
              </span>
            )}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobile(true)}
              className="flex lg:hidden items-center gap-1.5 text-sm text-[#E63946] font-semibold"
            >
              <SlidersHorizontal size={15} /> Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-[#EAEAEA] rounded px-2 h-8 focus:outline-none focus:border-[#E63946] cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-4">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white rounded-lg border border-[#EAEAEA] p-4 sticky top-24">
              <Sidebar />
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {Array(12).fill(null).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : sorted.length === 0 ? (
              <div className="bg-white rounded-lg border border-[#EAEAEA] py-20 text-center">
                <div className="text-5xl mb-4">🛍️</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">No products found</h3>
                <p className="text-[#6B7280] text-sm mb-4">Try adjusting your filters.</p>
                <button onClick={clearFilters} className="px-4 py-2 bg-[#E63946] text-white text-sm font-semibold rounded hover:bg-[#C5303A] transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {sorted.map((product, idx) => {
                  const id = product._id || idx;
                  return (
                    <motion.div
                      key={id}
                      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-lg border border-[#EAEAEA] overflow-hidden group cursor-pointer"
                      onClick={() => navigate(`/product/${id}`)}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                        <img
                          src={product.image || '/images/col8.jpg'}
                          alt={product.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-400"
                          onError={(e) => { e.target.src = '/images/col8.jpg'; }}
                        />
                        <span className="absolute top-2 left-2 bg-[#7CB342] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">20% OFF</span>
                        <button
                          onClick={(e) => toggleWL(e, product)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:scale-110 transition-transform z-10"
                        >
                          <Heart size={13} className={isWishlisted(id) ? 'fill-[#E63946] text-[#E63946]' : 'text-gray-400'} />
                        </button>
                      </div>
                      <div className="p-2.5">
                        <p className="text-[10px] text-[#6B7280] mb-0.5 truncate">{product.category || 'Collection'}</p>
                        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight mb-1">{product.title}</h3>
                        <div className="flex items-center gap-1 mb-1.5">
                          <span className="inline-flex items-center gap-0.5 bg-[#7CB342] text-white px-1 py-0.5 rounded text-[10px] font-semibold">
                            {(3.8 + (idx % 5) * 0.3).toFixed(1)} <Star size={8} className="fill-white" />
                          </span>
                          <span className="text-[10px] text-[#6B7280]">(128)</span>
                        </div>
                        <div className="flex items-baseline gap-1.5 mb-2">
                          <span className="text-sm font-bold text-gray-900">{productPrice(product)}</span>
                          <span className="text-[11px] text-[#6B7280] line-through">₹2,499</span>
                          <span className="text-[11px] text-[#7CB342] font-semibold">20% off</span>
                        </div>
                        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-xs font-semibold transition-colors ${
                              added[id] ? 'bg-[#7CB342] text-white' : 'bg-[#E63946] text-white hover:bg-[#C5303A]'
                            }`}
                          >
                            <ShoppingCart size={11} /> {added[id] ? 'Added!' : 'Cart'}
                          </button>
                          <button
                            onClick={() => navigate(`/product/${id}`)}
                            className="flex-1 py-1.5 rounded text-xs font-semibold bg-[#F4A261] text-white hover:bg-[#DB7C3E] transition-colors"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobile && (
        <div className="fixed inset-0 z-[300] flex">
          <div className="flex-1 bg-black/50" onClick={() => setShowMobile(false)} />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="w-72 bg-white h-full overflow-y-auto p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 text-lg">Filters</h3>
              <button onClick={() => setShowMobile(false)}><X size={20} className="text-gray-600" /></button>
            </div>
            <Sidebar />
            <button
              onClick={() => setShowMobile(false)}
              className="w-full mt-4 py-3 bg-[#E63946] text-white font-bold rounded hover:bg-[#C5303A] transition-colors"
            >
              Apply Filters
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Collection;
