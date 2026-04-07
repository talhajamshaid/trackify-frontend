import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../../components/Authlayout";
import { useVerifyOtpMutation } from "../../redux/api/authSlice/userSlice";

const OtpConfirmation = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [otpError, setOtpError] = useState("");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showP, setShowP] = useState(false);
  const [showC, setShowC] = useState(false);

  const navigate = useNavigate();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  // ─── OTP handlers ────────────────────────────────────────
  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (otpError) setOtpError("");
    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0)
      document.getElementById(`otp-${idx - 1}`)?.focus();
  };

  // ─── Password strength ───────────────────────────────────
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

  const mismatch = confirm.length > 0 && password !== confirm;

  // ─── Submit ──────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpFilled = otp.every((d) => d !== "");
    if (!otpFilled) {
      setOtpError("Please enter all 6 digits.");
      return;
    }
    if (mismatch || !password || !confirm) return;

    const otpString = otp.join("");

    try {
      await verifyOtp({ otp: otpString, newPassword: password }).unwrap();
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong. Try again.");
    }
  };

  const isDisabled =
    isLoading || mismatch || !password || !confirm || otp.some((d) => d === "");

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter the 6-digit code sent to your email, then set a new password."
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* ── OTP Section ── */}
        <div className="flex flex-col gap-1.5 pb-3">
          <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
            Verification Code
          </label>

          <div className="grid grid-cols-6 gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, idx)}
                onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                className={`w-full aspect-square text-center text-lg font-bold rounded-xl border-2 bg-cardbg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition ${
                  otpError
                    ? "border-red-300"
                    : "border-secondary focus:border-primary"
                }`}
              />
            ))}
          </div>

          {otpError && <p className="text-xs text-red-400">{otpError}</p>}
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-secondary pt-3" />

        {/* ── New Password ── */}
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
              className="w-full px-4 py-3 pr-11 rounded-xl border border-secondary bg-cardbg text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary transition"
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
              <span className={`text-xs font-medium ${strengthText[strength]}`}>
                {strengthLabel[strength]}
              </span>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {[
                  { label: "8+ characters", passed: hasLength },
                  { label: "Uppercase letter", passed: hasUppercase },
                  { label: "Number (0-9)", passed: hasNumber },
                  { label: "Special character", passed: hasSpecial },
                ].map(({ label, passed }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span
                      className={`text-xs ${
                        passed ? "text-primary" : "text-foreground/30"
                      }`}
                    >
                      {passed ? "✓" : "○"}
                    </span>
                    <span
                      className={`text-xs ${
                        passed ? "text-foreground/70" : "text-foreground/30"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Confirm Password ── */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showC ? "text" : "password"}
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`w-full px-4 py-3 pr-11 rounded-xl border bg-cardbg text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary transition ${
                mismatch ? "border-red-300" : "border-secondary"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowC(!showC)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-primary transition"
            >
              {showC ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {mismatch && (
            <p className="text-xs text-red-400">Passwords do not match</p>
          )}
        </div>

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={isDisabled}
          className="w-full py-3 rounded-xl bg-buttonbg text-white text-sm font-semibold hover:bg-primary transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Setting..." : "Set New Password"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default OtpConfirmation;
