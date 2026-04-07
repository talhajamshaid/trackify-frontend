// components/Modals/CreateTaskModal.jsx
import { useState } from "react";
import { useCreateTaskMutation } from "../../redux/api/user/tasksSlice";
import { toast } from "react-toastify";

const CreateTaskModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createTask, { isLoading }] = useCreateTaskMutation();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;
    try {
      await createTask({ title, description }).unwrap();
      toast.success("Task created!");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Error creating task");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-96 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <h3 className="text-2xl font-semibold text-badgeDoneText pb-6">
          Create Task
        </h3>

        <div className="mb-3">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            title="Enter the task title"
          >
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Task title..."
            title="Enter the task title"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            title="Enter the task description"
          >
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
            placeholder="Task description..."
            title="Enter the task description"
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !description.trim() || isLoading}
            className={`px-4 py-2 rounded-lg text-white transition ${
              !title.trim() || !description.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-badgeDoneText hover:bg-badgeDoneText/80"
            }`}
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
