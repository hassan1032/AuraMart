import React, { useEffect, useRef, useState } from "react";

const ConfirmModal = ({ onConfirm, onCancel }) => {
    const modalRef = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Lock background scroll
        document.body.classList.add("modal-open");

        if (modalRef.current) {
            modalRef.current.focus();
        }

        // Animate fade in
        setTimeout(() => setVisible(true), 10);

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                handleClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.classList.remove("modal-open");
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onCancel, 300); // match transition duration
    };

    return (
        <div
            className={`app-main-inner backdrop ${visible ? "show" : ""}`}
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 1050,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1rem",
                transition: "opacity 0.3s ease",
                opacity: visible ? 1 : 0,
            }}
            onClick={handleClose}
        >
            <div
                ref={modalRef}
                className="swal2-container swal2-center swal2-backdrop-show"
                role="dialog"
                aria-modal="true"
                aria-labelledby="swal2-title"
                aria-describedby="swal2-html-container"
                tabIndex={-1}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="swal2-popup swal2-modal swal2-icon-warning swal2-show"
                    style={{
                        display: "grid",
                        maxWidth: "90vw",
                        width: "400px",
                        transition: "transform 0.3s ease, opacity 0.3s ease",
                        transform: visible ? "scale(1)" : "scale(0.9)",
                        opacity: visible ? 1 : 0,
                    }}
                >
                    <div
                        className="swal2-icon swal2-warning swal2-icon-show"
                        style={{ display: "flex", justifyContent: "center" }}
                    >
                        <div className="swal2-icon-content">!</div>
                    </div>

                    <h2
                        className="swal2-title"
                        id="swal2-title"
                        style={{ display: "block", textAlign: "center" }}
                    >
                        Are you sure?
                    </h2>

                    <div
                        className="swal2-html-container"
                        id="swal2-html-container"
                        style={{ display: "block", textAlign: "center", marginBottom: "1rem" }}
                    >
                        Are you sure you want to delete this item?
                    </div>

                    <div
                        className="swal2-actions"
                        style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
                    >
                        <button
                            type="button"
                            className="swal2-confirm swal2-styled"
                            style={{ backgroundColor: "rgb(34, 166, 153)" }}
                            onClick={onConfirm}
                        >
                            Yes, Confirm!
                        </button>

                        <button
                            type="button"
                            className="swal2-cancel swal2-styled swal2-default-outline"
                            style={{ backgroundColor: "rgb(221, 51, 51)" }}
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
