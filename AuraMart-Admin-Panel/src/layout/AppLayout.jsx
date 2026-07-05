import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import { getToken } from "../auth/authToken";

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div className="flex h-screen bg-[#FAF7F2] overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(p => !p)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header onMenuToggle={() => setMobileOpen(p => !p)} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-screen-2xl mx-auto p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
