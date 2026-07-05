import { useState, useEffect } from 'react';
import { Package, Loader2, XCircle, MapPin, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ApiUrl, getAuthToken } from '../../utils/api';
import { formatINR } from '../../utils/price';
import { toastSuccess, toastError } from '../../utils/toast.js';

const statusColors = {
  pending:    'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed:  'bg-blue-100 text-blue-700 border-blue-200',
  processing: 'bg-purple-100 text-purple-700 border-purple-200',
  shipped:    'bg-indigo-100 text-indigo-700 border-indigo-200',
  delivered:  'bg-green-100 text-green-700 border-green-200',
  cancelled:  'bg-red-100 text-red-700 border-red-200',
  returned:   'bg-gray-100 text-gray-600 border-gray-200',
};

const fmtDate = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const OrderCard = ({ order, onCancel, cancelling }) => {
  const [expanded, setExpanded] = useState(false);
  const status = (order.status || 'pending').toLowerCase();
  const canCancel = ['pending', 'confirmed'].includes(status);

  return (
    <div className="border border-[#EAEAEA] rounded-xl overflow-hidden">
      {/* Order header */}
      <div className="px-4 py-3 bg-[#FAF7F2] flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <p className="text-[11px] text-[#6B7280] uppercase tracking-wide">Order ID</p>
            <p className="text-sm font-bold text-gray-800">{order.orderCode || order._id?.slice(-8).toUpperCase()}</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-[#EAEAEA]" />
          <div>
            <p className="text-[11px] text-[#6B7280] uppercase tracking-wide">Date</p>
            <p className="text-sm font-semibold text-gray-800">{fmtDate(order.createdAt)}</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-[#EAEAEA]" />
          <div>
            <p className="text-[11px] text-[#6B7280] uppercase tracking-wide">Total</p>
            <p className="text-sm font-bold text-[#E63946]">{formatINR(order.totalAmount || 0)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 text-xs font-bold rounded-full border capitalize ${statusColors[status] || statusColors.pending}`}>
            {status}
          </span>
          {canCancel && (
            <button
              onClick={() => onCancel(order._id)}
              disabled={cancelling === order._id}
              className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-red-600 border border-red-200 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {cancelling === order._id ? <Loader2 size={11} className="animate-spin" /> : <XCircle size={11} />}
              Cancel
            </button>
          )}
          <button
            onClick={() => setExpanded(p => !p)}
            className="p-1 text-[#6B7280] hover:text-gray-800 transition-colors"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Products — always show all items */}
      <div className="divide-y divide-[#F5F5F5]">
        {order.items?.map((item, i) => {
          const name  = item.product?.productName || item.product?.name
            || item.accessory?.accessoryName || item.accessory?.name
            || item.productSnapshot?.name
            || `Item ${i + 1}`;
          const img   = item.product?.colorImages?.[0]?.thumbnail
            || item.accessory?.colorImages?.[0]?.accessoryThumbnail
            || item.productSnapshot?.image
            || '/images/col8.jpg';
          const price = item.unitPrice || item.price?.sellingPrice || 0;
          const qty   = item.quantity || 1;

          return (
            <div key={i} className="flex gap-3 p-4">
              <div className="w-16 h-18 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0" style={{ height: '72px' }}>
                <img src={img} alt={name} className="w-full h-full object-cover"
                  onError={e => { e.target.src = '/images/col8.jpg'; }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 line-clamp-2">{name}</p>
                {item.selectedSize  && <p className="text-xs text-[#6B7280] mt-0.5">Size: {item.selectedSize}</p>}
                {item.selectedColor && <p className="text-xs text-[#6B7280]">Color: {item.selectedColor}</p>}
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-[#6B7280]">Qty: {qty}</span>
                  <span className="text-sm font-bold text-[#E63946]">{formatINR(price * qty)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shipping + Payment (expanded) */}
      {expanded && order.shippingAddress && (
        <div className="px-4 py-3 bg-[#F8F9FA] border-t border-[#EAEAEA] grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex gap-2">
            <MapPin size={14} className="text-[#E63946] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide mb-1">Delivery Address</p>
              <p className="text-xs text-gray-700 font-semibold">{order.shippingAddress.name}</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                {[
                  order.shippingAddress.addressLine,
                  order.shippingAddress.city,
                  order.shippingAddress.state,
                  order.shippingAddress.postalCode,
                  order.shippingAddress.country,
                ].filter(Boolean).join(', ')}
              </p>
              {order.shippingAddress.phone && (
                <p className="text-xs text-[#6B7280] mt-0.5">{order.shippingAddress.phone}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <CreditCard size={14} className="text-[#E63946] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide mb-1">Payment</p>
              <p className="text-xs text-gray-700 font-semibold">Cash on Delivery</p>
              <p className="text-xs text-[#6B7280] mt-0.5">
                {order.paymentStatus === 'paid' ? 'Paid' : 'Pay on delivery'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MyOrders = () => {
  const [orders,     setOrders]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) { setLoading(false); return; }
    axios.get(ApiUrl.getOrders, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { if (res.data?.data) setOrders(res.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (orderId) => {
    const token = getAuthToken();
    if (!token || cancelling) return;
    setCancelling(orderId);
    try {
      const res = await axios.patch(
        `${ApiUrl.cancelOrder}/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o));
        toastSuccess('Order cancelled successfully.');
      }
    } catch { toastError('Could not cancel order. Please try again.'); }
    finally { setCancelling(null); }
  };

  if (loading) return (
    <div className="bg-white rounded-lg border border-[#EAEAEA] p-6 space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="border border-[#EAEAEA] rounded-xl overflow-hidden">
          <div className="skeleton h-14 rounded-none" />
          <div className="flex gap-3 p-4">
            <div className="skeleton w-16 h-16 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-2/3 rounded" />
              <div className="skeleton h-3 w-1/3 rounded" />
              <div className="skeleton h-4 w-20 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (!orders.length) return (
    <div className="bg-white rounded-lg border border-[#EAEAEA] p-12 text-center">
      <Package size={48} className="text-[#6B7280] mx-auto mb-4" />
      <h3 className="text-lg font-bold text-gray-800 mb-2">No Orders Yet</h3>
      <p className="text-sm text-[#6B7280] mb-5">Order a product and we'll show it here!</p>
      <Link
        to="/collections"
        className="inline-block px-6 py-2.5 bg-[#E63946] text-white font-semibold rounded hover:bg-[#C5303A] transition-colors"
      >
        Start Shopping
      </Link>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-[#EAEAEA] overflow-hidden">
      <div className="px-4 py-3.5 border-b border-[#EAEAEA]">
        <h3 className="font-bold text-gray-800">My Orders ({orders.length})</h3>
      </div>
      <div className="p-4 space-y-4">
        {orders.map(order => (
          <OrderCard
            key={order._id}
            order={order}
            onCancel={handleCancel}
            cancelling={cancelling}
          />
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
