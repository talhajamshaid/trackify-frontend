import React, { useState } from "react";
import { Plus, Eye, Search } from "lucide-react";
import { capitalizeFirstLetter, formatDate } from "../../utils/datetime";
import CreateTaskModal from "../../components/Modals/CreateTaskModal";
import TaskDetailsModal from "../../components/Modals/TaskDetailsModal";
import {
  useGetMyTasksQuery,
  useUpdateTaskStatusMutation,
} from "../../redux/api/user/tasksSlice";
import Pagination from "../../components/pagination/Pagination";
import { useDebounce } from "../../utils/helper";
import { toast } from "react-toastify";

const statusPill = (status) =>
  ({
    pending: "bg-badgePending text-badgePendingText border-badgePending",
    approved: "bg-badgeDone text-badgeDoneText border-badgeDone",
    rejected: "bg-badgeRejected text-badgeRejectedText border-badgeRejected",
    "in-progress": "bg-purple-100 text-purple-700 border-purple-200",
    completed: "bg-green-100 text-green-700 border-green-200",
  })[status] ?? "bg-cardbg text-mutedText border-cardBorder";

const MyTasks = () => {
  // ✅ filters state
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  // modals
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [comment, setComment] = useState("");

  const { data, isLoading, error } = useGetMyTasksQuery({
    status: statusFilter,
    search: debouncedSearch.trim(),
    page,
    limit,
  });

  const tasks = data?.data ?? [];
  const [updateTaskStatus, { isLoading: updateLoading }] =
    useUpdateTaskStatusMutation();
  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setPage(1);
  };

  const handleStatusChange = async (taskId, status) => {
    console.log("id", taskId);
    console.log("status", status);

    try {
      await updateTaskStatus({ taskId: taskId, status }).unwrap();
      toast.success("Status updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };
  return (
    <div className="flex flex-col h-full gap-2">
      {/* Header */}
      <div className="flex flex-shrink-0 flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-badgeDoneText">
            My Tasks
          </h1>
          <p className="text-sm text-black/50">
            View and track all your submitted tasks.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-badgeDoneText text-white text-sm rounded-xl hover:bg-badgeDoneText/80 transition"
        >
          <Plus size={16} />
          Create Task
        </button>
      </div>

      {/* 🔍 Filters */}
      <div className="flex items-end gap-3 w-[70%] ml-auto pb-4 pt-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
          />
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-background/20 border border-secondary outline-none"
          />
        </div>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded-xl text-sm bg-background/20 border border-secondary"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* Reset */}
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 rounded-xl text-sm bg-[#003388] text-white"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="bg-cardbg border border-cardBorder rounded-2xl p-4 flex flex-col flex-1 min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto table-scroll">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-cardbg z-10">
              <tr className="border-b border-cardBorder">
                <th className="text-left text-xs font-semibold text-black/40 uppercase pb-3 pr-4">
                  #
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
                  Details
                </th>
                <th className="text-left text-xs font-semibold text-black/40 uppercase pb-3 pr-4">
                  Admin Comment
                </th>
                <th className="text-left text-xs font-semibold text-black/40 uppercase pb-3 pr-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-mutedText">
                    Loading tasks...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-red-400">
                    Failed to load tasks
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-black/40">
                    No tasks found
                  </td>
                </tr>
              ) : (
                tasks.map((t, index) => (
                  <tr key={t._id} className="border-b border-cardBorder">
                    <td className="py-4 pr-4 text-mutedText">{index + 1}</td>
                    <td className="py-4 pr-4 font-medium">{t.title}</td>
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
                          setIsDetailOpen(true);
                        }}
                        className="p-1.5 cursor-pointer rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                    <td className="py-4 pr-4 text-center">
                      <button
                        disabled={t.status === "pending"}
                        onClick={() => {
                          setComment(t.adminComment);
                          setIsCommentOpen(true);
                        }}
                        title={
                          t.status === "pending"
                            ? "Wait for admin response"
                            : "View comment"
                        }
                        className={`inline-flex items-center justify-center p-1.5 rounded-lg transition
      ${
        t.status === "pending"
          ? "text-gray-400 cursor-not-allowed"
          : "text-blue-600 hover:bg-blue-100 hover:text-blue-700"
      }`}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                    <td className="py-4 pr-4 text-center">
                      <select
                        value={t.status}
                        onChange={(e) =>
                          handleStatusChange(t._id, e.target.value)
                        }
                        disabled={
                          updateLoading ||
                          t.status === "pending" ||
                          t.status === "rejected" ||
                          t.status === "completed"
                        } // disable if pending/rejected or loading
                        style={{ width: "94px" }}
                        className="px-2 py-1 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        currentPage={page}
        totalPages={data?.pagination?.totalPages || 0}
        totalItems={data?.pagination?.total || 0}
        itemsPerPage={limit}
        onPageChange={(p) => setPage(p)}
        onItemsPerPageChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
      />

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetailsModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          task={selectedTask}
        />
      )}

      {/* Create Task Modal */}
      {isCreateOpen && (
        <CreateTaskModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
      )}

      {isCommentOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-2">
          <div className="bg-cardbg rounded-2xl p-6 w-full max-w-md border border-cardBorder shadow-lg">
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-foreground">
                Admin Comment
              </h3>
            </div>

            {/* Comment Card */}
            <div className="border-l-4 border-badgePending bg-background p-4 rounded-lg shadow-sm">
              <p className="text-sm text-mutedText">
                {comment || "No comment available"}
              </p>
            </div>

            {/* Close Button */}
            <div className="flex justify-end mt-5">
              <button
                onClick={() => setIsCommentOpen(false)}
                className="px-4 py-2 text-sm bg-badgeDoneText text-white rounded-lg hover:bg-badgeDoneText/80 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;
