import { toast } from "react-toastify";

const TOAST_KEY = "globalToastMessage";
const TOAST_TYPE_KEY = "globalToastType";

// Show queued toast on next page load
export const showQueuedToast = () => {
    const msg = sessionStorage.getItem(TOAST_KEY);
    const type = sessionStorage.getItem(TOAST_TYPE_KEY);

    if (msg) {
        if (type === "success") toast.success(msg, { autoClose: 3000 });
        if (type === "error") toast.error(msg, { autoClose: 3000 });
        if (type === "info") toast.info(msg, { autoClose: 3000 });
    }

    sessionStorage.removeItem(TOAST_KEY);
    sessionStorage.removeItem(TOAST_TYPE_KEY);
};

// Queue toast to show after navigation
const queueToast = (msg, type) => {
    sessionStorage.setItem(TOAST_KEY, msg || "Something went wrong");
    sessionStorage.setItem(TOAST_TYPE_KEY, type);
};

// Export simple methods
export const showSuccess = (msg, queue = false) =>
    queue ? queueToast(msg, "success") : toast.success(msg || "Something went wrong", { autoClose: 3000 });

export const showError = (msg, queue = false) =>
    queue ? queueToast(msg, "error") : toast.error(msg || "Something went wrong", { autoClose: 3000 });

export const showInfo = (msg, queue = false) =>
    queue ? queueToast(msg, "info") : toast.info(msg || "Backend Error", { autoClose: 3000 });
