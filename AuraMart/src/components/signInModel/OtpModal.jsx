import { useState, useRef } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ApiUrl } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toastSuccess, toastError } from '../../utils/toast.js';

const OtpModal = ({ onClose }) => {
  const navigate   = useNavigate();
  const { login }  = useAuth();
  const [otp,      setOtp]      = useState(Array(6).fill(''));
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const refs = useRef([]);

  const mode = localStorage.getItem('authMode') || 'register';

  const handleChange = (e, i) => {
    if (isNaN(e.target.value)) return;
    const next = [...otp];
    next[i] = e.target.value;
    setOtp(next);
    if (e.target.value && refs.current[i + 1]) refs.current[i + 1].focus();
  };

  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace' && !otp[i] && refs.current[i - 1]) refs.current[i - 1].focus();
  };

  const handleVerify = async () => {
    const code  = otp.join('');
    const email = localStorage.getItem('userEmail');
    if (code.length < 6) { setError('Please enter all 6 digits.'); return; }
    setLoading(true); setError('');
    try {
      const endpoint = mode === 'login' ? ApiUrl.verifyOtpLogin : ApiUrl.verifyEmail;
      const res = await axios.post(endpoint, { email, OTP: code });

      if (res.status === 200 || res.data?.status === true || res.data?.success) {
        // Extract token and user from either response shape
        const token = res.data?.token || res.data?.data?.token;
        const user  = res.data?.user  || res.data?.data?.user || res.data?.data;

        if (token) {
          // login() dispatches 'user-login' → CartContext.mergeGuestAndSync handles
          // the guest cart merge automatically. Do NOT merge here too — a second
          // merge call would find the item already added by CartContext and
          // increment its quantity, resulting in qty 2 for 1 guest item.
          login(token, user, true);
        }
        localStorage.setItem('verifiedEmail', email);
        localStorage.removeItem('authMode');

        toastSuccess(mode === 'login' ? 'Login Successful! 🎉' : 'Registration Successful! Welcome aboard 🎉');
        setSuccess(true);
        setTimeout(() => { if (typeof onClose === 'function') onClose(); navigate('/'); }, 1500);
      } else {
        setError('OTP verification failed. Please try again.');
        toastError('OTP verification failed. Please try again.');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong.';
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const email = localStorage.getItem('userEmail');
    try {
      const endpoint = mode === 'login' ? ApiUrl.otpLogin : ApiUrl.sendOtpInEmail;
      await axios.post(endpoint, { email });
      setError(''); setOtp(Array(6).fill(''));
    } catch { setError('Failed to resend OTP.'); }
  };

  return (
    <div className="auth-overlay" onClick={() => { if (typeof onClose === 'function') onClose(); }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="auth-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#E63946] px-6 py-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Verify OTP</h2>
            <p className="text-blue-200 text-sm mt-0.5">Enter the 6-digit code sent to you</p>
          </div>
          <button onClick={() => { if (typeof onClose === 'function') onClose(); else navigate('/'); }} className="text-white/70 hover:text-white mt-1"><X size={20} /></button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-6">
              <CheckCircle size={48} className="text-[#7CB342] mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 text-lg mb-1">
                {mode === 'login' ? 'Login Successful!' : 'Email Verified!'}
              </h3>
              <p className="text-sm text-[#6B7280]">Redirecting…</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-5 text-center">
                Enter the 6-digit OTP sent to{' '}
                <span className="font-semibold text-gray-800">
                  {localStorage.getItem('userEmail') || 'your email'}
                </span>
              </p>

              <div className="flex justify-center gap-2 mb-6">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { refs.current[i] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onFocus={(e) => e.target.select()}
                    className={`w-11 h-12 text-center text-lg font-bold border-2 rounded focus:outline-none focus:border-[#E63946] transition-colors ${
                      digit ? 'border-[#E63946] bg-[#FFF1F1]' : 'border-[#EAEAEA]'
                    }`}
                  />
                ))}
              </div>

              {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

              <button
                onClick={handleVerify}
                disabled={loading}
                className="w-full h-11 bg-[#F4A261] text-white font-bold rounded hover:bg-[#DB7C3E] disabled:opacity-60 transition-colors mb-3"
              >
                {loading ? 'Verifying…' : 'VERIFY OTP'}
              </button>

              <p className="text-center text-sm text-[#6B7280]">
                Didn&apos;t receive the OTP?{' '}
                <button onClick={handleResend} className="text-[#E63946] font-semibold hover:underline">
                  Resend
                </button>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OtpModal;
