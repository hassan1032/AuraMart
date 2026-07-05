import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Eye, EyeOff, Lock, Mail, ShoppingBag, ArrowRight,
  Star, Heart, Package, Tag, Gift, Zap, CheckCircle,
} from "lucide-react";
import { ApiEndpoints } from "../../../api/apis";
import { request } from "../../../api/request";
import { useAuth } from "../../../context/AuthContext";

/* ── Pinterest-style pin cards ─────────────────────────────── */
const COLS = [
  [
    { g: ["#E63946", "#A8202B"], Icon: ShoppingBag, title: "New Arrivals",  sub: "48 items",   gh: 112 },
    { g: ["#F4A261", "#C5630A"], Icon: Tag,         title: "Trending",      sub: "32 items",   gh: 88  },
    { g: ["#2B2D42", "#121318"], Icon: Package,     title: "Collections",   sub: "12 sets",    gh: 120 },
    { g: ["#7CB342", "#4A6E1A"], Icon: Star,        title: "Top Picks",     sub: "20 items",   gh: 96  },
    { g: ["#E63946", "#F4A261"], Icon: Gift,        title: "Gifting",       sub: "35 items",   gh: 104 },
  ],
  [
    { g: ["#9B6FA0", "#5E3568"], Icon: Heart,       title: "Favourites",    sub: "156 saved",  gh: 96  },
    { g: ["#E63946", "#C5303A"], Icon: Zap,         title: "Flash Sale",    sub: "18 deals",   gh: 120 },
    { g: ["#2B2D42", "#3D3F58"], Icon: Package,     title: "Accessories",   sub: "64 items",   gh: 88  },
    { g: ["#7CB342", "#A8D060"], Icon: Star,        title: "Seasonal",      sub: "27 items",   gh: 112 },
    { g: ["#F4A261", "#E63946"], Icon: Tag,         title: "On Sale",       sub: "29 items",   gh: 96  },
  ],
  [
    { g: ["#5D8B2F", "#7CB342"], Icon: Star,        title: "Seasonal",      sub: "27 items",   gh: 120 },
    { g: ["#E63946", "#C5303A"], Icon: Package,     title: "Featured",      sub: "40 items",   gh: 88  },
    { g: ["#2B2D42", "#3D3550"], Icon: Heart,       title: "Bridal",        sub: "55 items",   gh: 104 },
    { g: ["#D4722A", "#F4A261"], Icon: Tag,         title: "Offers",        sub: "29 items",   gh: 112 },
    { g: ["#9B6FA0", "#E63946"], Icon: Gift,        title: "Gifting",       sub: "35 items",   gh: 96  },
  ],
];

const PinCard = ({ g, Icon, title, sub, gh }) => (
  <div className="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-default bg-white">
    <div
      className="flex items-center justify-center"
      style={{
        height: gh,
        background: `linear-gradient(145deg, ${g[0]}, ${g[1]})`,
      }}
    >
      <Icon size={24} className="text-white/50" />
    </div>
    <div className="px-3 py-2.5">
      <p className="text-[11px] font-bold text-gray-800 truncate">{title}</p>
      <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
    </div>
  </div>
);

/* ──────────────────────────────────────────────────────────── */

const Login = () => {
  const { login }  = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [email,   setEmail]   = useState("");
  const [pwd,     setPwd]     = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/admin/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const [data, error] = await request({
        method: "POST",
        url: ApiEndpoints.AUTH.LOGIN_EMP,
        data: { email, password: pwd },
      });
      if (error || !data?.token) {
        toast.error(error?.message || "Invalid credentials");
        return;
      }
      login({
        token:       data.token,
        roleType:    data.employee?.role?.roleName || null,
        permissions: Array.isArray(data.employee?.role?.permissions)
          ? data.employee.role.permissions : [],
      });
      setEmail(""); setPwd("");
      navigate(from, { replace: true });
      toast.success("Welcome back!");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F5F5F5]">

      {/* ── LEFT: Pin board ──────────────────────────────────────── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-[#F5F5F5]">

        {/* Top gradient — for logo readability */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#F5F5F5] to-transparent z-10 pointer-events-none" />
        {/* Bottom gradient — for tagline readability */}
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#F5F5F5] via-[#F5F5F5]/85 to-transparent z-10 pointer-events-none" />

        {/* Logo — top left */}
        <div className="absolute top-7 left-8 z-20 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#E63946] rounded-lg flex items-center justify-center shadow-md shadow-[#E63946]/30">
            <ShoppingBag size={14} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 text-sm tracking-tight">AuraMart</span>
          <span className="text-[9px] px-1.5 py-0.5 bg-[#E63946]/10 text-[#E63946] rounded font-bold uppercase tracking-widest">
            Admin
          </span>
        </div>

        {/* Masonry columns */}
        <div className="absolute inset-0 flex gap-2.5 px-5 pt-5 overflow-hidden">
          {COLS.map((col, ci) => (
            <div
              key={ci}
              className="flex-1 flex flex-col gap-2.5"
              style={{ marginTop: [0, 36, 18][ci] }}
            >
              {col.map((pin, pi) => (
                <PinCard key={pi} {...pin} />
              ))}
            </div>
          ))}
        </div>

        {/* Bottom branding */}
        <div className="absolute bottom-9 left-8 right-8 z-20">
          <h2 className="text-xl font-bold text-gray-900 mb-1.5 leading-snug">
            Manage your store<br />with confidence.
          </h2>
          <p className="text-[13px] text-gray-500 mb-4">
            Products, orders, customers — all in one place.
          </p>
          <div className="space-y-1.5">
            {[
              "Real-time order tracking & analytics",
              "Manage 500+ products across collections",
              "10,000+ customers trust AuraMart",
            ].map((txt) => (
              <div key={txt} className="flex items-center gap-2">
                <CheckCircle size={12} className="text-[#7CB342] flex-shrink-0" />
                <span className="text-xs text-gray-500">{txt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Login form ─────────────────────────────────────── */}
      <div className="w-full lg:w-[440px] flex-shrink-0 flex flex-col items-center justify-center bg-white px-8 py-12 relative shadow-[-24px_0_80px_-12px_rgba(0,0,0,0.07)]">

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-28 h-28 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#FFF1F1] rounded-bl-full" />
          <div className="absolute top-0 right-0 w-14 h-14 bg-[#FECACA]/60 rounded-bl-full" />
        </div>

        <div className="relative w-full max-w-[340px]">

          {/* Mobile brand */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-[#E63946] rounded-xl flex items-center justify-center">
              <ShoppingBag size={17} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">AuraMart Admin</span>
          </div>

          {/* Desktop brand mark */}
          <div className="hidden lg:flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-[#E63946] rounded-xl flex items-center justify-center shadow-md shadow-[#E63946]/25">
              <ShoppingBag size={16} className="text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900 text-sm">AuraMart</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-[#FFF1F1] text-[#E63946] rounded font-bold uppercase tracking-widest">
                Admin
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-[1.75rem] font-bold text-gray-900 leading-tight">
              Welcome back
            </h1>
            <p className="text-sm text-gray-400 mt-1.5">
              Sign in to your admin account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                Email address
              </label>
              <div className="relative group">
                <Mail
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E63946] transition-colors duration-150"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  placeholder="admin@auramart.in"
                  className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-[#E63946] focus:bg-white transition-all"
                  style={{ boxShadow: "none" }}
                  onFocus={(e) => { e.target.style.boxShadow = "0 0 0 3px rgba(230,57,70,0.1)"; }}
                  onBlur={(e) => { e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[13px] font-semibold text-gray-700">Password</label>
                <a
                  href="/forget-password"
                  className="text-xs font-semibold text-[#E63946] hover:text-[#C5303A] transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <Lock
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E63946] transition-colors duration-150"
                />
                <input
                  type={showPwd ? "text" : "password"}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full h-11 pl-10 pr-11 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-[#E63946] focus:bg-white transition-all"
                  style={{ boxShadow: "none" }}
                  onFocus={(e) => { e.target.style.boxShadow = "0 0 0 3px rgba(230,57,70,0.1)"; }}
                  onBlur={(e) => { e.target.style.boxShadow = "none"; }}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPwd((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#E63946] hover:bg-[#C5303A] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2 mt-1"
              style={{ boxShadow: "0 4px 14px rgba(230,57,70,0.25)" }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>Sign in <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          {/* Stats */}
          <div className="mt-7 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-2">
              {[["10K+", "Customers"], ["500+", "Products"], ["99.9%", "Uptime"]].map(
                ([val, lbl]) => (
                  <div key={lbl} className="bg-[#FAF7F2] rounded-xl py-3 text-center">
                    <p className="text-sm font-bold text-gray-800">{val}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{lbl}</p>
                  </div>
                )
              )}
            </div>
          </div>

          <p className="text-center text-[11px] text-gray-300 mt-6">
            © {new Date().getFullYear()} AuraMart India. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
