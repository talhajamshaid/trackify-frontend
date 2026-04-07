// src/components/Sidebar.jsx
import { BadgeDollarSign, LayoutDashboard, UserCheck, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import logo from "../assets/images/svg.svg";
import { LuHistory } from "react-icons/lu";
import { FaTasks } from "react-icons/fa";
import { BiTask } from "react-icons/bi";

const navItem = (to, icon, label) => ({ to, icon, label });

const getLinks = (role) => {
  if (role === "admin") {
    return [
      navItem("/admin/dashboard", LayoutDashboard, "Dashboard"),
      navItem("/admin/user", UserCheck, "User Request"),
      navItem("/admin/task", BiTask, "Task Manager"),
      navItem("/admin/task-history", LuHistory, "Task History"),
      navItem("/admin/settings", IoSettingsOutline, "Settings"),
    ];
  } else {
    return [
      navItem("/user/dashboard", LayoutDashboard, "Dashboard"),
      navItem("/user/task", LayoutDashboard, "Task Manager"),

      navItem("/user/settings", IoSettingsOutline, "Settings"),
    ];
  }
};

const Sidebar = ({ open, onClose, role, user }) => {
  const sidebarRef = useRef(null);
  const mainLinks = getLinks(role);
  useEffect(() => {
    const handler = (e) => {
      if (
        open &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out ${
      isActive
        ? "bg-sidebarActive text-primary shadow-sm"
        : "text-sidebarText hover:bg-white/5 hover:text-sky-200 hover:translate-x-1"
    }`;

  return (
    <aside
      ref={sidebarRef}
      onMouseLeave={() => open && onClose()}
      className={`
        fixed lg:static top-0 left-0 z-30
        w-64 lg:w-74 h-screen flex flex-col flex-shrink-0 overflow-y-auto
        bg-foreground border-r border-sidebarBorder
        transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      {/* ── Mobile close bar ── */}
      <div className="flex items-center justify-between px-4 py-3 lg:hidden border-b border-sidebarBorder">
        {open && (
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
            <div className="leading-tight">
              <div className="text-sky-100 text-base font-bold">Trackify</div>
              <div className="text-xs text-sidebarText">
                Task Management System
              </div>
            </div>
          </div>
        )}
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-sidebarActive hover:bg-sidebarBorder transition-colors text-sidebarText ml-auto"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Desktop logo — height locked to match Header (py-3 + h-12 logo) ── */}
      <div className="hidden lg:flex items-center gap-3 px-5 py-3 border-b border-sidebarBorder min-h-[5rem]">
        <img src={logo} alt="Logo" className="h-12 w-auto flex-shrink-0" />
        <div className="leading-tight">
          <div className="text-white text-xl font-bold tracking-tight">
            Trackify
          </div>
          <div className="text-xs text-[#babdc1]">Task Management System</div>
        </div>
      </div>

      {/* ── Nav links ── */}
      <div className="flex-1 px-3 pb-4 pt-6 flex flex-col">
        <nav className="flex flex-col gap-2">
          {mainLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={linkClass}
              onClick={onClose}
            >
              <item.icon className="text-white" size={20} />
              <span className="text-md text-white">{item.label}</span>{" "}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* ── User strip ── */}
      <div className="px-4 py-4 border-t border-sidebarBorder flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-sidebarActive flex items-center justify-center text-primary text-xs font-semibold flex-shrink-0">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="leading-tight">
          <div className="text-sky-100 text-sm font-medium">
            {user?.name || "User"}
          </div>
          <div className="text-xs text-sidebarText">
            {user?.email || "user@example.com"}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
