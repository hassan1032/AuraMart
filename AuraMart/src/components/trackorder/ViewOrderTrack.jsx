import { useState } from 'react';
import { Search, CheckCircle, Package, Truck, Home } from 'lucide-react';
import { formatINR } from '../../utils/price';

const steps = [
  { label: 'Order Placed', icon: CheckCircle, done: true  },
  { label: 'Packing',      icon: Package,     done: true  },
  { label: 'Dispatched',   icon: Truck,       done: true  },
  { label: 'Delivered',    icon: Home,        done: false },
];

const ViewOrderTrack = () => {
  const [orderNumber, setOrderNumber] = useState('');

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* page header */}
      <div className="bg-[#E63946] py-8 text-center">
        <h1 className="text-xl font-bold text-white">Track Your Order</h1>
        <p className="text-blue-200 text-sm mt-1">Live status updates for your shipment</p>
      </div>

      <div className="max-w-[960px] mx-auto px-4 py-8 space-y-6">
        {/* search bar */}
        <div className="bg-white rounded-xl border border-[#EAEAEA] shadow-sm p-5 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter your Order Number  (#000000)"
            className="flex-1 px-4 py-2.5 border border-[#EAEAEA] rounded-lg text-sm focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-colors"
          />
          <button
            className="flex items-center gap-2 px-6 py-2.5 bg-[#E63946] hover:bg-[#C5303A] text-white font-semibold rounded-lg transition-colors text-sm"
          >
            <Search size={15} /> Track
          </button>
        </div>

        {/* order detail card */}
        <div className="bg-white rounded-xl border border-[#EAEAEA] shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#EAEAEA] flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-800 text-sm">#123NM25</p>
              <p className="text-xs text-[#6B7280] mt-0.5">Order Date: <strong className="text-gray-600">25 July 2025</strong></p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">In Transit</span>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* product info */}
            <div className="flex gap-4 p-5 md:border-r border-[#FAF7F2] md:w-72 flex-shrink-0">
              <div className="w-20 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img src="/images/col8.jpg" alt="Grace Dress" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-gray-800">Grace</p>
                <p className="text-xs text-[#6B7280] mt-0.5">Flower Girls & Bridesmaids</p>
                <p className="text-sm font-bold text-[#E63946] mt-1">{formatINR(28500)}</p>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  An elegant dress with floral print and silk sash.
                </p>
              </div>
            </div>

            {/* tracking info */}
            <div className="flex-1 p-5">
              <div className="mb-4">
                <p className="text-xs text-[#6B7280]">Expected Delivery</p>
                <p className="font-bold text-gray-800 text-sm">28 July 2025 • 10:30 AM</p>
              </div>

              {/* progress steps */}
              <div className="flex items-center gap-0">
                {steps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={i} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                          step.done
                            ? 'bg-[#7CB342] text-white'
                            : 'bg-gray-100 text-[#6B7280] border-2 border-[#EAEAEA]'
                        }`}>
                          <Icon size={16} />
                        </div>
                        <span className="text-[10px] text-center mt-1.5 font-medium text-gray-600 w-16">{step.label}</span>
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1 mb-5 ${step.done && steps[i+1].done ? 'bg-[#7CB342]' : step.done ? 'bg-[#7CB342]' : 'bg-[#EAEAEA]'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrderTrack;
