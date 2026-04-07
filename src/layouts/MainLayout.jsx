import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";
import { userReducer } from "../redux/reducer/userReducer";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector((state) => state[userReducer.name]?.user);
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar — left side, full height */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role={user?.role}
        user={user}
      />

      {/* Right side: Header + Main stacked vertically */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 overflow-hidden p-6">
          <div
            className="h-full w-full rounded-3xl bg-white/80 border border-secondary/40 shadow-sm p-5 overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#e2e8f0 transparent",
            }}
          >
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background-color: #eff1f3; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background-color: #e3ecf7; }
      `}</style>
    </div>
  );
};

export default MainLayout;
