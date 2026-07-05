import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Tag, Package, Headphones, Tags, Palette, Ruler,
  Image, Ticket, Zap, ShoppingCart, Wand2, Users, Shield, Puzzle,
  Settings, FileText, LogOut, ChevronDown, ChevronRight, X, Menu,
  UserCheck, Warehouse, Clock, Star,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { logout } from "../../auth/authToken";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  {
    label: null,
    items: [
      { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    label: "CATALOG",
    items: [
      { to: "/admin/product/collection", icon: Tag, label: "Categories" },
      { to: "/admin/products", icon: Package, label: "Products" },
      { to: "/admin/product/accessories-type", icon: Tags, label: "Accessory Types" },
      { to: "/admin/product/accessories", icon: Headphones, label: "Accessories" },
    ],
  },
  {
    label: "VARIANTS",
    items: [
      { to: "/admin/product/color", icon: Palette, label: "Colors" },
      { to: "/admin/product/size", icon: Ruler, label: "Sizes" },
    ],
  },
  {
    label: "PROMOTIONS",
    items: [
      { to: "/admin/banner", icon: Image, label: "Banners" },
      { to: "/admin/coupon", icon: Ticket, label: "Coupons" },
      { to: "/admin/events", icon: Clock, label: "Events" },
      { to: "/admin/product/flashsales", icon: Zap, label: "Flash Sales" },
      { to: "/admin/stokiest", icon: Warehouse, label: "Stockist" },
    ],
  },
  {
    label: "ORDERS",
    items: [
      {
        label: "All Orders",
        icon: ShoppingCart,
        key: "orders",
        children: [
          { to: "/admin/all-orders", label: "All Orders" },
          { to: "/admin/orders/pending", label: "Pending" },
          { to: "/admin/orders/confirm", label: "Confirmed" },
          { to: "/admin/orders/processing", label: "Processing" },
          { to: "/admin/orders/pickup", label: "Pickup" },
          { to: "/admin/orders/on-the-way", label: "On The Way" },
          { to: "/admin/orders/delivered", label: "Delivered" },
          { to: "/admin/orders/return", label: "Returns" },
          { to: "/admin/orders/replacement", label: "Replacement" },
          { to: "/admin/orders/cancel", label: "Cancelled" },
        ],
      },
    ],
  },
  {
    label: "CUSTOMIZATION",
    items: [
      {
        label: "Customization",
        icon: Wand2,
        key: "customize",
        children: [
          { to: "/admin/product/customize", label: "Product Customization" },
          { to: "/admin/accessory/customize", label: "Accessory Customization" },
        ],
      },
    ],
  },
  {
    label: "USERS",
    items: [
      { to: "/admin/customer", icon: Users, label: "Customers" },
      { to: "/admin/employees", icon: UserCheck, label: "Employees" },
      { to: "/admin/user/permissions", icon: Shield, label: "Roles & Permissions" },
      { to: "/admin/module", icon: Puzzle, label: "Modules" },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      {
        label: "Store Settings",
        icon: Settings,
        key: "settings",
        children: [
          { to: "/admin/business/General", label: "General Settings" },
          { to: "/admin/business/Business", label: "Business Setup" },
          { to: "/admin/business/Verification", label: "Verification" },
          { to: "/admin/business/delivery-charge", label: "Delivery Charges" },
          { to: "/admin/business/color-theme", label: "Theme Colors" },
          { to: "/admin/business/social-link", label: "Social Links" },
        ],
      },
      {
        label: "Legal Pages",
        icon: FileText,
        key: "legal",
        children: [
          { to: "/admin/business/legal-privacy-policy", label: "Privacy Policy" },
          { to: "/admin/business/term-and-condition", label: "Terms & Conditions" },
          { to: "/admin/business/return-refund-policy", label: "Return & Refund" },
          { to: "/admin/business/shipping-delivery", label: "Shipping & Delivery" },
          { to: "/admin/business/about-us", label: "About Us" },
          { to: "/admin/business/legal-contact-us", label: "Contact Us" },
        ],
      },
    ],
  },
];

function NavItem({ item, collapsed }) {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;

  if (item.children) {
    const isAnyActive = item.children.some(c => window.location.pathname.startsWith(c.to));
    return (
      <div>
        <button
          onClick={() => setOpen(p => !p)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
            "text-slate-400 hover:text-white hover:bg-white/10",
            (open || isAnyActive) && "text-white bg-white/10"
          )}
        >
          <Icon size={16} className="shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left truncate">{item.label}</span>
              <ChevronDown size={13} className={cn("shrink-0 transition-transform", open && "rotate-180")} />
            </>
          )}
        </button>
        {!collapsed && open && (
          <div className="ml-7 mt-1 space-y-0.5 border-l border-white/10 pl-3">
            {item.children.map((child) => (
              <NavLink
                key={child.to}
                to={child.to}
                className={({ isActive }) =>
                  cn(
                    "block py-1.5 px-2 text-xs rounded-md transition-colors",
                    isActive
                      ? "text-[#E63946] font-semibold bg-[#E63946]/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )
                }
              >
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
          isActive
            ? "bg-[#E63946] text-white shadow-md shadow-[#E63946]/20"
            : "text-slate-400 hover:text-white hover:bg-white/10"
        )
      }
      title={collapsed ? item.label : undefined}
    >
      <Icon size={16} className="shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  );
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const navigate = useNavigate();
  const { authData } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/10 shrink-0">
        {!collapsed && (
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#E63946] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-white font-semibold text-sm">AuraMart</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/admin/dashboard" className="mx-auto">
            <div className="w-8 h-8 bg-[#E63946] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} className="rotate-90" />}
        </button>
        <button onClick={onMobileClose} className="lg:hidden text-slate-400 hover:text-white">
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll px-3 py-4 space-y-6">
        {NAV.map((section, si) => (
          <div key={si}>
            {section.label && !collapsed && (
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">
                {section.label}
              </p>
            )}
            {section.label && collapsed && <div className="border-t border-white/10 my-2" />}
            <div className="space-y-0.5">
              {section.items.map((item, ii) => (
                <NavItem key={item.to || item.key || ii} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg bg-white/5">
            <div className="w-8 h-8 bg-[#E63946] rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">
                {(authData?.roleType || "A")[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">Admin</p>
              <p className="text-[10px] text-slate-400 truncate">{authData?.roleType || "SuperAdmin"}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={15} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-[#2B2D42] border-r border-white/5 transition-all duration-300 shrink-0",
          collapsed ? "w-16" : "w-60"
        )}
        style={{ height: "100vh", position: "sticky", top: 0 }}
      >
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={onMobileClose} />
          <aside className="relative w-64 bg-[#2B2D42] flex flex-col h-full">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
