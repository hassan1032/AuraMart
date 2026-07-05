import { toast } from 'react-toastify';

const BASE = {
  position: 'top-right',
  autoClose: 3500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const toastSuccess = (msg, opts = {}) =>
  toast.success(msg, { ...BASE, ...opts });

export const toastError = (msg, opts = {}) =>
  toast.error(msg, { ...BASE, ...opts });

export const toastInfo = (msg, opts = {}) =>
  toast.info(msg, { ...BASE, ...opts });

export const toastWarn = (msg, opts = {}) =>
  toast.warn(msg, { ...BASE, ...opts });
