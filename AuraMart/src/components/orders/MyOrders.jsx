import { useState, useEffect } from 'react';
import { Package, ChevronRight, Clock, CheckCircle, XCircle, Truck, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ApiUrl, getAuthToken } from '../../utils/api';
import { formatINR } from '../../utils/price';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    cls: 'text-[#F4A261] bg-[#FFF3E0]',   Icon: Clock },
  processing: { label: 'Processing', cls: 'text-blue-600 bg-blue-50',      Icon: AlertCircle },
  shipped:    { label: 'Shipped',    cls: 'text-indigo-600 bg-indigo-50',   Icon: Truck },
  delivered:  { label: 'Delivered',  cls: 'text-[#7CB342] bg-[#F1F8E9]',   Icon: CheckCircle },
  cancelled:  { label: 'Cancelled',  cls: 'text-red-500 bg-red-50',        Icon: XCircle },
};

const SkeletonOrder = () => (
  <div className="bg-white rounded-xl border border-[#EAEAEA] p-4 space-y-3">
    <div className="flex justify-between">
      <div className="skeleton h-4 w-32 rounded" />
      <div className="skeleton h-4 w-20 rounded" />
    </div>
    <div className="skeleton h-3 w-48 rounded" />
    <div className="flex gap-3 mt-2">
      <div className="skeleton w-14 h-18 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
      </div>
    </div>
  </div>
);

const MyOrders = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const token = getAuthToken();

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    axios.get(ApiUrl.getOrders, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.data?.success && res.data.data?.length) setOrders(res.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!token) return (
    <div className="bg-white rounded-xl border border-[#EAEAEA] p-12 text-center">
      <Package size={48} className="text-[#6B7280] mx-auto mb-3" />
      <h3 className="font-bold text-gray-800 mb-2">Login to view orders</h3>
      <p className="text-sm text-[#6B7280]">Please sign in to see your order history.</p>
    </div>
  );

  if (loading) return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => <SkeletonOrder key={i} />)}
    </div>
  );

  if (!orders.length) return (
    <div className="bg-white rounded-xl border border-[#EAEAEA] p-12 text-center">
      <Package size={48} className="text-[#6B7280] mx-auto mb-4" />
      <h3 className="font-bold text-gray-800 mb-2">No orders yet</h3>
      <p className="text-sm text-[#6B7280] mb-5">Your orders will appear here once you place one.</p>
      <Link
        to="/collections"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E63946] text-white text-sm font-semibold rounded-lg hover:bg-[#C5303A] transition-colors"
      >
        Shop Now <ChevronRight size={14} />
      </Link>
    </div>
  );

  return (
    <div className="space-y-3">
      <h2 className="font-bold text-gray-800 text-lg">
        My Orders <span className="text-sm font-normal text-[#6B7280]">({orders.length})</span>
      </h2>

      {orders.map((order, idx) => {
        const status = (order.status || 'pending').toLowerCase();
        const cfg    = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
        const StatusIcon = cfg.Icon;
        const date   = order.createdAt
          ? new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
            })
          : '—';
        const products = order.items || [];

        return (
          <div key={order._id || idx} className="bg-white rounded-xl border border-[#EAEAEA] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#FAF7F2] border-b border-[#EAEAEA]">
              <div>
                <p className="text-xs text-[#6B7280] font-medium">Order ID</p>
                <p className="text-sm font-bold text-gray-800 font-mono">
                  #{order.orderCode || String(order._id || idx).slice(-8).toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#6B7280] mb-1">{date}</p>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.cls}`}>
                  <StatusIcon size={11} /> {cfg.label}
                </span>
              </div>
            </div>

            {/* Products */}
            <div className="p-4">
              {products.slice(0, 2).map((item, i) => {
                // getUserOrders aggregation enriches each item with .product / .accessory / .price
                const name  = item.product?.name || item.product?.productName
                  || item.accessory?.accessoryName || item.accessory?.name
                  || 'Product';
                const img   = item.product?.colorImages?.[0]?.thumbnail
                  || item.accessory?.colorImages?.[0]?.accessoryThumbnail
                  || item.product?.thumbnail
                  || '/images/col8.jpg';
                const price = item.unitPrice || item.price?.sellingPrice || 0;
                const qty   = item.quantity || 1;
                return (
                  <div key={i} className={`flex gap-3 ${i < Math.min(products.length, 2) - 1 ? 'mb-3' : ''}`}>
                    <div className="w-14 h-[72px] rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={img} alt={name}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.src = '/images/col8.jpg'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">{name}</p>
                      {item.selectedSize  && <p className="text-xs text-[#6B7280] mt-0.5">Size: {item.selectedSize}</p>}
                      {item.selectedColor && <p className="text-xs text-[#6B7280]">Color: {item.selectedColor}</p>}
                      <p className="text-sm font-bold text-[#E63946] mt-1">{formatINR(price * qty)}</p>
                    </div>
                  </div>
                );
              })}
              {products.length > 2 && (
                <p className="text-xs text-[#6B7280] mt-2">
                  +{products.length - 2} more item{products.length - 2 !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#EAEAEA]">
              <div>
                <p className="text-xs text-[#6B7280]">Order Total</p>
                <p className="text-sm font-bold text-gray-800">
                  {formatINR(order.totalAmount || order.total || 0)}
                </p>
              </div>
              <Link
                to="/track-orders"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#E63946] hover:underline"
              >
                Track Order <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyOrders;
