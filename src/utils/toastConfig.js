// utils/toastConfig.js — import karke use karo
import { toast } from "react-toastify";

const options = {
  position: "top-left",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showSuccess = (msg) => toast.success(msg, options);
export const showError = (msg) => toast.error(msg, options);
export const showInfo = (msg) => toast.info(msg, options);
