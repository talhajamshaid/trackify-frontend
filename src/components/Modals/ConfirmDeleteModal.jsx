import React from "react";
import { X } from "lucide-react";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-foreground">
            {title || "Confirm Delete"}
          </h2>
          <button
            onClick={onClose}
            className="text-foreground/40 hover:text-foreground transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <p className="text-sm text-black/70 mb-6">
          Are you sure you want to delete this item?
        </p>

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl cursor-pointer border border-secondary text-sm text-foreground/60 hover:bg-secondary/20 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl cursor-pointer bg-red-500 text-white text-sm font-medium hover:opacity-90 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
