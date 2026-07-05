import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logout from './Logout';
import { logout } from '../../../auth/authToken';
import { request } from '../../../api/request';
import { ApiEndpoints } from '../../../api/apis';
import { useAuth } from '../../../context/AuthContext';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
    const { authData } = useAuth();
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [adminName, setAdminName] = useState('Admin');

    const handleLogout = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowLogoutModal(true);
        logout();
    };

    const handleCancel = () => setShowLogoutModal(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const [data, error] = await request({
                method: "GET",
                url: ApiEndpoints.AUTH.GET_ADMIN_PROFILE,
            });
            if (!error && data?.data) {
                const { firstName, lastName } = data.data;
                setAdminName(`${firstName || ''} ${lastName || ''}`.trim() || 'Admin');
            }
        };
        fetchProfile();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const close = (e) => {
            if (!e.target.closest('.user-profile-box')) setShowProfileDropdown(false);
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    return (
        <>
            <div className="app-header header-shadow">
                <div className="app-header-logo"></div>

                <div className="app-header-mobile-menu">
                    <div>
                        <button
                            type="button"
                            className={`hamburger hamburger--elastic mobile-toggle-nav ${isSidebarOpen ? 'is-active' : ''}`}
                            onClick={toggleSidebar}
                            data-class="closed-sidebar"
                        >
                            <span className="hamburger-box">
                                <span className="hamburger-inner"></span>
                            </span>
                        </button>
                    </div>
                </div>

                <div className="app-header-menu">
                    <span>
                        <button type="button" className="w-8 h-8 rounded-lg bg-[#E63946] text-white flex items-center justify-center mobile-toggle-header-nav">
                            <span className="text-sm font-bold">···</span>
                        </button>
                    </span>
                </div>

                <div className="app-header-content">
                    <div className="app-header-left">
                        <div className="header-pane">
                            <button
                                type="button"
                                className={`hamburger close-sidebar-btn hamburger--elastic ${isSidebarOpen ? 'is-active' : ''}`}
                                onClick={toggleSidebar}
                                data-class="closed-sidebar"
                            >
                                <span className="hamburger-box">
                                    <span className="hamburger-inner"></span>
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="app-header-right">
                        {/* Notification Bell */}
                        <div className="badgeButtonBox me-2 position-relative">
                            <button type="button" className="emailBadge position-relative" title="Notifications">
                                <i className="fa-solid fa-bell noti"></i>
                            </button>
                        </div>

                        {/* Admin Dropdown */}
                        <div
                            className="user-profile-box dropdown ml-3"
                            onClick={() => setShowProfileDropdown(prev => !prev)}
                        >
                            <div className="nav-profile-box">
                                <div className="profile-image d-flex align-items-center justify-content-center"
                                    style={{
                                        width: 38, height: 38,
                                        background: 'var(--primary, #9a7b4f)',
                                        borderRadius: '50%',
                                        color: '#fff',
                                        fontSize: 16,
                                        flexShrink: 0,
                                    }}
                                >
                                    <i className="fa-solid fa-user"></i>
                                </div>
                                <div className="profile-content ms-2">
                                    <span style={{ fontWeight: 500 }}>{adminName}</span>
                                    <i className="fa-solid fa-angle-down dropIcon ms-1"></i>
                                </div>
                            </div>

                            {showProfileDropdown && (
                                <div className="dropdown-menu profile-item show">
                                    <Link to="/admin/general-setting" className="dropdown-item">
                                        <i className="fa fa-cog me-2"></i> Settings
                                    </Link>
                                    <Link to="/admin/profile/change-password" className="dropdown-item">
                                        <i className="fa-solid fa-key me-2"></i> Change Password
                                    </Link>
                                    <div className="dropdown-divider"></div>
                                    <button
                                        className="dropdown-item text-danger"
                                        onClick={() => setShowLogoutModal(true)}
                                    >
                                        <i className="fa-solid fa-right-from-bracket me-2"></i> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showLogoutModal && (
                <Logout onLogout={handleLogout} onCancel={handleCancel} />
            )}
        </>
    );
};

export default Header;
