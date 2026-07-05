import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  ChevronRight, ArrowRight, ShoppingCart, Heart,
  Star, Package, Truck, RefreshCw, Shield, Layers,
  Sparkles, Tag, Crown, Gift, Sun, Wind, Briefcase,
  Shirt, Gem, Flower2, Smartphone, Monitor, BookOpen,
  Zap, Watch, Glasses,
} from 'lucide-react';

import HeroSection       from './HeroSection.jsx';
import OurBestCollection from './OurBestCollection.jsx';
import ProductCard       from '../product-card/ProductCard.jsx';
import Accessories       from '../accessories/Accessories.jsx';
import ShopByColours     from '../colorpalate/ShopByColours.jsx';
import { ApiUrl }        from '../../utils/api.js';
import { normalizeProduct, productPrice } from '../../utils/price.js';
import { useCart }       from '../../context/CartContext.jsx';
import { useWishlist }   from '../../context/WishlistContext.jsx';

/* ─── icon map: matches any collection name substring ─────────── */
const ICON_MAP = [
  // AuraMart categories
  { key: 'fashion',     Icon: Shirt      },
  { key: 'beauty',      Icon: Sparkles   },
  { key: 'footwear',    Icon: Package    },
  { key: 'electron',    Icon: Zap        },
  { key: 'laptop',      Icon: Monitor    },
  { key: 'mobile',      Icon: Smartphone },
  { key: 'phone',       Icon: Smartphone },
  { key: 'book',        Icon: BookOpen   },
  { key: 'accessor',    Icon: Gem        },
  { key: 'watch',       Icon: Watch      },
  { key: 'sunglass',    Icon: Glasses    },
  { key: 'jewel',       Icon: Gem        },
  // Legacy fallbacks
  { key: 'casual',      Icon: Shirt      },
  { key: 'office',      Icon: Briefcase  },
  { key: 'bridal',      Icon: Crown      },
  { key: 'winter',      Icon: Wind       },
  { key: 'evening',     Icon: Star       },
  { key: 'summer',      Icon: Sun        },
  { key: 'flower',      Icon: Flower2    },
  { key: 'bridesmaid',  Icon: Heart      },
  { key: 'party',       Icon: Sparkles   },
  { key: 'boutique',    Icon: Tag        },
  { key: 'bespoke',     Icon: Layers     },
  { key: 'communion',   Icon: Shield     },
  { key: 'event',       Icon: Gift       },
  { key: 'gown',        Icon: Crown      },
  { key: 'collection',  Icon: Package    },
];
const getIcon = (name = '') => {
  const l = name.toLowerCase();
  return ICON_MAP.find(({ key }) => l.includes(key))?.Icon || Package;
};

/* ─── gradient palette for promo cards ───────────────────────── */
const GRADIENTS = [
  ['#E63946', '#A8202B'],
  ['#F4A261', '#C5630A'],
  ['#7C3AED', '#4C1D95'],
  ['#7CB342', '#4A7C1A'],
  ['#0891B2', '#0C4A6E'],
  ['#D97706', '#92400E'],
];

/* ─── trust badges ────────────────────────────────────────────── */
const TRUST = [
  { Icon: Star,      label: 'Premium Quality',  desc: 'Finest fabrics, expert craft' },
  { Icon: Package,   label: 'Handcrafted',       desc: 'Made with care & attention'   },
  { Icon: Truck,     label: 'Free Delivery',     desc: 'Free shipping all over India'  },
  { Icon: RefreshCw, label: 'Easy Returns',      desc: '30-day hassle-free returns'   },
];

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ══════════════════════════════════════════════════════════════ */

/* Section Header */
const SectionHead = ({ eyebrow, title, to }) => (
  <div className="flex items-end justify-between mb-5">
    <div>
      {eyebrow && (
        <p className="text-[11px] font-bold text-[#E63946] uppercase tracking-[0.18em] mb-1">
          {eyebrow}
        </p>
      )}
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
        <span className="inline-block w-1 h-5 bg-[#E63946] rounded-full" />
        {title}
      </h2>
    </div>
    {to && (
      <Link
        to={to}
        className="flex items-center gap-1 text-xs font-semibold text-[#E63946] hover:text-[#C5303A] transition-colors whitespace-nowrap"
      >
        View All <ChevronRight size={14} />
      </Link>
    )}
  </div>
);

/* Promo Card — tall editorial card, image bg + color overlay */
const PromoCard = ({ title, sub, image, gradient, Icon, to }) => (
  <Link
    to={to || '/collections'}
    className="relative rounded-2xl overflow-hidden block group"
    style={{ height: 220 }}
  >
    {/* Image layer */}
    {image && (
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        onError={e => { e.target.style.display = 'none'; }}
      />
    )}

    {/* Gradient fill (always present — visible if no image, or as tint) */}
    <div
      className="absolute inset-0 transition-opacity duration-300"
      style={{
        background: image
          ? `linear-gradient(135deg, ${gradient[0]}CC, ${gradient[1]}99)`
          : `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
        opacity: image ? 0.75 : 1,
      }}
    />

    {/* Dark bottom-up scrim for text */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

    {/* Decorative orb */}
    <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />

    {/* Content */}
    <div className="relative h-full flex flex-col justify-between p-5">
      {/* Icon badge */}
      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
        <Icon size={18} className="text-white" />
      </div>

      {/* Text */}
      <div>
        <h3 className="font-bold text-white text-sm sm:text-base leading-snug mb-0.5">{title}</h3>
        <p className="text-white/70 text-xs mb-3">{sub}</p>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/35 border border-white/30 text-white text-[11px] font-semibold backdrop-blur-sm transition-colors">
          Shop Now <ArrowRight size={10} />
        </span>
      </div>
    </div>
  </Link>
);

/* Category Circle — thumbnail image or icon fallback */
const CatCircle = ({ col, onClick }) => {
  const Icon  = getIcon(col.collectionName || col.name || '');
  const img   = col.thumbnail || col.image || col.bannerImage || null;
  const label = col.collectionName || col.name || 'Category';

  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2.5 group flex-shrink-0">
      <div className="w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#E63946] transition-all duration-200 shadow-sm group-hover:shadow-lg group-hover:scale-110 flex-shrink-0">
        {img ? (
          <img
            src={img}
            alt={label}
            className="w-full h-full object-cover"
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling?.classList.remove('hidden'); }}
          />
        ) : null}
        <div className={`w-full h-full bg-[#FAF7F2] flex items-center justify-center ${img ? 'hidden' : ''}`}>
          <Icon size={24} className="text-[#6B7280] group-hover:text-[#E63946] transition-colors" />
        </div>
      </div>
      <span className="text-xs text-center text-[#6B7280] group-hover:text-[#E63946] font-medium transition-colors leading-snug max-w-[80px]">
        {label}
      </span>
    </button>
  );
};

/* Featured product card */
const FeatCard = ({ product, onCart }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const _wishlisted = isWishlisted(product._id);

  const handleCart = (e) => {
    e.preventDefault();
    onCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-[#EAEAEA] hover:border-[#E63946]/30 hover:shadow-xl transition-all duration-200"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF7F2]">
        <img
          src={product.image || '/images/col1.webp'}
          alt={product.title || product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = '/images/col1.webp'; }}
        />
        {/* wishlist */}
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full shadow flex items-center justify-center transition-all ${
            _wishlisted ? 'bg-[#E63946] text-white' : 'bg-white text-gray-400 hover:text-[#E63946]'
          }`}
        >
          <Heart size={13} fill={_wishlisted ? 'currentColor' : 'none'} />
        </button>
        {/* slide-up cart */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <button
            onClick={handleCart}
            className={`w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 ${
              added ? 'bg-[#7CB342] text-white' : 'bg-[#E63946] text-white'
            }`}
          >
            <ShoppingCart size={12} />
            {added ? 'Added to Cart!' : 'Add to Cart'}
          </button>
        </div>
      </div>
      <div className="p-3">
        {product.colors?.length > 0 && (
          <div className="flex gap-1 mb-1.5 flex-wrap">
            {product.colors.slice(0, 5).map((c, i) => (
              <span
                key={i}
                className="w-3.5 h-3.5 rounded-full border border-gray-200 flex-shrink-0"
                style={{ backgroundColor: c.code || c.color || c }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[10px] text-gray-400 self-center">+{product.colors.length - 5}</span>
            )}
          </div>
        )}
        <p className="font-semibold text-gray-800 text-sm truncate">{product.title || product.name}</p>
        <p className="font-bold text-[#E63946] text-sm mt-0.5">{productPrice(product)}</p>
      </div>
    </Link>
  );
};

/* Skeletons */
const ProdSkel = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-[#EAEAEA]">
    <div className="aspect-[3/4] skeleton" />
    <div className="p-3 space-y-2">
      <div className="skeleton h-3 rounded w-3/4" />
      <div className="skeleton h-3 rounded w-1/3" />
    </div>
  </div>
);

const ChipSkel = () => (
  <div className="skeleton h-7 w-24 rounded-full flex-shrink-0" />
);

/* ══════════════════════════════════════════════════════════════ */

export default function Home({ addToCart: propAdd, openCart }) {
  const navigate               = useNavigate();
  const { addToCart: ctxAdd }  = useCart();
  const addToCart              = propAdd || ctxAdd;

  const [collections, setCollections] = useState([]);
  const [colLoading,  setColLoading]  = useState(true);
  const [products,    setProducts]    = useState([]);
  const [prodLoading, setProdLoading] = useState(true);
  const [email,       setEmail]       = useState('');
  const [subscribed,  setSubscribed]  = useState(false);

  useEffect(() => {
    axios.get(ApiUrl.getAllCollections)
      .then(res => setCollections(res.data?.data || []))
      .catch(() => {})
      .finally(() => setColLoading(false));

    axios.get(ApiUrl.getAllProducts)
      .then(res => {
        const raw = Array.isArray(res.data?.data) ? res.data.data : [];
        setProducts(raw.slice(0, 8).map(normalizeProduct));
      })
      .catch(() => {})
      .finally(() => setProdLoading(false));
  }, []);

  /* Build promo cards from first 4 collections */
  const promoCards = (collections.length > 0 ? collections.slice(0, 4) : [null, null, null, null]).map((col, i) => {
    const fallbacks = [
      { title: 'Bridal Collections', sub: 'Up to 30% off',   to: '/collections' },
      { title: 'Accessories',        sub: 'From ₹999',        to: '/accessories' },
      { title: 'Party Dresses',      sub: 'Special Prices',   to: '/collections' },
      { title: 'Bespoke Service',    sub: 'Custom Orders',    to: '/collections' },
    ];
    const fb = fallbacks[i] || fallbacks[0];
    const name = col?.collectionName || col?.name || fb.title;
    return {
      title:    name,
      sub:      col?.productCount ? `${col.productCount} items` : fb.sub,
      image:    col?.image || col?.thumbnail || col?.bannerImage || null,
      gradient: GRADIENTS[i] || GRADIENTS[0],
      Icon:     getIcon(name),
      to:       fb.to,
    };
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2]">

      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <HeroSection />

      {/* ── 2. COLLECTION CHIPS ─────────────────────────────── */}
      <div className="bg-white border-b border-[#EAEAEA] sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4">
          <div
            className="flex justify-center gap-2 py-4 overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <button
              onClick={() => navigate('/collections')}
              className="flex-shrink-0 px-5 py-2 rounded-full bg-[#E63946] text-white text-xs font-semibold shadow-sm"
            >
              All Collections
            </button>
            {colLoading
              ? Array.from({ length: 7 }).map((_, i) => <ChipSkel key={i} />)
              : collections.map((col, i) => (
                  <button
                    key={col._id || i}
                    onClick={() => navigate('/collections')}
                    className="flex-shrink-0 px-5 py-2 rounded-full bg-[#FAF7F2] border border-[#EAEAEA] text-gray-600 text-xs font-medium whitespace-nowrap hover:border-[#E63946] hover:text-[#E63946] hover:bg-[#FFF1F1] transition-colors"
                  >
                    {col.collectionName || col.name}
                  </button>
                ))
            }
          </div>
        </div>
      </div>

      {/* ── 3. PROMO FEATURE CARDS ──────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 pt-6 pb-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {promoCards.map((card, i) => (
            <PromoCard key={i} {...card} />
          ))}
        </div>
      </div>

      {/* ── 4. SHOP BY CATEGORY ─────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-[#EAEAEA] px-6 py-8">
          <SectionHead eyebrow="Browse" title="Shop by Category" to="/collections" />

          {colLoading ? (
            <div className="flex justify-center gap-8 py-4 overflow-x-auto">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3 flex-shrink-0">
                  <div className="w-[72px] h-[72px] skeleton rounded-full" />
                  <div className="skeleton h-3 w-16 rounded" />
                </div>
              ))}
            </div>
          ) : collections.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-6 py-2">
              {collections.slice(0, 8).map((col, i) => (
                <CatCircle key={col._id || i} col={col} onClick={() => navigate('/collections')} />
              ))}
              {/* View All tile */}
              <button
                onClick={() => navigate('/collections')}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-[72px] h-[72px] rounded-full bg-[#E63946] flex items-center justify-center shadow-sm group-hover:bg-[#C5303A] transition-all duration-200 group-hover:scale-110">
                  <ChevronRight size={26} className="text-white" />
                </div>
                <span className="text-xs text-center text-[#E63946] font-semibold">View All</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* ── 5. OUR BEST COLLECTIONS ─────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 pb-6">
        <div className="bg-white rounded-2xl border border-[#EAEAEA] px-5 py-6 sm:px-6">
          <SectionHead eyebrow="Curated for You" title="Our Best Collections" to="/collections" />
          <OurBestCollection />
        </div>
      </div>

      {/* ── 6. FEATURED PRODUCTS ────────────────────────────── */}
      <motion.div
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="max-w-[1400px] mx-auto px-4 pb-6"
      >
        <div className="bg-white rounded-2xl border border-[#EAEAEA] px-5 py-6 sm:px-6">
          <SectionHead eyebrow="Handpicked" title="Featured Looks" to="/collections" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {prodLoading
              ? Array.from({ length: 8 }).map((_, i) => <ProdSkel key={i} />)
              : products.length > 0
                ? products.map((p, i) => <FeatCard key={p._id || i} product={p} onCart={addToCart} />)
                : <p className="col-span-full text-center py-12 text-sm text-gray-400">No products yet</p>
            }
          </div>
        </div>
      </motion.div>

      {/* ── 7. TRUST BADGES ─────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 pb-6">
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#1E2030,#2B2D42)' }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {TRUST.map(({ Icon, label, desc }, i) => (
              <div
                key={label}
                className={`flex items-center gap-3.5 px-5 sm:px-6 py-5 sm:py-6 ${i % 2 === 0 ? 'border-r border-white/[0.07]' : ''} ${i < 2 ? 'border-b sm:border-b-0 border-white/[0.07]' : ''} sm:border-r sm:last:border-r-0`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-[#F4A261]" />
                </div>
                <div>
                  <p className="text-white font-bold text-xs sm:text-sm">{label}</p>
                  <p className="text-white/40 text-[11px] mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 8. NEW ARRIVALS ─────────────────────────────────── */}
      <motion.div
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="max-w-[1400px] mx-auto px-4 pb-6"
      >
        <div className="bg-white rounded-2xl border border-[#EAEAEA] px-5 py-6 sm:px-6">
          <SectionHead eyebrow="Just In" title="New Arrivals" to="/collections" />
          <ProductCard addToCart={addToCart} openCart={openCart} limit={8} />
        </div>
      </motion.div>

      {/* ── 9. ACCESSORIES ──────────────────────────────────── */}
      <motion.div
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="max-w-[1400px] mx-auto px-4 pb-6"
      >
        <div className="bg-white rounded-2xl border border-[#EAEAEA] px-5 py-6 sm:px-6">
          <SectionHead eyebrow="Complete the Look" title="Shop Accessories" to="/accessories" />
          <Accessories />
        </div>
      </motion.div>

      {/* ── 10. NEWSLETTER ──────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 pb-6">
        <div className="relative rounded-2xl overflow-hidden px-6 py-12 text-center" style={{ background: 'linear-gradient(135deg,#E63946,#C5303A)' }}>
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
          <div className="relative max-w-md mx-auto">
            <p className="text-[11px] font-bold text-white/60 uppercase tracking-[0.2em] mb-2">Stay in the Loop</p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5">Get 10% off your first order</h3>
            <p className="text-sm text-white/65 mb-7">Subscribe for exclusive offers, new collections & style inspiration.</p>
            {subscribed ? (
              <p className="text-white font-semibold flex items-center justify-center gap-2">
                <Shield size={16} /> Thank you! Check your inbox.
              </p>
            ) : (
              <form
                onSubmit={e => { e.preventDefault(); if (email.trim()) setSubscribed(true); }}
                className="flex gap-2 max-w-sm mx-auto"
              >
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address" required
                  className="flex-1 h-11 px-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white transition-colors"
                />
                <button type="submit" className="h-11 px-5 bg-white text-[#E63946] font-bold text-sm rounded-xl hover:bg-[#FAF7F2] transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── 11. SHOP BY COLOUR ──────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 pb-10">
        <div className="bg-white rounded-2xl border border-[#EAEAEA] px-5 py-6 sm:px-6">
          <SectionHead eyebrow="Find Your Shade" title="Shop by Colour" to="/collections" />
          <ShopByColours />
        </div>
      </div>

    </div>
  );
}
