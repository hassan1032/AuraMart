import { useState } from 'react';
import { X, Mail } from 'lucide-react';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
);
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.025 4.388 11.019 10.125 11.927V15.563H7.078v-3.49h3.047v-2.66c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.927-1.956 1.874v2.267h3.328l-.532 3.49h-2.796v8.437C19.612 23.092 24 18.098 24 12.073z"/></svg>
);
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ApiUrl } from '../../utils/api';

const Register = ({ onClose, onSwitchToSignIn }) => {
  const navigate = useNavigate();
  const [email,   setEmail]   = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(ApiUrl.sendOtpInEmail, { email }, { withCredentials: false });
      if (res.status === 200) {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('authMode', 'register');
        setSent(true);
        setTimeout(() => { navigate('/register-otp'); }, 1200);
      } else {
        setError('Failed to send OTP. Try again.');
      }
    } catch {
      setError('Something went wrong while sending OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="auth-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#E63946] px-6 py-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Create Account</h2>
            <p className="text-blue-200 text-sm mt-0.5">Sign up to enjoy exclusive benefits</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white mt-1">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">📧</div>
              <h3 className="font-bold text-gray-800 mb-1">OTP Sent!</h3>
              <p className="text-sm text-[#6B7280]">Redirecting to verification page…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    required
                    className={`w-full h-10 pl-9 pr-3 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] ${
                      error ? 'border-red-400' : 'border-[#EAEAEA]'
                    }`}
                  />
                </div>
                {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
              </div>

              <p className="text-xs text-[#6B7280]">
                By continuing, you agree to our{' '}
                <a href="/privacy-policy" className="text-[#E63946] hover:underline">Terms of Use</a> and{' '}
                <a href="/privacy-policy" className="text-[#E63946] hover:underline">Privacy Policy</a>.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#F4A261] text-white font-bold rounded hover:bg-[#DB7C3E] disabled:opacity-60 transition-colors"
              >
                {loading ? 'Sending OTP…' : 'CONTINUE'}
              </button>
            </form>
          )}

          {!sent && (
            <>
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#EAEAEA]" /></div>
                <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-[#6B7280]">OR</span></div>
              </div>
              <div className="space-y-2.5">
                <button className="w-full h-10 flex items-center justify-center gap-2 border border-[#EAEAEA] rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <GoogleIcon /> Continue with Google
                </button>
                <button className="w-full h-10 flex items-center justify-center gap-2 border border-[#EAEAEA] rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <FacebookIcon /> Continue with Facebook
                </button>
              </div>
              <p className="text-center text-sm text-gray-600 mt-5">
                Already have an account?{' '}
                <button onClick={onSwitchToSignIn} className="text-[#E63946] font-semibold hover:underline">
                  Login
                </button>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
