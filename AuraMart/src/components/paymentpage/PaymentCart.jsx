import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  CheckCircle, XCircle, ShieldCheck, Package, Loader2,
  MapPin, Plus, Trash2, Edit2, Truck, CreditCard, Tag, AlertCircle,
} from 'lucide-react';
import { toastSuccess, toastError, toastInfo } from '../../utils/toast.js';
import { ApiUrl, BASEURL } from '../../utils/api';
import { formatINR } from '../../utils/price.js';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry','Chandigarh',
];

const EMPTY_ADDR = {
  fullName: '', mobile: '', houseNo: '', area: '',
  landmark: '', city: '', state: '', pinCode: '',
};

const iCls = 'w-full px-3 py-2.5 border border-[#EAEAEA] rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-colors';

const toAddrPayload = (f) => ({
  name:          f.fullName.trim(),
  contact:       '+91' + f.mobile.trim(),
  countryCode:   '+91',
  addressLine:   [f.houseNo, f.area, f.landmark].filter(Boolean).join(', '),
  city:          f.city.trim(),
  provinceState: f.state,
  postalCode:    f.pinCode.trim(),
  country:       'India',
  addressType:   'Home',
});

const validateAddr = (f) => {
  if (!f.fullName.trim())         return 'Full name is required.';
  if (!/^\d{10}$/.test(f.mobile)) return 'Enter a valid 10-digit mobile number.';
  if (!f.houseNo.trim())          return 'House / Flat No. is required.';
  if (!f.area.trim())             return 'Area / Street is required.';
  if (!f.city.trim())             return 'City is required.';
  if (!f.state)                   return 'State is required.';
  if (!/^\d{6}$/.test(f.pinCode)) return 'Enter a valid 6-digit PIN code.';
  return null;
};

const PaymentCart = ({ cartItems = [] }) => {
  const navigate              = useNavigate();
  const location              = useLocation();
  const { isLoggedIn, token } = useAuth();
  const { clearCart }         = useCart();

  const buyNowItem = location.state?.buyNowItem || null;
  const isBuyNow   = !!buyNowItem;

  // ── Address state ──────────────────────────────────────────────
  const [addrs,       setAddrs]      = useState([]);
  const [addrLoading, setAddrLoading]= useState(false);
  const [selAddrId,   setSelAddrId]  = useState(null);
  const [showForm,    setShowForm]   = useState(false);
  const [editingId,   setEditingId]  = useState(null);
  const [addrForm,    setAddrForm]   = useState(EMPTY_ADDR);
  const [addrErr,     setAddrErr]    = useState('');
  const [saving,      setSaving]     = useState(false);
  const [deletingId,  setDeletingId] = useState(null);

  // ── Cart state ─────────────────────────────────────────────────
  const [dbItems,     setDbItems]    = useState([]);
  const [dbTotal,     setDbTotal]    = useState(0);
  const [cartLoading, setCartLoading]= useState(false);

  // ── Order state ────────────────────────────────────────────────
  const [placing,       setPlacing]      = useState(false);
  const [formErr,       setFormErr]      = useState('');
  const [orderOk,       setOrderOk]      = useState(false);
  const [orderFail,     setOrderFail]    = useState(false);
  const [orderErrMsg,   setOrderErrMsg]  = useState('');

  // ── Payment method ─────────────────────────────────────────────
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'online'

  // ── Fetch saved addresses ──────────────────────────────────────
  const fetchAddrs = useCallback(async () => {
    if (!token) return;
    setAddrLoading(true);
    try {
      const r = await axios.get(ApiUrl.getAddresses, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = r.data?.data || [];
      setAddrs(list);
      setSelAddrId(prev => {
        if (prev && list.find(a => a._id === prev)) return prev;
        const def = list.find(a => a.isDefault) || list[0];
        return def?._id || null;
      });
    } catch {
      setAddrs([]);
    } finally {
      setAddrLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isLoggedIn && token) fetchAddrs();
  }, [isLoggedIn, token, fetchAddrs]);

  // ── Fetch + sync cart on mount ─────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn || !token) return;
    setCartLoading(true);

    (async () => {
      try {
        const hdr = { Authorization: `Bearer ${token}` };

        // 1. Check DB cart
        const r = await axios.get(ApiUrl.getCart, { headers: hdr });
        const items = r.data?.data?.items || [];

        // 2. If DB cart empty, sync from localStorage
        if (items.length === 0) {
          const raw = localStorage.getItem('guestCart');
          const local = raw ? JSON.parse(raw) : [];
          const valid = local.map(it => {
            const isAcc = !!it.isAccessory;
            const pd = (it.prices || []).find(p => p.country === 'IND') || (it.prices || [])[0] || it.priceInfo;
            return {
              productId:    !isAcc ? (it.productId || it._id) : undefined,
              accessoryId:   isAcc ? (it.accessoryId || it._id) : undefined,
              priceId:       it.priceId || pd?._id || it.priceInfo?._id,
              quantity:      it.qty || it.quantity || 1,
              selectedSize:  it.selectedSize || it.size  || '',
              selectedColor: it.selectedColor || it.color || '',
            };
          }).filter(it => it.priceId);

          if (valid.length > 0) {
            await axios.post(ApiUrl.mergeCart, { guestItems: valid }, { headers: hdr });
            const r2 = await axios.get(ApiUrl.getCart, { headers: hdr });
            setDbItems(r2.data?.data?.items || []);
            setDbTotal(r2.data?.cartTotal || 0);
            return;
          }
        }

        setDbItems(items);
        setDbTotal(r.data?.cartTotal || 0);
      } catch (e) {
        console.error('[CartSync]', e?.response?.data || e?.message);
        setDbItems([]);
      } finally {
        setCartLoading(false);
      }
    })();
  }, [isLoggedIn, token]);

  // ── Derived values ─────────────────────────────────────────────
  const useDb     = !isBuyNow && dbItems.length > 0;
  const dispItems = isBuyNow ? [buyNowItem] : useDb ? dbItems : cartItems;
  const subtotal  = isBuyNow
    ? (buyNowItem.price || 0) * (buyNowItem.quantity || buyNowItem.qty || 1)
    : useDb
      ? dbTotal
      : cartItems.reduce((s, it) => {
          const p = parseFloat(String(it.price || it.sellingPrice || 0).replace(/[^\d.]/g, '')) || 0;
          return s + p * (it.qty || 1);
        }, 0);

  // ── Address form helpers ───────────────────────────────────────
  const openAdd = () => {
    setEditingId(null);
    setAddrForm(EMPTY_ADDR);
    setAddrErr('');
    setShowForm(true);
  };

  const openEdit = (a) => {
    const digits = (a.contact || '').replace(/^\+91/, '');
    const parts  = (a.addressLine || '').split(', ');
    setAddrForm({
      fullName: a.name          || '',
      mobile:   digits,
      houseNo:  parts[0]        || '',
      area:     parts[1]        || '',
      landmark: parts.slice(2).join(', ') || '',
      city:     a.city          || '',
      state:    a.provinceState || '',
      pinCode:  a.postalCode    || '',
    });
    setEditingId(a._id);
    setAddrErr('');
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setAddrForm(EMPTY_ADDR);
    setAddrErr('');
  };

  const handleAddrChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'mobile' || name === 'pinCode') && !/^\d*$/.test(value)) return;
    setAddrForm(p => ({ ...p, [name]: value }));
    setAddrErr('');
  };

  const handleSaveAddr = async (e) => {
    e.preventDefault();
    const err = validateAddr(addrForm);
    if (err) { setAddrErr(err); return; }
    setSaving(true);
    try {
      const hdr = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
      const payload = toAddrPayload(addrForm);
      let res;
      if (editingId) {
        res = await axios.put(`${ApiUrl.updateAddress}/${editingId}`, payload, { headers: hdr });
      } else {
        res = await axios.post(ApiUrl.addAddress, payload, { headers: hdr });
      }
      if (res.data?.success) {
        const returnedId = res.data.data?._id || editingId;
        cancelForm();
        await fetchAddrs();
        if (returnedId) setSelAddrId(returnedId);
        toastSuccess(editingId ? 'Address updated!' : 'Address saved!');
      } else {
        setAddrErr(res.data?.message || 'Failed to save address.');
      }
    } catch (err) {
      setAddrErr(err.response?.data?.message || 'Could not save address.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (deletingId) return;
    setDeletingId(id);
    try {
      await axios.delete(`${ApiUrl.deleteAddress}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const next = addrs.filter(a => a._id !== id);
      setAddrs(next);
      if (selAddrId === id) {
        const def = next.find(a => a.isDefault) || next[0];
        setSelAddrId(def?._id || null);
      }
      toastInfo('Address removed.');
    } catch {
      toastError('Could not delete address.');
    } finally {
      setDeletingId(null);
    }
  };

  // ── Place order ────────────────────────────────────────────────
  const buildShippingAddress = (addr) => ({
    name:        addr.name,
    phone:       addr.contact,
    addressLine: addr.addressLine,
    city:        addr.city,
    state:       addr.provinceState,
    postalCode:  addr.postalCode,
    country:     addr.country || 'India',
    addressType: addr.addressType || 'Home',
  });

  const buildBuyNowItem = () => {
    const pd = (buyNowItem.prices || []).find(p => p.country === 'IND')
      || (buyNowItem.prices || [])[0];
    return {
      accessoryId:   buyNowItem.isAccessory ? buyNowItem._id : undefined,
      productId:     !buyNowItem.isAccessory ? buyNowItem._id : undefined,
      priceId:       pd?._id || buyNowItem.priceId,
      quantity:      buyNowItem.quantity || buyNowItem.qty || 1,
      selectedSize:  buyNowItem.selectedSize  || '',
      selectedColor: buyNowItem.selectedColor || '',
    };
  };

  // Map dbItems (populated Mongoose objects from getCart) to plain order item format
  const buildCartItemsFromDb = () =>
    dbItems.map(it => ({
      productId:    it.productId?._id  ?? (typeof it.productId  === 'string' ? it.productId  : undefined),
      accessoryId:  it.accessoryId?._id ?? (typeof it.accessoryId === 'string' ? it.accessoryId : undefined),
      priceId:      it.priceId?._id    ?? it.priceId,
      quantity:     it.quantity || 1,
      selectedSize: it.selectedSize  || '',
      selectedColor: it.selectedColor || '',
    })).filter(it => it.priceId);

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload  = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const placeCodOrder = async (shippingAddress, hdr) => {
    if (isBuyNow) {
      const item = buildBuyNowItem();
      if (!item.priceId) throw new Error('Price information missing — please go back and try again.');
      return axios.post(ApiUrl.createOrder, { items: [item], shippingAddress }, { headers: hdr });
    }
    if (useDb) {
      // Send items directly from what we already fetched — avoids backend re-reading an empty cart
      const items = buildCartItemsFromDb();
      if (!items.length) throw new Error('Cart items are missing price data — please re-add them to cart.');
      return axios.post(ApiUrl.createOrder, { items, shippingAddress }, { headers: hdr });
    }
    // Fallback: CartContext items (when DB sync hadn't completed at page load)
    if (cartItems.length === 0) throw new Error('Your cart is empty. Please add items and try again.');
    const localItems = cartItems.map(it => {
      const isAcc = !!it.isAccessory;
      const pd = (it.prices || []).find(p => p.country === 'IND') || (it.prices || [])[0] || it.priceInfo;
      return {
        productId:    !isAcc ? (it.productId || it._id) : undefined,
        accessoryId:   isAcc ? (it.accessoryId || it._id) : undefined,
        priceId:       it.priceId || pd?._id || it.priceInfo?._id,
        quantity:      it.qty || it.quantity || 1,
        selectedSize:  it.selectedSize || it.size || '',
        selectedColor: it.selectedColor || it.color || '',
      };
    }).filter(it => it.priceId);
    if (!localItems.length) throw new Error('Cart items are missing price data — please re-add them to cart.');
    return axios.post(ApiUrl.createOrder, { items: localItems, shippingAddress }, { headers: hdr });
  };

  const placeRazorpayOrder = async (shippingAddress, hdr, selAddr) => {
    // Build items payload — always explicit so backend never reads from cart model
    let itemsPayload;
    if (isBuyNow) {
      const item = buildBuyNowItem();
      if (!item.priceId) throw new Error('Price information missing — please go back and try again.');
      itemsPayload = [item];
    } else {
      itemsPayload = buildCartItemsFromDb();
      if (!itemsPayload.length) throw new Error('Cart is empty or items missing price data.');
    }

    const createRes = await axios.post(ApiUrl.razorpayCreateOrder, {
      type:  'buyNow',   // always send items explicitly — no cart-model read on backend
      items: itemsPayload,
    }, { headers: hdr });

    if (!createRes.data?.success) throw new Error(createRes.data?.message || 'Could not initiate payment.');

    const { razorpayOrderId, amount, currency, keyId } = createRes.data;

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) throw new Error('Razorpay checkout failed to load. Check your internet connection.');

    return new Promise((resolve, reject) => {
      const options = {
        key:         keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name:        'AuraMart',
        description: 'Order Payment',
        image:       '/images/col8.jpg',
        order_id:    razorpayOrderId,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(ApiUrl.razorpayVerifyPayment, {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              shippingAddress,
              type:  'buyNow',   // items sent explicitly; frontend clears cart on success
              items: itemsPayload,
            }, { headers: hdr });
            resolve(verifyRes);
          } catch (err) {
            reject(err);
          }
        },
        prefill: {
          name:    selAddr?.name    || '',
          contact: selAddr?.contact || '',
        },
        theme:  { color: '#E63946' },
        modal:  {
          ondismiss: () => {
            setPlacing(false);
            reject(new Error('Payment cancelled.'));
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        reject(new Error(resp.error?.description || 'Payment failed.'));
      });
      rzp.open();
    });
  };

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) return setFormErr('Please login to place an order.');

    const selAddr = addrs.find(a => a._id === selAddrId);
    if (!selAddr) {
      return setFormErr(
        addrs.length > 0
          ? 'Please select a delivery address.'
          : 'Please add a delivery address to continue.',
      );
    }
    if (dispItems.length === 0) return setFormErr('Your cart is empty.');

    const shippingAddress = buildShippingAddress(selAddr);
    const hdr = { Authorization: `Bearer ${token}` };

    setPlacing(true);
    setFormErr('');

    try {
      let res;
      if (paymentMethod === 'online') {
        res = await placeRazorpayOrder(shippingAddress, hdr, selAddr);
      } else {
        res = await placeCodOrder(shippingAddress, hdr);
      }

      if (res?.data?.success) {
        if (!isBuyNow) clearCart();
        toastSuccess('Order placed successfully! 🎉');
        setOrderOk(true);
      } else {
        const msg = res?.data?.message || 'Order could not be placed.';
        setOrderErrMsg(msg);
        toastError(msg);
        setOrderFail(true);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.';
      if (msg === 'Payment cancelled.') return;
      setOrderErrMsg(msg);
      toastError(msg);
      setOrderFail(true);
    } finally {
      setPlacing(false);
    }
  };

  // ── Not logged in ──────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="bg-white rounded-xl border border-[#EAEAEA] p-10 text-center max-w-sm mx-4 shadow-sm">
          <div className="w-16 h-16 bg-[#FFF1F1] rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={30} className="text-[#E63946]" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Login Required</h2>
          <p className="text-sm text-[#6B7280] mb-6">Please log in to complete your order.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-[#E63946] text-white font-bold rounded hover:bg-[#C5303A] transition-colors"
          >
            Go Back &amp; Login
          </button>
        </div>
      </div>
    );
  }

  const selAddr = addrs.find(a => a._id === selAddrId);

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Page header */}
      <div className="bg-white border-b border-[#EAEAEA] shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-[#E63946] font-extrabold text-xl tracking-tight"
          >
            AuraMart
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <span className="text-sm font-semibold text-gray-700">Secure Checkout</span>
          <ShieldCheck size={14} className="text-[#388E3C]" />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-5 flex flex-col lg:flex-row gap-5 items-start">

        {/* ── LEFT column ───────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* STEP 1: Delivery Address */}
          <div className="bg-white rounded-xl border border-[#EAEAEA] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#EAEAEA] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#E63946] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <h2 className="font-bold text-gray-800">Delivery Address</h2>
              </div>
              {addrLoading && <Loader2 size={14} className="animate-spin text-[#6B7280]" />}
            </div>

            <div className="p-5 space-y-3">
              {/* Saved address cards */}
              {addrs.map(addr => (
                <label
                  key={addr._id}
                  className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                    selAddrId === addr._id
                      ? 'border-[#E63946] bg-[#FFF8F8] ring-1 ring-[#E63946]'
                      : 'border-[#EAEAEA] bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryAddress"
                    value={addr._id}
                    checked={selAddrId === addr._id}
                    onChange={() => { setSelAddrId(addr._id); setShowForm(false); }}
                    className="mt-0.5 w-4 h-4 flex-shrink-0 accent-[#E63946]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-semibold text-sm text-gray-800">{addr.name}</span>
                      <span className="text-xs text-[#6B7280]">{addr.contact}</span>
                      {addr.isDefault && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#E63946] text-white rounded uppercase tracking-wide">
                          Default
                        </span>
                      )}
                      <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded uppercase tracking-wide">
                        {addr.addressType || 'Home'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {[addr.addressLine, addr.city, addr.provinceState, addr.postalCode].filter(Boolean).join(', ')} — India
                    </p>
                  </div>
                  {/* Edit / Delete */}
                  <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); openEdit(addr); }}
                      className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); handleDelete(addr._id); }}
                      disabled={deletingId === addr._id}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === addr._id
                        ? <Loader2 size={13} className="animate-spin" />
                        : <Trash2 size={13} />}
                    </button>
                  </div>
                </label>
              ))}

              {/* No addresses message */}
              {addrs.length === 0 && !showForm && !addrLoading && (
                <div className="text-center py-4">
                  <MapPin size={32} className="text-[#6B7280] mx-auto mb-2" />
                  <p className="text-sm text-[#6B7280]">No saved addresses. Add one to continue.</p>
                </div>
              )}

              {/* Add New Address button */}
              {!showForm && (
                <button
                  onClick={openAdd}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#E63946] hover:text-[#C5303A] transition-colors py-1"
                >
                  <Plus size={15} />
                  {addrs.length > 0 ? 'Add New Address' : 'Add Delivery Address'}
                </button>
              )}

              {/* Address form (Add / Edit) */}
              {showForm && (
                <form
                  onSubmit={handleSaveAddr}
                  noValidate
                  className="border border-[#EAEAEA] rounded-xl p-4 space-y-3 bg-[#FAFAFA]"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-gray-800">
                      {editingId ? 'Edit Address' : 'New Delivery Address'}
                    </h3>
                    {addrs.length > 0 && (
                      <button
                        type="button"
                        onClick={cancelForm}
                        className="text-xs text-[#6B7280] hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {addrErr && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                      <AlertCircle size={13} /> {addrErr}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                      <input className={iCls} name="fullName" placeholder="Full Name" value={addrForm.fullName} onChange={handleAddrChange} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile *</label>
                      <div className="flex border border-[#EAEAEA] rounded-lg overflow-hidden focus-within:border-[#E63946] focus-within:ring-1 focus-within:ring-[#E63946]">
                        <span className="px-3 py-2.5 text-sm bg-[#F8F9FA] border-r border-[#EAEAEA] text-gray-700 flex-shrink-0">+91</span>
                        <input
                          type="text" name="mobile" placeholder="10-digit number"
                          value={addrForm.mobile} onChange={handleAddrChange} maxLength="10"
                          className="flex-1 px-3 py-2.5 text-sm focus:outline-none bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">House / Flat No. *</label>
                      <input className={iCls} name="houseNo" placeholder="House/Flat No., Building" value={addrForm.houseNo} onChange={handleAddrChange} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Area / Street *</label>
                      <input className={iCls} name="area" placeholder="Area / Street / Locality" value={addrForm.area} onChange={handleAddrChange} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Landmark</label>
                      <input className={iCls} name="landmark" placeholder="Landmark (Optional)" value={addrForm.landmark} onChange={handleAddrChange} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">City / Town *</label>
                      <input className={iCls} name="city" placeholder="City / Town" value={addrForm.city} onChange={handleAddrChange} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">PIN Code *</label>
                      <input className={iCls} name="pinCode" placeholder="6-digit PIN Code" value={addrForm.pinCode} onChange={handleAddrChange} maxLength="6" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">State *</label>
                      <select className={iCls} name="state" value={addrForm.state} onChange={handleAddrChange}>
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2 bg-[#FAF7F2] rounded-lg text-xs text-gray-600">
                    🇮🇳 Country: <strong>India</strong> — Shipping within India only.
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#E63946] rounded-lg hover:bg-[#C5303A] disabled:opacity-60 transition-colors"
                    >
                      {saving && <Loader2 size={14} className="animate-spin" />}
                      {saving ? 'Saving...' : (editingId ? 'Update Address' : 'Save & Use This Address')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* STEP 2: Payment Method */}
          <div className="bg-white rounded-xl border border-[#EAEAEA] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#EAEAEA] flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#E63946] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                2
              </div>
              <h2 className="font-bold text-gray-800">Payment Method</h2>
            </div>
            <div className="p-5 space-y-3">
              {/* COD option */}
              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                paymentMethod === 'cod'
                  ? 'border-[#E63946] bg-[#FFF8F8] ring-1 ring-[#E63946]'
                  : 'border-[#EAEAEA] bg-white hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="w-4 h-4 accent-[#E63946] flex-shrink-0"
                />
                <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] flex items-center justify-center flex-shrink-0">
                  <Truck size={18} className="text-[#E63946]" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">Cash on Delivery</p>
                  <p className="text-xs text-[#6B7280]">Pay when your order arrives at your door</p>
                </div>
              </label>

              {/* Razorpay option */}
              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                paymentMethod === 'online'
                  ? 'border-[#E63946] bg-[#FFF8F8] ring-1 ring-[#E63946]'
                  : 'border-[#EAEAEA] bg-white hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                  className="w-4 h-4 accent-[#E63946] flex-shrink-0"
                />
                <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] flex items-center justify-center flex-shrink-0">
                  <CreditCard size={18} className="text-[#E63946]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800">Online Payment</p>
                  <p className="text-xs text-[#6B7280]">UPI · Cards · Net Banking · Wallets — powered by Razorpay</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#2563EB] text-white rounded uppercase tracking-wide">UPI</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#16A34A] text-white rounded uppercase tracking-wide">Cards</span>
                </div>
              </label>
            </div>
          </div>

          {/* Validation error */}
          {formErr && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              <AlertCircle size={15} className="flex-shrink-0" />
              {formErr}
            </div>
          )}

          {/* Place Order — mobile only */}
          <button
            onClick={handlePlaceOrder}
            disabled={placing || cartLoading}
            className="lg:hidden w-full py-3.5 bg-[#F4A261] hover:bg-[#E8900A] disabled:opacity-60 text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            {placing
              ? <><Loader2 size={16} className="animate-spin" /> Placing Order…</>
              : `PLACE ORDER · ${formatINR(subtotal)}`}
          </button>
        </div>

        {/* ── RIGHT column — Order Summary ──────────────────────── */}
        <div className="lg:w-[340px] flex-shrink-0 w-full space-y-3">
          <div className="bg-white rounded-xl border border-[#EAEAEA] p-5 sticky top-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
              Price Details
            </h2>

            {/* Item list */}
            {cartLoading ? (
              <div className="space-y-3 mb-4">
                {[1, 2].map(i => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-12 h-14 bg-gray-200 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : dispItems.length === 0 ? (
              <div className="text-center py-6 mb-4">
                <Package size={32} className="text-[#6B7280] mx-auto mb-2" />
                <p className="text-sm text-[#6B7280]">Your cart is empty.</p>
              </div>
            ) : (
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
                {dispItems.map((item, i) => {
                  const name  = item.productId?.productName  || item.productId?.name
                    || item.accessoryId?.accessoryName || item.accessoryId?.name
                    || item.productSnapshot?.name
                    || item.name || item.productName || item.title || 'Product';
                  const img   = item.productId?.colorImages?.[0]?.thumbnail
                    || item.accessoryId?.colorImages?.[0]?.accessoryThumbnail
                    || item.productSnapshot?.image
                    || item.image || '/images/col8.jpg';
                  const price = item.priceId?.sellingPrice || item.unitPrice
                    || item.price || item.sellingPrice || 0;
                  const qty   = item.quantity || item.qty || 1;

                  return (
                    <div key={i} className="flex gap-3">
                      <div className="w-12 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                        <img
                          src={img} alt={name}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.src = '/images/col8.jpg'; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight">{name}</p>
                        {item.selectedSize  && <p className="text-[10px] text-[#6B7280] mt-0.5">Size: {item.selectedSize}</p>}
                        {item.selectedColor && <p className="text-[10px] text-[#6B7280]">Color: {item.selectedColor}</p>}
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-[#6B7280]">Qty: {qty}</span>
                          <span className="text-sm font-bold text-gray-800">{formatINR(price * qty)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Price breakdown */}
            <div className="border-t border-dashed border-[#EAEAEA] pt-3 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Price ({dispItems.length} item{dispItems.length !== 1 ? 's' : ''})
                </span>
                <span className="font-medium text-gray-800">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Charges</span>
                <span className="text-[#388E3C] font-semibold">FREE</span>
              </div>
            </div>

            <div className="border-t border-[#EAEAEA] mt-3 pt-3 flex justify-between items-center">
              <span className="font-bold text-gray-800">Total Amount</span>
              <span className="font-bold text-gray-900 text-lg">{formatINR(subtotal)}</span>
            </div>

            {subtotal > 0 && (
              <div className="mt-2 text-xs text-[#388E3C] font-semibold flex items-center gap-1">
                <Tag size={11} /> You save with Free Delivery on this order
              </div>
            )}

            {/* Selected address preview */}
            {selAddr && (
              <div className="mt-4 p-3 bg-[#F8F9FA] rounded-lg border border-[#EAEAEA]">
                <div className="flex items-start gap-2">
                  <MapPin size={13} className="text-[#E63946] mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-0.5">
                      Delivering to
                    </p>
                    <p className="text-xs font-semibold text-gray-800">{selAddr.name}</p>
                    <p className="text-[10px] text-gray-500 leading-relaxed truncate">
                      {[selAddr.addressLine, selAddr.city, selAddr.provinceState].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Place Order button */}
            <button
              onClick={handlePlaceOrder}
              disabled={placing || cartLoading}
              className="w-full mt-4 py-3.5 bg-[#F4A261] hover:bg-[#E8900A] disabled:opacity-60 text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
            >
              {placing
                ? <><Loader2 size={15} className="animate-spin" /> Placing Order…</>
                : 'PLACE ORDER'}
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-[#6B7280]">
              <ShieldCheck size={12} className="text-[#388E3C]" />
              Safe &amp; Secure Checkout
            </div>
          </div>

          {/* Delivery info card */}
          <div className="bg-white rounded-xl border border-[#EAEAEA] p-4">
            <div className="flex items-start gap-3">
              <Truck size={16} className="text-[#388E3C] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-700">Free Delivery across India</p>
                <p className="text-[10px] text-[#6B7280] mt-0.5">
                  Cash on Delivery · No minimum order value
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Order success modal ──────────────────────────────────── */}
      {orderOk && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={36} className="text-[#388E3C]" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">Order Placed!</h2>
            <p className="text-sm text-gray-500 mb-2">Your order has been confirmed.</p>
            {selAddr && (
              <p className="text-xs text-[#6B7280] bg-[#F8F9FA] rounded-lg px-3 py-2 mb-5">
                Delivering to <strong>{selAddr.name}</strong>, {selAddr.city}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/collections')}
                className="flex-1 py-2.5 border border-[#EAEAEA] text-gray-600 font-semibold rounded-lg text-sm hover:bg-gray-50"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/account')}
                className="flex-1 py-2.5 bg-[#E63946] hover:bg-[#C5303A] text-white font-semibold rounded-lg text-sm"
              >
                View Orders
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Order failed modal ───────────────────────────────────── */}
      {orderFail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={36} className="text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Order Failed</h2>
            <p className="text-sm text-gray-500 mb-6">{orderErrMsg}</p>
            <button
              onClick={() => setOrderFail(false)}
              className="w-full py-2.5 bg-[#EF4444] hover:bg-red-600 text-white font-semibold rounded-lg text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentCart;
