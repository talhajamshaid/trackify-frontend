import React, { useState } from "react";
import { capitalizeFirstLetter, formatDate } from "../../utils/datetime";
import { useGetTaskHistoryQuery } from "../../redux/api/admin/tasksSlice";
import { Eye, Search } from "lucide-react";
import TaskDetailsModal from "../../components/Modals/TaskDetailsModal";
import Pagination from "../../components/pagination/Pagination";
import { useDebounce } from "../../utils/helper";

const statusPill = (status) =>
  ({
    pending: "bg-badgePending text-badgePendingText border-badgePending",
    approved: "bg-badgeDone text-badgeDoneText border-badgeDone",
    rejected: "bg-badgeRejected text-badgeRejectedText border-badgeRejected",
  })[status] ?? "bg-cardbg text-mutedText border-cardBorder";

const TaskHistory = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useGetTaskHistoryQuery({
    status: statusFilter,
    search: debouncedSearch.trim(),
    page,
    limit,
  });

  const tasks = data?.tasks ?? [];

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
  };
  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex flex-shrink-0 flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-badgeDoneText">
            Task History
          </h1>
          <p className="text-sm text-black/50">
            Review all task history records.
          </p>
        </div>
      </div>
      {/* Top Filters */}
      <div className="flex items-end gap-3 w-[70%] ml-auto pb-6">
        {/* Search input */}
        <div className="relative flex-1 min-w-0">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none"
          />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email..."
            className="
        w-full pl-9 pr-4 py-2 rounded-xl text-sm
        bg-background/20 border border-secondary
        outline-none transition-all duration-200
        hover:border-secondary/60 hover:shadow-[0_0_0_3px_rgba(100,140,230,0.10)]
        focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(51,112,204,0.18)]
      "
          />
        </div>

        {/* Status dropdown */}
        <div className="w-28 flex-shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="
        w-full px-3 py-2 rounded-xl text-sm
        bg-background/20 border border-secondary text-foreground/50
        outline-none transition-all duration-200 cursor-pointer appearance-none
        hover:border-secondary/60 hover:shadow-[0_0_0_3px_rgba(100,140,230,0.10)]
        focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(51,112,204,0.18)]
      "
          >
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Reset button */}
        <button
          onClick={handleResetFilters}
          className="
      flex-shrink-0 flex items-center justify-center gap-2
      px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap
      bg-[#003388] text-white cursor-pointer
      hover:bg-[#003388]/80 active:scale-95 transition-all duration-200
    "
        >
          Reset
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-cardbg border border-cardBorder rounded-2xl p-4 flex flex-col flex-1 min-h-0">
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
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-black/40 uppercase pb-3 pr-4">
                  Date
                </th>
                <th className="text-left text-xs font-semibold text-black/40 uppercase pb-3 pr-4">
                  Actions
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
                    <td className="py-4 pr-4 font-medium">{t.user_id.name}</td>
                    <td className="py-4 pr-4">{t.title}</td>
                    <td className="py-4 pr-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full border ${statusPill(t.status)}`}
                      >
                        {capitalizeFirstLetter(t.status)}
                      </span>
                    </td>
                    <td className="py-4 pr-4">{formatDate(t.createdAt)}</td>
                    <td className="py-4 pr-4 flex items-center gap-2">
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex-shrink-0">
        <Pagination
          currentPage={page}
          totalPages={data?.pagination?.totalPages || 0}
          totalItems={data?.pagination?.totalTasks || 0}
          itemsPerPage={limit}
          onPageChange={(p) => setPage(p)}
          onItemsPerPageChange={(items) => {
            setLimit(items);
            setPage(1);
          }}
        />
      </div>
      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={selectedTask}
        />
      )}
    </div>
  );
};

export default TaskHistory;
