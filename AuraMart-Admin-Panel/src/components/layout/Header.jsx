import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, Bell, Settings, KeyRound, LogOut, ChevronDown, Search } from "lucide-react";
import { cn, getInitials } from "../../lib/utils";
import { logout } from "../../auth/authToken";
import { useAuth } from "../../context/AuthContext";
import { request } from "../../api/request";
import { ApiEndpoints } from "../../api/apis";

const BREADCRUMB_MAP = {
  "/admin/dashboard": [{ label: "Dashboard" }],
  "/admin/product/collection": [{ label: "Catalog" }, { label: "Categories" }],
  "/admin/product/collection/create": [{ label: "Catalog" }, { label: "Categories", href: "/admin/product/collection" }, { label: "Create" }],
  "/admin/products": [{ label: "Catalog" }, { label: "Products" }],
  "/admin/product/create": [{ label: "Catalog" }, { label: "Products", href: "/admin/products" }, { label: "Create" }],
  "/admin/banner": [{ label: "Promotions" }, { label: "Banners" }],
  "/admin/coupon": [{ label: "Promotions" }, { label: "Coupons" }],
  "/admin/product/flashsales": [{ label: "Promotions" }, { label: "Flash Sales" }],
  "/admin/all-orders": [{ label: "Orders" }, { label: "All Orders" }],
  "/admin/customer": [{ label: "Users" }, { label: "Customers" }],
  "/admin/employees": [{ label: "Users" }, { label: "Employees" }],
  "/admin/product/color": [{ label: "Variants" }, { label: "Colors" }],
  "/admin/product/size": [{ label: "Variants" }, { label: "Sizes" }],
};

export function Header({ onMenuToggle }) {
  const { authData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const dropdownRef = useRef(null);

  const crumbs = BREADCRUMB_MAP[location.pathname] || [];

  useEffect(() => {
    const fetchProfile = async () => {
      const [data, error] = await request({ method: "GET", url: ApiEndpoints.AUTH.GET_ADMIN_PROFILE });
      if (!error && data?.data) {
        const { firstName, lastName } = data.data;
        setAdminName(`${firstName || ""} ${lastName || ""}`.trim() || "Admin");
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const close = (e) => { if (!dropdownRef.current?.contains(e.target)) setProfileOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#EAEAEA] h-14 flex items-center px-4 gap-4 shrink-0 shadow-sm">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <Menu size={18} />
      </button>

      {/* Breadcrumb */}
      <div className="hidden sm:flex items-center gap-1.5 text-sm text-gray-400 flex-1 min-w-0">
        {crumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-gray-300">/</span>}
            {crumb.href ? (
              <Link to={crumb.href} className="hover:text-gray-600 transition-colors truncate">
                {crumb.label}
              </Link>
            ) : (
              <span className={cn("truncate", i === crumbs.length - 1 && "text-gray-700 font-medium")}>
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        ))}
        {crumbs.length === 0 && (
          <span className="text-gray-400 text-xs">AuraMart Admin</span>
        )}
      </div>

      <div className="flex-1 sm:flex-none" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Bell */}
        <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell size={17} />
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen(p => !p)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-7 h-7 bg-[#E63946] rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">{getInitials(adminName) || "A"}</span>
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">{adminName}</span>
            <ChevronDown size={14} className={cn("text-gray-400 transition-transform", profileOpen && "rotate-180")} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-gray-200 shadow-lg py-1.5 z-50">
              <div className="px-3 py-2 border-b border-gray-100 mb-1">
                <p className="text-xs font-semibold text-gray-900 truncate">{adminName}</p>
                <p className="text-xs text-gray-400">{authData?.roleType || "SuperAdmin"}</p>
              </div>
              <Link
                to="/admin/general-setting"
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                onClick={() => setProfileOpen(false)}
              >
                <Settings size={14} />
                Settings
              </Link>
              <Link
                to="/admin/profile/change-password"
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                onClick={() => setProfileOpen(false)}
              >
                <KeyRound size={14} />
                Change Password
              </Link>
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
