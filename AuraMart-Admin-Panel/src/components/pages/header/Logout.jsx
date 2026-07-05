import React from 'react';
import { Link } from 'react-router-dom';

const Logout = ({ onLogout, onCancel }) => {
    return (
        <div className="app-main-inner">
            <div className="jvectormap-tip" aria-hidden="true"></div>
            <div className="swal2-container swal2-center swal2-backdrop-show" style={{ overflowY: 'auto' }}>
                <div
                    aria-labelledby="swal2-title"
                    aria-describedby="swal2-html-container"
                    className="swal2-popup swal2-modal swal2-icon-warning swal2-show"
                    tabIndex="-1"
                    role="dialog"
                    aria-live="assertive"
                    aria-modal="true"
                    style={{ display: 'grid' }}
                >
                    <button type="button" className="swal2-close" aria-label="Close this dialog" style={{ display: 'none' }}>×</button>
                    <div className="swal2-icon swal2-warning swal2-icon-show" style={{ display: 'flex' }}>
                        <div className="swal2-icon-content">!</div>
                    </div>
                    <h2 className="swal2-title" id="swal2-title" style={{ display: 'block' }}>Are you sure?</h2>
                    <div className="swal2-html-container" id="swal2-html-container" style={{ display: 'block' }}>
                        Are you sure you want to log out?
                    </div>
                    <div className="swal2-actions" style={{ display: 'flex' }}>

                        <button
                            type="button"
                            className="swal2-confirm swal2-styled"
                            aria-label=""
                            style={{ backgroundColor: 'rgb(34, 166, 153)' }}
                            onClick={onLogout}
                        >
                            Yes, Logout!
                        </button>

                        <Link>
                        </Link>
                        <button
                            type="button"
                            className="swal2-cancel swal2-styled swal2-default-outline"
                            aria-label=""
                            style={{ backgroundColor: 'rgb(221, 51, 51)' }}
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Logout;
