import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail, Lock, KeyRound, ShoppingBag, ArrowLeft } from "lucide-react";
import { ApiEndpoints } from "../../../api/apis";
import { request } from "../../../api/request";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const startTimer = (sec = 60) => {
    setResendTimer(sec);
    const t = setInterval(() => setResendTimer(p => { if (p <= 1) { clearInterval(t); return 0; } return p - 1; }), 1000);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");
    setLoading(true);
    const [, error] = await request({ method: "POST", url: ApiEndpoints.AUTH.FORGOT_PASSWORD, data: { email } });
    setLoading(false);
    if (error) { toast.error(error.message || "Failed to send OTP"); return; }
    toast.success("OTP sent to your email");
    setStep(2);
    startTimer();
  };

  const handleResend = async () => {
    setLoading(true);
    const [, error] = await request({ method: "POST", url: ApiEndpoints.AUTH.FORGOT_PASSWORD, data: { email } });
    setLoading(false);
    if (error) { toast.error("Failed to resend OTP"); return; }
    toast.success("OTP resent");
    startTimer();
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!otp || !password || !confirmPassword) return toast.error("Please fill all fields");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    setLoading(true);
    const [, error] = await request({
      method: "POST", url: ApiEndpoints.AUTH.RESET_PASSWORD,
      data: { email, otp, newPassword: password, confirmPassword },
    });
    setLoading(false);
    if (error) { toast.error(error.message || "Reset failed"); return; }
    toast.success("Password reset successfully!");
    navigate("/login");
  };

  const InputField = ({ label, icon: Icon, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input {...props} className="w-full h-10 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:bg-white transition-all" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 75% 75%, #6366f1 0%, transparent 50%)` }} />

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 pt-8 pb-10">
            <div className="flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-4 mx-auto">
              <ShoppingBag size={28} className="text-white" />
            </div>
            <h1 className="text-center text-xl font-bold text-white">Forgot Password</h1>
            <p className="text-center text-sm text-white/70 mt-1">
              {step === 1 ? "Enter your email to receive a reset OTP" : "Enter the OTP and your new password"}
            </p>
          </div>

          <div className="px-8 py-8 -mt-4 bg-white rounded-t-2xl">
            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <InputField label="Email address" icon={Mail} type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@example.com" />
                <button type="submit" disabled={loading}
                  className="w-full h-10 bg-[#E63946] hover:bg-[#C5303A] disabled:opacity-60 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 mt-2">
                  {loading ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Sending...</> : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleReset} className="space-y-4">
                <div className="flex items-center gap-2 py-2 px-3 bg-[#FFF1F1] rounded-lg">
                  <Mail size={13} className="text-[#E63946]" />
                  <span className="text-xs text-[#E63946] font-medium truncate">{email}</span>
                  <button type="button" onClick={() => setStep(1)} className="ml-auto text-xs text-[#E63946] hover:text-[#E63946]">Change</button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">OTP Code</label>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required maxLength={6} pattern="\d{6}" inputMode="numeric" placeholder="6-digit OTP"
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] text-center tracking-widest font-mono text-lg" />
                  <div className="flex justify-end mt-1">
                    <button type="button" disabled={resendTimer > 0 || loading} onClick={handleResend}
                      className="text-xs text-[#E63946] hover:text-[#C5303A] disabled:text-gray-400 disabled:cursor-not-allowed">
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                    </button>
                  </div>
                </div>
                <InputField label="New Password" icon={Lock} type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="Min. 6 characters" />
                <InputField label="Confirm Password" icon={KeyRound} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="Repeat password" />
                <button type="submit" disabled={loading}
                  className="w-full h-10 bg-[#E63946] hover:bg-[#C5303A] disabled:opacity-60 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2">
                  {loading ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Resetting...</> : "Reset Password"}
                </button>
              </form>
            )}

            <div className="mt-4 flex justify-center">
              <a href="/login" className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                <ArrowLeft size={12} /> Back to Sign In
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} AuraMart. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;
