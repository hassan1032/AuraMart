import { X, Send, Loader2 } from 'lucide-react';
import { useState } from 'react';

const inputCls = 'w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-colors';

const CustomizationModel = ({ isOpen, onClose, product }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const handleClose = () => {
    setForm({ name: '', email: '', phone: '', message: '' });
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAEAEA]">
          <h3 className="font-bold text-gray-800">Submit Customization Request</h3>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {/* product preview */}
          {product && (
            <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-xl mb-5">
              {product.mainImage && (
                <img
                  src={product.mainImage}
                  alt={product.title}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => { e.target.src = '/images/col8.jpg'; }}
                />
              )}
              <div>
                <p className="font-semibold text-gray-800 text-sm">{product.title}</p>
                {product.category && <p className="text-xs text-[#6B7280] mt-0.5">{product.category}</p>}
              </div>
            </div>
          )}

          {submitted ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <Send size={22} className="text-[#7CB342]" />
              </div>
              <h3 className="font-bold text-gray-800">Request Submitted!</h3>
              <p className="text-sm text-[#6B7280] mt-1 max-w-[260px]">
                We'll review your customization request and contact you within 48 hours.
              </p>
              <button
                onClick={handleClose}
                className="mt-5 px-6 py-2.5 bg-[#E63946] hover:bg-[#C5303A] text-white font-semibold rounded-lg text-sm transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Your Name *</label>
                <input className={inputCls} required type="text" placeholder="Full Name"
                  value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address *</label>
                  <input className={inputCls} required type="email" placeholder="Email"
                    value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Contact Number</label>
                  <input className={inputCls} type="text" placeholder="Phone Number"
                    value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Message *</label>
                <textarea
                  className={inputCls + ' resize-none'}
                  required
                  rows={4}
                  placeholder="Describe your customization requirements..."
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-2.5 border border-[#EAEAEA] text-gray-600 font-semibold rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#E63946] hover:bg-[#C5303A] disabled:opacity-60 text-white font-semibold rounded-lg text-sm transition-colors"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomizationModel;
