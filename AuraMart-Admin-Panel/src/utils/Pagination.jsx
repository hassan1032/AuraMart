import React from 'react';

const Pagination = ({ currentPage, totalItems, limit, onPageChange = () => { } }) => {
    const totalPages = Math.ceil(totalItems / limit);
    if (totalPages <= 1) return null;

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
        }
    };

    return (
        <div className="my-3">
            <nav className="d-flex justify-items-center justify-content-between">
                {/* Mobile view */}
                <div className="d-flex justify-content-between flex-fill d-sm-none">
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`} aria-disabled={currentPage === 1}>
                            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                                « Previous
                            </button>
                        </li>
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                                Next »
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Desktop view */}
                <div className="d-none flex-sm-fill d-sm-flex align-items-sm-center justify-content-sm-between">
                    <div>
                        <p className="small text-muted">
                            Showing{" "}
                            <span className="fw-semibold">{(currentPage - 1) * limit + 1}</span> to{" "}
                            <span className="fw-semibold">
                                {Math.min(currentPage * limit, totalItems)}
                            </span>{" "}
                            of <span className="fw-semibold">{totalItems}</span> results
                        </p>
                    </div>

                    <div>
                        <ul className="pagination">
                            {/* Previous Button */}
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`} aria-disabled={currentPage === 1}>
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    aria-label="« Previous"
                                >
                                    ‹
                                </button>
                            </li>

                            {/* Page Numbers */}
                            {Array.from({ length: totalPages }, (_, i) => (
                                <li
                                    key={i + 1}
                                    className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                                    aria-current={currentPage === i + 1 ? "page" : undefined}
                                >
                                    <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                                        {i + 1}
                                    </button>
                                </li>
                            ))}

                            {/* Next Button */}
                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    aria-label="Next »"
                                >
                                    ›
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Pagination;
