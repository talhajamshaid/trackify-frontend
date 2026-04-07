import React from "react";
import { capitalizeFirstLetter, formatDate } from "../../utils/datetime";
import {
  useGetUsersQuery,
  useUpdateUserStatusMutation,
} from "../../redux/api/admin/usersSlice";
import { toast } from "react-toastify";
import { Search } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "../../utils/helper";

const statusPill = (status) =>
  ({
    active: "bg-badgeDone text-badgeDoneText border-badgeDone",
    inactive: "bg-cardbg text-mutedText border-cardBorder",
  })[status] ?? "bg-cardbg text-mutedText border-cardBorder";

const UserRequest = () => {
  const { data, isLoading, error } = useGetUsersQuery();
  const users = data ?? [];
  const [updateUserStatus, { isLoading: isUpdating }] =
    useUpdateUserStatusMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
  };

  // Frontend filtering
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      debouncedSearch.trim() === "" ||
      u.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(debouncedSearch.toLowerCase());

    const matchesStatus = statusFilter === "" || u.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    toast.dismiss();
    try {
      const res = await updateUserStatus({
        id: user._id,
        status: newStatus,
      }).unwrap();
      toast.success(
        res?.message ||
          `User ${newStatus === "active" ? "activated" : "deactivated"}`,
      );
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update user status");
    }
  };

  return (
    <div className="flex flex-col h-full gap-2">
      {/* Header */}
      <div className="flex flex-shrink-0 flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-badgeDoneText">
            Users List
          </h1>
          <p className="text-sm text-black/50">
            Manage and monitor all registered users.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-end gap-3 w-[70%] ml-auto pb-4 mt-3">
        {/* Search */}
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

        {/* Status */}
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Reset */}
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
                  Email
                </th>
                <th className="text-left text-xs font-semibold text-black/40 uppercase pb-3 pr-4">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-black/40 uppercase pb-3 pr-4">
                  Date
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
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-red-400">
                    Failed to load users
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-black/40">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, index) => (
                  <tr key={u._id} className="border-b border-cardBorder">
                    <td className="py-4 pr-4 text-mutedText">{index + 1}</td>
                    <td className="py-4 pr-4 font-medium">
                      {capitalizeFirstLetter(u.name)}
                    </td>
                    <td className="py-4 pr-4 text-mutedText">{u.email}</td>
                    <td className="py-4 pr-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full border ${statusPill(u.status)}`}
                      >
                        {capitalizeFirstLetter(u.status)}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-mutedText">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="py-4 pr-4">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={isUpdating}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                          u.status === "active" ? "bg-primary" : "bg-cardBorder"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            u.status === "active"
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserRequest;
