import {
  Users,
  CalendarDays,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useGetDashboardQuery } from "../../redux/api/admin/AdmindashboardSlice";

const Dashboard = () => {
  const { data, isLoading } = useGetDashboardQuery();
  const users = data?.users || {};
  const tasks = data?.tasks || {};
  const recentPendingTasks = data?.recentPendingTasks || [];
  const recentUsers = data?.recentUsers || [];

  const statusBadge = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
    inProgress: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
  };

  return (
    <div className="space-y-6">
      {/* User Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white border border-secondary/40 p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center flex-shrink-0">
            <Users size={18} className="text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Total Users
            </p>
            <p className="text-2xl font-semibold text-foreground leading-tight">
              {isLoading ? "—" : users.total || 0}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-secondary/40 p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center flex-shrink-0">
            <CheckCircle size={18} className="text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Active Users
            </p>
            <p className="text-2xl font-semibold text-foreground leading-tight">
              {isLoading ? "—" : users.active || 0}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-secondary/40 p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center flex-shrink-0">
            <XCircle size={18} className="text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Inactive Users
            </p>
            <p className="text-2xl font-semibold text-foreground leading-tight">
              {isLoading ? "—" : users.inactive || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Task Status */}
      <div className="rounded-2xl bg-white border border-secondary/40 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-base font-semibold text-foreground">
              Task Status Breakdown
            </p>
            <p className="text-sm text-black/50">All time counts</p>
          </div>
        </div>

        <div className="divide-y divide-secondary/30">
          {[
            { label: "Pending", value: tasks.pending, key: "pending" },
            { label: "Approved", value: tasks.approved, key: "approved" },
            { label: "Rejected", value: tasks.rejected, key: "rejected" },
            {
              label: "In Progress",
              value: tasks.inProgress,
              key: "inProgress",
            },
            { label: "Completed", value: tasks.completed, key: "completed" },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-2"
            >
              <span className="text-sm text-black/60">{item.label}</span>
              <span
                className={`text-xs font-medium px-3 py-0.5 rounded-full ${statusBadge[item.key]}`}
              >
                {isLoading ? "—" : item.value || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Pending Tasks */}
      <div className="rounded-2xl bg-white border border-secondary/40 p-4">
        <p className="text-base font-semibold text-foreground mb-4">
          Recent Pending Tasks
        </p>
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : recentPendingTasks.length === 0 ? (
          <p className="text-sm text-black/50">No pending tasks.</p>
        ) : (
          <ul className="space-y-2">
            {recentPendingTasks.map((task, idx) => (
              <li
                key={idx}
                className="flex justify-between text-sm border-b border-secondary/30 pb-1"
              >
                <span>{task.title}</span>
                <span className="text-foreground">{task.assignee}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recent Users */}
      <div className="rounded-2xl bg-white border border-secondary/40 p-4">
        <p className="text-base font-semibold text-foreground mb-4">
          Recent Users
        </p>
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : recentUsers.length === 0 ? (
          <p className="text-sm text-black/50">No recent users.</p>
        ) : (
          <ul className="space-y-2">
            {recentUsers.map((user, idx) => (
              <li
                key={idx}
                className="flex justify-between text-sm border-b border-secondary/30 pb-1"
              >
                <span>{user.name}</span>
                <span className="text-foreground">{user.email}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
