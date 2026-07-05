import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Plus, Trash2, Edit2, CheckCircle, AlertCircle, Loader2, Star } from 'lucide-react';
import { ApiUrl, BASEURL, getAuthToken } from '../../utils/api.js';
import { toastSuccess, toastError, toastInfo } from '../../utils/toast.js';

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry','Chandigarh',
];

const EMPTY_FORM = { fullName: '', mobile: '', houseNo: '', area: '', landmark: '', city: '', state: '', pinCode: '' };

const inputCls = 'w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-colors';

// Convert frontend form fields → backend model fields
const toPayload = (f) => ({
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

const AddressList = () => {
  const [addresses,  setAddresses]  = useState([]);
  const [showForm,   setShowForm]   = useState(false);
  const [editingId,  setEditingId]  = useState(null);   // _id of address being edited
  const [formData,   setFormData]   = useState(EMPTY_FORM);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [defaultingId, setDefaultingId] = useState(null);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState('');

  const token = getAuthToken();
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const fetchAddresses = () => {
    if (!token) { setLoading(false); return; }
    axios.get(ApiUrl.getAddresses, { headers })
      .then(res => setAddresses(res.data?.data || []))
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'mobile' || name === 'pinCode') && !/^\d*$/.test(value)) return;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validate = () => {
    if (!formData.fullName.trim())         return 'Full name is required.';
    if (!/^\d{10}$/.test(formData.mobile)) return 'Enter a valid 10-digit mobile number.';
    if (!formData.houseNo.trim())          return 'House / Flat No. is required.';
    if (!formData.area.trim())             return 'Area / Street is required.';
    if (!formData.city.trim())             return 'City is required.';
    if (!formData.state)                   return 'State is required.';
    if (!/^\d{6}$/.test(formData.pinCode)) return 'Enter a valid 6-digit PIN code.';
    return null;
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const openEdit = (addr) => {
    // Convert backend fields → form fields
    const contactDigits = (addr.contact || '').replace(/^\+91/, '');
    const parts = (addr.addressLine || '').split(', ');
    setFormData({
      fullName:  addr.name          || '',
      mobile:    contactDigits,
      houseNo:   parts[0]           || '',
      area:      parts[1]           || '',
      landmark:  parts.slice(2).join(', ') || '',
      city:      addr.city          || '',
      state:     addr.provinceState || '',
      pinCode:   addr.postalCode    || '',
    });
    setEditingId(addr._id);
    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const err = validate();
    if (err) { setError(err); return; }
    if (!token) { setError('Please log in to save an address.'); return; }
    setSaving(true);
    try {
      const payload = toPayload(formData);
      let res;
      if (editingId) {
        res = await axios.put(`${ApiUrl.updateAddress}/${editingId}`, payload, { headers });
      } else {
        res = await axios.post(ApiUrl.addAddress, payload, { headers });
      }
      if (res.data?.success) {
        const msg = editingId ? 'Address updated successfully.' : 'Address saved successfully.';
        setSuccess(msg);
        toastSuccess(msg);
        setFormData(EMPTY_FORM);
        setShowForm(false);
        setEditingId(null);
        fetchAddresses();
      } else {
        const msg = res.data?.message || 'Failed to save address.';
        setError(msg); toastError(msg);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong.';
      setError(msg); toastError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!token || deletingId) return;
    setDeletingId(id);
    try {
      await axios.delete(`${ApiUrl.deleteAddress}/${id}`, { headers });
      setAddresses(prev => prev.filter(a => a._id !== id));
      setSuccess('Address removed.');
      toastInfo('Address removed.');
    } catch {
      setError('Could not delete address.');
      toastError('Could not delete address.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id) => {
    if (!token || defaultingId) return;
    setDefaultingId(id);
    try {
      const res = await axios.put(`${ApiUrl.updateAddress}/${id}`, { isDefault: true }, { headers });
      if (res.data?.success) {
        setAddresses(prev => prev.map(a => ({ ...a, isDefault: a._id === id })));
        setSuccess('Default address updated.');
        toastSuccess('Default address updated ✅');
      }
    } catch {
      setError('Could not update default address.');
      toastError('Could not update default address.');
    } finally {
      setDefaultingId(null);
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setError('');
  };

  if (loading) return (
    <div className="bg-white rounded-lg border border-[#EAEAEA] p-6 space-y-3">
      <div className="skeleton h-5 w-40 rounded" />
      {[1, 2].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-[#EAEAEA] overflow-hidden">
      {/* header */}
      <div className="px-5 py-3.5 border-b border-[#EAEAEA] flex items-center justify-between">
        <h3 className="font-bold text-gray-800">Delivery Addresses</h3>
        {!showForm && (
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#E63946] hover:text-[#C5303A] transition-colors"
          >
            <Plus size={15} /> Add New Address
          </button>
        )}
      </div>

      <div className="p-5 space-y-4">
        {success && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            <CheckCircle size={15} /> {success}
          </div>
        )}

        {/* add / edit form */}
        {showForm && (
          <form onSubmit={handleSave} noValidate className="border border-[#EAEAEA] rounded-xl p-5 space-y-4">
            <h4 className="font-bold text-gray-800 text-sm">
              {editingId ? 'Edit Address' : 'New Delivery Address'}
            </h4>

            {error && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                <AlertCircle size={15} /> {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                <input className={inputCls} name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile Number *</label>
                <div className="flex border border-[#EAEAEA] rounded-lg overflow-hidden focus-within:border-[#E63946] focus-within:ring-1 focus-within:ring-[#E63946]">
                  <span className="px-3 py-2.5 text-sm bg-[#F8F9FA] border-r border-[#EAEAEA] text-gray-700 flex items-center">+91</span>
                  <input
                    type="text" name="mobile" placeholder="10-digit number"
                    value={formData.mobile} onChange={handleChange} maxLength="10"
                    className="flex-1 px-3 py-2.5 text-sm focus:outline-none bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">House / Flat No. *</label>
                <input className={inputCls} name="houseNo" placeholder="House/Flat No., Building" value={formData.houseNo} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Area / Street *</label>
                <input className={inputCls} name="area" placeholder="Area / Street / Locality" value={formData.area} onChange={handleChange} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Landmark</label>
                <input className={inputCls} name="landmark" placeholder="Landmark (Optional)" value={formData.landmark} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">City / Town *</label>
                <input className={inputCls} name="city" placeholder="City / Town" value={formData.city} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">PIN Code *</label>
                <input className={inputCls} name="pinCode" placeholder="6-digit PIN Code" value={formData.pinCode} onChange={handleChange} maxLength="6" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">State *</label>
                <select className={inputCls} name="state" value={formData.state} onChange={handleChange}>
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-[#FAF7F2] rounded-lg text-xs text-gray-600">
              🇮🇳 Country: <strong>India</strong> — Shipping within India only.
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={cancelForm}
                className="px-5 py-2 text-sm font-semibold text-gray-600 border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-[#E63946] rounded-lg hover:bg-[#C5303A] disabled:opacity-60 transition-colors">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? 'Saving...' : (editingId ? 'Update Address' : 'Save Address')}
              </button>
            </div>
          </form>
        )}

        {/* saved addresses */}
        {addresses.length === 0 && !showForm && (
          <div className="text-center py-10">
            <MapPin size={40} className="text-[#6B7280] mx-auto mb-3" />
            <p className="text-sm text-[#6B7280]">No saved addresses. Add one to speed up checkout!</p>
          </div>
        )}

        {addresses.map(addr => (
          <div
            key={addr._id}
            className={`relative p-4 border rounded-xl ${addr.isDefault ? 'border-[#E63946] bg-[#FFF8F8]' : 'border-[#EAEAEA] bg-[#F8F9FA]'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-semibold text-gray-800 text-sm">{addr.name}</p>
                  <span className="text-xs text-[#6B7280]">{addr.contact}</span>
                  {addr.isDefault && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-[#E63946] text-white rounded-full uppercase tracking-wide">
                      <Star size={9} fill="currentColor" /> Default
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {[addr.addressLine, addr.city, addr.provinceState, addr.postalCode, addr.country].filter(Boolean).join(', ')}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => openEdit(addr)}
                  className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit address"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(addr._id)}
                  disabled={deletingId === addr._id}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Remove address"
                >
                  {deletingId === addr._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            </div>

            {!addr.isDefault && (
              <button
                onClick={() => handleSetDefault(addr._id)}
                disabled={defaultingId === addr._id}
                className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#E63946] hover:underline disabled:opacity-50"
              >
                {defaultingId === addr._id ? <Loader2 size={11} className="animate-spin" /> : null}
                Set as Default
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressList;
