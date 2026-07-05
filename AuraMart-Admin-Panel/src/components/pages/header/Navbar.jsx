import React, { useState } from 'react';

const Navbar = () => {


  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <>
      {/* Floating Hamburger */}
      <div
        className="fixed top-4 left-4 z-[1000]"
        style={{
          position: 'fixed',
          top: '1rem',
          left: isSidebarOpen ? '17rem' : '1rem',
          zIndex: 1000,
          transition: 'left 0.3s ease'
        }}
      >
        <button
          type="button"
          className="hamburger hamburger--elastic"
          onClick={toggleSidebar}
        >
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </button>
      </div>

      {/* Main App Container */}
      <div
        className={`app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar ${isSidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        style={{
          transition: 'margin-left 0.3s ease'
        }}
      >
        {/* Header */}
        <div className="app-header header-shadow">
          {/* You can optionally remove the other hamburger buttons below to avoid duplicate toggles */}
        </div>

        {/* Sidebar */}
        <div className={`app-main ${isSidebarOpen ? 'sidebar-open' : 'closed-sidebar'}`}>
          <div className="app-sidebar">
            {/* Your full sidebar content remains unchanged */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
