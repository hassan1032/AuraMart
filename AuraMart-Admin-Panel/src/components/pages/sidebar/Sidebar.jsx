import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logout from '../header/Logout';
import { logout } from '../../../auth/authToken';
import { useAuth } from '../../../context/AuthContext';
import { allRoutePaths, customizeRoute, useParentActive } from '../../../hooks/useParentActive';

const Sidebar = () => {
  const { hasPermission } = useAuth();
  const { isParentActive } = useParentActive();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleMenu = (menu) => {
    setActiveMenu(prev => (prev === menu ? null : menu));
  };

  const toggleFullScreen = () => {
    const elem = document.body;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCancel = () => setShowLogoutModal(false);

  useEffect(() => {
    if (isParentActive(allRoutePaths)) {
      setActiveMenu("ordersMenu");
    } else if (isParentActive(customizeRoute)) {
      setActiveMenu("customizemenu");
    } else {
      setActiveMenu("");
    }
  }, [location.pathname]);

  return (
    <>
      <div className='app-sidebar'>
        <div className="scrollbar-sidebar">
          <div className="branding-logo">
            <NavLink to="/">
              <img
                src="https://www.nickimacfarlane.com/wp-content/themes/nickimacfarlane-2014/images/logo.png"
                alt="logo"
                loading="lazy"
              />
            </NavLink>
          </div>

          <div className="app-sidebar-inner">
            <ul className="vertical-nav-menu metismenu">

              {/* ── Dashboard ───────────────────────────────────── */}
              <li>
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) => isActive ? "menu active" : "menu"}
                >
                  <span>
                    <i className="fa-solid fa-house menu-icon"></i>
                    Dashboard
                  </span>
                </NavLink>
              </li>

              {/* ── CATALOG ─────────────────────────────────────── */}
              <li className="menu-divider">
                <span className="menu-title">CATALOG</span>
              </li>

              {hasPermission("Collection") && (
                <li>
                  <NavLink className="menu" to="/admin/product/collection">
                    <span>
                      <i className="fa-solid fa-layer-group menu-icon"></i>
                      Categories
                    </span>
                  </NavLink>
                </li>
              )}

              {hasPermission("products") && (
                <li>
                  <NavLink className="menu" to="/admin/products">
                    <span>
                      <i className="fa-brands fa-codepen menu-icon"></i>
                      Products
                    </span>
                  </NavLink>
                </li>
              )}

              {hasPermission("Accessory type") && (
                <li>
                  <NavLink className="menu" to="/admin/product/accessories-type">
                    <span>
                      <i className="fa-solid fa-tags menu-icon"></i>
                      Accessory Types
                    </span>
                  </NavLink>
                </li>
              )}

              {hasPermission("Accessories") && (
                <li>
                  <NavLink className="menu" to="/admin/product/accessories">
                    <span>
                      <i className="fa-solid fa-headphones menu-icon"></i>
                      Accessories
                    </span>
                  </NavLink>
                </li>
              )}

              {/* ── PRODUCT VARIANTS ────────────────────────────── */}
              {hasPermission('Color' || 'Size') && (
                <li className="menu-divider">
                  <span className="menu-title">VARIANTS</span>
                </li>
              )}

              {hasPermission("Color") && (
                <li>
                  <NavLink className="menu" to="/admin/product/color">
                    <span>
                      <i className="fa-solid fa-palette menu-icon"></i>
                      Colors
                    </span>
                  </NavLink>
                </li>
              )}

              {hasPermission("Size") && (
                <li>
                  <NavLink className="menu" to="/admin/product/size">
                    <span>
                      <i className="fa-solid fa-list-ol menu-icon"></i>
                      Sizes
                    </span>
                  </NavLink>
                </li>
              )}

              {/* ── PROMOTIONS ───────────────────────────────────── */}
              {hasPermission("Banner" || "Coupon" || "Events" || "Stokiest") && (
                <li className="menu-divider">
                  <span className="menu-title">PROMOTIONS</span>
                </li>
              )}

              {hasPermission("banner") && (
                <li>
                  <NavLink className="menu" to="/admin/banner">
                    <span>
                      <i className="fa-solid fa-image menu-icon"></i>
                      Banners
                    </span>
                  </NavLink>
                </li>
              )}

              {hasPermission("coupon") && (
                <li>
                  <NavLink className="menu" to="/admin/coupon">
                    <span>
                      <i className="fa-solid fa-ticket menu-icon"></i>
                      Coupons
                    </span>
                  </NavLink>
                </li>
              )}

              {hasPermission("events") && (
                <li>
                  <NavLink className="menu" to="/admin/events">
                    <span>
                      <i className="fa-solid fa-clock menu-icon"></i>
                      Events
                    </span>
                  </NavLink>
                </li>
              )}

              <li>
                <NavLink className="menu" to="/admin/product/flashsales">
                  <span>
                    <i className="fa-solid fa-bolt menu-icon"></i>
                    Flash Sales
                  </span>
                </NavLink>
              </li>

              {hasPermission("stokiest") && (
                <li>
                  <NavLink className="menu" to="/admin/stokiest">
                    <span>
                      <i className="fa-solid fa-warehouse menu-icon"></i>
                      Stockist
                    </span>
                  </NavLink>
                </li>
              )}

              {/* ── ORDERS ──────────────────────────────────────── */}
              <li className="menu-divider">
                <span className="menu-title">ORDER MANAGEMENT</span>
              </li>

              <li>
                <Link
                  className={`menu ${activeMenu === "ordersMenu" ? "active" : ""}`}
                  onClick={() => toggleMenu('ordersMenu')}
                >
                  <span>
                    <i className="fa-solid fa-cart-shopping menu-icon"></i>
                    All Orders
                  </span>
                  <img
                    src="/down_arrow.png"
                    alt="arrow"
                    className={`downIcon ${activeMenu === "ordersMenu" ? "rotate" : ""}`}
                  />
                </Link>

                {activeMenu === 'ordersMenu' && (
                  <div className="dropdownMenuCollapse">
                    <div className="listBar">
                      <NavLink to="/admin/all-orders" className={({ isActive }) => `subMenu hasCount ${isActive ? "active" : ""}`}>All</NavLink>
                      <NavLink to="/admin/orders/pending" className={({ isActive }) => `subMenu hasCount ${isActive ? "active" : ""}`}>Pending</NavLink>
                      <NavLink to="/admin/orders/confirm" className={({ isActive }) => `subMenu hasCount ${isActive ? "active" : ""}`}>Confirmed</NavLink>
                      <NavLink to="/admin/orders/processing" className={({ isActive }) => `subMenu hasCount ${isActive ? "active" : ""}`}>Processing</NavLink>
                      <NavLink to="/admin/orders/pickup" className={({ isActive }) => `subMenu hasCount ${isActive ? "active" : ""}`}>Pickup</NavLink>
                      <NavLink to="/admin/orders/on-the-way" className={({ isActive }) => `subMenu hasCount ${isActive ? "active" : ""}`}>On The Way</NavLink>
                      <NavLink to="/admin/orders/delivered" className={({ isActive }) => `subMenu hasCount ${isActive ? "active" : ""}`}>Delivered</NavLink>
                      <NavLink to="/admin/orders/return" className={({ isActive }) => `subMenu hasCount ${isActive ? "active" : ""}`}>Returns</NavLink>
                      <NavLink to="/admin/orders/replacement" className={({ isActive }) => `subMenu hasCount ${isActive ? "active" : ""}`}>Replacement</NavLink>
                      <NavLink to="/admin/orders/cancel" className={({ isActive }) => `subMenu hasCount ${isActive ? "active" : ""}`}>Cancelled</NavLink>
                    </div>
                  </div>
                )}
              </li>

              {/* ── CUSTOMIZATION ────────────────────────────────── */}
              <li className="menu-divider">
                <span className="menu-title">CUSTOMIZATION</span>
              </li>

              <li>
                <Link
                  className={`menu ${activeMenu === "customizemenu" ? "active" : ""}`}
                  onClick={() => toggleMenu('customizemenu')}
                >
                  <span>
                    <i className="fa-solid fa-magic-wand-sparkles menu-icon"></i>
                    Customization
                  </span>
                  <img
                    src="/down_arrow.png"
                    alt="arrow"
                    className={`downIcon ${activeMenu === 'customizemenu' ? 'rotate' : ""}`}
                  />
                </Link>
                {activeMenu === 'customizemenu' && (
                  <div className="dropdownMenuCollapse">
                    <div className="listBar">
                      <NavLink to="/admin/product/customize" className={({ isActive }) => `subMenu ${isActive ? "active" : ""}`}>Product Customization</NavLink>
                      <NavLink to="/admin/accessory/customize" className={({ isActive }) => `subMenu ${isActive ? 'active' : ''}`}>Accessory Customization</NavLink>
                    </div>
                  </div>
                )}
              </li>

              {/* ── USERS ───────────────────────────────────────── */}
              {hasPermission('Employees' || 'Role & Permissions' || 'Module') && (
                <li className="menu-divider">
                  <span className="menu-title">USER MANAGEMENT</span>
                </li>
              )}

              <li>
                <NavLink className="menu" to="/admin/customer">
                  <span>
                    <i className="fa-solid fa-users menu-icon"></i>
                    Customers
                  </span>
                </NavLink>
              </li>

              {hasPermission("employees") && (
                <li>
                  <NavLink className="menu" to="/admin/employees">
                    <span>
                      <i className="fa-solid fa-users-gear menu-icon"></i>
                      Employees
                    </span>
                  </NavLink>
                </li>
              )}

              {hasPermission("role & permissions") && (
                <li>
                  <NavLink className="menu" to="/admin/user/permissions">
                    <span>
                      <i className="fa-solid fa-key menu-icon"></i>
                      Roles & Permissions
                    </span>
                  </NavLink>
                </li>
              )}

              <li>
                <NavLink className="menu" to="/admin/module">
                  <span>
                    <i className="fa-solid fa-puzzle-piece menu-icon"></i>
                    Modules
                  </span>
                </NavLink>
              </li>

              {/* ── BUSINESS ────────────────────────────────────── */}
              <li className="menu-divider">
                <span className="menu-title">BUSINESS SETTINGS</span>
              </li>

              <li>
                <a className="menu" onClick={() => toggleMenu('settingsMenu')}>
                  <span>
                    <i className="bi bi-gear-fill menu-icon"></i>
                    Store Settings
                  </span>
                  <img src="/down_arrow.png" alt="" className="downIcon" />
                </a>
                {activeMenu === 'settingsMenu' && (
                  <div className="dropdownMenuCollapse">
                    <div className="listBar">
                      <NavLink to="/admin/business/General" className="subMenu">General Settings</NavLink>
                      <NavLink to="/admin/business/Business" className="subMenu">Business Setup</NavLink>
                      <NavLink to="/admin/business/Verification" className="subMenu">Verification</NavLink>
                      <NavLink to="/admin/business/delivery-charge" className="subMenu">Delivery Charges</NavLink>
                      <NavLink to="/admin/business/color-theme" className="subMenu">Theme Colors</NavLink>
                      <NavLink to="/admin/business/social-link" className="subMenu">Social Links</NavLink>
                    </div>
                  </div>
                )}
              </li>

              <li>
                <a className="menu" onClick={() => toggleMenu('legalPagesMenu')}>
                  <span>
                    <i className="fa-solid fa-bookmark menu-icon"></i>
                    Legal Pages
                  </span>
                  <img src="/down_arrow.png" alt="" className="downIcon" />
                </a>
                {activeMenu === 'legalPagesMenu' && (
                  <div className="dropdownMenuCollapse">
                    <div className="listBar">
                      <NavLink to="/admin/business/legal-privacy-policy" className="subMenu">Privacy Policy</NavLink>
                      <NavLink to="/admin/business/term-and-condition" className="subMenu">Terms & Conditions</NavLink>
                      <NavLink to="/admin/business/return-refund-policy" className="subMenu">Return & Refund Policy</NavLink>
                      <NavLink to="/admin/business/shipping-delivery" className="subMenu">Shipping & Delivery</NavLink>
                      <NavLink to="/admin/business/about-us" className="subMenu">About Us</NavLink>
                      <NavLink to="/admin/business/legal-contact-us" className="subMenu">Contact Us</NavLink>
                    </div>
                  </div>
                )}
              </li>

            </ul>
          </div>

          <div className="sideBarfooter">
            <button type="button" className="fullbtn hite-icon" onClick={toggleFullScreen} title="Full Screen">
              <i className="fa-solid fa-expand"></i>
            </button>
            <NavLink to="/admin/general-setting" className="fullbtn hite-icon" title="Settings">
              <i className="fa-solid fa-cog"></i>
            </NavLink>
            <NavLink to="/admin/profile" className="fullbtn hite-icon" title="Profile">
              <i className="fa-solid fa-user"></i>
            </NavLink>
            <button
              className="fullbtn hite-icon logout"
              title="Logout"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowLogoutModal(true);
              }}
            >
              <i className="fa-solid fa-power-off"></i>
            </button>
          </div>
        </div>
      </div>

      {showLogoutModal && (
        <Logout onLogout={handleLogout} onCancel={handleCancel} />
      )}
    </>
  );
};

export default Sidebar;
