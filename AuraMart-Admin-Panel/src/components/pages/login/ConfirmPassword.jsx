import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const ConfirmPassword = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full bg-[#E63946]/30 flex items-center justify-center">
          <ShieldCheck size={28} className="text-white/60" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Password Reset</h2>
      <p className="text-white/70 mb-6 text-sm">
        Please use the Forgot Password flow to reset your password via OTP verification.
      </p>
      <Link to="/forgot-password"
        className="block w-full py-2.5 px-4 bg-[#E63946] hover:bg-[#C5303A] text-white font-semibold rounded-lg transition-colors text-sm">
        Go to Forgot Password
      </Link>
      <Link to="/login" className="block mt-3 text-white/60 hover:text-white text-sm transition-colors">
        Back to Login
      </Link>
    </div>
  </div>
);

export default ConfirmPassword;
