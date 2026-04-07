import { CheckCircle, XCircle, Loader2, ClipboardList } from "lucide-react";
import { useGetUsersQuery } from "../../redux/api/user/usersSlice";

const Dashboard = () => {
  const { data, isLoading } = useGetUsersQuery();
  const tasks = data?.tasks || {};
  const recentTasks = data?.recentTasks || [];

  const statusBadge = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
    "in-progress": "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
  };

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-black/50">Your task activity overview.</p>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white border border-secondary/40 p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center flex-shrink-0">
            <ClipboardList size={18} className="text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Total Tasks
            </p>
            <p className="text-2xl font-semibold text-foreground leading-tight">
              {isLoading ? "—" : tasks.total || 0}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-secondary/40 p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center flex-shrink-0">
            <CheckCircle size={18} className="text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Approved
            </p>
            <p className="text-2xl font-semibold text-foreground leading-tight">
              {isLoading ? "—" : tasks.approved || 0}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-secondary/40 p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center flex-shrink-0">
            <XCircle size={18} className="text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Rejected
            </p>
            <p className="text-2xl font-semibold text-foreground leading-tight">
              {isLoading ? "—" : tasks.rejected || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Task Status Breakdown */}
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
              key: "in-progress",
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

      {/* Recent Tasks */}
      <div className="rounded-2xl bg-white border border-secondary/40 p-4">
        <p className="text-base font-semibold text-foreground mb-4">
          Recent Tasks
        </p>
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : recentTasks.length === 0 ? (
          <p className="text-sm text-black/50">No tasks found.</p>
        ) : (
          <ul className="space-y-2">
            {recentTasks.map((task) => (
              <li
                key={task._id}
                className="flex items-start justify-between gap-3 border-b border-secondary/30 pb-2"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {task.title}
                  </p>
                  <p className="text-xs text-black/50 mt-0.5">
                    {task.description}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusBadge[task.status]}`}
                  >
                    {task.status}
                  </span>
                  <span className="text-xs text-black/40">
                    {formatDate(task.createdAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
