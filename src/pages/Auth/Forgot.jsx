import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "../../utils/datetime";
import AuthLayout from "../../components/Authlayout";
import { useForgotPasswordMutation } from "../../redux/api/authSlice/userSlice";
import { toast } from "react-toastify";

const initialState = { email: "" };

const ForgotPassword = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      if (!isEmail) {
        newErrors.email = "Enter a valid email";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({
      ...prev,
      [name]: value ? "" : `${capitalizeFirstLetter(name)} is required`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    toast.dismiss();

    try {
      const value = formData.email;

      const res = await forgotPassword({
        email: value,
      }).unwrap();

      toast.success(res?.message || "Email sent successfully");

      // Navigate to email sent page
      navigate("/email-sent", { state: { email: formData.email } });
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your account's associated email for a password reset link"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
            Email
          </label>
          <input
            name="email"
            type="text"
            placeholder="Email or phone number"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-secondary bg-cardbg text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-xl bg-buttonbg text-white text-sm font-semibold 
    ${isLoading ? "cursor-not-allowed opacity-70" : "hover:bg-primary cursor-pointer"}
  `}
        >
          {isLoading ? "Sending..." : "Submit"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground/50">
        Remember your password?{" "}
        <button
          onClick={() => navigate("/login")}
          className="text-buttonbg font-semibold hover:underline"
        >
          Back to Login
        </button>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;
