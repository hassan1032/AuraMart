import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package } from 'lucide-react';

const OrderTrack = () => {
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState('');

  const handleTrack = () => {
    if (!orderNumber.trim()) return;
    navigate('/view-order');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* page header */}
      <div className="bg-[#E63946] py-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 mb-4">
          <Package size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Track Your Order</h1>
        <p className="text-blue-200 text-sm mt-1">Enter your order number to get live status updates</p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-[#EAEAEA] shadow-sm p-6 sm:p-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Order Number</label>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            placeholder="#000000"
            className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-sm text-gray-800 text-center tracking-widest focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-colors mb-4"
          />
          <button
            onClick={handleTrack}
            disabled={!orderNumber.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#E63946] hover:bg-[#C5303A] disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
          >
            <Search size={16} />
            Track Order
          </button>
        </div>

        <p className="text-center text-xs text-[#6B7280] mt-4">
          You can find your order number in the order confirmation email.
        </p>
      </div>
    </div>
  );
};

export default OrderTrack;
