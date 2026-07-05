import { Heart, ShoppingCart, Trash2, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatINR, productPrice } from '../../utils/price.js';
import { toastSuccess } from '../../utils/toast.js';

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

const Wishlist = ({ addToCart, openCart }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { wishlistItems, loading, removeById, wishlistCount } = useWishlist();

  const { products = [], accessories = [] } = wishlistItems;

  // Flatten into a uniform display list
  const allItems = [
    ...products.map(p => {
      const prod = p.productId || {};
      const img  = prod.colorImages?.[0]?.thumbnail || prod.image || '/images/col8.jpg';
      const name = prod.productName || prod.name || 'Product';
      const price = (prod.prices?.[0]?.sellingPrice || 0);
      const stockQty = prod.prices?.reduce((sum, p) => sum + (p.stockQuantity || 0), 0) ?? 1;
      return { _id: prod._id, isProduct: true, name, img, price, category: prod.selectCollection?.[0] || 'Collection', inStock: stockQty > 0 };
    }),
    ...accessories.map(a => {
      const acc  = a.accessoryId || {};
      const img  = acc.colorImages?.[0]?.accessoryThumbnail || acc.image || '/images/col8.jpg';
      const name = acc.accessoryName || acc.name || 'Accessory';
      const price = acc.prices?.[0]?.sellingPrice || 0;
      const stockQty = acc.prices?.reduce((sum, p) => sum + (p.stockQuantity || 0), 0) ?? 1;
      return { _id: acc._id, isAccessory: true, name, img, price, category: acc.selectAccessoryType?.[0] || 'Accessory', inStock: stockQty > 0 };
    }),
  ].filter(it => it._id);

  const handleRemove = (id, isAcc) => removeById(id, isAcc);

  const handleAddToCart = (item) => {
    if (addToCart) addToCart({ ...item, title: item.name, image: item.img, qty: 1 });
    if (openCart) openCart();
    toastSuccess('Added to Cart 🛒', { autoClose: 2000 });
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-5">My Wishlist</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    </div>
  );

  if (!isLoggedIn) return (
    <div className="min-h-[70vh] bg-[#FAF7F2] flex items-center justify-center">
      <div className="bg-white rounded-lg border border-[#EAEAEA] p-12 text-center max-w-sm w-full mx-4">
        <Heart size={48} className="text-[#6B7280] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Login to see your Wishlist</h2>
        <p className="text-sm text-[#6B7280] mb-6">Save items you love and find them here anytime.</p>
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 bg-[#E63946] text-white font-bold rounded hover:bg-[#C5303A] transition-colors"
        >
          Login / Register
        </button>
      </div>
    </div>
  );

  if (!allItems.length) return (
    <div className="min-h-[70vh] bg-[#FAF7F2] flex items-center justify-center">
      <div className="bg-white rounded-lg border border-[#EAEAEA] p-12 text-center max-w-sm w-full mx-4">
        <Heart size={48} className="text-[#6B7280] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Your Wishlist is empty!</h2>
        <p className="text-sm text-[#6B7280] mb-6">Tap the ❤️ on any product to save it here.</p>
        <button
          onClick={() => navigate('/collections')}
          className="w-full py-3 bg-[#E63946] text-white font-bold rounded hover:bg-[#C5303A] transition-colors"
        >
          Explore Collections
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-gray-800">
            My Wishlist{' '}
            <span className="text-base font-normal text-[#6B7280]">
              ({allItems.length} item{allItems.length !== 1 ? 's' : ''})
            </span>
          </h1>
        </div>

        <AnimatePresence>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {allItems.map(item => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-lg border border-[#EAEAEA] overflow-hidden group hover:shadow-md transition-all"
              >
                {/* Image */}
                <Link
                  to={item.isAccessory ? `/accessory/${item._id}` : `/product/${item._id}`}
                  className="block relative"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-gray-50">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={e => { e.target.src = '/images/col8.jpg'; }}
                    />
                  </div>
                  {/* Stock badge */}
                  {!item.inStock && (
                    <span className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 bg-gray-500 text-white rounded">
                      Out of Stock
                    </span>
                  )}
                  {/* Remove heart */}
                  <button
                    onClick={e => { e.preventDefault(); handleRemove(item._id, !!item.isAccessory); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:bg-red-50 transition-colors z-10"
                  >
                    <Heart size={13} className="fill-[#E63946] text-[#E63946]" />
                  </button>
                </Link>

                {/* Content */}
                <div className="p-2.5">
                  <p className="text-xs text-[#6B7280] mb-0.5 truncate">{item.category}</p>
                  <h3 className="text-sm font-semibold text-gray-800 truncate mb-1">{item.name}</h3>
                  <p className="text-sm font-bold text-[#E63946] mb-2">
                    {item.price > 0 ? formatINR(item.price) : 'Price on request'}
                  </p>

                  <div className="flex gap-1.5">
                    {item.inStock && item.price > 0 && (
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-[#E63946] text-white text-xs font-semibold rounded hover:bg-[#C5303A] transition-colors"
                      >
                        <ShoppingCart size={11} /> Cart
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(item._id, !!item.isAccessory)}
                      className="w-8 flex items-center justify-center py-1.5 border border-[#EAEAEA] rounded hover:bg-red-50 hover:border-red-200 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Wishlist;
