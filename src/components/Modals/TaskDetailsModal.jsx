// src/components/Modals/TaskDetailsModal.jsx
import React from "react";

const TaskDetailsModal = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-2">
      <div className="bg-cardbg rounded-2xl p-6 w-full max-w-md border border-cardBorder shadow-lg">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-foreground">
            {task.user_id?.name}
          </h3>
        </div>

        {/* Description Card */}
        <div className="border-l-4 border-badgePending bg-background p-4 rounded-lg shadow-sm space-y-2">
          <p className="text-sm text-mutedText">
            <span className="font-bold text-badgeDoneText">Title :</span>{" "}
            {task.title}
          </p>
          <p className="text-sm text-mutedText">
            <span className="font-bold text-badgeDoneText">Description :</span>{" "}
            {task.description}
          </p>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-badgeDoneText text-white rounded-lg hover:bg-badgeDoneText/80 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
