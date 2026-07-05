import React from 'react';

const Footer = () => {
  return (
    <div className="app-wrapper-footer">
      <div className="app-footer">
        <div className="app-footer-inner d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>© 2025</div>
          <div className="d-none d-sm-block">
            <i className="bi bi-telephone"></i>
            <span> +8801714231625 </span>
          </div>
          <div className="d-none d-sm-block">
            <i className="fa-solid fa-envelope"></i>
            <span> support@auramart.in</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
