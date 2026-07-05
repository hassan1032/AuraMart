import React, { useEffect } from "react";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

export function Modal({ open, onClose, title, children, size = "md", className }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!open) return null;

  const sizeClass = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl",
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full bg-white rounded-2xl shadow-2xl overflow-hidden",
          "animate-in fade-in zoom-in-95 duration-200",
          sizeClass,
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="overflow-y-auto max-h-[calc(100vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, loading, variant = "danger" }) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="p-6 text-center">
        <div className={cn(
          "mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4",
          variant === "danger" ? "bg-red-100" : "bg-amber-100"
        )}>
          {variant === "danger" ? (
            <Trash2 className="text-red-500" size={24} />
          ) : (
            <AlertTriangle className="text-amber-500" size={24} />
          )}
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-2">{title || "Are you sure?"}</h3>
        <p className="text-sm text-gray-500 mb-6">{message || "This action cannot be undone."}</p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="secondary" size="md" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" size="md" onClick={onConfirm} loading={loading}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
