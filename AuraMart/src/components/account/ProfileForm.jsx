import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { ApiUrl, getAuthToken } from '../../utils/api.js';
import { toastSuccess, toastError } from '../../utils/toast.js';

const inputCls = 'w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-colors';

const ProfileForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dob: '', gender: '',
    email: '', countryCode: '+91', phone: '',
  });
  const [loading,   setLoading]   = useState(false);
  const [fetching,  setFetching]  = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg,   setErrorMsg]   = useState('');

  useEffect(() => {
    const token = getAuthToken();
    if (!token) { setFetching(false); return; }
    axios.get(ApiUrl.userProfile, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.data?.data) {
          const d = res.data.data;
          // Fallback: split `name` if dedicated first/last fields are empty
          const nameParts = (d.name || '').trim().split(/\s+/);
          setFormData({
            firstName:   d.firstName || d.first_name || nameParts[0] || '',
            lastName:    d.lastName  || d.last_name  || nameParts.slice(1).join(' ') || '',
            dob:         d.dob       || d.dateOfBirth || '',
            gender:      d.gender    || '',
            email:       d.email     || '',
            countryCode: d.countryCode || '+91',
            phone:       d.contact   || d.phone || d.mobile || '',
          });
        }
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSuccessMsg(''); setErrorMsg('');
  };

  const validate = () => {
    if (!formData.firstName.trim()) return 'First name is required.';
    if (!formData.lastName.trim())  return 'Last name is required.';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Please enter a valid email.';
    if (formData.phone && !/^\d{7,15}$/.test(formData.phone.replace(/\s/g, ''))) return 'Please enter a valid phone number.';
    return null;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMsg(''); setErrorMsg('');
    const err = validate();
    if (err) { setErrorMsg(err); return; }
    const token = getAuthToken();
    if (!token) { setErrorMsg('You must be logged in to update your profile.'); return; }
    setLoading(true);
    try {
      const res = await axios.put(
        ApiUrl.updateProfile,
        { ...formData, phone: formData.countryCode + formData.phone },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      if (res.data?.success) { setSuccessMsg('Profile updated successfully.'); toastSuccess('Profile Updated Successfully ✅'); }
      else { setErrorMsg(res.data?.message || 'Failed to update profile.'); toastError(res.data?.message || 'Failed to update profile.'); }
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setErrorMsg(msg); toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="bg-white rounded-lg border border-[#EAEAEA] p-6 space-y-4">
      <div className="skeleton h-5 w-32 rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="skeleton h-10 rounded-lg" />)}
      </div>
    </div>
  );

  const displayName = [formData.firstName, formData.lastName].filter(Boolean).join(' ') || 'Your Profile';

  return (
    <div className="bg-white rounded-lg border border-[#EAEAEA] overflow-hidden">
      {/* header */}
      <div className="px-5 py-4 border-b border-[#EAEAEA] flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-[#FFF1F1] flex items-center justify-center flex-shrink-0">
          <User size={20} className="text-[#E63946]" />
        </div>
        <div>
          <p className="font-bold text-gray-800 text-sm">{displayName}</p>
          {formData.email && <p className="text-xs text-[#6B7280]">{formData.email}</p>}
        </div>
      </div>

      <form onSubmit={handleSave} noValidate className="p-5 space-y-4">
        {successMsg && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            <CheckCircle size={15} /> {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            <AlertCircle size={15} /> {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">First Name *</label>
            <input className={inputCls} type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Last Name *</label>
            <input className={inputCls} type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Date of Birth</label>
            <input className={inputCls} type="date" name="dob" value={formData.dob} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Gender</label>
            <select className={inputCls} name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="prefer_not">Prefer not to say</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
            <input className={inputCls} type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Contact Number</label>
            <div className="flex border border-[#EAEAEA] rounded-lg overflow-hidden focus-within:border-[#E63946] focus-within:ring-1 focus-within:ring-[#E63946]">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="px-3 py-2.5 text-sm bg-[#F8F9FA] border-r border-[#EAEAEA] text-gray-700 focus:outline-none"
              >
                <option value="+91">+91 (India)</option>
              </select>
              <input
                type="text"
                name="phone"
                placeholder="Contact Number"
                value={formData.phone}
                onChange={handleChange}
                className="flex-1 px-4 py-2.5 text-sm text-gray-800 bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold text-gray-600 border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-[#E63946] rounded-lg hover:bg-[#C5303A] disabled:opacity-60 transition-colors"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
