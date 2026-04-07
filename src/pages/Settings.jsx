import { useState } from "react";
import { useUpdateProfileMutation } from "../redux/api/authSlice/userSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../redux/reducer/userReducer";
import ChangePasswordModal from "../components/Modals/ChangePasswordModal";

export default function Settings() {
  const user = useSelector((state) => state.userReducer?.user);
  const dispatch = useDispatch();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "",
    street: user?.street_address || "",
    city: user?.city || "",
  });

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email" || name === "role") return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        street_address: formData.street,
        city: formData.city,
      };

      const res = await updateProfile(payload).unwrap();
      // Redux update
      dispatch(updateUser(res.user));

      // localStorage bhi update karo ← yeh missing tha
      const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...existingUser, ...res.user }),
      );

      toast.success(res?.message || "Profile updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };
  const readOnlyClass =
    "w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-secondary outline-none text-sm text-black/40 cursor-not-allowed";

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-background/20 border border-secondary outline-none focus:border-buttonbg text-sm transition";

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-badgeDoneText">
          Profile Setting
        </h1>
        <p className="text-sm text-black/50">
          Update your personal information and profile details
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-secondary/40 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {/* Avatar Circle */}
            <div className="w-14 h-14 rounded-full bg-buttonbg flex items-center justify-center">
              <span className="text-white text-xl font-bold uppercase">
                {formData.name?.charAt(0) || "?"}
              </span>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-base font-bold text-foreground">
              {formData.name}
            </h3>
            <p className="text-sm text-black/50">{formData.email}</p>
            <p className="text-xs text-black/40 mt-0.5">
              Full system access &amp; platform owner
            </p>
          </div>
        </div>

        {/* Change Password */}
        <button
          type="button"
          onClick={() => setShowPasswordModal(true)}
          className="px-5 py-2 rounded-xl cursor-pointer border border-buttonbg text-buttonbg text-sm font-semibold hover:bg-buttonbg hover:text-white transition w-full sm:w-auto"
        >
          Change Password
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-secondary/40 rounded-2xl p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Full Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className={readOnlyClass}
              />
            </div>
          </div>

          {/* Row 2: Phone + Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">
                Street Address
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Enter street address"
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 3: Street + City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className={inputClass}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl cursor-pointer bg-buttonbg text-white text-sm font-semibold hover:opacity-90 transition active:scale-[0.98] w-full sm:w-auto disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </div>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </form>
      </div>
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}
