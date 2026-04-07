import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../../redux/api/authSlice/userSlice";
import { setToken, setUser } from "../../utils/helper";
import AuthLayout from "../../components/Authlayout";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "../../utils/datetime";
import { useDispatch } from "react-redux";
import { setlogin } from "../../redux/reducer/userReducer";

const initialState = { email: "", password: "" };

const Login = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: value ? "" : `${capitalizeFirstLetter(name)} is required`,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (!value) newErrors[key] = `${capitalizeFirstLetter(key)} is required`;
    });

    if (formData.email) {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

      if (!isEmail) {
        newErrors.email = "Enter a valid email";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await loginUser({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      // Save token & user
      setToken(res.token);
      setUser(res.user);
      dispatch(setlogin(res.user));

      toast.success(res?.message || "Login successful!");

      // Redirect based on role
      if (res.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (res.user.role === "user") {
        navigate("/user/dashboard");
      } else {
        navigate("/"); // fallback
      }
    } catch (err) {
      const message =
        err?.data?.message ||
        err?.error ||
        "Invalid credentials. Please try again.";
      toast.error(message);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to access your account"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
            Email
          </label>
          <input
            type="text"
            name="email"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border bg-cardbg text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary transition ${
              errors.email ? "border-red-300" : "border-secondary"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 pr-11 rounded-xl border bg-cardbg text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary transition ${
                errors.password ? "border-red-300" : "border-secondary"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-primary transition"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password}</p>
          )}
        </div>

        {/* Remember me + Forgot */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 rounded border border-secondary accent-buttonbg"
            />
            <label htmlFor="remember" className="text-xs text-foreground/60">
              Remember me
            </label>
          </div>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-xs text-buttonbg hover:underline font-medium"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 cursor-pointer rounded-xl bg-buttonbg text-white text-sm font-semibold hover:bg-primary transition-all shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Logging in...
            </div>
          ) : (
            "Login"
          )}
        </button>
        <p className="text-center text-sm text-foreground/50">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-buttonbg font-semibold hover:underline"
          >
            Sign up
          </button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
