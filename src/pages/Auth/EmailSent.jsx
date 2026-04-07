import { Mail, CheckCircle2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../../components/Authlayout";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForgotPasswordMutation } from "../../redux/api/authSlice/userSlice";

const RESEND_COOLDOWN = 30;

const EmailSent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your email";

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const [timer, setTimer] = useState(() => {
    const endTime = localStorage.getItem("resendEndTime");
    if (!endTime) return 0;
    const remaining = Math.ceil((parseInt(endTime) - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  });

  const canResend = timer <= 0 && !isLoading;

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          localStorage.removeItem("resendEndTime");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await forgotPassword({ email }).unwrap();
      toast.success("Reset link sent again!");
      const endTime = Date.now() + RESEND_COOLDOWN * 1000;
      localStorage.setItem("resendEndTime", endTime.toString());
      setTimer(RESEND_COOLDOWN);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to resend link");
    }
  };

  return (
    <AuthLayout showLogo={false}>
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="h-20 w-20 rounded-full bg-secondary/50 flex items-center justify-center">
            <Mail size={36} className="text-buttonbg" />
          </div>
        </div>

        <div className="flex justify-center items-center gap-2 mb-2">
          <h2 className="text-2xl font-bold text-foreground">Link Sent</h2>
          <CheckCircle2 size={20} className="text-primary" />
        </div>

        <p className="text-sm text-foreground/50 mb-6">
          Instructions to reset your password have been sent to{" "}
          <span className="font-semibold text-buttonbg">{email}</span>
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 rounded-xl bg-buttonbg text-white text-sm font-semibold hover:bg-primary transition-all shadow-md active:scale-[0.98]"
          >
            Back To Login
          </button>

          <p className="text-sm text-center text-foreground/50 mt-2">
            Didn't receive?{" "}
            {canResend ? (
              <button
                onClick={handleResend}
                className="font-semibold text-buttonbg hover:underline cursor-pointer"
              >
                Resend
              </button>
            ) : (
              <span className="font-semibold text-gray-400">
                {isLoading ? "Sending..." : `Resend in ${timer}s`}
              </span>
            )}
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailSent;
