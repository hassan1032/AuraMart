import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Trash2, ShoppingBag, Tag, ChevronRight, Shield } from 'lucide-react';
import { formatINR } from '../../utils/price.js';
import { useAuth } from '../../context/AuthContext';

const Checkout = ({ cartItems: initialItems, setCartItems }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [cartItems, setLocal] = useState(initialItems || []);
  const [coupon,    setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [authWarn, setAuthWarn] = useState(false);

  const sync = (u) => { setLocal(u); if (setCartItems) setCartItems(u); };

  const incQty = (i) => sync(cartItems.map((it, idx) => idx === i ? { ...it, qty: (it.qty||1)+1 } : it));
  const decQty = (i) => sync(cartItems.map((it, idx) => idx === i ? { ...it, qty: Math.max(1,(it.qty||1)-1) } : it));
  const remove = (id) => sync(cartItems.filter(it => it.id !== id));

  const parse  = (p) => parseFloat(String(p).replace(/[₹$,]/g, '')) || 0;
  const subtotal = cartItems.reduce((t, it) => t + parse(it.price) * (it.qty||1), 0);
  const shipping  = 0;
  const discount  = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total     = subtotal + shipping - discount;

  if (!cartItems.length) return (
    <div className="min-h-[70vh] bg-[#FAF7F2] flex items-center justify-center">
      <div className="bg-white rounded-lg border border-[#EAEAEA] p-12 text-center max-w-sm w-full mx-4">
        <div className="w-20 h-20 bg-[#FAF7F2] rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag size={36} className="text-[#6B7280]" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty!</h2>
        <p className="text-sm text-[#6B7280] mb-6">Add some beautiful pieces to get started.</p>
        <button
          onClick={() => navigate('/collections')}
          className="w-full py-3 bg-[#E63946] text-white font-bold rounded hover:bg-[#C5303A] transition-colors"
        >
          Shop Now
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-4">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Shopping Cart ({cartItems.length} items)</h1>

        <div className="flex flex-col lg:flex-row gap-4">

          {/* ── Cart Items ─────────────────────────────────────────── */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-[#EAEAEA] overflow-hidden">
              {cartItems.map((item, idx) => (
                <div key={item.id || idx} className="flex gap-4 p-4 border-b last:border-b-0 border-[#EAEAEA] hover:bg-[#F8F9FA] transition-colors">
                  <div className="w-24 h-28 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.image || '/images/col8.jpg'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/images/col8.jpg'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 leading-snug mb-0.5">{item.title}</p>
                    {item.color && (
                      <p className="text-xs text-[#6B7280]">
                        Color: {item.color}{item.size && ` • Size: ${item.size}`}
                      </p>
                    )}
                    <p className="text-xs text-[#7CB342] mt-1">✓ In Stock</p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center border-2 border-[#EAEAEA] rounded overflow-hidden">
                        <button onClick={() => decQty(idx)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold text-sm">−</button>
                        <span className="w-10 text-center text-sm font-semibold">{item.qty||1}</span>
                        <button onClick={() => incQty(idx)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold text-sm">+</button>
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors px-2 py-1.5 rounded hover:bg-red-50"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900 text-base">{formatINR(parse(item.price) * (item.qty||1))}</p>
                    <p className="text-xs text-[#6B7280]">{formatINR(parse(item.price))} each</p>
                    <p className="text-xs text-[#7CB342] mt-1">20% off</p>
                  </div>
                </div>
              ))}

              {/* Delivery & Address */}
              <div className="px-4 py-3 bg-[#F8F9FA] border-t border-[#EAEAEA] flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  📦 Delivery to saved address &nbsp;·&nbsp;
                  <a href="/account" className="text-[#E63946] hover:underline text-sm">Change</a>
                </p>
                <span className="text-sm font-semibold text-[#7CB342]">FREE</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-white rounded-lg border border-[#EAEAEA] mt-4 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={16} className="text-[#E63946]" />
                <span className="text-sm font-semibold text-gray-800">Apply Coupon</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  className="flex-1 border border-[#EAEAEA] rounded px-3 h-10 text-sm focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]"
                />
                <button
                  onClick={() => { if (coupon.trim()) setCouponApplied(true); }}
                  className="px-4 h-10 bg-[#E63946] text-white text-sm font-semibold rounded hover:bg-[#C5303A] transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponApplied && (
                <p className="text-sm text-[#7CB342] mt-2 flex items-center gap-1">
                  ✓ Coupon applied! You save {formatINR(discount)}
                </p>
              )}
            </div>
          </div>

          {/* ── Order Summary ──────────────────────────────────────── */}
          <div className="lg:w-80 xl:w-96 flex-shrink-0">
            <div className="bg-white rounded-lg border border-[#EAEAEA] p-4 sticky top-24">
              <h3 className="text-sm font-bold text-[#6B7280] uppercase tracking-wider mb-4">Price Details</h3>

              <div className="space-y-2.5 border-b border-[#EAEAEA] pb-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Price ({cartItems.length} item{cartItems.length!==1?'s':''})</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Discount</span>
                  <span className="text-[#7CB342]">− {formatINR(discount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Delivery Charges</span>
                  <span className="text-[#7CB342]">FREE</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Coupon Savings</span>
                    <span className="text-[#7CB342]">− {formatINR(discount)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between font-bold text-base mb-1">
                <span>Total Amount</span>
                <span>{formatINR(total)}</span>
              </div>
              <p className="text-xs text-[#7CB342] mb-4">You will save {formatINR(discount + (subtotal * 0.2))} on this order</p>

              {authWarn && (
                <div className="mb-3 px-4 py-3 bg-red-50 border border-red-200 rounded text-sm text-red-700 text-center">
                  Please{' '}
                  <button onClick={() => navigate('/')} className="font-bold underline hover:text-red-800">
                    log in
                  </button>
                  {' '}to place your order.
                </div>
              )}

              <button
                onClick={() => {
                  if (!isLoggedIn) { setAuthWarn(true); return; }
                  setAuthWarn(false);
                  navigate('/cart-checkout');
                }}
                className="w-full py-3.5 bg-[#F4A261] text-white font-bold rounded hover:bg-[#DB7C3E] transition-colors flex items-center justify-center gap-2"
              >
                PLACE ORDER <ChevronRight size={16} />
              </button>

              <div className="mt-4 flex items-start gap-2 text-xs text-[#6B7280]">
                <Shield size={14} className="flex-shrink-0 mt-0.5 text-[#6B7280]" />
                <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
