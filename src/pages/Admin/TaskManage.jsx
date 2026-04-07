import React from "react";
import { capitalizeFirstLetter, formatDate } from "../../utils/datetime";
import {
  useApproveTaskMutation,
  useGetTasksQuery,
  useRejectTaskMutation,
} from "../../redux/api/admin/tasksSlice";
import { Eye } from "lucide-react";
import { useState } from "react";
import TaskDetailsModal from "../../components/Modals/TaskDetailsModal";
import { toast } from "react-toastify";

const statusPill = (status) =>
  ({
    pending: "bg-badgePending text-badgePendingText border-badgePending",
    approved: "bg-badgeDone text-badgeDoneText border-badgeDone",
    rejected: "bg-badgeRejected text-badgeRejectedText border-badgeRejected",
  })[status] ?? "bg-cardbg text-mutedText border-cardBorder";

const TaskManage = () => {
  const { data, isLoading, error } = useGetTasksQuery();
  const tasks = data ?? [];
  const [approveTask] = useApproveTaskMutation();
  const [rejectTaskMutation] = useRejectTaskMutation();

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRejectTask, setSelectedRejectTask] = useState(null);
  const [rejectComment, setRejectComment] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [comment, setComment] = useState("");

  const handleCloseModal = () => {
    setModalOpen(false);
    setComment("");
  };

  const handleCloseRejectModal = () => {
    setRejectModalOpen(false);
    setRejectComment("");
  };

  const handleApprove = async () => {
    if (!comment.trim() || !selectedTask) return;
    setLoadingTasks((prev) => ({ ...prev, [selectedTask._id]: true }));
    try {
      await approveTask({ taskId: selectedTask._id, comment }).unwrap();
      toast.success("Task approved!");
      setComment("");
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Error approving task");
    } finally {
      setLoadingTasks((prev) => ({ ...prev, [selectedTask._id]: false }));
    }
  };

  const handleReject = async () => {
    if (!rejectComment.trim() || !selectedRejectTask) return;
    try {
      await rejectTaskMutation({
        taskId: selectedRejectTask._id,
        comment: rejectComment,
      }).unwrap();
      toast.success("Task rejected!");
      setRejectComment("");
      setRejectModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Error rejecting task");
    }
  };

  return (
    <div className="flex flex-col h-full gap-2">
      {/* Header */}
      <div className="flex flex-shrink-0 flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-badgeDoneText">
            Task Management
          </h1>
          <p className="text-sm text-black/50">
            Review and manage all pending tasks.
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-cardbg border border-cardBorder rounded-2xl mt-4 p-4 flex flex-col flex-1 min-h-0">
        {/* Scrollable Table Body */}
        <div className="flex-1 min-h-0 overflow-y-auto table-scroll">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-cardbg z-10">
              <tr className="border-b border-cardBorder">
                <th className="text-left text-xs font-semibold text-black/40 uppercase pb-3 pr-4">
                  #
                </th>
                <th className="text-left text-xs font-semibold text-black/40 uppercase pb-3 pr-4">
                  Name
                </th>
                <th className="text-left text-xs font-semibold text-black/40 uppercase pb-3 pr-4">
                  Title
                </th>
                <th className="text-left text-xs font-semibold text-black/40 uppercase pb-3 pr-4">
                  Date
                </th>
                <th className="text-left text-xs font-semibold text-black/40 uppercase pb-3 pr-4">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-black/40 uppercase pb-3 pr-4">
                  Description
                </th>
                <th className="text-left text-xs font-semibold text-black/40 uppercase pb-3 pr-4">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-mutedText">
                    Loading tasks...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-red-400">
                    Failed to load tasks
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-black/40">
                    No tasks found
                  </td>
                </tr>
              ) : (
                tasks.map((t, index) => (
                  <tr key={t._id} className="border-b border-cardBorder">
                    <td className="py-4 pr-4 text-mutedText">{index + 1}</td>
                    <td className="py-4 pr-4 font-medium">{t.user_id.name}</td>
                    <td className="py-4 pr-4">{t.title}</td>
                    <td className="py-4 pr-4">{formatDate(t.createdAt)}</td>
                    <td className="py-4 pr-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full border ${statusPill(t.status)}`}
                      >
                        {capitalizeFirstLetter(t.status)}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <button
                        onClick={() => {
                          setSelectedTask(t);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 cursor-pointer rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <button
                          disabled={loadingTasks[t._id]}
                          onClick={() => {
                            setSelectedTask(t);
                            setModalOpen(true);
                          }}
                          className={`px-3 py-1 text-xs rounded-lg ${
                            loadingTasks[t._id]
                              ? "bg-gray-300 text-white cursor-not-allowed"
                              : "bg-badgeDone text-badgeDoneText"
                          }`}
                        >
                          ✔
                        </button>
                        <button
                          disabled={loadingTasks[t._id]}
                          onClick={() => {
                            setSelectedRejectTask(t);
                            setRejectModalOpen(true);
                          }}
                          className={`px-3 py-1 text-xs rounded-lg ${
                            loadingTasks[t._id]
                              ? "bg-gray-300 text-white cursor-not-allowed"
                              : "bg-badgeRejected text-badgeRejectedText"
                          }`}
                        >
                          ✖
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={selectedTask}
        />
      )}

      {/* Approve Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-96 p-6 relative animate-fadeIn">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Approve Task
            </h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={`w-full border rounded-lg p-3 text-sm mb-2 resize-none focus:outline-none focus:ring-2 ${
                comment.trim() === ""
                  ? "border"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
              rows={4}
              placeholder="Add a comment for approval..."
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={comment.trim() === ""}
                className={`px-4 py-2 rounded-lg text-white transition ${
                  comment.trim() === ""
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-badgeDoneText hover:bg-badgeDoneText/80"
                }`}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-96 p-6 relative animate-fadeIn">
            <button
              onClick={handleCloseRejectModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Reject Task
            </h3>
            <textarea
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              className="w-full border rounded-lg p-3 text-sm mb-2 resize-none focus:outline-none focus:ring-2 border-gray-300 focus:ring-red-400"
              rows={4}
              placeholder="Add a reason for rejection..."
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseRejectModal}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={rejectComment.trim() === ""}
                className={`px-4 py-2 rounded-lg text-white transition ${
                  rejectComment.trim() === ""
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-badgeRejectedText hover:bg-badgeRejectedText/80"
                }`}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManage;
