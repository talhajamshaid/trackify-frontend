import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../../redux/api/authSlice/userSlice";
import AuthLayout from "../../components/Authlayout";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "../../utils/datetime";

const initialState = { name: "", email: "", password: "" };

const Register = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

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
      if (!isEmail) newErrors.email = "Enter a valid email";
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      toast.success(res?.message || "Account created successfully!");

      navigate("/login");
    } catch (err) {
      const message =
        err?.data?.message || err?.error || "Registration failed. Try again.";
      toast.error(message);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Fill in the details below to get started"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border bg-cardbg text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary transition ${
              errors.name ? "border-red-300" : "border-secondary"
            }`}
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
            Email
          </label>
          <input
            type="text"
            name="email"
            placeholder="Enter your email"
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

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 cursor-pointer rounded-xl bg-buttonbg text-white text-sm font-semibold hover:bg-primary transition-all shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating account...
            </div>
          ) : (
            "Create Account"
          )}
        </button>

        {/* Login link */}
        <p className="text-center text-sm text-foreground/50">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-buttonbg font-semibold hover:underline"
          >
            Sign in
          </button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
