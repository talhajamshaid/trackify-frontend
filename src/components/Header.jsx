// src/components/Header.jsx
import { User, LogOut, ChevronDown, Menu, UserIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "../redux/api/authSlice/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "../redux/reducer/userReducer";
import { getToken } from "../utils/helper";

const Header = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();
  const token = getToken();
  const { user } = useSelector((state) => state.userReducer);

  const allLinks = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/user", label: "User Request" },
    { to: "/admin/task", label: "Task Manager" },
    { to: "/user/dashboard", label: "Dashboard" },
    { to: "/user/task", label: "Task Manager" },
  ];

  // Current route ka label find karlo
  const currentLink = allLinks.find((link) => link.to === location.pathname);
  const pageTitle = currentLink?.label || "Dashboard";

  const handleLogout = async () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
    try {
      await logoutUser(token).unwrap();
    } catch {
      /* silent */
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    // min-h-[5rem] + py-3 matches sidebar logo section exactly
    <header className="w-full flex-shrink-0 min-h-[5rem] bg-background border-b border-cardBorder shadow-sm px-6 py-1 flex items-center justify-between">
      {/* Left: page title / breadcrumb area */}
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile/tablet only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-cardBorder/40 transition-colors text-foreground"
        >
          <Menu size={20} />
        </button>

        {/* Optional: current page label — swap with dynamic title if needed */}
        <div className="flex items-center gap-2">
          <span className="text-foreground text-xl font-semibold text-base hidden sm:block">
            {pageTitle}
          </span>
        </div>
      </div>

      {/* Right: Profile dropdown */}
      <div className="flex items-center gap-3">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-3 pl-3 border-l border-cardBorder cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="h-9 w-9 rounded-full bg-sidebarActive border border-cardBorder flex items-center justify-center text-primary flex-shrink-0">
              <UserIcon className="h-5 w-5" />
            </div>

            {/* Name + role */}
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-sm font-semibold text-foreground">
                {user?.role || "Role"} {/* backend se aayega */}
              </div>
              <div className="text-xs text-sidebarActive">
                {user?.name || "User"}
                {/* backend se aayega */}
              </div>
            </div>

            <ChevronDown
              size={14}
              className={`text-mutedText transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-cardbg rounded-xl shadow-lg border border-cardBorder py-1 z-50">
              <button
                className="w-full cursor-pointer flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-background transition-colors"
                onClick={() => {
                  setOpen(false);
                  navigate(`/${user?.role}/settings`);
                }}
              >
                <User size={15} className="text-mutedText" />
                Profile
              </button>
              <div className="border-t border-cardBorder my-1" />
              <button
                className="w-full flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-closebtn hover:bg-badgeRejected transition-colors"
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
