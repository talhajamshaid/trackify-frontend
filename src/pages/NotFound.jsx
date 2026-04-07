import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function NotFound() {
  // safely access user
  const user = useSelector((state) => state.auth?.user);
  const dashboardPath =
    user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard";

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full rounded-2xl bg-white border border-black/10 p-6 text-center">
        <div className="text-4xl font-bold text-badgeDoneText">404</div>
        <div className="mt-2 text-lg font-semibold text-foreground">
          Page not found
        </div>
        <p className="mt-1 text-sm text-black/50">
          This route doesn’t exist in your website.
        </p>
        <Link
          to={dashboardPath || "/"} // fallback if user is undefined
          className="mt-5 inline-flex px-4 py-2 rounded-xl bg-badgeDoneText text-white hover:opacity-90 transition-opacity"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
