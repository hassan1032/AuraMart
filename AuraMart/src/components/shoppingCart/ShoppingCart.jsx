import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { parsePrice, formatINR } from '../../utils/price.js';

const ShoppingCart = ({ isOpen, onClose, cartItems, setCartItems, removeFromCart }) => {
  const navigate = useNavigate();

  const updateQty = (id, delta) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, qty: Math.max(1, (item.qty || 1) + delta) } : item
      )
    );
  };

  const remove = (id) => {
    if (removeFromCart) removeFromCart(id);
    else setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal   = cartItems.reduce((s, i) => s + parsePrice(i.price) * (i.qty || 1), 0);
  const totalItems = cartItems.reduce((s, i) => s + (i.qty || 1), 0);

  const goCheckout  = () => { onClose(); navigate('/cart-checkout'); };
  const goViewCart  = () => { onClose(); navigate('/checkout'); };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`cart-drawer ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex flex-col h-full bg-white">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#EAEAEA] bg-[#E63946]">
            <div className="flex items-center gap-2 text-white">
              <ShoppingBag size={18} />
              <div>
                <p className="text-sm font-bold">My Cart</p>
                {totalItems > 0 && (
                  <p className="text-blue-200 text-xs">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence>
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center py-16 px-6"
                >
                  <div className="w-20 h-20 bg-[#FAF7F2] rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag size={32} className="text-[#6B7280]" />
                  </div>
                  <h4 className="text-gray-800 font-bold text-lg mb-1">Your cart is empty!</h4>
                  <p className="text-sm text-[#6B7280] mb-6">Add items to get started</p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-[#E63946] text-white text-sm font-semibold rounded hover:bg-[#C5303A] transition-colors"
                  >
                    Continue Shopping
                  </button>
                </motion.div>
              ) : (
                <div className="divide-y divide-[#EAEAEA]">
                  {cartItems.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 p-4 hover:bg-[#F8F9FA] transition-colors"
                    >
                      {/* Image */}
                      <div className="w-16 h-20 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                        <img
                          src={item.image || '/images/col8.jpg'}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = '/images/col8.jpg'; }}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">{item.title}</p>
                        {(item.selectedSize  || item.size)  && <p className="text-xs text-[#6B7280] mt-0.5">Size: {item.selectedSize  || item.size}</p>}
                        {(item.selectedColor || item.color) && <p className="text-xs text-[#6B7280]">Color: {item.selectedColor || item.color}</p>}
                        <p className="text-sm font-bold text-[#E63946] mt-1">{formatINR(parsePrice(item.price))}</p>

                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-[#EAEAEA] rounded overflow-hidden">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              disabled={(item.qty || 1) <= 1}
                              className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:text-gray-300 transition-colors text-sm font-bold"
                            >−</button>
                            <span className="w-8 text-center text-sm font-medium">{item.qty || 1}</span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-sm font-bold"
                            >+</button>
                          </div>
                          <button
                            onClick={() => remove(item.id)}
                            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-[#EAEAEA] bg-white px-4 py-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-[#6B7280]">Subtotal ({totalItems} items)</span>
                <span className="text-base font-bold text-gray-800">{formatINR(subtotal)}</span>
              </div>
              <p className="text-xs text-[#7CB342] mb-3">🎉 Free delivery on this order!</p>
              <div className="space-y-2">
                <button
                  onClick={goCheckout}
                  className="w-full py-3 bg-[#F4A261] text-white text-sm font-bold rounded hover:bg-[#DB7C3E] transition-colors"
                >
                  PLACE ORDER
                </button>
                <button
                  onClick={goViewCart}
                  className="w-full py-3 border-2 border-[#E63946] text-[#E63946] text-sm font-bold rounded hover:bg-[#FFF1F1] transition-colors"
                >
                  View Cart ({totalItems})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;
