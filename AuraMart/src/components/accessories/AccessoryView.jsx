import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Heart, Share2, ChevronLeft, ShoppingCart, Zap, Shield, Truck, RefreshCw, Star, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ApiUrl, authHeaders } from '../../utils/api.js';
import { normalizeAccessory, formatINR } from '../../utils/price.js';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const SkeletonView = () => (
  <div className="min-h-screen bg-[#FAF7F2]">
    <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-4">
      <div className="bg-white rounded-lg border border-[#EAEAEA] p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-[45%] flex gap-3">
            <div className="flex flex-col gap-2">
              {[1,2,3].map(i => <div key={i} className="skeleton w-16 h-16 rounded" />)}
            </div>
            <div className="flex-1 skeleton aspect-square rounded-lg" />
          </div>
          <div className="lg:flex-1 space-y-4">
            <div className="skeleton h-7 w-3/4 rounded" />
            <div className="skeleton h-4 w-1/2 rounded" />
            <div className="skeleton h-8 w-1/3 rounded" />
            <div className="skeleton h-20 w-full rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function AccessoryView() {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  const [item,       setItem]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [selImage,   setSelImage]   = useState(0);
  const [qty,        setQty]        = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart,setAddedToCart]= useState(false);
  const [imgZoomed,  setImgZoomed]  = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${ApiUrl.getSingleAccessory}?id=${id}`);
        const raw = res.data?.data;
        if (raw) setItem(normalizeAccessory(Array.isArray(raw) ? raw[0] : raw));
      } catch { setItem(null); }
      setLoading(false);
    };
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCart = () => {
    if (!item) return;
    addToCart({ ...item, qty, isAccessory: true });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) { navigate('/'); return; }
    navigate('/cart-checkout', {
      state: { buyNowItem: { ...item, quantity: qty, qty, isAccessory: true } },
    });
  };

  if (loading) return <SkeletonView />;

  if (!item) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-[#FAF7F2]">
      <div className="text-5xl">🔍</div>
      <h2 className="text-xl font-bold text-gray-800">Accessory not found</h2>
      <p className="text-gray-500">This item may have been removed or is unavailable.</p>
      <button
        onClick={() => navigate('/accessories')}
        className="px-6 py-2.5 bg-[#E63946] text-white rounded font-semibold hover:bg-[#C5303A] transition-colors"
      >
        Back to Accessories
      </button>
    </div>
  );

  const gallery   = item.gallery?.length ? item.gallery : [item.image || '/images/col8.jpg'];
  const inStock   = item.stockQty > 0;

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-4">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-3">
          <Link to="/" className="hover:text-[#E63946]">Home</Link>
          <ChevronRight size={12} />
          <Link to="/accessories" className="hover:text-[#E63946]">Accessories</Link>
          <ChevronRight size={12} />
          <span className="text-gray-800 font-medium truncate max-w-[200px]">{item.name}</span>
        </nav>

        {/* Main Card */}
        <div className="bg-white rounded-lg border border-[#EAEAEA] overflow-hidden">
          <div className="flex flex-col lg:flex-row">

            {/* ── Gallery ───────────────────────────────────────── */}
            <div className="lg:w-[45%] p-4 lg:p-6">
              <div className="flex gap-3">
                {/* Thumbnails */}
                {gallery.length > 1 && (
                  <div className="flex flex-col gap-2 w-16 flex-shrink-0">
                    {gallery.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelImage(i)}
                        className={`w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                          selImage === i ? 'border-[#E63946]' : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={img} alt={`view ${i + 1}`}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.src = '/images/col8.jpg'; }}
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main Image */}
                <div className="flex-1 relative">
                  <div
                    className="aspect-square rounded-lg overflow-hidden bg-gray-50 cursor-zoom-in"
                    onClick={() => setImgZoomed(true)}
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={selImage}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        src={gallery[selImage] || item.image || '/images/col8.jpg'}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        onError={e => { e.target.src = '/images/col8.jpg'; }}
                      />
                    </AnimatePresence>

                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <button
                        onClick={e => { e.stopPropagation(); setWishlisted(v => !v); }}
                        className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Heart size={16} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                      </button>
                      <button className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform">
                        <Share2 size={15} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={() => navigate(-1)} className="mt-4 flex items-center gap-1.5 text-sm text-[#E63946] hover:underline">
                <ChevronLeft size={15} /> Back
              </button>
            </div>

            {/* ── Details ──────────────────────────────────────── */}
            <div className="lg:flex-1 p-4 lg:p-6 lg:border-l border-[#EAEAEA]">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-2">{item.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 bg-[#7CB342] text-white px-2 py-0.5 rounded text-sm font-semibold">
                  4.2 <Star size={11} className="fill-white" />
                </span>
                <span className="text-sm text-[#6B7280]">128 ratings</span>
              </div>

              <div className="border-t border-[#EAEAEA] my-4" />

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-1">
                {item.price > 0 ? (
                  <span className="text-3xl font-bold text-gray-900">{formatINR(item.price)}</span>
                ) : (
                  <span className="text-lg text-gray-500">Price on request</span>
                )}
              </div>
              <p className="text-xs text-[#6B7280] mb-4">Inclusive of all taxes</p>

              {/* Stock */}
              <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-4 ${
                inStock ? 'bg-[#F1F8E9] text-[#7CB342]' : 'bg-red-50 text-red-500'
              }`}>
                <span className={`w-2 h-2 rounded-full ${inStock ? 'bg-[#7CB342]' : 'bg-red-500'}`} />
                {inStock ? `In Stock (${item.stockQty} left)` : 'Out of Stock'}
              </div>

              {/* Offers */}
              <div className="bg-[#FAF7F2] rounded-lg p-3 mb-4 space-y-2">
                <p className="text-sm font-bold text-gray-800 mb-2">Available Offers</p>
                {[
                  '🏷️ Bank Offer: 5% Cashback on purchases above ₹5000',
                  '🚚 Free delivery on this item',
                  '↩️ Easy 30-day returns',
                ].map((offer, i) => (
                  <p key={i} className="text-xs text-gray-700">{offer}</p>
                ))}
              </div>

              {/* Min Qty notice */}
              {item.minQty > 1 && (
                <p className="text-xs text-[#F4A261] font-medium mb-3">
                  Minimum order quantity: {item.minQty}
                </p>
              )}

              {/* Quantity */}
              {item.price > 0 && (
                <div className="flex items-center gap-3 mb-5 flex-wrap">
                  <span className="text-sm font-semibold text-gray-800">Qty:</span>
                  <div className="flex items-center border-2 border-gray-200 rounded overflow-hidden">
                    <button
                      onClick={() => setQty(q => Math.max(item.minQty || 1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-bold"
                    >−</button>
                    <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                    <button
                      onClick={() => setQty(q => q + 1)}
                      className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-bold"
                    >+</button>
                  </div>
                  {qty > 1 && item.price > 0 && (
                    <div className="flex items-baseline gap-1.5 bg-[#FAF7F2] px-3 py-1.5 rounded-lg border border-[#EAEAEA]">
                      <span className="text-xs text-gray-500">Total:</span>
                      <span className="text-base font-bold text-[#E63946]">{formatINR(qty * item.price)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* CTA Buttons */}
              {item.price > 0 && (
                <div className="flex gap-3 mb-5">
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 h-12 flex items-center justify-center gap-2 rounded font-bold text-sm transition-all ${
                      addedToCart ? 'bg-[#7CB342] text-white' : 'bg-[#F4A261] text-white hover:bg-[#DB7C3E]'
                    }`}
                  >
                    <ShoppingCart size={16} />
                    {addedToCart ? 'Added to Cart ✓' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={!inStock}
                    className="flex-1 h-12 flex items-center justify-center gap-2 bg-[#E63946] text-white rounded font-bold text-sm hover:bg-[#C5303A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Zap size={16} />
                    Buy Now
                  </button>
                </div>
              )}

              {/* Delivery Info */}
              <div className="grid grid-cols-2 gap-3 border border-[#EAEAEA] rounded-lg p-3">
                {[
                  { icon: <Truck size={16} className="text-[#E63946]" />,     text: 'Free Delivery' },
                  { icon: <RefreshCw size={16} className="text-[#E63946]" />, text: 'Easy Returns' },
                  { icon: <Shield size={16} className="text-[#7CB342]" />,    text: 'Authentic Product' },
                  { icon: <Zap size={16} className="text-[#F4A261]" />,       text: 'Fast Track Available' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {row.icon}
                    <span className="text-xs font-medium text-gray-700">{row.text}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-[#6B7280] mt-3 bg-[#FAF7F2] px-3 py-2 rounded">
                📦 Usual delivery is up to 10 weeks. Fast-track service available — contact us for details.
              </p>
            </div>
          </div>
        </div>

        {/* ── Description ────────────────────────────────────── */}
        {item.description && (
          <div className="bg-white rounded-lg border border-[#EAEAEA] mt-4">
            <div className="px-5 py-3.5 border-b border-[#EAEAEA]">
              <h3 className="font-bold text-gray-800">Product Description</h3>
            </div>
            <div className="p-5 text-sm text-gray-700 leading-relaxed">
              <p>{item.description}</p>
            </div>
          </div>
        )}

      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {imgZoomed && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[500] flex items-center justify-center p-4"
            onClick={() => setImgZoomed(false)}
          >
            <img
              src={gallery[selImage] || item.image || '/images/col8.jpg'}
              alt={item.name}
              className="max-w-full max-h-full object-contain rounded-lg"
              onError={e => { e.target.src = '/images/col8.jpg'; }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
