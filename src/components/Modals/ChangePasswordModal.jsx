import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { toast } from "react-toastify";
import { useUpdatePasswordMutation } from "../../redux/api/authSlice/userSlice";

export default function ChangePasswordModal({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState(""); // yeh newPassword banega
  const [showCurrent, setShowCurrent] = useState(false);
  const [showP, setShowP] = useState(false);

  const [changePassword, { isLoading }] = useUpdatePasswordMutation();

  // Strength checks
  const hasLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const passedCount = [hasLength, hasUppercase, hasNumber, hasSpecial].filter(
    Boolean,
  ).length;

  const strength =
    password.length === 0
      ? 0
      : passedCount <= 1
        ? 1
        : passedCount <= 2
          ? 2
          : passedCount <= 3
            ? 3
            : 4;

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = [
    "",
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-primary",
  ];
  const strengthText = [
    "",
    "text-red-400",
    "text-orange-400",
    "text-yellow-500",
    "text-primary",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !password) return;

    try {
      const res = await changePassword({
        currentPassword,
        newPassword: password,
      }).unwrap();
      toast.success(res?.message || "Password updated successfully");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update password");
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal Box */}
      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-foreground">New Password</h2>
            <p className="text-sm text-black/50">
              Create a strong password for your account.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-black/40 hover:text-red-500 hover:bg-red-50 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Current Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 rounded-xl border border-secondary bg-background/20 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-primary transition"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
              New Password
            </label>
            <div className="relative">
              <input
                type={showP ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 rounded-xl border border-secondary bg-background/20 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              <button
                type="button"
                onClick={() => setShowP(!showP)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-primary transition"
              >
                {showP ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Strength bar */}
            {password.length > 0 && (
              <div className="flex flex-col gap-2 mt-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        strength >= i ? strengthColor[strength] : "bg-secondary"
                      }`}
                    />
                  ))}
                </div>
                <span
                  className={`text-xs font-medium ${strengthText[strength]}`}
                >
                  {strengthLabel[strength]}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={
              !currentPassword ||
              !hasLength ||
              !hasUppercase ||
              !hasNumber ||
              !hasSpecial ||
              isLoading
            }
            className="w-full py-3 rounded-xl bg-buttonbg text-white text-sm font-semibold hover:opacity-90 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating...
              </div>
            ) : (
              "Set New Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
