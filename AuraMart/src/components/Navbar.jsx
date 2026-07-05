import { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Search, ShoppingCart, Heart, User, Menu, X,
  ChevronDown, Package, MapPin, LogOut, ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ApiUrl } from '../utils/api.js';
import { productPrice, normalizeProduct } from '../utils/price.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { toastInfo } from '../utils/toast.js';
import SignIn from './signInModel/SignIn.jsx';
import Register from './signInModel/Register.jsx';
import OtpModal from './signInModel/OtpModal.jsx';
import CollectionsDropdown from './collection/CollectionsDropdown.jsx';
import AccessoriesDropdown from './accessories/AccessoriesDropdown.jsx';

const navLinks = [
  { label: 'Home',        to: '/' },
  { label: 'Collections', to: '/collections', dropdown: 'collections' },
  { label: 'Accessories', to: '/accessories', dropdown: 'accessories' },
  { label: 'Events',      to: '/events' },
  { label: 'Stockist',    to: '/stockist' },
  { label: 'Track Order', to: '/track-orders' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { cartCount, openCart } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const { wishlistCount } = useWishlist();

  const handleLogout = () => { logout(); toastInfo('Logged out successfully. See you soon!'); };

  const [scrolled,       setScrolled]       = useState(false);
  const [mobileOpen,     setMobileOpen]      = useState(false);
  const [showSignIn,     setShowSignIn]      = useState(false);
  const [showRegister,   setShowRegister]    = useState(false);
  const [showOtp,        setShowOtp]         = useState(false);
  const [showUserMenu,   setShowUserMenu]    = useState(false);
  const [activeDropdown, setActiveDropdown]  = useState(null);
  const [searchOpen,     setSearchOpen]      = useState(false);
  const [searchQuery,    setSearchQuery]     = useState('');
  const [searchResults,  setSearchResults]   = useState([]);
  const [searching,      setSearching]       = useState(false);

  const userMenuRef    = useRef(null);
  const searchInputRef = useRef(null);
  const searchTimer    = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 80);
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setSearchOpen(false); setMobileOpen(false); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onClickOut = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', onClickOut);
    return () => document.removeEventListener('mousedown', onClickOut);
  }, []);

  const doSearch = useCallback((q) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await axios.get(`${ApiUrl.getAllProducts}?search=${encodeURIComponent(q)}&limit=8`);
        setSearchResults(res.data?.data ? res.data.data.map(normalizeProduct) : []);
      } catch { setSearchResults([]); }
      finally  { setSearching(false); }
    }, 350);
  }, []);

  const closeSearch = () => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); };

  return (
    <>
      {/* ── Announcement Bar ──────────────────────────────────────── */}
      <div className="bg-[#2B2D42] text-white text-xs text-center py-2 px-4">
        <div className="flex items-center justify-center gap-5 flex-wrap">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-[#F4A261]">✦</span> Free Delivery Across India
          </span>
          <span className="text-white/25 hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-[#F4A261]">✦</span> Cash on Delivery Available
          </span>
          <span className="text-white/25 hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-[#F4A261]">✦</span> Easy Returns &amp; Exchange
          </span>
        </div>
      </div>

      {/* ── Main Header ───────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-200 ${
          scrolled ? 'shadow-[0_4px_24px_rgba(0,0,0,0.08)]' : 'border-b border-[#EAEAEA]'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-8">

          {/* ── Top row: logo + search + icons ──────────────────── */}
          <div className="h-16 flex items-center gap-4">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E63946] flex items-center justify-center flex-shrink-0">
                <Heart size={15} className="fill-white text-white" />
              </div>
              <span className="font-bold text-[#2B2D42] text-base sm:text-lg tracking-tight leading-none">
                AuraMart
              </span>
            </Link>

            {/* Search trigger (desktop) */}
            <div className="flex-1 max-w-xl hidden sm:block">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full h-10 flex items-center gap-2.5 bg-[#FAF7F2] hover:bg-[#F0ECE6] rounded-full px-4 text-[#6B7280] text-sm transition-colors border border-[#EAEAEA] hover:border-[#d5c9bc]"
              >
                <Search size={15} className="text-[#E63946] flex-shrink-0" />
                <span className="truncate">Search dresses, accessories&hellip;</span>
              </button>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-0.5 sm:gap-1 ml-auto flex-shrink-0">

              {/* Search (mobile) */}
              <button
                onClick={() => setSearchOpen(true)}
                className="sm:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#FAF7F2] text-[#2B2D42] transition-colors"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => navigate('/whislist')}
                className="hidden sm:flex w-9 h-9 sm:h-auto sm:w-auto items-center gap-1.5 px-2 sm:px-3 py-2 rounded-full hover:bg-[#FAF7F2] text-[#2B2D42] transition-colors text-sm font-medium relative"
              >
                <span className="relative">
                  <Heart size={18} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-[#E63946] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                      {wishlistCount > 99 ? '99+' : wishlistCount}
                    </span>
                  )}
                </span>
                <span className="hidden md:block">Wishlist</span>
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-full hover:bg-[#FAF7F2] text-[#2B2D42] transition-colors text-sm font-medium"
              >
                <div className="relative">
                  <ShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-0.5 bg-[#E63946] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:block">Cart</span>
              </button>

              {/* User */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => isLoggedIn ? setShowUserMenu(v => !v) : setShowSignIn(true)}
                  className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-full hover:bg-[#FAF7F2] text-[#2B2D42] transition-colors text-sm font-medium"
                >
                  {isLoggedIn && user?.name ? (
                    <span className="w-7 h-7 rounded-full bg-[#E63946] text-white text-xs font-bold flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <User size={18} />
                  )}
                  <span className="hidden sm:block">{isLoggedIn ? (user?.name?.split(' ')[0] || 'Account') : 'Login'}</span>
                  {isLoggedIn && <ChevronDown size={12} />}
                </button>

                <AnimatePresence>
                  {isLoggedIn && showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-54 bg-white rounded-2xl shadow-2xl border border-[#EAEAEA] py-2 z-50 overflow-hidden"
                      style={{ width: '220px' }}
                    >
                      <div className="px-4 py-3 border-b border-[#EAEAEA] bg-[#FAF7F2]">
                        <div className="w-10 h-10 rounded-full bg-[#E63946] text-white font-bold text-sm flex items-center justify-center mb-2">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <p className="text-sm font-semibold text-[#2B2D42] truncate">{user?.name || 'My Account'}</p>
                        <p className="text-xs text-[#6B7280] truncate">{user?.email || ''}</p>
                      </div>
                      {[
                        { icon: <User size={14} />,    label: 'My Profile',   to: '/account' },
                        { icon: <Package size={14} />, label: 'My Orders',    to: '/account' },
                        { icon: <Heart size={14} />,   label: 'Wishlist',     to: '/whislist' },
                        { icon: <MapPin size={14} />,  label: 'Track Order',  to: '/track-orders' },
                      ].map((item) => (
                        <Link
                          key={item.label}
                          to={item.to}
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#2B2D42] hover:bg-[#FFF1F1] hover:text-[#E63946] transition-colors"
                        >
                          <span className="text-[#6B7280]">{item.icon}</span> {item.label}
                        </Link>
                      ))}
                      <div className="border-t border-[#EAEAEA] mt-1" />
                      <button
                        onClick={() => { handleLogout(); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile hamburger */}
              <button
                className="flex sm:hidden w-9 h-9 items-center justify-center rounded-full hover:bg-[#FAF7F2] text-[#2B2D42]"
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* ── Secondary Nav ─────────────────────────────────────── */}
          <div className="hidden sm:block border-t border-[#EAEAEA]">
            <ul className="flex items-center gap-0 text-sm">
              {navLinks.map((link) => (
                <li
                  key={link.to}
                  className="popup-trigger"
                  onMouseEnter={() => link.dropdown && setActiveDropdown(link.dropdown)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center gap-1 h-10 px-4 font-medium transition-colors relative whitespace-nowrap text-sm
                      ${isActive
                        ? 'text-[#E63946] after:absolute after:bottom-0 after:inset-x-2 after:h-0.5 after:bg-[#E63946] after:rounded-full'
                        : 'text-[#6B7280] hover:text-[#2B2D42]'
                      }`
                    }
                  >
                    {link.label}
                    {link.dropdown && <ChevronDown size={11} />}
                  </NavLink>
                  <AnimatePresence>
                    {link.dropdown === 'collections' && activeDropdown === 'collections' && (
                      <div className="popup-dropdown-wrapper">
                        <CollectionsDropdown />
                      </div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {link.dropdown === 'accessories' && activeDropdown === 'accessories' && (
                      <div className="popup-dropdown-wrapper">
                        <AccessoriesDropdown />
                      </div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ─────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-[201] overflow-y-auto shadow-2xl"
            >
              {/* Drawer header */}
              <div className="px-5 py-5 flex items-center justify-between border-b border-[#EAEAEA]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#E63946] flex items-center justify-center">
                    <Heart size={13} className="fill-white text-white" />
                  </div>
                  <span className="font-bold text-[#2B2D42] text-base">AuraMart</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="text-[#6B7280] hover:text-[#2B2D42]">
                  <X size={20} />
                </button>
              </div>

              {/* User info */}
              {isLoggedIn ? (
                <div className="px-5 py-4 bg-[#FAF7F2] border-b border-[#EAEAEA]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E63946] text-white font-bold flex items-center justify-center">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-[#2B2D42] text-sm">{user?.name || 'Hello!'}</p>
                      <p className="text-xs text-[#6B7280]">{user?.email || ''}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-5 py-4 bg-[#FAF7F2] border-b border-[#EAEAEA]">
                  <p className="text-sm text-[#2B2D42] font-semibold mb-3">Welcome! 👋</p>
                  <button
                    onClick={() => { setMobileOpen(false); setShowSignIn(true); }}
                    className="w-full py-2.5 bg-[#E63946] text-white font-semibold text-sm rounded-xl transition-colors hover:bg-[#C5303A]"
                  >
                    Login / Sign Up
                  </button>
                </div>
              )}

              {/* Nav links */}
              <nav className="py-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-5 py-3 text-sm font-medium transition-colors
                      ${isActive ? 'text-[#E63946] bg-[#FFF1F1]' : 'text-[#2B2D42] hover:bg-[#FAF7F2]'}`
                    }
                  >
                    {link.label}
                    <ChevronRight size={14} className="text-[#6B7280]" />
                  </NavLink>
                ))}
                <div className="border-t border-[#EAEAEA] my-2" />
                <NavLink
                  to="/whislist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 text-sm text-[#2B2D42] hover:bg-[#FAF7F2]"
                >
                  <Heart size={16} className="text-[#6B7280]" /> Wishlist
                </NavLink>
                {isLoggedIn && (
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-500 hover:bg-red-50"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Search Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-start justify-center pt-20 px-4"
            onClick={closeSearch}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[#EAEAEA]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[#EAEAEA]">
                <Search size={16} className="text-[#E63946] flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search dresses, accessories…"
                  value={searchQuery}
                  onChange={(e) => doSearch(e.target.value)}
                  className="flex-1 outline-none text-sm text-[#2B2D42] placeholder-[#6B7280] bg-transparent"
                />
                <button onClick={closeSearch} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#FAF7F2] text-[#6B7280]">
                  <X size={14} />
                </button>
              </div>

              <div className="max-h-[65vh] overflow-y-auto">
                {searching && (
                  <div className="flex items-center justify-center gap-2 py-10 text-[#E63946]">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span className="text-sm text-[#6B7280]">Searching…</span>
                  </div>
                )}

                {!searching && searchQuery && searchResults.length === 0 && (
                  <div className="text-center py-12 px-4">
                    <div className="text-4xl mb-3">🔍</div>
                    <p className="text-[#2B2D42] font-semibold">No results for &ldquo;{searchQuery}&rdquo;</p>
                    <p className="text-sm text-[#6B7280] mt-1">Try different keywords</p>
                  </div>
                )}

                {!searching && searchResults.length > 0 && (
                  <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {searchResults.map((product, idx) => (
                      <Link
                        key={product._id || idx}
                        to={`/product/${product._id}`}
                        onClick={closeSearch}
                        className="group rounded-xl overflow-hidden border border-[#EAEAEA] hover:border-[#E63946]/30 hover:shadow-lg transition-all bg-white"
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-[#FAF7F2]">
                          <img
                            src={product.image || '/images/col8.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { e.target.src = '/images/col8.jpg'; }}
                          />
                        </div>
                        <div className="p-2.5">
                          <p className="text-xs font-semibold text-[#2B2D42] truncate">{product.name}</p>
                          <p className="text-xs text-[#E63946] font-bold mt-0.5">{productPrice(product)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {!searching && !searchQuery && (
                  <div className="px-5 py-6">
                    <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-3">Popular searches</p>
                    <div className="flex flex-wrap gap-2">
                      {['Flower Girl', 'Bridesmaid', 'Communion', 'Party Dress', 'Accessories'].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => doSearch(tag)}
                          className="px-4 py-1.5 text-sm border border-[#EAEAEA] text-[#2B2D42] rounded-full hover:bg-[#FFF1F1] hover:text-[#E63946] hover:border-[#E63946]/30 transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth modals */}
      {!isLoggedIn && showSignIn && (
        <SignIn
          onClose={() => setShowSignIn(false)}
          onSwitchToRegister={() => { setShowSignIn(false); setShowRegister(true); }}
        />
      )}
      {!isLoggedIn && showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onSwitchToSignIn={() => { setShowRegister(false); setShowSignIn(true); }}
          onVerifyEmail={() => { setShowRegister(false); setShowOtp(true); }}
        />
      )}
      {showOtp && <OtpModal onClose={() => setShowOtp(false)} />}
    </>
  );
}
