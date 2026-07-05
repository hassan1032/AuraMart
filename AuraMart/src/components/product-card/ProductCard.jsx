import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ApiUrl } from '../../utils/api.js';
import { productPrice, normalizeProduct } from '../../utils/price.js';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { toastSuccess } from '../../utils/toast.js';

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-[#EAEAEA] overflow-hidden">
    <div className="skeleton aspect-[3/4] w-full rounded-t-2xl" />
    <div className="p-3.5 space-y-2">
      <div className="skeleton h-3.5 w-3/4 rounded-full" />
      <div className="skeleton h-3 w-1/2 rounded-full" />
      <div className="skeleton h-4 w-1/3 rounded-full" />
    </div>
  </div>
);

const StarRating = ({ value = 4.2 }) => (
  <div className="flex items-center gap-1.5">
    <div className="inline-flex items-center gap-0.5 bg-[#7CB342] text-white px-1.5 py-0.5 rounded-md text-[10px] font-bold">
      {value.toFixed(1)} <Star size={9} className="fill-white" />
    </div>
    <span className="text-[11px] text-[#6B7280]">(128)</span>
  </div>
);

const ProductCard = ({ addToCart, openCart, limit = 8 }) => {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [added,    setAdded]    = useState({});

  useEffect(() => {
    axios.get(`${ApiUrl.getAllProducts}?limit=${limit}`)
      .then(res => { if (res.data?.data?.length) setProducts(res.data.data.map(normalizeProduct)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [limit]);

  const handleToggleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (addToCart) addToCart(product);
    if (openCart) openCart();
    setAdded(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [product._id]: false })), 2000);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array(limit).fill(null).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl mb-4">🛍️</div>
        <h3 className="text-[#2B2D42] font-semibold text-lg mb-1">No products available</h3>
        <p className="text-[#6B7280] text-sm">Products will appear here once added.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {products.map((product, idx) => {
        const id          = product._id || idx;
        const _isWishlisted = isWishlisted(id);
        const isAdded     = added[id];
        const colors      = (product.colors || []).slice(0, 5);
        const rating      = 3.8 + (idx % 5) * 0.3;

        return (
          <motion.div
            key={id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-white rounded-2xl border border-[#EAEAEA] overflow-hidden group relative cursor-pointer hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] transition-shadow duration-300"
            onClick={() => navigate(`/product/${id}`)}
          >
            {/* Image area */}
            <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF7F2]">
              <img
                src={product.image || '/images/col8.jpg'}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-107 transition-transform duration-500"
                onError={(e) => { e.target.src = '/images/col8.jpg'; }}
              />

              {/* Discount badge */}
              <div className="absolute top-2.5 left-2.5">
                <span className="bg-[#E63946] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  20% OFF
                </span>
              </div>

              {/* Wishlist heart */}
              <button
                onClick={(e) => handleToggleWishlist(e, product)}
                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-115 transition-transform z-10"
                style={{ transform: 'scale(1)' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Heart
                  size={15}
                  className={_isWishlisted ? 'fill-[#E63946] text-[#E63946]' : 'text-[#6B7280]'}
                />
              </button>

              {/* Hover overlay with quick view */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/product/${id}`); }}
                  className="w-full flex items-center justify-center gap-1.5 bg-white text-[#2B2D42] text-xs font-bold py-2 rounded-full hover:bg-[#FAF7F2] transition-colors shadow-sm"
                >
                  <Eye size={12} /> Quick View
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-3.5">
              <p className="text-[10px] text-[#6B7280] mb-0.5 truncate uppercase tracking-wide font-medium">
                {product.category || 'Collection'}
              </p>
              <h3 className="text-sm font-semibold text-[#2B2D42] line-clamp-2 leading-tight mb-2">
                {product.title}
              </h3>

              <StarRating value={rating} />

              {/* Colors */}
              {colors.length > 0 && (
                <div className="flex gap-1.5 mt-2 mb-1.5">
                  {colors.map((c, ci) => (
                    <span
                      key={ci}
                      className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                      style={{ backgroundColor: c, outline: '1px solid #EAEAEA' }}
                    />
                  ))}
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-sm font-bold text-[#2B2D42]">{productPrice(product)}</span>
                <span className="text-xs text-[#6B7280] line-through">₹2,499</span>
                <span className="text-xs text-[#7CB342] font-bold">20% off</span>
              </div>
              <p className="text-[10px] text-[#7CB342] font-medium mt-0.5">Free Delivery</p>

              {/* Action buttons */}
              <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isAdded
                      ? 'bg-[#7CB342] text-white'
                      : 'bg-[#FAF7F2] text-[#2B2D42] hover:bg-[#E63946] hover:text-white border border-[#EAEAEA] hover:border-transparent'
                  }`}
                >
                  <ShoppingCart size={12} />
                  {isAdded ? 'Added!' : 'Cart'}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/product/${id}`); }}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#E63946] text-white hover:bg-[#C5303A] transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProductCard;
