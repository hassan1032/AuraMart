import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Heart, Share2, ChevronLeft, ShoppingCart, Zap, Shield, Truck, RefreshCw, Star, ChevronRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ApiUrl } from '../../utils/api.js';
import { productPrice, normalizeProduct } from '../../utils/price.js';
import SizeChart from '../sizechart/SizeChart';
import CustomizationModel from '../customizationModel/CustomizationModel';

const SkeletonProduct = () => (
  <div className="min-h-screen bg-[#FAF7F2]">
    <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-4">
      <div className="bg-white rounded-lg border border-[#EAEAEA] p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-[45%] flex gap-3">
            <div className="flex flex-col gap-2">
              {[1,2,3,4].map(i => <div key={i} className="skeleton w-16 h-18 rounded" />)}
            </div>
            <div className="flex-1 skeleton aspect-[3/4] rounded-lg" />
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

const StarRating = ({ value = 4.2, count = 128 }) => (
  <div className="flex items-center gap-2">
    <span className="inline-flex items-center gap-1 bg-[#7CB342] text-white px-2 py-0.5 rounded text-sm font-semibold">
      {value.toFixed(1)} <Star size={11} className="fill-white" />
    </span>
    <span className="text-sm text-[#6B7280]">{count.toLocaleString()} ratings</span>
  </div>
);

export default function ViewProduct({ addToCart, openCart }) {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [openSizeChart, setOpenSizeChart] = useState(false);
  const [showCustom, setShowCustom]       = useState(false);
  const [activeTab,  setActiveTab]        = useState('description');
  const [selImage,   setSelImage]         = useState(0);
  const [selSize,    setSelSize]          = useState(null);
  const [selColor,   setSelColor]         = useState(null);
  const [qty,        setQty]             = useState(1);
  const [product,    setProduct]          = useState(null);
  const [similar,    setSimilar]          = useState([]);
  const [loading,    setLoading]          = useState(true);
  const [accessories, setAccessories]    = useState([]);
  const [quantities,  setQuantities]     = useState([]);
  const [addedToCart, setAddedToCart]    = useState(false);
  const [imgZoomed,  setImgZoomed]       = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${ApiUrl.getProductById}?id=${id}`);
        if (res.data?.data) {
          const raw = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
          const p = normalizeProduct(raw);
          setProduct(p);
          setSelSize(p.sizes?.[0] || null);
          setSelColor(p.colors?.[0] || null);
          if (p.accessories?.length) {
            setAccessories(p.accessories);
            setQuantities(Array(p.accessories.length).fill(0));
          }
        }
      } catch { setProduct(null); }
      try {
        const sr = await axios.get(`${ApiUrl.getAllProducts}?limit=6`);
        if (sr.data?.data?.length) {
          setSimilar(sr.data.data.map(normalizeProduct).filter(p => String(p._id) !== String(id)).slice(0, 4));
        }
      } catch { setSimilar([]); }
      setLoading(false);
    };
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => { if (accessories?.length) setQuantities(Array(accessories.length).fill(0)); }, [accessories]);

  const incAcc  = (i) => { const u = [...quantities]; u[i]++; setQuantities(u); };
  const decAcc  = (i) => { const u = [...quantities]; if (u[i] > 0) u[i]--; setQuantities(u); };

  const handleAddToCart = () => {
    if (addToCart) addToCart({
      ...product,
      qty,
      selectedSize: selSize,
      selectedColor: selColor,
      size: selSize,
      color: selColor,
    });
    if (openCart) openCart();
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) return <SkeletonProduct />;

  if (!product) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-[#FAF7F2]">
      <div className="text-5xl">🔍</div>
      <h2 className="text-xl font-bold text-gray-800">Product not found</h2>
      <p className="text-gray-500">This product may have been removed or is unavailable.</p>
      <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-[#E63946] text-white rounded font-semibold hover:bg-[#C5303A] transition-colors">
        Go Back
      </button>
    </div>
  );

  const p       = product;
  const gallery = p.gallery || p.images || [p.image || '/images/hero1.jpg'];
  const colors  = p.colors || [];
  const sizes   = p.sizes?.length ? p.sizes : ['XS', 'S', 'M', 'L', 'XL'];
  const oldPrice = p.oldPrice || p.mrp;

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-4">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-3">
          <Link to="/" className="hover:text-[#E63946]">Home</Link>
          <ChevronRight size={12} />
          <Link to="/collections" className="hover:text-[#E63946]">Collections</Link>
          <ChevronRight size={12} />
          <span className="text-gray-800 font-medium truncate max-w-[200px]">{p.title}</span>
        </nav>

        {/* Main Card */}
        <div className="bg-white rounded-lg border border-[#EAEAEA] overflow-hidden">
          <div className="flex flex-col lg:flex-row">

            {/* ── Gallery ────────────────────────────────────────── */}
            <div className="lg:w-[45%] p-4 lg:p-6">
              <div className="flex gap-3">
                {/* Thumbnails */}
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
                        src={img} alt={`${p.title} view ${i+1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/images/col8.jpg'; }}
                      />
                    </button>
                  ))}
                </div>

                {/* Main Image */}
                <div className="flex-1 relative">
                  <div
                    className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-50 cursor-zoom-in relative"
                    onClick={() => setImgZoomed(true)}
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={selImage}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        src={gallery[selImage] || p.image || '/images/col8.jpg'}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/images/col8.jpg'; }}
                      />
                    </AnimatePresence>

                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); if (product) toggleWishlist(product); }}
                        className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Heart size={16} className={product && isWishlisted(product._id) ? 'fill-[#E63946] text-[#E63946]' : 'text-gray-400'} />
                      </button>
                      <button className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform">
                        <Share2 size={15} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back */}
              <button onClick={() => navigate(-1)} className="mt-4 flex items-center gap-1.5 text-sm text-[#E63946] hover:underline">
                <ChevronLeft size={15} /> Back
              </button>
            </div>

            {/* ── Product Details ─────────────────────────────────── */}
            <div className="lg:flex-1 p-4 lg:p-6 lg:border-l border-[#EAEAEA]">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-2">{p.title}</h1>

              <StarRating value={4.2} count={128} />

              <div className="border-t border-[#EAEAEA] my-4" />

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-bold text-gray-900">{productPrice(p)}</span>
                {oldPrice && (
                  <span className="text-lg text-[#6B7280] line-through">
                    {productPrice({ price: oldPrice })}
                  </span>
                )}
                <span className="text-base font-semibold text-[#7CB342]">20% off</span>
              </div>
              <p className="text-xs text-[#6B7280] mb-4">Inclusive of all taxes</p>

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

              {/* Colors */}
              {colors.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-800 mb-2">
                    Colour: <span className="font-normal text-gray-600">{selColor || 'Select'}</span>
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setSelColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                          selColor === c ? 'border-[#E63946] ring-2 ring-[#E63946]/30' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-800">
                    Size: <span className="font-normal text-gray-600">{selSize || 'Select'}</span>
                  </p>
                  <button
                    onClick={() => setOpenSizeChart(true)}
                    className="text-xs text-[#E63946] hover:underline font-medium"
                  >
                    Size Chart
                  </button>
                </div>
                <SizeChart isOpen={openSizeChart} onClose={() => setOpenSizeChart(false)} />
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setSelSize(s)}
                      className={`px-3 py-1.5 rounded border-2 text-sm font-medium transition-all ${
                        selSize === s
                          ? 'border-[#E63946] bg-[#FFF1F1] text-[#E63946]'
                          : 'border-gray-300 text-gray-700 hover:border-gray-500'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customization */}
              <label className="flex items-center gap-2 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-[#E63946]"
                  onChange={(e) => setShowCustom(e.target.checked)}
                />
                <span className="text-sm text-gray-700">Want customization? (add message or special request)</span>
              </label>
              <CustomizationModel isOpen={showCustom} onClose={() => setShowCustom(false)} product={p} />

              {/* Quantity + dynamic total */}
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <span className="text-sm font-semibold text-gray-800">Qty:</span>
                <div className="flex items-center border-2 border-gray-200 rounded overflow-hidden">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-bold"
                  >−</button>
                  <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-bold"
                  >+</button>
                </div>
                {qty > 1 && p.price > 0 && (
                  <div className="flex items-baseline gap-1.5 bg-[#FAF7F2] px-3 py-1.5 rounded-lg border border-[#EAEAEA]">
                    <span className="text-xs text-gray-500">Total:</span>
                    <span className="text-base font-bold text-[#E63946]">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(qty * p.price)}
                    </span>
                    <span className="text-xs text-gray-400">({qty} × {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(p.price)})</span>
                  </div>
                )}
              </div>

              {/* CTA Buttons */}
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
                  onClick={() => navigate('/cart-checkout', {
                    state: { buyNowItem: { ...p, quantity: qty, qty, selectedSize: selSize, selectedColor: selColor, isProduct: true } }
                  })}
                  className="flex-1 h-12 flex items-center justify-center gap-2 bg-[#E63946] text-white rounded font-bold text-sm hover:bg-[#C5303A] transition-colors"
                >
                  <Zap size={16} />
                  Buy Now
                </button>
              </div>

              {/* Delivery Info */}
              <div className="grid grid-cols-2 gap-3 border border-[#EAEAEA] rounded-lg p-3">
                {[
                  { icon: <Truck size={16} className="text-[#E63946]" />,    text: 'Free Delivery' },
                  { icon: <RefreshCw size={16} className="text-[#E63946]" />, text: 'Easy Returns' },
                  { icon: <Shield size={16} className="text-[#7CB342]" />,    text: 'Authentic Product' },
                  { icon: <Zap size={16} className="text-[#F4A261]" />,       text: 'Fast Track Available' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-xs font-medium text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Delivery note */}
              <p className="text-xs text-[#6B7280] mt-3 bg-[#FAF7F2] px-3 py-2 rounded">
                📦 Usual delivery is up to 10 weeks. Fast-track service available — contact us for details.
              </p>
            </div>
          </div>
        </div>

        {/* ── Accessories ─────────────────────────────────────────── */}
        {accessories.length > 0 && (
          <div className="bg-white rounded-lg border border-[#EAEAEA] mt-4 overflow-hidden">
            <div className="px-4 pt-4 pb-3 border-b border-[#FAF7F2]">
              <h3 className="font-bold text-gray-800">Pair with Accessories</h3>
            </div>
            <div className="p-4 flex gap-4 flex-wrap">
              {accessories.map((item, i) => (
                <div key={i} className="flex items-center gap-3 border border-[#EAEAEA] rounded-lg p-3 min-w-[180px]">
                  <img
                    src={item.image} alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => { e.target.src = '/images/col3.jpg'; }}
                  />
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{item.name}</p>
                    <p className="text-xs text-[#E63946] font-bold">{item.price}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <button onClick={() => decAcc(i)} className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-sm font-bold hover:bg-gray-100">−</button>
                      <span className="text-xs font-medium w-5 text-center">{quantities[i] || 0}</span>
                      <button onClick={() => incAcc(i)} className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-sm font-bold hover:bg-gray-100">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tabs ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-lg border border-[#EAEAEA] mt-4">
          <div className="flex border-b border-[#EAEAEA]">
            {['description', 'info'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3.5 text-sm font-semibold transition-all border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'text-[#E63946] border-[#E63946]'
                    : 'text-gray-500 border-transparent hover:text-gray-800'
                }`}
              >
                {tab === 'description' ? 'Product Description' : 'Additional Information'}
              </button>
            ))}
          </div>
          <div className="p-5 text-sm text-gray-700 leading-relaxed">
            {activeTab === 'description' && (
              <div>
                {p.detailedDescription || p.description ? (
                  <p>{p.detailedDescription || p.description}</p>
                ) : (
                  <ul className="space-y-1.5 list-disc pl-5">
                    {['Exquisite hand-embroidered floral lace overlay', 'Soft silk bodice with satin waistband', 'Fully lined for comfort with inner cotton layer', 'Concealed zip fastening at the back', 'Perfect for weddings, formal occasions, and photoshoots', 'Includes detachable sash for customizable styling', 'Available in multiple sizes'].map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                )}
              </div>
            )}
            {activeTab === 'info' && (
              <div>
                {p.additionalInformation ? (
                  <p className="whitespace-pre-wrap">{p.additionalInformation}</p>
                ) : (
                  <ul className="space-y-1.5 list-disc pl-5">
                    {['Fabric: 100% Silk and Cotton Lining', 'Available Colors: White, Ivory, Blush', 'Sizes: 2–3 yrs, 4–5 yrs, 6–7 yrs, 8–10 yrs', 'Care: Dry clean only', 'Made in the UK'].map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Similar Products ──────────────────────────────────────── */}
        {similar.length > 0 && (
          <div className="bg-white rounded-lg border border-[#EAEAEA] mt-4">
            <div className="px-4 pt-4 pb-3 border-b border-[#FAF7F2]">
              <h3 className="font-bold text-gray-800">You May Also Like</h3>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {similar.map((sp, idx) => (
                <Link
                  key={sp._id || idx}
                  to={`/product/${sp._id}`}
                  className="group rounded-lg border border-[#EAEAEA] overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-gray-50">
                    <img
                      src={sp.image || '/images/col8.jpg'}
                      alt={sp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.src = '/images/col8.jpg'; }}
                    />
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-semibold text-gray-800 truncate">{sp.title || sp.name}</p>
                    <p className="text-xs text-[#E63946] font-bold mt-0.5">{productPrice(sp)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
